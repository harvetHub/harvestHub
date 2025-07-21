"use client";

import { useEffect, useState } from "react";
import { toSentenceCase } from "@/utils/toSentenceCase";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/getRelativeTime";
import Image from "next/image";
import Pagination from "@/components/Pagination"; // adjust the import path as needed

interface ProductItem {
  id: number;
  name: string;
  image_url?: string;
  quantity: number;
  price: number;
}

interface PurchaseItem {
  productList: ProductItem[];
  order_id: number;
  name: string;
  status: string;
  total_amount: number;
  order_date: string;
}

const statusMap: Record<string, string | undefined> = {
  All: undefined,
  Pending: "pending",
  Preparing: "preparing",
  "Ready to Pickup": "ready_for_pickup",
  Completed: "released",
  Canceled: "rejected",
};

const cancelOptions = [
  "Changed my mind",
  "Found a better price",
  "Ordered by mistake",
  "Other",
];

const ItemList: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCancel, setShowCancel] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const itemsPerPage = 10; // or any value you want

  const fetchPurchases = async (statusKey: string, page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    const mappedStatus = statusMap[statusKey];
    if (mappedStatus) params.append("status", mappedStatus);
    params.append("limit", itemsPerPage.toString());
    params.append("page", page.toString());
    const res = await fetch(`/api/purchase?${params.toString()}`);
    const data = await res.json();
    console.log("Fetched purchases:", data);
    setPurchases(data.items || []);
    setTotalPages(data.totalPages || 1); // Make sure your API returns totalPages
    setLoading(false);
  };
  useEffect(() => {
    fetchPurchases(filter, currentPage);
  }, [filter, currentPage]);

  const fetchStatusCounts = async () => {
    const statuses = Object.keys(statusMap).filter((s) => s !== "All");
    const counts: Record<string, number> = {};

    await Promise.all(
      statuses.map(async (tab) => {
        const mappedStatus = statusMap[tab];
        const params = new URLSearchParams();
        if (mappedStatus) params.append("status", mappedStatus);
        params.append("limit", "1"); // Only need count, not data
        params.append("count", "exact"); // Make sure your API supports this

        const res = await fetch(`/api/purchase?${params.toString()}`);
        const data = await res.json();
        counts[tab] = data.totalCount || 0; // Make sure your API returns totalCount
      })
    );

    // For "All" tab, sum all counts
    counts["All"] = Object.values(counts).reduce((a, b) => a + b, 0);
    setStatusCounts(counts);
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancel = async (orderId: number) => {
    console.log({ order_id: orderId, reasons: [cancelReason] });
    if (!cancelReason) return;
    const res = await fetch("/api/purchase/manage/cancel", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, reasons: [cancelReason] }),
    });
    if (res.ok) {
      fetchPurchases(filter, currentPage);
    }
    setShowCancel(null);
    setCancelReason("");
  };

  return (
    <div className="myContainer mx-auto p-4 space-y-4">
      {/* Filter Section */}
      <div className="flex space-x-4 bg-white p-4 rounded-md shadow-sm mb-4 overflow-auto">
        {Object.keys(statusMap).map((status) => (
          <div key={status} className="relative">
            <Button
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
            {statusCounts[status] ? (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {statusCounts[status]}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      {/* Purchase List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : purchases.length > 0 ? (
          purchases
            .slice() // create a shallow copy to avoid mutating state
            .sort(
              (a, b) =>
                new Date(b.order_date).getTime() -
                new Date(a.order_date).getTime()
            )
            .map((purchase, index) => (
              <Card key={index} className="shadow-sm rounded-sm p-6">
                <CardHeader className="flex flex-row justify-between space-y-2 border-b-1 border-gray-200">
                  <CardTitle className="text-lg font-semibold ">
                    {purchase.productList[0]?.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {purchase.order_date
                      ? getRelativeTime(purchase.order_date)
                      : ""}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span className="font-medium">
                      {toSentenceCase(purchase.status)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 ">
                    Amount:{" "}
                    <span className="font-medium">
                      {formatPrice(purchase.total_amount)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date Purchased:{" "}
                    {purchase.order_date
                      ? new Date(purchase.order_date).toDateString()
                      : ""}
                  </p>

                  {/* Product List */}
                  {purchase.productList && purchase.productList.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold mb-2">Items:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {purchase.productList.map((item: ProductItem) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 bg-gray-50 rounded p-2 border"
                          >
                            {item.image_url ? (
                              <Image
                                width={48}
                                height={48}
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded shadow"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                N/A
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-base">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty:{" "}
                                <span className="font-semibold">
                                  {item.quantity}
                                </span>
                                {" · "}
                                <span>{formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Cancel Order Section */}
                {purchase.status === "pending" && (
                  <div className="mt-4">
                    {showCancel === purchase.order_id ? (
                      <div className="bg-red-50 p-3 rounded border mb-2">
                        <div className="mb-2 font-semibold">
                          Select cancellation reason:
                        </div>
                        <div className="flex flex-col gap-1 mb-2">
                          {cancelOptions.map((option, index) => (
                            <label
                              key={index}
                              className="flex items-center gap-2"
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
                        <Button
                          variant="destructive"
                          disabled={!cancelReason}
                          onClick={() => handleCancel(purchase.order_id)}
                        >
                          Confirm Cancel
                        </Button>
                        <Button
                          variant="outline"
                          className="ml-2"
                          onClick={() => setShowCancel(null)}
                        >
                          Close
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancel(purchase.order_id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            ))
        ) : (
          <p className="text-center text-gray-500">No purchases found.</p>
        )}
      </div>

      {/* Pagination */}
      {purchases.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <div className="mb-8"></div>
    </div>
  );
};

export default ItemList;
