"use client";

import { useState } from "react";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { addReview } from "@/app/actions/review";
import { Button } from "@/components/ui/button";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  image: string | null;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
};

export function ProductReviews({ productId, reviews }: { productId: string, reviews: Review[] }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("Please login to submit a review.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    const res = await addReview(productId, { rating, comment });
    setIsSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setComment("");
    } else {
      setError(res.error || "Failed to submit review");
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-border">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/3">
          <h3 className="text-2xl font-light mb-6">Customer Reviews</h3>
          
          {session ? (
            success ? (
              <div className="bg-secondary/50 p-6 rounded-lg text-center">
                <p className="text-sm">Thank you for your review!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-secondary/30 p-6 rounded-lg flex flex-col gap-4">
                <h4 className="font-medium">Write a Review</h4>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star className={`h-6 w-6 ${star <= rating ? 'fill-brand text-brand' : 'text-muted-foreground opacity-30'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )
          ) : (
            <div className="bg-secondary/30 p-6 rounded-lg text-center">
              <p className="text-sm mb-4">Please login to write a review</p>
              <Button asChild variant="outline">
                <a href="/login">Login</a>
              </Button>
            </div>
          )}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground font-light">No reviews yet. Be the first to review this product.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.user.name || "Anonymous"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-brand">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Purchase
                    </div>
                  )}
                </div>
                
                {review.comment && (
                  <p className="text-muted-foreground font-light text-sm mt-4 leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {review.image && (
                  <img src={review.image} alt="Review" className="mt-4 h-24 w-24 object-cover rounded border border-border" />
                )}

                <button className="flex items-center gap-2 text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
