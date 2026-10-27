import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Razorpay from "razorpay";
import { sendEmail } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please log in to place an order." }, { status: 401 });
    }

    const {
      items,
      shippingAddress,
      shippingAddressId,
      saveAddressToProfile,
      couponCode,
      paymentMethod = "ONLINE",
    } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Calculate totals securely from DB prices instead of client provided prices
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      if (item.variantId) {
        const variant = await db.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant) {
          return NextResponse.json({ error: `Variant not found for: ${item.name}` }, { status: 404 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Not enough stock for variant of: ${variant.product.name}` },
            { status: 400 }
          );
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

    let shipping = subtotal > 9999 ? 0 : 99; // Free shipping over 9999
    let discount = 0;

    // 2. Apply Coupon
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

    // 3. Resolve Address
    let addressIdToUse = shippingAddressId;

    if (shippingAddressId) {
      const existingAddress = await db.address.findFirst({
        where: { id: shippingAddressId, userId: session.user.id },
      });
      if (existingAddress) {
        addressIdToUse = existingAddress.id;
      } else {
        addressIdToUse = null;
      }
    }

    if (!addressIdToUse) {
      if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pinCode) {
        return NextResponse.json({ error: "Shipping address is incomplete" }, { status: 400 });
      }

      const createdAddress = await db.address.create({
        data: {
          userId: session.user.id,
          label: shippingAddress.label || "Home",
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state || "",
          pinCode: shippingAddress.pinCode,
          phone: shippingAddress.phone || "",
          country: "India",
          isDefault: saveAddressToProfile ? false : false,
        },
      });

      addressIdToUse = createdAddress.id;
    }

    // 4. Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // 5. Handle COD (Cash On Delivery)
    if (paymentMethod === "COD") {
      const order = await db.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          subtotal,
          discount,
          shipping,
          tax: 0,
          total,
          couponCode: couponCode || null,
          shippingAddressId: addressIdToUse,
          orderStatus: "CONFIRMED",
          paymentStatus: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Initialize Payment record as COD
      await db.payment.create({
        data: {
          orderId: order.id,
          amount: total,
          currency: "INR",
          status: "PENDING",
          paymentMethod: "COD",
        },
      });

      // Atomically decrement stock and update coupon usage in transaction
      await db.$transaction(async (tx) => {
        for (const item of order.items) {
          if (item.variantId) {
            const variant = await tx.productVariant.findUnique({
              where: { id: item.variantId },
            });
            if (variant) {
              const newStock = Math.max(0, variant.stock - item.quantity);
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: { stock: newStock },
              });
              await tx.inventoryTransaction.create({
                data: {
                  productId: item.productId,
                  variantId: item.variantId,
                  previousStock: variant.stock,
                  changedAmount: -item.quantity,
                  newStock,
                  reason: `Order #${order.orderNumber} Placed (COD)`,
                  userId: session.user.id,
                },
              });
            }
          } else {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });
            if (product) {
              const newStock = Math.max(0, product.stock - item.quantity);
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: newStock },
              });
              await tx.inventoryTransaction.create({
                data: {
                  productId: item.productId,
                  previousStock: product.stock,
                  changedAmount: -item.quantity,
                  newStock,
                  reason: `Order #${order.orderNumber} Placed (COD)`,
                  userId: session.user.id,
                },
              });
            }
          }
        }

        if (couponCode) {
          await tx.coupon.update({
            where: { code: couponCode },
            data: { usedCount: { increment: 1 } },
          });
        }
      });

      // Clear user's cart in DB
      const userCart = await db.cart.findUnique({
        where: { userId: session.user.id },
      });
      if (userCart) {
        await db.cartItem.deleteMany({
          where: { cartId: userCart.id },
        });
      }

      // Send confirmation email
      if (session.user.email) {
        const emailItems = order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        }));

        sendEmail({
          to: session.user.email,
          subject: `Order Confirmation #${order.orderNumber} (Cash on Delivery)`,
          html: OrderConfirmationEmail({
            customerName: session.user.name || "Customer",
            orderNumber: order.orderNumber,
            total: order.total,
            items: emailItems,
          }),
        }).catch((err) => console.error("Email send failed:", err));
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: "COD",
      });
    }

    // 6. Handle ONLINE (Razorpay / Digital)
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        subtotal,
        discount,
        shipping,
        tax: 0,
        total,
        couponCode: couponCode || null,
        shippingAddressId: addressIdToUse,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        items: {
          create: orderItemsData,
        },
      },
    });

    const options = {
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: order.id,
    };

    let razorpayOrderId = `mock_rzp_${Date.now()}`;
    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const rzpOrder = await razorpay.orders.create(options);
        razorpayOrderId = rzpOrder.id;
      }
    } catch (e) {
      console.warn("Razorpay API create order error, using test fallback ID:", e);
    }

    // Initialize Payment record
    await db.payment.create({
      data: {
        orderId: order.id,
        amount: total,
        currency: "INR",
        razorpayId: razorpayOrderId,
        status: "PENDING",
        paymentMethod: "RAZORPAY",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId,
      amount: options.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
      paymentMethod: "ONLINE",
    });
  } catch (error: any) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 500 });
  }
}
