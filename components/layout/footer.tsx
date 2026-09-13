"use client";

import React from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#E2E8F0] py-3 px-6 text-xs text-slate-400 flex items-center justify-between select-none">
      <div>
        <span>&copy; 2026, Powered by </span>
        <span className="font-semibold text-slate-600">TURIA</span>
      </div>

      {/* Floating Customizer Button */}
      <Link
        href="/design-system"
        className="fixed bottom-6 right-0 z-40 bg-[#6366F1] hover:bg-[#4F46E5] text-white p-2.5 rounded-l-xl shadow-lg flex items-center justify-center transition-all hover:pl-3.5 group cursor-pointer"
        title="Open App Customizer & Design Tokens"
        aria-label="App Customizer"
      >
        <Settings className="size-4 animate-spin-slow group-hover:rotate-45 transition-transform" />
      </Link>
    </footer>
  );
}
