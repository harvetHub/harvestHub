"use client";

import { FC } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useCartCount } from "@/hooks/useCartCount";
import { ShoppingCartIcon, CogIcon } from "@heroicons/react/20/solid";
import { LogOutIcon, HelpingHandIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: FC = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const { count: initialCount } = useCartCount();

  // Use cartItems.length if available (client updates), otherwise fallback to initialCount from API
  const cartCount =
    typeof cartItems?.length === "number" && cartItems.length > 0
      ? cartItems.length
      : initialCount;

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
    <header className="bg-gray-800 text-white py-4 ">
      <div className="myContainer mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/dashboard">HarvestHub</Link>
        </h1>
        <nav className="flex items-center">
          <Link href="/cart" className="mr-4 relative">
            <button className="text-white flex items-center hover:bg-none cursor-pointer bg-none">
              <ShoppingCartIcon className="w-6 h-6"></ShoppingCartIcon>
              {cartCount > 0 && (
                <span className="h-fit absolute text-xs top-[-5px] right-[-7px] bg-red-500 rounded-full w-fit px-1">
                  {cartCount}
                </span>
              )}
            </button>
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
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/user/account/profile")}
              >
                <CogIcon className="w-5 h-5 mr-2 " />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => router.push("/user/purchase")}
              >
                <HelpingHandIcon className="w-5 h-5 mr-2 " />
                My Purchase
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={handleLogout}
              >
                <LogOutIcon className="w-5 h-5 mr-2 " />
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
