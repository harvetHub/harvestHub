"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Review = {
  review_id: number | string;
  user_id?: string | number;
  product_id?: number | string;
  rating?: number | null;
  review_text?: string | null;
  created_at?: string | null;
  // optional user payload if your API includes it:
  user?: { name?: string; avatar_url?: string | null } | null;
  user_name?: string | null; // fallback if API returns this
};

type Props = {
  productId: number;
  maxPreview?: number; // default 5
};

export default function ProductReviews({ productId, maxPreview = 4 }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/reviews", location.origin);
        url.searchParams.set("product_id", String(productId));
        const res = await fetch(url.toString());
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) {
          setError(data?.error || "Failed to load reviews");
          setReviews([]);
          return;
        }
        setReviews(data.reviews ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Failed to load reviews");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (productId) fetchReviews();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const totalCount = reviews.length;
  const visibleReviews = useMemo(
    () => (expanded ? reviews : reviews.slice(0, maxPreview)),
    [reviews, expanded, maxPreview]
  );

  const formatDate = (iso?: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  if (!productId) return null;

  return (
    <section className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {totalCount} review{totalCount !== 1 ? "s" : ""}
        </div>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground">Loading reviews…</div>
      )}
      {error && <div className="text-sm text-destructive">{error}</div>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleReviews.map((r) => {
              const name =
                r.user?.name ||
                r.user_name ||
                (typeof r.user_id !== "undefined"
                  ? `User ${String(r.user_id).slice(0, 6)}`
                  : "Anonymous");
              const avatar = r.user?.avatar_url ?? null;
              const date = formatDate(r.created_at);
              const rating =
                typeof r.rating === "number"
                  ? Math.max(0, Math.min(5, r.rating))
                  : 0;

              return (
                <Card key={r.review_id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        {avatar ? (
                          <AvatarImage src={avatar} alt={name} />
                        ) : (
                          <AvatarFallback>
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="text-xs text-muted-foreground">
                              {date}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {r.review_text ? (
                          <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                            {r.review_text}
                          </p>
                        ) : (
                          <p className="mt-3 text-sm text-muted-foreground italic">
                            No comment
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalCount > maxPreview && (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => setExpanded((s) => !s)}>
                {expanded ? "Show fewer" : `View all (${totalCount})`}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
