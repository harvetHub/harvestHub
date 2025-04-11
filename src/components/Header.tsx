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
import { ShoppingCartIcon, CogIcon } from "@heroicons/react/20/solid";
import { LogOutIcon, HelpingHandIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            <Button variant="ghost" className="text-white flex items-center">
              <ShoppingCartIcon className="w-5 h-5 mr-1" />({cartItems.length})
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="" alt="User Avatar" />
                <AvatarFallback className="bg-gray-0">
                  <UserIcon className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => router.push("/settings")}>
                <CogIcon className="w-5 h-5 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/support")}>
                <HelpingHandIcon className="w-5 h-5 mr-2" />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOutIcon className="w-5 h-5 mr-2" />
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
