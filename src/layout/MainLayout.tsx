import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 bg-bg-color overflow-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};
