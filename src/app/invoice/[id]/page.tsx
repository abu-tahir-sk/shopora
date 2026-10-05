import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  const session = await auth();

  const order = await db.order.findUnique({
    where: { id: p.id },
    include: {
      items: { include: { product: true } },
      address: true,
      user: true,
      payment: true,
    }
  });

  if (!order) return notFound();

  // Basic security: only admin or the user who placed the order can view it
  if (session?.user?.role !== "ADMIN" && session?.user?.id !== order.userId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Unauthorized access to this invoice.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen p-8 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-start border-b pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Invoice</h1>
          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl tracking-widest font-semibold uppercase">SHOPORA</h2>
          <p className="text-sm text-gray-500 mt-2">123 Fashion Street</p>
          <p className="text-sm text-gray-500">Mumbai, MH 400001</p>
          <p className="text-sm text-gray-500">contact@shopora.com</p>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Billed To</h3>
          <p className="font-medium">{order.user.name}</p>
          <p className="text-gray-600">{order.user.email}</p>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Shipped To</h3>
          <p className="font-medium">{order.user.name}</p>
          <p className="text-gray-600">{order.address.street}</p>
          <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.pinCode}</p>
          <p className="text-gray-600">{order.address.country}</p>
          <p className="text-gray-600">Phone: {order.address.phone}</p>
        </div>
      </div>

      <table className="w-full text-left mb-8">
        <thead>
          <tr className="border-b">
            <th className="py-3 font-semibold text-sm uppercase tracking-wider">Item</th>
            <th className="py-3 font-semibold text-sm uppercase tracking-wider text-right">Qty</th>
            <th className="py-3 font-semibold text-sm uppercase tracking-wider text-right">Price</th>
            <th className="py-3 font-semibold text-sm uppercase tracking-wider text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-4">
                <p className="font-medium">{item.product.name}</p>
                {item.product.sku && <p className="text-xs text-gray-500">SKU: {item.product.sku}</p>}
              </td>
              <td className="py-4 text-right">{item.quantity}</td>
              <td className="py-4 text-right">₹{item.price.toLocaleString("en-IN")}</td>
              <td className="py-4 text-right font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/2 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
              <span>-₹{order.discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-400">
        <p>Thank you for shopping with Shopora.</p>
        <p className="mt-1">This is a computer generated invoice and does not require a signature.</p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
}
