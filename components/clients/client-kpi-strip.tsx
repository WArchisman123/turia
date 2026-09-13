"use client";

import React from "react";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { ClientKpiData } from "./types";

interface ClientKpiStripProps {
  kpi: ClientKpiData;
}

export function ClientKpiStrip({ kpi }: ClientKpiStripProps) {
  const cards = [
    {
      label: "Total Clients",
      value: kpi.totalClients,
      icon: Users,
      valueColor: "text-[#6366F1]",
      bgColor: "bg-purple-50/80",
      borderColor: "border-purple-100",
      iconColor: "text-[#6366F1]",
    },
    {
      label: "New Clients this month",
      value: kpi.newClientsThisMonth,
      icon: UserPlus,
      valueColor: "text-[#0284C7]",
      bgColor: "bg-sky-50/80",
      borderColor: "border-sky-100",
      iconColor: "text-[#0284C7]",
    },
    {
      label: "Active Clients 90 days",
      value: kpi.activeClients90Days,
      icon: UserCheck,
      valueColor: "text-[#059669]",
      bgColor: "bg-emerald-50/80",
      borderColor: "border-emerald-100",
      iconColor: "text-[#059669]",
    },
    {
      label: "No Activity 90 days",
      value: kpi.noActivity90Days,
      icon: UserX,
      valueColor: "text-[#D97706]",
      bgColor: "bg-amber-50/80",
      borderColor: "border-amber-100",
      iconColor: "text-[#D97706]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
          >
            <div className="space-y-0.5">
              <span className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                {card.label}
              </p>
            </div>
            <div
              className={`size-9 rounded-lg ${card.bgColor} ${card.borderColor} border flex items-center justify-center ${card.iconColor}`}
            >
              <Icon className="size-4.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
