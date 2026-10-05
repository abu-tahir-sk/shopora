import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress, couponCode } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals securely from DB prices instead of client provided prices
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      if (item.variantId) {
        const variant = await db.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true }
        });
        if (!variant) {
          return NextResponse.json({ error: `Variant not found for: ${item.name}` }, { status: 404 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json({ error: `Not enough stock for variant of: ${variant.product.name}` }, { status: 400 });
        }
        const price = variant.price || variant.product.price;
        subtotal += price * item.quantity;
        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity: item.quantity,
          price: price,
        });
      } else {
        const product = await db.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
        }
        if (product.stock < item.quantity) {
          return NextResponse.json({ error: `Not enough stock for: ${item.name}` }, { status: 400 });
        }
        subtotal += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    let shipping = subtotal > 999 ? 0 : 99;
    let discount = 0;

    // Apply Coupon
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === "PERCENTAGE") {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
            } else if (coupon.discountType === "FIXED") {
              discount = coupon.discountValue;
            } else if (coupon.discountType === "FREE_SHIPPING") {
              shipping = 0;
            }
          }
        }
      }
    }

    let total = subtotal + shipping - discount;
    if (total < 0) total = 0;

    // Create an address first
    const address = await db.address.create({
      data: {
        userId: session.user.id,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pinCode: shippingAddress.pinCode,
        phone: shippingAddress.phone,
        country: "India",
      },
    });

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        subtotal,
        discount,
        shipping,
        tax: 0,
        total,
        couponCode,
        shippingAddressId: address.id,
        items: {
          create: orderItemsData,
        },
      },
    });

    // Create Razorpay order
    const options = {
      amount: Math.round(total * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: order.id,
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
    } catch (e) {
      console.warn("Razorpay error, returning mock order for development", e);
      razorpayOrder = {
        id: `mock_rzp_${Date.now()}`,
        amount: options.amount,
      };
    }

    // Initialize Payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        currency: "INR",
        razorpayId: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: options.amount,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
