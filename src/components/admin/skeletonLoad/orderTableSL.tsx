import { TableRow, TableCell } from "@/components/ui/table";

export default function OrderTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 8 }).map((__, cellIdx) => (
            <TableCell key={cellIdx}>
              <div className="h-4 my-2 bg-gray-200 rounded animate-pulse w-1/2 "></div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
