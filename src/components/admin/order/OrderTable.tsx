import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toSentenceCase } from "@/utils/toSentenceCase";
import { formatPrice } from "@/utils/formatPrice";
import OrderTableSkeleton from "../skeletonLoad/orderTableSL";
import { Order } from "@/lib/definitions";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onCancelOrder: (orderId: number) => void;
  onManageOrder: (order: Order) => void;
}

export default function OrdersTable({
  orders,
  loading,
  onManageOrder,
}: OrdersTableProps) {
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else {
      return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Order Date & Time</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shipping Method</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <OrderTableSkeleton />
          ) : !loading && orders.length > 0 ? (
            orders
              .sort(
                (a, b) =>
                  new Date(b.order_date).getTime() -
                  new Date(a.order_date).getTime()
              ) // Sort by date (latest first)

              .map((order, index) => {
                const orderDate = new Date(order.order_date);
                return (
                  <TableRow key={order.order_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{toSentenceCase(order.customer_name)}</TableCell>
                    <TableCell>
                      {orderDate.toDateString()}
                      {" -"}
                      <span className="p-1 px-2 font-semibold rounded-md">
                        {getRelativeTime(orderDate)}
                      </span>
                    </TableCell>
                    <TableCell>{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          "px-3 py-1 rounded-xl border border-gray-100 font-semibold " +
                          (order.status?.toLowerCase() === "released"
                            ? "bg-green-100 text-green-700"
                            : order.status?.toLowerCase() === "preparing"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status?.toLowerCase() ===
                                "ready_for_pickup" ||
                              order.status?.toLowerCase() === "ready for pickup"
                            ? "bg-blue-100 text-blue-700"
                            : order.status?.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-700"
                            : order.status?.toLowerCase() === "pending"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-700")
                        }
                      >
                        {toSentenceCase(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {toSentenceCase(order.shipping_method ?? "N/A")}
                    </TableCell>
                    <TableCell>
                      {toSentenceCase(order.payment_status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => onManageOrder(order)}
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
  );
}
