import React from "react";

interface DefaultLayoutTypes {
  children: React.ReactNode;
}

export const MainLayout: React.FC<DefaultLayoutTypes> = ({ children }) => {
  return (
    <main className="flex flex-col h-screen w-full">
      <div className="flex flex-1 overflow-hidden p-2">
        <div className="flex-1 p-4 bg-bg-color overflow-auto">{children}</div>
      </div>
    </main>
  );
};
