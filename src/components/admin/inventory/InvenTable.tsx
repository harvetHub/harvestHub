import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stocks: number;
  price: number;
}

interface InventoryTableProps {
  inventory: InventoryItem[];
  onAddStock: (item: InventoryItem) => void;
  onReduceStock: (item: InventoryItem) => void;
  loading: boolean; // Indicates loading state
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onAddStock,
  onReduceStock,
  loading,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? // Skeleton rows for loading state
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          : inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.stocks}</TableCell>
                <TableCell>
                  ₱
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                  }).format(item.price)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onAddStock(item)}
                    >
                      Add Stock
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReduceStock(item)}
                    >
                      Reduce Stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
