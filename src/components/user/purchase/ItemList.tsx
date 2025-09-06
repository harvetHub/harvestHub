"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { PurchaseItem } from "@/lib/definitions";
import PurchaseCard from "./PurchaseCard";
import { statusMap } from "@/lib/purchaseItemConfig";

const ITEMS_PER_PAGE = 10;

const ItemList: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchPurchases = async (statusKey: string, page = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    const mappedStatus = statusMap[statusKey];
    if (mappedStatus) params.append("status", mappedStatus);
    params.append("limit", ITEMS_PER_PAGE.toString());
    params.append("page", page.toString());

    const res = await fetch(`/api/purchase?${params.toString()}`);
    const data = await res.json();
    setPurchases(data.items || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  console.log("ItemList purchases:", purchases);

  const fetchStatusCounts = async () => {
    const statuses = Object.keys(statusMap).filter((s) => s !== "All");
    const counts: Record<string, number> = {};

    await Promise.all(
      statuses.map(async (tab) => {
        const mappedStatus = statusMap[tab];
        const params = new URLSearchParams();
        if (mappedStatus) params.append("status", mappedStatus);
        params.append("limit", "1");
        params.append("count", "exact");

        const res = await fetch(`/api/purchase?${params.toString()}`);
        const data = await res.json();
        counts[tab] = data.totalCount || 0;
      })
    );

    counts["All"] = Object.values(counts).reduce((a, b) => a + b, 0);
    setStatusCounts(counts);
  };

  useEffect(() => {
    fetchPurchases(filter, currentPage);
  }, [filter, currentPage]);

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  const handleRefresh = () => {
    fetchPurchases(filter, currentPage);
    fetchStatusCounts();
  };

  return (
    <div className="myContainer mx-auto p-4 space-y-4">
      <div className="flex space-x-4 bg-white p-4 rounded-md shadow-sm mb-4 overflow-auto">
        {Object.keys(statusMap).map((status) => (
          <div key={status} className="relative">
            <button
              className={`px-3 py-2 rounded ${
                filter === status
                  ? "bg-slate-900 text-white"
                  : "bg-transparent border border-slate-200 text-slate-700"
              }`}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
            {statusCounts[status] ? (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {statusCounts[status]}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : purchases.length > 0 ? (
          purchases
            .slice()
            .sort(
              (a, b) =>
                new Date(b.order_date).getTime() -
                new Date(a.order_date).getTime()
            )
            .map((purchase) => (
              <PurchaseCard
                key={purchase.order_id}
                purchase={purchase}
                onUpdated={handleRefresh}
              />
            ))
        ) : (
          <p className="text-center text-gray-500">No purchases found.</p>
        )}
      </div>

      {purchases.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      <div className="mb-8" />
    </div>
  );
};

export default ItemList;
