"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CogIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
      });

      if (response.ok) {
        // Show success toast
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        // Redirect to login page after logout
        router.push("/admin");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="absolute top-0 right-0 z-10 p-6 ">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer w-12 h-12 shadow-sm border border-gray-200  transition duration-200 ease-in-out">
            <AvatarImage className="" src="" alt="User Avatar" />
            <AvatarFallback>
              <UserIcon className="w-6 h-6 " />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => router.push("/settings")}>
            <CogIcon className="w-5 h-5 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout}>
            <LogOutIcon className="w-5 h-5 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
