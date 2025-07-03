"use client";

import { useEffect, useState } from "react";
import { toSentenceCase } from "@/utils/toSentenceCase";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/getRelativeTime";

interface PurchaseItem {
  id: number;
  name: string;
  status: string;
  total_amount: number;
  order_date: string;
}

const ItemList: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "All") params.append("status", filter);
      params.append("limit", "50");
      const res = await fetch(`/api/purchase?${params.toString()}`);
      const data = await res.json();
      console.log("Fetched purchases:", data.items);
      setPurchases(data.items || []);
      setLoading(false);
    };
    fetchPurchases();
  }, [filter]);

  return (
    <div className="myContainer mx-auto p-4 space-y-4">
      {/* Filter Section */}
      <div className="flex space-x-4 bg-white p-4 rounded-md shadow-sm mb-4 overflow-auto">
        {[
          "All",
          "Ready to Pickup",
          "Completed",
          "Canceled",
          "Return & Refund",
        ].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Purchase List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : purchases.length > 0 ? (
          purchases.map((purchase) => (
            <Card key={purchase.id} className="shadow-sm rounded-sm p-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold border-b-1 border-gray-200 pb-2">
                  {purchase.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-medium">
                    {toSentenceCase(purchase.status)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Amount: {formatPrice(purchase.total_amount)}
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  {purchase.order_date
                    ? getRelativeTime(purchase.order_date)
                    : ""}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No purchases found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemList;
