import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const Header: FC = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);

  const handleLogout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      router.push("/");
    } else {
      console.error("Failed to log out");
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/dashboard">HarvestHub</Link>
        </h1>
        <nav className="flex items-center">
          <Link href="/products" className="mr-4">
            Products
          </Link>
          <Link href="/cart" className="mr-4">
            <Button variant="ghost" className="text-white">
              Cart ({cartItems.length})
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/support")}>
                Support
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;
