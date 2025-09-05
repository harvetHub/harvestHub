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

type CustomerReviewDialogProps = {
  orderId: number | string;
  status?: string; // e.g. "completed"
  initialRating?: number;
  initialMessage?: string;
  onSaved?: () => void;
};

export default function CustomerReviewDialog({
  orderId,
  initialRating = 0,
  initialMessage = "",
  onSaved,
}: CustomerReviewDialogProps) {
  // hooks must run unconditionally
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);
  const [message, setMessage] = useState<string>(initialMessage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = async () => {
    if (rating <= 0) {
      setError("Please provide a rating.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: typeof orderId === "number" ? orderId : Number(orderId),
          rating,
          message,
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
        <Button className="w-full">Rate Order</Button>
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
