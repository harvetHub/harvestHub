"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function useAuthCheck() {
  const session = useSession(); // Automatically reads session from cookies
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Session data:", session); // Log the session data for debugging

        if (!session?.access_token) {
          // Redirect to login if no session
          Swal.fire({
            icon: "warning",
            title: "Unauthorized",
            text: "You need to log in to access this page.",
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
          router.push("/admin");
        } else {
          console.log("Session found. User is authenticated.");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/admin"); // Redirect to login on error
      } finally {
        setLoading(false); // Stop loading once the check is complete
      }
    };

    checkAccessToken();
  }, [router, pathname]);

  return { session, loading };
}
