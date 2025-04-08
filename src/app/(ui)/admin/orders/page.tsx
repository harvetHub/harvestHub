"use client";

import { useState, useEffect } from "react";
import { AdminMainLayout } from "@/layout/AdminMainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        // Fetch customer names for each order
        const ordersWithNames = await Promise.all(
          data.orders.map(async (order: Order) => {
            const userResponse = await fetch(
              `/api/admin/users?user_id=${order.user_id}`
            );
            const userData = await userResponse.json();
            return {
              ...order,
              customer_name: userData.user?.name || "Unknown",
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

  const handleManageOrder = (order: Order) => {
    setSelectedOrder(order);
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
              <SelectValue placeholder="Filter by Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipping Method</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      ₱
                      {new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                      }).format(order.total_amount)}
                    </TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.shipping_method || "N/A"}</TableCell>
                    <TableCell>{order.payment_status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.order_id)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleManageOrder(order)}
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {selectedOrder && (
          <div className="modal">
            {/* Modal content for managing the selected order */}
            <h2>Manage Order</h2>
            <p>Order ID: {selectedOrder.order_id}</p>
            <p>Customer Name: {selectedOrder.customer_name}</p>
            <p>Status: {selectedOrder.status}</p>
            {/* Add additional fields and actions for managing the order */}
          </div>
        )}
      </section>
    </AdminMainLayout>
  );
}
