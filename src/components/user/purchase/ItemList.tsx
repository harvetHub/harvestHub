"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ItemList: React.FC = () => {
  const [filter, setFilter] = useState("All");

  // Sample purchase data
  const purchases = [
    {
      id: 1,
      name: "Product 1",
      status: "Completed",
      price: 100,
      date: "2025-05-01",
    },
    {
      id: 2,
      name: "Product 2",
      status: "Canceled",
      price: 200,
      date: "2025-04-15",
    },
    {
      id: 3,
      name: "Product 3",
      status: "Return & Refund",
      price: 150,
      date: "2025-04-20",
    },
    {
      id: 4,
      name: "Product 4",
      status: "Completed",
      price: 300,
      date: "2025-03-10",
    },
    {
      id: 5,
      name: "Product 4",
      status: "Completed",
      price: 300,
      date: "2025-03-10",
    },
    {
      id: 6,
      name: "Product 4",
      status: "Completed",
      price: 300,
      date: "2025-03-10",
    },
    {
      id: 7,
      name: "Product 4",
      status: "Completed",
      price: 300,
      date: "2025-03-10",
    },
  ];

  // Filter purchases based on the selected filter
  const filteredPurchases =
    filter === "All"
      ? purchases
      : purchases.filter((purchase) => purchase.status === filter);

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
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <Card key={purchase.id} className="shadow-sm rounded-sm p-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold border-b-1 border-gray-200 pb-2">
                  {purchase.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{purchase.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Price: ₱{purchase.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(purchase.date).toLocaleDateString()}
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
