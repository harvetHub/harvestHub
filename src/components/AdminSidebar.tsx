import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Package, ShoppingCart, Users, Box } from "lucide-react";

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path; // Check if the path is active

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-center">HarvestHub Admin</h2>
      <nav className="space-y-4">
        <Button
          variant="ghost"
          className={`w-full text-left flex justify-start items-center space-x-2 ${
            isActive("/admin/dashboard") ? "bg-gray-700 text-blue-400" : ""
          }`}
          onClick={() => navigateTo("/admin/dashboard")}
        >
          <Home className="w-5 h-5 sm:block hidden" />
          <span>Dashboard</span>
        </Button>

        <p className="text-sm text-gray-400 mb-2 py-2 px-2 border-y border-gray-400/50">
          Management
        </p>
        <Button
          variant="ghost"
          className={`w-full text-left flex justify-start items-center space-x-2 ${
            isActive("/admin/products") ? "bg-gray-700 text-blue-400" : ""
          }`}
          onClick={() => navigateTo("/admin/products")}
        >
          <Package className="w-5 h-5 sm:block hidden" />
          <span>Product</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full text-left flex justify-start items-center space-x-2 ${
            isActive("/admin/orders") ? "bg-gray-700 text-blue-400" : ""
          }`}
          onClick={() => navigateTo("/admin/orders")}
        >
          <ShoppingCart className="w-5 h-5 sm:block hidden" />
          <span>Order</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full text-left flex justify-start items-center space-x-2 ${
            isActive("/admin/users") ? "bg-gray-700 text-blue-400" : ""
          }`}
          onClick={() => navigateTo("/admin/users")}
        >
          <Users className="w-5 h-5 sm:block hidden" />
          <span>User</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-full text-left flex justify-start items-center space-x-2 ${
            isActive("/admin/inventory") ? "bg-gray-700 text-blue-400" : ""
          }`}
          onClick={() => navigateTo("/admin/inventory")}
        >
          <Box className="w-5 h-5 sm:block hidden" />
          <span>Inventory</span>
        </Button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
