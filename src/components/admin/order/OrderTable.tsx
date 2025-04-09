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

interface Order {
  order_id: number;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  shipping_method: string | null;
  payment_status: string;
}

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onCancelOrder: (orderId: number) => void;
  onManageOrder: (order: Order) => void;
}

export default function OrdersTable({
  orders,
  loading,
  onCancelOrder,
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
            <TableHead>ID</TableHead>
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
            // Skeleton Loader
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
                </TableCell>
              </TableRow>
            ))
          ) : orders.length > 0 ? (
            orders.map((order) => {
              const orderDate = new Date(order.order_date);
              return (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{toSentenceCase(order.customer_name)}</TableCell>
                  <TableCell>
                    {orderDate.toDateString()}
                    {" -"}
                    <span className="p-1 px-2 font-semibold rounded-md">
                      {getRelativeTime(orderDate)}
                    </span>
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
                        onClick={() => onCancelOrder(order.order_id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
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
