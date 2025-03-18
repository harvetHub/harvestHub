"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";

export default function AdminDashboard() {
  //   const router = useRouter();
  //   const token = useAuthStore((state) => state.token);

  //   useEffect(() => {
  //     if (!token) {
  //       router.push("/admin/login");
  //     }
  //   }, [token, router]);

  return (
    <section className="bg-white">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        <p className="text-center mt-4">Welcome to the admin dashboard.</p>
      </div>
    </section>
  );
}
