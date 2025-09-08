"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProductItem } from "@/lib/definitions";

type CustomerReviewDialogProps = {
  productId?: number;
  productList?: ProductItem[];
  orderId?: number;
  status?: string; // e.g. "completed"
  initialRating?: number;
  initialMessage?: string;
  onSaved?: () => void;
};

export default function CustomerReviewDialog({
  productId,
  orderId,
  initialRating = 0,
  initialMessage = "",
  onSaved,
}: CustomerReviewDialogProps) {
  // hooks run unconditionally
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);
  const [message, setMessage] = useState<string>(initialMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // new: track if current user already rated this product
  const [hasRated, setHasRated] = useState(false);
  const [checkingRated, setCheckingRated] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkIfRated = async () => {
      setCheckingRated(true);
      setHasRated(false);

      if (!productId) {
        setCheckingRated(false);
        return;
      }

      try {
        // fetch current user profile to get user id
        const profileRes = await fetch("/api/profile", {
          credentials: "include",
        });
        let userId: string | number | null = null;
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          userId = profileData?.user_id ?? profileData?.id ?? null;
        }

        // if no logged in user -> cannot be rated by current user
        if (!userId) {
          if (mounted) {
            setHasRated(false);
            setCheckingRated(false);
          }
          return;
        }

        // fetch reviews for this product
        const reviewsRes = await fetch(`/api/reviews?product_id=${productId}`);
        if (!reviewsRes.ok) {
          if (mounted) setHasRated(false);
          return;
        }
        const reviewsData = await reviewsRes.json();
        const reviews = Array.isArray(reviewsData.reviews)
          ? reviewsData.reviews
          : [];

        const already = reviews.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => String(r.user_id) === String(userId)
        );
        if (mounted) {
          setHasRated(Boolean(already));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (mounted) setHasRated(false);
      } finally {
        if (mounted) setCheckingRated(false);
      }
    };

    checkIfRated();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const submitReview = async () => {
    const pid = productId ?? null;
    if (!pid) {
      setError("productId is required to submit a review.");
      return;
    }
    if (rating <= 0) {
      setError("Please provide a rating.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/purchase/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(pid),
          order_id: orderId,
          rating,
          review_text: message || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to save review.");
      } else {
        setOpen(false);
        setHasRated(true); // hide trigger after successful save
        onSaved?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // If still checking, avoid showing trigger to prevent flicker.
  // Hide the trigger when user already rated; optionally show a small label instead.
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* only render the trigger when we finished checking and the user has NOT already rated */}
      {!checkingRated && !hasRated && (
        <DialogTrigger asChild>
          <Button className="w-full align-bottom rounded-none rounded-tr-md rounded-bl-2xl opacity-60 hover:opacity-100">
            Rate
          </Button>
        </DialogTrigger>
      )}

      {/* If user already rated, show a non-interactive indicator instead of the trigger */}
      {!checkingRated && hasRated && (
        <div className="text-sm text-muted-foreground px-2 py-1 opacity-50">
          Rated
        </div>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate and Review</DialogTitle>
          <DialogDescription>
            Share your feedback for this completed order.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-3 flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= (hover || rating);
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      filled ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
            <div className="text-sm text-gray-500 ml-2">
              {rating > 0 ? `${rating}/5` : "No rating"}
            </div>
          </div>

          <div className="mb-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your review (optional)"
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <div className="text-destructive text-sm mb-3">{error}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={submitReview} disabled={saving}>
            {saving ? "Saving..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
