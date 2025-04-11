"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <header className="w-full bg-white shadow-sm p-4 flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/path-to-avatar.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
