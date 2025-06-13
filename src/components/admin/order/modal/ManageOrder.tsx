import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/definitions";
import { formatPrice } from "@/utils/formatPrice";

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
          <DialogTitle>{order.customer_name} Order</DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4">
          Total Amount:{" "}
          <span className="text-md font-bold">
            {formatPrice(order.total_amount)}
          </span>
        </DialogDescription>
        <DialogFooter>
          <Button
            variant="default"
            onClick={() => onUpdateStatus("Ready for Pickup")}
            className="cursor-pointer"
          >
            Ready for Pickup
          </Button>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => onUpdateStatus("Released")}
          >
            Paid & Released
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
