"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useLoading } from "@/lib/context/Loading";

export function Layout({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {

  const {collapsed: sidebarCollapsed, setCollapsed: setSidebarCollapsed} = useLoading()

  return (
    <div
      className="flex h-screen  bg-white text-black w-full"
      style={{ maxHeight: "100vh" }}
    >
      {" "}
      {/* Ensures light background */}
      <div className={sidebarCollapsed ? "min-w-[64px]" :"min-w-[255px]"}>
        <Sidebar collapsed={sidebarCollapsed} page={page} />
      </div>
      <div className="flex-1 flex flex-col ">
        <Header
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 p-4 bg-[#F5F5F5] text-black">
          {" "}
          {/* Main content light styling */}
          {children}
        </main>
      </div>
    </div>
  );
}
