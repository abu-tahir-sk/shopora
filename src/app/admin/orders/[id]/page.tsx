import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronLeft, Package, CreditCard, Truck, Calendar, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateOrderStatus, updatePaymentStatus } from "../actions";

export const metadata = {
  title: "Order Details | Admin",
};

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: {
            include: {
              images: true
            }
          }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const updateOrderWithId = updateOrderStatus.bind(null, order.id);
  const updatePaymentWithId = updatePaymentStatus.bind(null, order.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border rounded-md bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center py-4 border-b last:border-0 last:pb-0">
                  <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image 
                        src={item.product.images[0].url} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base truncate">
                      <Link href={`/product/${item.product.slug}`} className="hover:underline">
                        {item.product.name}
                      </Link>
                    </h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-medium">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-md bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Details
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-muted-foreground">{order.user.email}</p>
            </div>
            
            <h3 className="font-medium mt-6 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h3>
            {order.address ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.user.name}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.pinCode}</p>
                <p>{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No address provided</p>
            )}
          </div>

          <div className="border rounded-md bg-card p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </h2>
              <form action={updateOrderWithId} className="space-y-3">
                <select 
                  name="orderStatus"
                  defaultValue={order.orderStatus}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <Button type="submit" variant="secondary" className="w-full">Update Status</Button>
              </form>
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Status
              </h2>
              <form action={updatePaymentWithId} className="space-y-3">
                <select 
                  name="paymentStatus"
                  defaultValue={order.paymentStatus}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                </select>
                <Button type="submit" variant="secondary" className="w-full">Update Payment</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
