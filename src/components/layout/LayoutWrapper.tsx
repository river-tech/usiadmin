"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useAdminWebSocket } from "@/socket/hook";

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function LayoutWrapper({ children, className }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Kiểm tra auth và redirect về login nếu không có token
  useEffect(() => {
    // Đợi một chút để Redux state có thể được restore sau refresh
    const checkAuth = setTimeout(() => {
      const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      // Chỉ redirect nếu thực sự không có token trong storage
      // Nếu có token trong storage nhưng Redux chưa restore, vẫn cho phép (sẽ được restore sau)
      if (!tokenFromStorage) {
        router.push("/login");
      }
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, [router]);
  
  // Tự động connect WebSocket để nhận deposit requests mới (chỉ khi có auth)
  useAdminWebSocket();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={cn(
          "flex-1 overflow-auto p-6",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
