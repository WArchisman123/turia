"use client";

import React from "react";
import { Check, Repeat, Zap, Shield, Ban, List } from "lucide-react";
import { ServiceKpiData } from "./types";

interface ServicesKpiStripProps {
  kpi: ServiceKpiData;
}

export function ServicesKpiStrip({ kpi }: ServicesKpiStripProps) {
  const cards = [
    {
      label: "Active",
      value: kpi.activeCount,
      icon: Check,
      valueColor: "text-[#059669]",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-100",
      iconColor: "text-[#059669]",
    },
    {
      label: "Recurring",
      value: kpi.recurringCount,
      icon: Repeat,
      valueColor: "text-[#7C3AED]",
      bgColor: "bg-purple-50/80",
      borderColor: "border-purple-100",
      iconColor: "text-[#7C3AED]",
    },
    {
      label: "Non-Recurring",
      value: kpi.nonRecurringCount,
      icon: Zap,
      valueColor: "text-[#0284C7]",
      bgColor: "bg-sky-50/80",
      borderColor: "border-sky-100",
      iconColor: "text-[#0284C7]",
    },
    {
      label: "Default Services",
      value: kpi.defaultServicesCount,
      icon: Shield,
      valueColor: "text-slate-700",
      bgColor: "bg-slate-100/80",
      borderColor: "border-slate-200",
      iconColor: "text-slate-600",
    },
    {
      label: "Inactive",
      value: kpi.inactiveCount,
      icon: Ban,
      valueColor: "text-[#D97706]",
      bgColor: "bg-amber-50/80",
      borderColor: "border-amber-100",
      iconColor: "text-[#D97706]",
    },
    {
      label: "Total Services",
      value: kpi.totalServicesCount,
      icon: List,
      valueColor: "text-[#4F46E5]",
      bgColor: "bg-indigo-50/80",
      borderColor: "border-indigo-100",
      iconColor: "text-[#4F46E5]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
          >
            <div className="space-y-0.5">
              <span className={`text-xl font-bold tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                {card.label}
              </p>
            </div>
            <div
              className={`size-8 rounded-lg ${card.bgColor} ${card.borderColor} border flex items-center justify-center ${card.iconColor}`}
            >
              <Icon className="size-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
