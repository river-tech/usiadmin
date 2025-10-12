"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Workflow,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  // BarChart3,
  Menu,
  X,
  Shield
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Workflows",
    href: "/workflows",
    icon: Workflow,
    badge: "5"
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Logs",
    href: "/logs",
    icon: FileText,
  },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart3,
  // },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      "relative flex flex-col h-full gradient-sidebar text-white border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">UsITech</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white shadow"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/70">
            <p>Secure Admin Portal</p>
            <p>2FA Enabled</p>
          </div>
        </div>
      )}
    </div>
  );
}
