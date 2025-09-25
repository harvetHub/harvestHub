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
import { formatPrice } from "@/utils/formatPrice";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  loading: boolean; // New prop to indicate loading state
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  loading,
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
        {loading
          ? // Skeleton rows for loading state
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-10 w-10 bg-gray-300 rounded-md animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
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
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          : products.length > 0 ? products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>
                  <div className="bg-white w-fit rounded">
                    <Image
                      src={
                        typeof product.image_url === "string"
                          ? product.image_url
                          : "/placeholder.png"
                      }
                      alt={product.name}
                      width={50}
                      height={50}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {
                    categories.find((cat) => cat.value === product.product_type)
                      ?.name
                  }
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => onEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(String(product.product_id || ""))}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )):  <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No products found.
              </TableCell>
            </TableRow>}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
