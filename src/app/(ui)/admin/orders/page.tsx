"use client";

import { useState, useEffect } from "react";
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (response.ok) {
        const ordersWithNames = await Promise.all(
          data.orders.map(async (order: Order) => {
            const userResponse = await fetch(
              `/api/admin/users?user_id=${order.user_id}`
            );
            const userData = await userResponse.json();
            return {
              ...order,
              customer_name: userData.user?.name || "N/A",
            };
          })
        );

        setOrders(ordersWithNames);
        setFilteredOrders(ordersWithNames);
      } else {
        Swal.fire("Error", data.error || "Failed to fetch orders", "error");
      }
    } catch {
      Swal.fire("Error", "An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterOrders(term, paymentFilter);
  };

  const handlePaymentFilter = (value: string | null) => {
    setPaymentFilter(value);
    filterOrders(searchTerm, value);
  };

  const filterOrders = (term: string, paymentStatus: string | null) => {
    const filtered = orders.filter((order) => {
      const matchesSearch = order.customer_name.toLowerCase().includes(term);
      const matchesPayment = paymentStatus
        ? order.payment_status === paymentStatus
        : true;
      return matchesSearch && matchesPayment;
    });
    setFilteredOrders(filtered);
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
          <Select onValueChange={handlePaymentFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrdersTable
          orders={filteredOrders}
          loading={loading}
          onCancelOrder={handleCancelOrder}
          onManageOrder={(order) => setSelectedOrder({ ...order, user_id: "" })} // Pass an empty string for user_id
        />

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
