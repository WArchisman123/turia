"use client";

import React, { useState } from "react";
import {
  Home as HomeIcon,
  Users,
  User,
  ShoppingBag,
  CheckSquare,
  FileText,
  Users2,
  Shield,
  Search,
  Calendar,
  Clock,
  Filter,
  Bell,
  CheckCircle2,
  BarChart2,
  MoreHorizontal,
  Check,
  Layers,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DesignSystemPage() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between font-sans">
      {/* Main Container */}
      <main className="w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 flex-1">
        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN (Span 3 on Desktop)                          */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            
            {/* 1. BRAND CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Brand
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="size-11 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-sm text-white font-black text-2xl tracking-tight select-none">
                  T
                </div>
                
                {/* Brand Name & Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                    turia
                  </span>
                  <span className="bg-[#EEF2FF] text-[#6366F1] border border-[#E0E7FF] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    CA SUITE
                  </span>
                </div>
              </div>

              <p className="mt-3.5 text-[13px] text-slate-500 leading-relaxed font-normal">
                Chartered Accountancy Practice Management &amp; Statutory Compliance Operating System.
              </p>
            </section>

            {/* 2. COLORS CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Colors
                </span>
              </div>

              {/* Primary Palette */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2.5">
                  Primary
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Text Primary */}
                  <div
                    onClick={() => copyToClipboard("#0F172A")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-14 rounded-lg bg-[#0F172A] border border-transparent shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1.5 text-[10px] font-bold text-slate-800 tracking-tight leading-tight">
                      TEXT PRIMARY
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      #0F172A
                    </span>
                  </div>

                  {/* Text Secondary */}
                  <div
                    onClick={() => copyToClipboard("#64748B")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-14 rounded-lg bg-[#64748B] border border-transparent shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1.5 text-[10px] font-bold text-slate-800 tracking-tight leading-tight">
                      TEXT SEC.
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      #64748B
                    </span>
                  </div>

                  {/* Surface */}
                  <div
                    onClick={() => copyToClipboard("#F8FAFC")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-14 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1.5 text-[10px] font-bold text-slate-800 tracking-tight leading-tight">
                      SURFACE
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      #F8FAFC
                    </span>
                  </div>
                </div>
              </div>

              {/* Semantic Palette */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2.5">
                  Semantic
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {/* Brand Indigo */}
                  <div
                    onClick={() => copyToClipboard("#6366F1")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#6366F1] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      BRAND INDIGO
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #6366F1
                    </span>
                  </div>

                  {/* Present (Green) */}
                  <div
                    onClick={() => copyToClipboard("#10B981")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#10B981] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      PRESENT
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #10B981
                    </span>
                  </div>

                  {/* Overdue (Red) */}
                  <div
                    onClick={() => copyToClipboard("#EF4444")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#EF4444] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      OVERDUE
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #EF4444
                    </span>
                  </div>

                  {/* Alert (Amber) */}
                  <div
                    onClick={() => copyToClipboard("#F59E0B")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#F59E0B] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      ALERT
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #F59E0B
                    </span>
                  </div>
                </div>
              </div>

              {/* Neutrals Palette */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2.5">
                  Neutrals
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {/* Bg Prim */}
                  <div
                    onClick={() => copyToClipboard("#FFFFFF")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      BG PRIM.
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #FFFFFF
                    </span>
                  </div>

                  {/* Bg Sec */}
                  <div
                    onClick={() => copyToClipboard("#F1F5F9")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      BG SEC.
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #F1F5F9
                    </span>
                  </div>

                  {/* Border */}
                  <div
                    onClick={() => copyToClipboard("#E2E8F0")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#E2E8F0] border border-[#CBD5E1] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      BORDER
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #E2E8F0
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    onClick={() => copyToClipboard("#E2E8F0")}
                    className="cursor-pointer group flex flex-col"
                  >
                    <div className="h-12 rounded-lg bg-[#E2E8F0] border border-[#CBD5E1] shadow-xs transition-transform group-hover:scale-98" />
                    <span className="mt-1 text-[9px] font-bold text-slate-800 tracking-tight leading-tight">
                      DIVIDER
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 font-mono">
                      #E2E8F0
                    </span>
                  </div>
                </div>
              </div>

              {copiedHex && (
                <div className="text-center py-1 bg-indigo-50 text-indigo-700 text-[11px] font-medium rounded-md border border-indigo-100 flex items-center justify-center gap-1.5 animate-in fade-in">
                  <Check className="size-3.5" />
                  Copied {copiedHex} to clipboard!
                </div>
              )}
            </section>

            {/* 3. SPACING SYSTEM CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Spacing System
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  (4px Base Unit)
                </span>
              </div>

              {/* Visual Bars Scale */}
              <div className="h-28 flex items-end justify-between gap-1.5 pt-2 pb-1 border-b border-slate-100">
                {[
                  { px: "4px", h: "h-[8px]" },
                  { px: "8px", h: "h-[14px]" },
                  { px: "12px", h: "h-[22px]" },
                  { px: "16px", h: "h-[32px]" },
                  { px: "24px", h: "h-[46px]" },
                  { px: "32px", h: "h-[60px]" },
                  { px: "48px", h: "h-[78px]" },
                  { px: "64px", h: "h-[94px]" },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "w-full bg-[#C7D2FE] hover:bg-[#818CF8] transition-colors rounded-t-sm",
                        item.h
                      )}
                    />
                    <span className="text-[10px] text-slate-600 font-mono font-medium whitespace-nowrap">
                      {item.px}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3.5 text-[11px] text-slate-500 leading-normal font-normal">
                Consistent spatial rhythm engineered for dense financial matrices.
              </p>
            </section>

          </div>

          {/* ========================================================= */}
          {/* MIDDLE COLUMN (Span 5 on Desktop)                         */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* 4. TYPOGRAPHY CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Typography
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-2">
                {/* Left: Font family overview */}
                <div className="md:col-span-4 flex flex-col pr-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Font Family
                  </span>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight my-1">
                    Inter
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-normal">
                    Inter is a precision geometric sans-serif engineered for data-dense tables, statutory filings, and CA practice analytics.
                  </p>
                </div>

                {/* Right: Spec Table */}
                <div className="md:col-span-8 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        <th className="pb-2 font-semibold">Style</th>
                        <th className="pb-2 font-semibold">Usage</th>
                        <th className="pb-2 font-semibold">Size</th>
                        <th className="pb-2 font-semibold">Weight</th>
                        <th className="pb-2 font-semibold text-right">Line Ht</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="py-1.5 font-bold text-slate-900 text-sm">H1</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Page / Screen Title</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">32px</td>
                        <td className="py-1.5 text-[11px] text-slate-600 font-medium">Bold</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.2</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-semibold text-slate-900 text-xs">H2</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Section Title</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">24px</td>
                        <td className="py-1.5 text-[11px] text-slate-600 font-medium">SemiBold</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.3</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-semibold text-slate-900 text-xs">H3</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Card / Table Title</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">18px</td>
                        <td className="py-1.5 text-[11px] text-slate-600 font-medium">SemiBold</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.3</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium text-slate-900 text-[11px]">H4</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Subheading</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">15px</td>
                        <td className="py-1.5 text-[11px] text-slate-600 font-medium">Medium</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.4</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-normal text-slate-900 text-[11px]">Body Large</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Important content</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">16px</td>
                        <td className="py-1.5 text-[11px] text-slate-600">Regular</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.5</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-normal text-slate-900 text-[11px]">Body Medium</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Table &amp; body text</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">13px</td>
                        <td className="py-1.5 text-[11px] text-slate-600">Regular</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.5</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-normal text-slate-900 text-[11px]">Body Small</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Supporting meta</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">12px</td>
                        <td className="py-1.5 text-[11px] text-slate-600">Regular</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.4</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium text-slate-900 text-[10px]">Caption</td>
                        <td className="py-1.5 text-slate-600 text-[11px]">Labels, tags, badges</td>
                        <td className="py-1.5 font-mono text-[11px] text-slate-700">11px</td>
                        <td className="py-1.5 text-[11px] text-slate-600 font-medium">Medium</td>
                        <td className="py-1.5 text-right font-mono text-[11px] text-slate-500">1.3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 5. ICONS CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Icons
                </span>
              </div>

              {/* 16 Icon Matrix */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-y-4 gap-x-2 text-center py-1">
                {/* Row 1 */}
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <HomeIcon className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Home</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Users className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Leads</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <User className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Clients</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <ShoppingBag className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Services</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <CheckSquare className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Tasks</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <FileText className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Invoice</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Users2 className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Team</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Shield className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Registry</span>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Search className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Search</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Calendar className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Calendar</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Clock className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Clock</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Filter className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Filter</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Bell className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Notices</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <CheckCircle2 className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Verify</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <BarChart2 className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">Reports</span>
                </div>

                <div className="flex flex-col items-center gap-1.5 group cursor-default">
                  <div className="size-9 rounded-lg flex items-center justify-center text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <MoreHorizontal className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-600">More</span>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-normal">
                  Line style • 2px stroke • Rounded corners &amp; caps
                </span>
              </div>
            </section>

            {/* 6. GRID SYSTEM CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-4">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Grid System
                </span>
              </div>

              <div className="flex items-stretch gap-4">
                {/* 12-Column Visual Preview */}
                <div className="flex-1 bg-[#EEF2FF]/60 border border-[#C7D2FE]/60 rounded-lg p-2.5 flex gap-1.5 h-36 items-stretch">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#C7D2FE]/50 border border-[#818CF8]/30 rounded-xs transition-opacity hover:opacity-80"
                      title={`Column ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Specs Metadata */}
                <div className="w-28 flex flex-col justify-between py-1 text-slate-800 text-[10px]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      CONTAINER
                    </span>
                    <span className="font-bold text-xs text-slate-900">1440px</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      COLUMNS
                    </span>
                    <span className="font-bold text-xs text-slate-900">12</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      GUTTER
                    </span>
                    <span className="font-bold text-xs text-slate-900">20px</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      MARGIN
                    </span>
                    <span className="font-bold text-xs text-slate-900">24px</span>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (Span 4 on Desktop)                         */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* 7. UI ELEMENTS CARD */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)] flex flex-col gap-5">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  UI Elements
                </span>
              </div>

              {/* Buttons Matrix */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-3">
                  Buttons
                </span>

                <div className="grid grid-cols-5 gap-2 items-center text-center">
                  <div />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    DEFAULT
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    HOVER
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    OUTLINE
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    DISABLED
                  </span>

                  {/* Primary Row */}
                  <span className="text-[11px] font-medium text-slate-700 text-left">
                    Primary
                  </span>
                  <div>
                    <button className="w-full bg-[#6366F1] text-white text-[11px] font-medium py-1.5 px-2 rounded-lg shadow-xs hover:bg-[#4F46E5] transition-colors cursor-pointer">
                      + Add Task
                    </button>
                  </div>
                  <div>
                    <button className="w-full bg-[#4338CA] text-white text-[11px] font-medium py-1.5 px-2 rounded-lg shadow-xs cursor-pointer">
                      + Add Task
                    </button>
                  </div>
                  <div>
                    <button className="w-full border border-[#6366F1] text-[#6366F1] bg-white text-[11px] font-medium py-1.5 px-2 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                      + Add Task
                    </button>
                  </div>
                  <div>
                    <button
                      disabled
                      className="w-full bg-[#F1F5F9] text-[#94A3B8] border border-slate-200 text-[11px] font-medium py-1.5 px-2 rounded-lg cursor-not-allowed"
                    >
                      + Add Task
                    </button>
                  </div>

                  {/* Secondary Row */}
                  <span className="text-[11px] font-medium text-slate-700 text-left">
                    Secondary
                  </span>
                  <div>
                    <button className="w-full bg-[#F1F5F9] text-slate-700 text-[11px] font-medium py-1.5 px-2 rounded-lg hover:bg-[#E2E8F0] transition-colors cursor-pointer">
                      Filter
                    </button>
                  </div>
                  <div>
                    <button className="w-full bg-[#E2E8F0] text-slate-800 text-[11px] font-medium py-1.5 px-2 rounded-lg cursor-pointer">
                      Filter
                    </button>
                  </div>
                  <div>
                    <button className="w-full border border-slate-300 text-slate-700 bg-white text-[11px] font-medium py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      Filter
                    </button>
                  </div>
                  <div>
                    <button
                      disabled
                      className="w-full bg-[#F8FAFC] text-[#CBD5E1] border border-slate-100 text-[11px] font-medium py-1.5 px-2 rounded-lg cursor-not-allowed"
                    >
                      Filter
                    </button>
                  </div>

                  {/* Text Row */}
                  <span className="text-[11px] font-medium text-slate-700 text-left">
                    Text
                  </span>
                  <div>
                    <button className="text-[#6366F1] text-[11px] font-semibold hover:underline cursor-pointer">
                      View Details
                    </button>
                  </div>
                  <div>
                    <button className="text-[#4338CA] bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer">
                      View Details
                    </button>
                  </div>
                  <div className="text-slate-300 text-[11px] font-medium">—</div>
                  <div className="text-slate-300 text-[11px] font-medium">—</div>
                </div>
              </div>

              {/* Status Badges / Chips */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2.5">
                  Status Badges / Chips
                </span>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#10B981]" />
                    Present
                  </span>

                  <span className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#EF4444]" />
                    Overdue
                  </span>

                  <span className="bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#6366F1]" />
                    In Progress
                  </span>

                  <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#F59E0B]" />
                    Exp. 15d
                  </span>

                  <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-full px-2.5 py-0.5 text-[11px] font-medium inline-flex items-center gap-1.5">
                    <Check className="size-3 text-[#2563EB]" strokeWidth={2.5} />
                    GSTIN Verified
                  </span>

                  <span className="bg-[#F1F5F9] text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 text-[11px] font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                    More +
                  </span>
                </div>
              </div>

              {/* Statutory Compliance Status Meter */}
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block mb-2.5">
                  Statutory Compliance Status Meter
                </span>

                {/* Progress Bar Segmented */}
                <div className="w-full flex h-6 rounded-md overflow-hidden text-[10px] font-semibold text-white tracking-tight shadow-xs">
                  <div
                    style={{ width: "18%" }}
                    className="bg-[#EF4444] flex items-center justify-center whitespace-nowrap px-1"
                  >
                    Overdue 18%
                  </div>
                  <div
                    style={{ width: "42%" }}
                    className="bg-[#6366F1] flex items-center justify-center whitespace-nowrap px-1"
                  >
                    WIP 42%
                  </div>
                  <div
                    style={{ width: "40%" }}
                    className="bg-[#10B981] flex items-center justify-center whitespace-nowrap px-1"
                  >
                    Completed 40%
                  </div>
                </div>

                {/* Meter Ticks & Labels */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-medium">
                  <span>0%</span>
                  <span>50% (Active Firm Target)</span>
                  <span>100%</span>
                </div>
              </div>
            </section>

            {/* 8. CARD EXAMPLE */}
            <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
              <div className="mb-3">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                  Card Example
                </span>
              </div>

              {/* Real World Compliance Task Card */}
              <div className="border border-[#E2E8F0] rounded-xl p-4 bg-white shadow-xs">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      GSTR-3B Monthly Return Filing (Aug 2026)
                    </h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Acme Global Logistics Pvt Ltd • GSTIN: 27AABCU9603R1ZM
                    </p>
                  </div>
                  <span className="bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2] rounded-full px-2.5 py-0.5 text-[10px] font-bold inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span className="size-1.5 rounded-full bg-[#EF4444]" />
                    High Priority
                  </span>
                </div>

                {/* Description Box */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-lg p-3 my-3 text-[11px] text-slate-600 leading-relaxed">
                  Preparation of inward/outward summaries, ITC verification under Sec 16(2), and GSTR-2B reconciliation.
                </div>

                {/* Tags Strip */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md px-2 py-0.5 text-[10px] font-medium">
                    Statutory Audit
                  </span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-md px-2 py-0.5 text-[10px] font-medium">
                    Due: 20 Sep 2026
                  </span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-2 py-0.5 text-[10px] font-medium">
                    4/6 Sub-Tasks Done
                  </span>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Assignee & Ref */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3 text-slate-500" />
                      <span className="font-medium text-slate-700">archi (Sr. Associate)</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <FileText className="size-3 text-slate-400" />
                      PI-2026-089
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer">
                      Log Time
                    </button>
                    <button className="bg-[#6366F1] text-white hover:bg-[#4F46E5] px-2.5 py-1 rounded-md text-[11px] font-medium shadow-xs transition-colors cursor-pointer">
                      Verify &amp; File
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 9 & 10. SHADOWS & BORDER RADIUS DUAL CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* SHADOWS */}
              <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase block mb-3">
                  Shadows
                </span>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white border border-slate-100 shadow-[0px_1px_3px_rgba(0,0,0,0.12)] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        SMALL
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        0px 1px 3px rgba(0,0,0,0.12)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white border border-slate-100 shadow-[0px_4px_12px_rgba(0,0,0,0.16)] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        MEDIUM
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        0px 4px 12px rgba(0,0,0,0.16)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white border border-slate-100 shadow-[0px_12px_24px_rgba(0,0,0,0.20)] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        LARGE
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        0px 12px 24px rgba(0,0,0,0.20)
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* BORDER RADIUS */}
              <section className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
                <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase block mb-3">
                  Border Radius
                </span>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-[4px] bg-[#EEF2FF] border border-[#C7D2FE] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        SMALL
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">4px</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-[8px] bg-[#EEF2FF] border border-[#C7D2FE] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        MEDIUM
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">8px</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-[12px] bg-[#EEF2FF] border border-[#C7D2FE] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        LARGE
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">12px</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-800 uppercase block">
                        FULL
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">9999px</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* COMPREHENSIVE TABS & NAVIGATION STYLING SHOWCASE          */}
        {/* ========================================================= */}
        <section className="mt-8 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                  Tabs &amp; Navigation Styling
                </span>
                <span className="bg-[#EEF2FF] text-[#6366F1] font-semibold text-[10px] px-2 py-0.5 rounded-full border border-indigo-100">
                  SHADCN / RADIX PRIMITIVES
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Standardized tab controllers for Statutory Compliance Workspaces, Attendance Hubs, and Practitioner Portals.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <code>variant=&quot;line&quot; | &quot;pill&quot; | &quot;default&quot;</code>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* VARIANT 1: LINE / UNDERLINE TABS (Master Module Navigation) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  1. Line / Underline Tabs (Master Workflow Navigation)
                </span>
                <span className="text-[10px] font-mono text-slate-400">variant=&quot;line&quot;</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-[#F8FAFC]/50">
                <Tabs defaultValue="task-list" className="w-full">
                  <TabsList variant="line">
                    <TabsTrigger variant="line" value="task-summary" className="gap-1.5">
                      <Layers className="size-3.5" />
                      Task Summary
                    </TabsTrigger>
                    <TabsTrigger variant="line" value="task-list" className="gap-1.5">
                      <ListTodo className="size-3.5" />
                      Task List
                      <span className="ml-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        14
                      </span>
                    </TabsTrigger>
                    <TabsTrigger variant="line" value="sub-tasks" className="gap-1.5">
                      <CheckCircle2 className="size-3.5" />
                      Sub-Tasks
                      <span className="ml-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.2 rounded-full">
                        6
                      </span>
                    </TabsTrigger>
                    <TabsTrigger variant="line" value="recurring" className="gap-1.5">
                      <Clock className="size-3.5" />
                      Recurring
                    </TabsTrigger>
                    <TabsTrigger variant="line" value="analytics" className="gap-1.5">
                      <BarChart2 className="size-3.5" />
                      MIS Analytics
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <TabsContent value="task-summary" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Task Summary Matrix</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">8 grouping dimensions with Logarithmic Heatmap severity calculation.</p>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">8 Group-by Pills</span>
                      </div>
                    </TabsContent>

                    <TabsContent value="task-list" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Task List Pipeline (14 Active Filings)</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">10 status KPI metric cards, comprehensive filter slide-over drawer, and audit logs.</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">10 Status KPIs</span>
                      </div>
                    </TabsContent>

                    <TabsContent value="sub-tasks" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Sub-Tasks Execution &amp; Verification</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">10-column verification pipeline for partner reviews and articleship sign-offs.</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">10 Columns</span>
                      </div>
                    </TabsContent>

                    <TabsContent value="recurring" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">Recurring Compliance Schedule</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">Automated statutory FY schedules across Apr - Mar calendar cycles.</p>
                        </div>
                        <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">FY Apr-Mar</span>
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">12 Management MIS Reports</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">Pending aging analysis across 6 buckets (&gt;60d, 31-60d, 15-30d, 7-14d, &lt;7d).</p>
                        </div>
                        <span className="bg-purple-50 text-purple-700 font-semibold text-[10px] px-2 py-0.5 rounded-md">6 Aging Buckets</span>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>

            {/* VARIANT 2: PILL / SEGMENTED TABS (View Switchers & Control Bars) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  2. Pill / Segmented Tabs (View Switchers &amp; Filter Bars)
                </span>
                <span className="text-[10px] font-mono text-slate-400">variant=&quot;pill&quot;</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-[#F8FAFC]/50">
                <Tabs defaultValue="weekly" className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <TabsList variant="pill">
                      <TabsTrigger variant="pill" value="today">
                        Today&apos;s Attendance
                      </TabsTrigger>
                      <TabsTrigger variant="pill" value="weekly">
                        Weekly Matrix
                      </TabsTrigger>
                      <TabsTrigger variant="pill" value="monthly">
                        Monthly Calendar
                      </TabsTrigger>
                      <TabsTrigger variant="pill" value="regularization">
                        Regularization
                      </TabsTrigger>
                    </TabsList>

                    <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                      Geofence GPS: 150m
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <TabsContent value="today" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">Today&apos;s Live Clock-In Status</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">Punch-in attendance timer with GPS coordinate radius tracking.</p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Shift
                        </span>
                      </div>
                    </TabsContent>

                    <TabsContent value="weekly" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            📅
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">Weekly Hourly Timesheet Matrix</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">7-day matrix (12 PM - 11 PM) with live horizontal red indicator line.</p>
                          </div>
                        </div>
                        <span className="bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-indigo-200">
                          40.0 Hrs Target
                        </span>
                      </div>
                    </TabsContent>

                    <TabsContent value="monthly" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                            📊
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">Monthly Attendance &amp; Leave Ledger</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">Color badges for Present, Absent, Holiday, and ICAI exam study leave.</p>
                          </div>
                        </div>
                        <span className="bg-blue-50 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                          30 Days
                        </span>
                      </div>
                    </TabsContent>

                    <TabsContent value="regularization" className="mt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                            ⏳
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">Attendance Regularization Requests</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">Partner approval workflow for client audit site visits and outdoor duties.</p>
                          </div>
                        </div>
                        <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                          2 Pending
                        </span>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* GLOBAL FOOTER BANNER (Full-width Dark Navy Strip)         */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#0F172A] text-white py-4 px-6 md:px-8 mt-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[12px]">
          {/* Left: Brand + Description */}
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="font-extrabold tracking-wide text-white text-sm">
              TURIA
            </span>
            <span className="text-slate-600 font-light">|</span>
            <span className="text-slate-300 font-normal">
              Chartered Accountancy Practice Management &amp; Statutory Compliance Operating System.
            </span>
          </div>

          {/* Center: Version Info */}
          <div className="text-slate-400 font-medium">
            Design System v1.0 <span className="mx-1.5">•</span> September 2026
          </div>

          {/* Right: Tagline */}
          <div className="text-[#818CF8] font-medium">
            Precision Compliance. Seamless Practice Orchestration.
          </div>
        </div>
      </footer>
    </div>
  );
}
