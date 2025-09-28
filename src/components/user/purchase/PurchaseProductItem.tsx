"use client";

import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";
import { ProductItem } from "@/lib/definitions";

type Props = {
  item: ProductItem;
};

export default function PurchaseProductItem({ item }: Props) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded p-2 border">
      {item.image_url ? (
        <Image
          width={48}
          height={48}
          src={item.image_url}
          alt={item.name}
          className="w-12 h-12 object-cover rounded shadow"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
          N/A
        </div>
      )}
      <div className="flex-1">
        <div className="font-medium text-base">{item.name}</div>
        <div className="text-xs text-gray-500">
          Qty: <span className="font-semibold">{item.quantity}</span> {" · "}{" "}
          <span>{formatPrice(item.price)}</span>
        </div>
      </div>
    </div>
  );
}
