import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/lib/definitions";
import { categories } from "@/lib/productsConfig";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.product_id}>
            <TableCell>{product.product_id}</TableCell>
            <TableCell>
              <Image
                src={product.image_url || "/placeholder.png"}
                alt={product.name}
                width={50}
                height={50}
                className="rounded-md"
              />
            </TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              {
                categories.find((cat) => cat.value === product.product_type)
                  ?.name
              }
            </TableCell>
            <TableCell>₱{product.price.toFixed(2)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => onEdit(product)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(product.product_id || "")}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
