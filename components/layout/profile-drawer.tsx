"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useUser, useOrganization, SignOutButton } from "@clerk/nextjs";
import posthog from "posthog-js";
import {
  X,
  User,
  Settings,
  Smartphone,
  Video,
  Gift,
  Palette,
  Bot,
  LogOut,
  ChevronRight,
  Apple,
  Shield,
} from "lucide-react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = user?.fullName || user?.firstName || "archi";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "arch.sas.123@gmail.com";
  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "AR";
  const orgName = organization?.name || "Saha And Sons";
  const orgRole = membership?.role === "org:admin" ? "Super Admin" : "Partner / Staff";

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
        
        {/* Top Hero Banner */}
        <div className="bg-[#6366F1] text-white p-6 relative flex flex-col items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 size-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="size-5" />
          </button>

          {/* Large User Avatar with status */}
          <div className="relative mt-2">
            <div className="size-20 rounded-full bg-[#3730A3] text-white font-bold text-2xl flex items-center justify-center border-2 border-white/20 shadow-md">
              {userInitials}
            </div>
            <span className="absolute bottom-1 right-1 size-4 bg-[#10B981] border-2 border-white rounded-full" />
          </div>

          <h3 className="text-base font-bold text-white mt-3">{displayName}</h3>
          <p className="text-xs text-indigo-100 font-normal mt-0.5">
            {displayEmail}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/15 text-[10px] font-semibold text-white rounded-full border border-white/20">
            <Shield className="size-3" />
            <span>{orgName} • {orgRole}</span>
          </div>
        </div>

        {/* Content Navigation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Primary Profile Links */}
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-xs">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="size-4 text-slate-500" />
                <span className="font-medium">My Profile</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </Link>

            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="size-4 text-slate-500" />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </Link>
          </div>

          {/* Mobile Apps Section */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-600 block mb-2.5">
              Mobile Apps
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-lg border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer">
                <Smartphone className="size-5 text-emerald-600" />
                <span className="text-[11px] font-medium text-slate-700">Android</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white rounded-lg border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer">
                <Apple className="size-5 text-slate-800" />
                <span className="text-[11px] font-medium text-slate-700">iOS</span>
              </button>
            </div>
          </div>

          {/* Firm & Utility Links */}
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-xs">
            <button className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Video className="size-4 text-slate-500" />
                <span className="font-medium">Turia Demo Videos</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Gift className="size-4 text-slate-500" />
                <span className="font-medium">Refer &amp; Earn</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </button>

            <Link
              href="/design-system"
              onClick={onClose}
              className="flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette className="size-4 text-indigo-500" />
                <span className="font-medium">Design System &amp; Tokens</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </Link>

            <button className="w-full flex items-center justify-between p-3 text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <Bot className="size-4 text-slate-500" />
                <span className="font-medium">Enroll Utility</span>
              </div>
              <ChevronRight className="size-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <SignOutButton redirectUrl="/sign-in">
            <button
              onClick={() => posthog.reset()}
              className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="size-4" />
              <span className="font-medium text-xs">Logout from Practice</span>
            </button>
          </SignOutButton>
        </div>

      </div>
    </div>
  );
}
