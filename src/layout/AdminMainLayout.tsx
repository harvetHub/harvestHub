import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Header from "@/components/admin/Header";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const AdminMainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden p-2">
        <div className="hidden w-full lg:flex flex-col">
          <Header />
        </div>

        <div className="flex-1 p-4 bg-bg-color overflow-auto">{children}</div>
      </div>
    </div>
  );
};
