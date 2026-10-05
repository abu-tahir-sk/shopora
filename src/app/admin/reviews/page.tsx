import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Star } from "lucide-react";
import { approveReview, hideReview, deleteReview } from "./actions";

export const metadata = {
  title: "Reviews | Admin",
};

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } },
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Reviews</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Comment</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-6 py-4 font-medium">{review.product.name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{review.user.name}</span>
                    <span className="text-xs text-muted-foreground">{review.user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex text-brand">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="max-w-xs truncate" title={review.comment || ""}>
                    {review.comment || "-"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  {review.isApproved ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <XCircle className="h-3.5 w-3.5" />
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <form action={review.isApproved ? hideReview.bind(null, review.id) : approveReview.bind(null, review.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        {review.isApproved ? "Hide" : "Approve"}
                      </Button>
                    </form>
                    <form action={deleteReview.bind(null, review.id)}>
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
