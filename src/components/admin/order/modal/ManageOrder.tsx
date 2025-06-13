import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Order {
  order_id: number;
  customer_name: string;
  total_amount: number;
  status: string;
}

interface ManageOrderModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
}

export default function ManageOrderModal({
  order,
  onClose,
  onUpdateStatus,
}: ManageOrderModalProps) {
  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.customer_name}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total Amount:</strong> ₱
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
            }).format(order.total_amount)}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            onClick={() => onUpdateStatus("Ready for Pickup")}
            className="cursor-pointer"
          >
            Mark as Ready for Pickup
          </Button>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => onUpdateStatus("Released")}
          >
            Mark as Released
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
