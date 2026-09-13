"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import {
  Sparkles,
  ArrowLeft,
  Home,
  CheckSquare,
  Receipt,
  UserCheck,
  Building2,
  FolderLock,
  ArrowRight,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const coreModules = [
    {
      title: "Home Cockpit",
      description: "Punch-in attendance, timesheets & quick notes",
      href: "/",
      icon: Home,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Compliance Tasks",
      description: "Statutory deadlines, sub-tasks & audit pipeline",
      href: "/tasks",
      icon: CheckSquare,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400",
    },
    {
      title: "Client Master",
      description: "Entity directory, PAN, GSTINs & client groups",
      href: "/clients",
      icon: Building2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      title: "Invoicing & GST",
      description: "Proformas, tax invoices, TDS 194J & GSTR-1",
      href: "/invoices",
      icon: Receipt,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      title: "Leads Management",
      description: "Prospect pipeline, GSTIN verify & conversions",
      href: "/leads",
      icon: UserCheck,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-400",
    },
    {
      title: "Statutory Registry",
      description: "Physical DSC vault bins, licenses & expiry alerts",
      href: "/registry",
      icon: FolderLock,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400",
    },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 space-y-8 animate-in fade-in duration-200">
        {/* Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center shadow-xs relative overflow-hidden">
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-indigo-100/60 to-transparent dark:from-indigo-950/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-5">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400" />
              </span>
              <span>404 • Feature In Development / Coming Soon</span>
            </div>

            {/* Glowing Hero Icon */}
            <div className="relative size-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl shadow-indigo-500/25 flex items-center justify-center text-white my-2">
              <Sparkles className="size-9 animate-pulse" />
            </div>

            {/* Headline & Description */}
            <div className="space-y-2 max-w-xl">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Module Coming Soon
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This statutory compliance and practice management feature is currently being orchestrated for CA practitioners. Check back soon as updates are rolled out to your firm workspace.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                Go Back
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Home className="size-3.5" />
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Jump / Active Practice Modules */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Practice Modules
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Quick Navigation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {coreModules.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-start gap-3.5"
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <ArrowRight className="size-3 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
