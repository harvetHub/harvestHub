import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/definitions";
import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from "react";

interface OrderItem {
  stocks: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  image_url?: string | null;
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
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("orderData:", order);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders/${order.order_id}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, [order?.order_id]);

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="uppercase font-bold border-b-1 pb-4">
            {order.customer_name} Order
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4">
          <div>
            <div className="mt-2">
              <span className="font-bold uppercase">Ordered Items:</span>
              {loading ? (
                <div className="text-sm text-gray-500 mt-2">
                  Loading items...
                </div>
              ) : items.length === 0 ? (
                <div className="text-sm text-gray-500 mt-2">
                  No items found.
                </div>
              ) : (
                <ul className="mt-2 space-y-2">
                  {items.map((item, index) => (
                    <li
                      key={item.product_id}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span className="font-medium">
                        {index + 1}
                        {". "} {item.name}{" "}
                        <span className="font-normal text-xs italic ">
                          (stocks: {item.stocks})
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatPrice(item.price)} {"x"} {item.quantity}
                        {" ="}{" "}
                        <span className="font-bold">
                          {formatPrice(item.quantity * item.price)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex mt-4 mb-4 w-full justify-between items-baseline">
              <span className=" uppercase font-bold">Total Amount: </span>
              <span className="text-2xl font-bold text-black/80">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </DialogDescription>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
          {/* Show message if status is rejected */}
          {order.status === "rejected" && (
            <div className="col-span-full text-center text-red-600 font-semibold py-4">
              This order has been rejected.
            </div>
          )}

          {/* Show message if status is released */}
          {order.status === "released" && (
            <div className="col-span-full text-center text-green-700 font-semibold py-4">
              This order has been released and completed.
            </div>
          )}

          {/* Show action buttons only if not rejected or released */}
          {order.status !== "rejected" && order.status !== "released" && (
            <>
              {/* Show Accept & Prepare if not yet preparing or ready for pickup */}
              {order.status !== "preparing" &&
                order.status !== "ready_for_pickup" && (
                  <div className="flex w-full gap-2">
                    <Button
                      variant="default"
                      onClick={() => onUpdateStatus("preparing")}
                      className="cursor-pointer bg-green-600 hover:bg-green-500 w-full"
                    >
                      Accept & Prepare
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => onUpdateStatus("rejected")}
                      className="cursor-pointer w-full opacity-30 hover:bg-red-500 hover:opacity-100"
                    >
                      Reject
                    </Button>
                  </div>
                )}

              {/* Show Ready for Pickup if status is preparing */}
              {order.status === "preparing" && (
                <div className="flex w-full gap-2">
                  <Button
                    variant="default"
                    onClick={() => onUpdateStatus("ready_for_pickup")}
                    className="cursor-pointer bg-green-600 hover:bg-green-500 w-full"
                  >
                    Ready for Pickup
                  </Button>
                </div>
              )}

              {/* Show Release if status is ready for pickup */}
              {order.status === "ready_for_pickup" && (
                <Button
                  className="cursor-pointer bg-green-600 hover:bg-green-500"
                  variant="default"
                  onClick={() => onUpdateStatus("released")}
                >
                  Release
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
