"use client";

import React from "react";
import { ListTodo, CheckCircle2, XCircle, Users, IndianRupee, Percent } from "lucide-react";
import { LeadItem } from "./types";

interface LeadsKpiStripProps {
  leads: LeadItem[];
}

export function LeadsKpiStrip({ leads }: LeadsKpiStripProps) {
  const openCount = leads.filter((l) => l.status === "Open").length;
  const convertedCount = leads.filter((l) => l.status === "Converted").length;
  const lostCount = leads.filter((l) => l.status === "Lost").length;
  const totalCount = leads.length;

  const notConvertedDealValue = leads
    .filter((l) => l.status === "Open")
    .reduce((acc, curr) => acc + curr.dealValue, 0);

  const conversionRate =
    totalCount > 0 ? ((convertedCount / totalCount) * 100).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Open */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
          <ListTodo className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-none">Open</span>
          <span className="text-lg font-bold text-slate-900 block mt-1">{openCount}</span>
        </div>
      </div>

      {/* 2. Converted */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-none">Converted</span>
          <span className="text-lg font-bold text-emerald-700 block mt-1">{convertedCount}</span>
        </div>
      </div>

      {/* 3. Lost */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <XCircle className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-none">Lost</span>
          <span className="text-lg font-bold text-rose-700 block mt-1">{lostCount}</span>
        </div>
      </div>

      {/* 4. Total Leads */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Users className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-none">Total leads</span>
          <span className="text-lg font-bold text-slate-900 block mt-1">{totalCount}</span>
        </div>
      </div>

      {/* 5. Not Yet Converted Deal Value */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <IndianRupee className="size-5" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-slate-500 block leading-tight truncate max-w-[100px]">
            Unconverted Value
          </span>
          <span className="text-sm font-black text-amber-700 block mt-1">
            ₹{notConvertedDealValue >= 100000 ? `${(notConvertedDealValue / 100000).toFixed(2)}L` : notConvertedDealValue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* 6. Conversion Rate */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="size-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
          <Percent className="size-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block leading-none">Conversion Rate</span>
          <span className="text-lg font-bold text-cyan-700 block mt-1">{conversionRate}%</span>
        </div>
      </div>
    </div>
  );
}
