"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function useAuthCheck() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        console.log("Checking session...");

        // Fetch user data from an API route that validates the token
        const response = await fetch("/api/auth/validate-token", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          throw new Error("Invalid or expired token");
        }

        const data = await response.json();
        console.log("User data:", data); // Debugging

        setUser(data.user);
      } catch (error) {
        console.error("Error verifying auth token:", error);
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          showConfirmButton: false,
          timer: 3000,
          toast: true,
          position: "top-end",
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        router.push("/admin"); // Redirect to login on error
      } finally {
        setLoading(false); // Stop loading once the check is complete
      }
    };

    checkAuthToken();
  }, [router, pathname]);

  return { user, loading };
}
