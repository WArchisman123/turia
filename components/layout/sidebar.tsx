"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  User,
  ShoppingBag,
  CheckSquare,
  FileText,
  Users2,
  BarChart2,
  Shield,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Client", href: "/clients", icon: User },
  { label: "Services", href: "/services", icon: ShoppingBag },
  { label: "Task", href: "/tasks", icon: CheckSquare },
  { label: "Invoice", href: "/invoices", icon: FileText },
  { label: "Team", href: "/team", icon: Users2 },
  { label: "Reports", href: "/reports", icon: BarChart2 },
  { label: "Registry", href: "/registry", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[72px] bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-56px)] flex flex-col justify-between py-3 select-none shrink-0 z-20">
      {/* Navigation Stack */}
      <nav className="flex flex-col gap-1.5 items-center">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "w-[60px] h-[52px] rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer",
                isActive
                  ? "bg-[#6366F1] text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
              )}
              title={item.label}
            >
              <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] leading-none tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Design System Shortcut */}
      <div className="flex flex-col items-center pt-2 border-t border-slate-100">
        <Link
          href="/design-system"
          className={cn(
            "w-[60px] h-[48px] rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer",
            pathname === "/design-system"
              ? "bg-[#6366F1] text-white shadow-xs font-semibold"
              : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-medium"
          )}
          title="Design System & Tokens"
        >
          <Palette className="size-4" />
          <span className="text-[9px] leading-none">Tokens</span>
        </Link>
      </div>
    </aside>
  );
}
