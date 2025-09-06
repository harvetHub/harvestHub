"use client";

import { useState } from "react";
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
  // prefer productId (matches supabase column). orderId kept for backwards compatibility if needed.
  productId?: number | string;
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
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);
  const [message, setMessage] = useState<string>(initialMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Submitting review:", { productId, orderId, rating, message });

  const submitReview = async () => {
    // product_id is required by table
    const pid = productId ?? null; // parent should pass productId (prefer), fallback null

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
          orderId,
          rating,
          review_text: message || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to save review.");
      } else {
        setOpen(false);
        onSaved?.();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full align-bottom rounded-none rounded-tr-md rounded-bl-2xl opacity-60 hover:opacity-100">
          Rate
        </Button>
      </DialogTrigger>

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
