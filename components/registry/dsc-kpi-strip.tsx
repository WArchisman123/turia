"use client";

import React from "react";
import {
  List,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Building,
  Building2,
  UserCheck,
  AlertOctagon,
} from "lucide-react";
import { DSCKpiData } from "./types";
import { cn } from "@/lib/utils";

interface DSCKpiStripProps {
  kpi: DSCKpiData;
  activeFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

export function DSCKpiStrip({
  kpi,
  activeFilter,
  onSelectFilter,
}: DSCKpiStripProps) {
  const cards = [
    {
      id: "total",
      label: "Total DSC",
      value: kpi.totalDSC,
      color: "text-slate-900 dark:text-white",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
      icon: List,
    },
    {
      id: "active",
      label: "Active",
      value: kpi.active,
      color: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    {
      id: "exp30",
      label: "Exp. in 30d",
      value: kpi.expIn30d,
      color: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
      icon: Clock,
    },
    {
      id: "exp15",
      label: "Exp. in 15d",
      value: kpi.expIn15d,
      color: "text-orange-600 dark:text-orange-400",
      badgeBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
      icon: AlertTriangle,
    },
    {
      id: "expired",
      label: "Expired",
      value: kpi.expired,
      color: "text-rose-600 dark:text-rose-400",
      badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
      icon: Flame,
    },
    {
      id: "ca_office",
      label: "CA Office",
      value: kpi.caOffice,
      color: "text-indigo-600 dark:text-indigo-400",
      badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
      icon: Building,
    },
    {
      id: "cs_office",
      label: "CS Office",
      value: kpi.csOffice,
      color: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
      icon: Building2,
    },
    {
      id: "client_office",
      label: "Client Office",
      value: kpi.clientOffice,
      color: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      icon: UserCheck,
    },
    {
      id: "missing",
      label: "Missing",
      value: kpi.missing,
      color: "text-rose-600 dark:text-rose-400",
      badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
      icon: AlertOctagon,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(isSelected ? null : card.id)}
            className={cn(
              "p-3 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative group",
              isSelected
                ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-400"
                : "bg-white dark:bg-slate-900 border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
            )}
          >
            <div className="flex items-start justify-between gap-1 mb-2">
              <span className={cn("text-2xl font-bold tracking-tight", card.color)}>
                {card.value}
              </span>
              <div
                className={cn(
                  "size-6 rounded-md flex items-center justify-center shrink-0",
                  card.badgeBg
                )}
              >
                <Icon className="size-3.5" />
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {card.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
