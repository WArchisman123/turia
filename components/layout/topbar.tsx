"use client";

import React from "react";
import Link from "next/link";
import { useUser, OrganizationSwitcher } from "@clerk/nextjs";
import { useTheme } from "@/components/theme/theme-provider";
import {
  Bell,
  CheckSquare,
  MessageCircle,
  Mail,
  Zap,
  MessageSquare,
  Flame,
  Crosshair,
  Calendar,
  ListTodo,
  Search,
  Moon,
  Sun,
} from "lucide-react";

interface TopbarProps {
  onOpenProfile: () => void;
}

export function Topbar({ onOpenProfile }: TopbarProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { user } = useUser();

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "AR";

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: App Logo & Organization Switcher */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-[#6366F1] flex items-center justify-center text-white font-black text-base shadow-xs group-hover:bg-[#4F46E5] transition-colors">
            T
          </div>
        </Link>

        {/* Clerk Multi-tenant Organization Switcher */}
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          appearance={{
            elements: {
              rootBox: "flex items-center",
              organizationSwitcherTrigger:
                "px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-200 shadow-2xs gap-1.5",
              organizationPreviewTextContainer: "text-left",
              organizationPreviewMainIdentifier: "text-xs font-semibold text-slate-900",
            },
          }}
        />
      </div>

      {/* Middle: Quick Tools Strip (Scrollable on small screens) */}
      <nav className="hidden xl:flex items-center gap-4 text-xs text-slate-600 font-medium">
        {/* Notices */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer relative py-1">
          <span className="absolute -top-1.5 left-2 bg-[#EFF6FF] text-[#2563EB] text-[8px] font-bold px-1.5 py-0.2 rounded-full border border-blue-200 uppercase">
            ADD ON
          </span>
          <Bell className="size-3.5" />
          <span>Notices</span>
        </button>

        {/* Compliance */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <CheckSquare className="size-3.5" />
          <span>Compliance</span>
        </button>

        {/* WhatsApp */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <MessageCircle className="size-3.5" />
          <span>WhatsApp</span>
        </button>

        {/* Email */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <Mail className="size-3.5" />
          <span>Email</span>
        </button>

        {/* Agents */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer relative py-1">
          <span className="absolute -top-1.5 left-2 bg-[#ECFDF5] text-[#059669] text-[8px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200 uppercase">
            NEW
          </span>
          <Zap className="size-3.5" />
          <span>Agents</span>
        </button>

        {/* Chat */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <MessageSquare className="size-3.5" />
          <span>Chat</span>
        </button>

        {/* Sprints */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <Flame className="size-3.5" />
          <span>Sprints</span>
        </button>

        {/* Action-Center */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <Crosshair className="size-3.5" />
          <span>Action-Center</span>
        </button>

        {/* Calendar */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <Calendar className="size-3.5" />
          <span>Calendar</span>
        </button>

        {/* To-Do */}
        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
          <ListTodo className="size-3.5" />
          <span>To-Do</span>
        </button>
      </nav>

      {/* Right: Search, Theme Toggle, User Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <Search className="size-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Ctrl K"
            className="h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-full w-44 lg:w-52 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-600" />}
        </button>

        {/* User Avatar with status indicator */}
        <button
          onClick={onOpenProfile}
          className="relative size-8 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
          title={user?.fullName ? `${user.fullName} (${user.primaryEmailAddress?.emailAddress})` : "archi (Managing Partner)"}
          aria-label="Open profile drawer"
        >
          {userInitials}
          <span className="absolute bottom-0 right-0 size-2.5 bg-[#10B981] border-2 border-white rounded-full" />
        </button>
      </div>
    </header>
  );
}
