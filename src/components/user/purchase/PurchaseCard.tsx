"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toSentenceCase } from "@/utils/toSentenceCase";
import { formatPrice } from "@/utils/formatPrice";
import { getRelativeTime } from "@/utils/getRelativeTime";
import { PurchaseItem, ProductItem } from "@/lib/definitions";
import PurchaseProductItem from "./PurchaseProductItem";
import { cancelOptions } from "@/lib/purchaseItemConfig";
import { Calendar, Clock, Tag } from "lucide-react";
import CustomerReview from "./CustomerReviewModal";

type Props = {
  purchase: PurchaseItem;
  onUpdated?: () => void;
};

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "released":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
    case "refunded":
      return "bg-red-100 text-red-800";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

export default function PurchaseCard({ purchase, onUpdated }: Props) {
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!cancelReason) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/purchase/manage/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: purchase.order_id,
          reasons: [cancelReason],
        }),
      });
      if (res.ok) {
        onUpdated?.();
      }
    } finally {
      setShowCancel(false);
      setCancelReason("");
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm rounded-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 p-6 border-b relative">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold truncate">
            {toSentenceCase(purchase.productList?.[0]?.name ?? "Order")}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {purchase.order_date ? getRelativeTime(purchase.order_date) : ""}
          </p>
          {/* Order meta / actions */}
          <aside className="rounded-md w-fit mt-4">
            {/* Actions */}
            {purchase.status === "pending" ? (
              <>
                {showCancel ? (
                  <div className="">
                    <div className="text-sm font-medium">Cancel reason</div>
                    <div className="flex flex-col gap-2">
                      {cancelOptions.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="radio"
                            name={`cancel-reason-${purchase.order_id}`}
                            checked={cancelReason === option}
                            onChange={() => setCancelReason(option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="destructive"
                        disabled={!cancelReason || submitting}
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        {submitting ? "Cancelling..." : "Confirm Cancel"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancel(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancel(true)}
                    className="w-fit opacity-60 hover:opacity-100 absolute top-[-10] left-0 p-2 pt-4 rounded-none rounded-tl-lg rounded-br-2xl px-4"
                  >
                    Cancel
                  </Button>
                )}
              </>
            ) : (
              ""
            )}
          </aside>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(
              purchase.status
            )}`}
          >
            <Tag className="w-4 h-4" />
            <span>{toSentenceCase(purchase.status)}</span>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">
                {formatPrice(purchase.total_amount)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {purchase.order_date
                  ? new Date(purchase.order_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{purchase.order_id ?? ""}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items list - primary column spans 2 on large screens */}
          <div className="lg:col-span-4">
            <div className="font-semibold mb-2">Items</div>
            <div className="flex flex-col gap-4">
              {purchase.productList && purchase.productList.length > 0 ? (
                purchase.productList.map((item: ProductItem, index) => (
                  // render each item individually and show rate button per-item for released/completed orders
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 border rounded-md bg-white relative"
                  >
                    <div className="flex-1">
                      <PurchaseProductItem item={item} />
                    </div>

                    {(purchase.status === "released" ||
                      purchase.status === "completed") && (
                      <div className="flex flex-col gap-2 absolute top-3 right-3">
                        {item.is_rated ? (
                          <div className="text-sm inline-flex items-center gap-2 px-2 py-1 opacity-50">
                            Rated
                          </div>
                        ) : (
                          <CustomerReview
                            productId={item.product_id}
                            orderId={purchase.order_id}
                            status={purchase.status}
                            onSaved={() => {
                              onUpdated?.();
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No items found.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
