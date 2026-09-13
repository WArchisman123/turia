"use client";

import React, { useState } from "react";
import { Topbar } from "./topbar";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { ProfileDrawer } from "./profile-drawer";
import { OrgGate } from "@/components/auth/org-gate";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <OrgGate>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
        {/* Top Navigation */}
        <Topbar onOpenProfile={() => setIsProfileOpen(true)} />

        {/* Main Area: Sidenav + Content */}
        <div className="flex flex-1 items-stretch">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
              {children}
            </div>
            <Footer />
          </div>
        </div>

        {/* Slide-over Profile Drawer */}
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </OrgGate>
  );
}
