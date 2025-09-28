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
import useAuthCheck from "@/hooks/admin/useAuthCheck";
import { Order, OrderStatus } from "@/lib/definitions";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusType, setStatusType] = useState<string>("All");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch available statuses from DB
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch("/api/admin/orders/statuses");
        const data = await res.json();
        if (res.ok) {
          setStatuses(data.statuses);
        } else {
          Swal.fire("Error", data.error || "Failed to fetch statuses", "error");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        Swal.fire("Error", "Failed to fetch statuses", "error");
      }
    };
    fetchStatuses();
  }, []);

  // Fetch orders from the API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/orders/fetch?page=${currentPage}&limit=${itemsPerPage}&status=${statusType}&search_term=${searchTerm}`
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

  const handleStatusFilter = (value: string) => {
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
            `/api/admin/orders/delete?order_id=${orderId}`,
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

  const handleUpdateOrderStatus = async (status: OrderStatus) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders/update`, {
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

  // Check if the user is authenticated
  useAuthCheck();

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
          <Select onValueChange={handleStatusFilter} value={statusType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </SelectItem>
              ))}
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
