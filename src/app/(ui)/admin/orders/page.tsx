"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrdersTable from "@/components/admin/order/OrderTable";
import ManageOrderModal from "@/components/admin/order/modal/ManageOrder";
import Pagination from "@/components/Pagination";
import Swal from "sweetalert2";

interface Order {
  order_id: number;
  user_id: string;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_method: string | null;
  payment_status: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusType, setStatusType] = useState<string | null>("All");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch orders from the API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/orders?page=${currentPage}&limit=${itemsPerPage}&status=${statusType}&search_term=${searchTerm}`
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } else {
        Swal.fire("Error", data.error || "Failed to fetch orders", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Swal.fire(
        "Error",
        `An unexpected error occurred: ${errorMessage}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusType, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleStatusFilter = (value: string | null) => {
    setStatusType(value);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleCancelOrder = async (orderId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `/api/admin/orders?order_id=${orderId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            Swal.fire("Cancelled!", "The order has been cancelled.", "success");
            fetchOrders(); // Refresh the orders list
          } else {
            const data = await response.json();
            Swal.fire(
              "Error",
              data.error || "Failed to cancel order.",
              "error"
            );
          }
        } catch {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  const handleUpdateOrderStatus = async (status: string) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: selectedOrder.order_id, status }),
      });

      if (response.ok) {
        Swal.fire("Success", "Order status updated successfully.", "success");
        fetchOrders(); // Refresh the orders list
        setSelectedOrder(null); // Close the modal
      } else {
        const data = await response.json();
        Swal.fire("Error", data.error || "Failed to update order.", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminMainLayout>
      <section className="mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

        <div className="flex items-center space-x-4 mb-4">
          <Input
            placeholder="Search orders by customer name..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrdersTable
          orders={orders}
          loading={loading}
          onCancelOrder={handleCancelOrder}
          onManageOrder={(order) => setSelectedOrder({ ...order, user_id: "" })}
        />

        {orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {selectedOrder && (
          <ManageOrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </section>
    </AdminMainLayout>
  );
}
