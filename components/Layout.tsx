"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="flex h-screen  bg-white text-black"
      style={{ maxHeight: "100vh" }}
    >
      {" "}
      {/* Ensures light background */}
      <div className="w-[255px]">
        <Sidebar collapsed={sidebarCollapsed} page={page} />
      </div>
      <div className="flex-1 flex flex-col ">
        <Header
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 p-4 bg-white text-black">
          {" "}
          {/* Main content light styling */}
          {children}
        </main>
      </div>
    </div>
  );
}
