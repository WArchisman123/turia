"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Users,
  Building2,
  DollarSign,
  PieChart,
  Calendar,
  Percent,
  Receipt,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import {
  SalesAnalyticsData,
  GSTR1StatCards,
  GSTR1Table4Row,
  GSTR1Table7Row,
  GSTR1Table8Row,
  GSTR1Table12Row,
  GSTR1Table13Row,
} from "./types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SalesAnalyticsTabProps {
  analytics: SalesAnalyticsData;
  gstr1Stats: GSTR1StatCards;
  gstr1Table4: GSTR1Table4Row[];
  gstr1Table7: GSTR1Table7Row[];
  gstr1Table8: GSTR1Table8Row[];
  gstr1Table12: GSTR1Table12Row[];
  gstr1Table13: GSTR1Table13Row[];
}

const REPORTS_LIST = [
  { id: "dashboard", label: "Analytics Dashboard", icon: BarChart3 },
  { id: "gstr1", label: "GSTR-1 Outward Supplies Report", icon: FileSpreadsheet },
  { id: "master_sales", label: "Master Sales Summary", icon: TrendingUp },
  { id: "sales_by_client", label: "Sales By Client", icon: Building2 },
  { id: "payments_received", label: "Payment Received Report", icon: DollarSign },
  { id: "receivable_aging", label: "Receivable Aging Report", icon: Calendar },
  { id: "revenue_by_user", label: "Revenue By User / Partner", icon: Users },
  { id: "service_profitability", label: "Service Profitability", icon: PieChart },
  { id: "tds_194j", label: "TDS 194J Register", icon: Percent },
  { id: "reimbursements_recovery", label: "Pass-Through Recovery Rate", icon: Receipt },
  { id: "retainer_growth", label: "Retainer Growth Analysis", icon: FileCheck },
  { id: "proforma_conversion", label: "Proforma Conversion Pipeline", icon: ArrowUpRight },
  { id: "cancelled_notes", label: "Cancelled & Credit Notes", icon: ShieldAlert },
];

export function SalesAnalyticsTab({
  analytics,
  gstr1Stats,
  gstr1Table4,
  gstr1Table7,
  gstr1Table8,
  gstr1Table12,
  gstr1Table13,
}: SalesAnalyticsTabProps) {
  const [activeReport, setActiveReport] = useState<string>("dashboard");
  const [gstr1SubTab, setGstr1SubTab] = useState<"table4" | "table7" | "table8" | "table12" | "table13">("table4");

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* 13-Report Navigation Sidebar */}
      <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 block">
          Sales & Tax MIS Reports (13)
        </span>
        {REPORTS_LIST.map((rep) => {
          const Icon = rep.icon;
          const isActive = activeReport === rep.id;

          return (
            <button
              key={rep.id}
              type="button"
              onClick={() => setActiveReport(rep.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`size-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="truncate">{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        {/* ========================================================================= */}
        {/* VIEW 1: Analytics Dashboard (invoice-6.png) */}
        {/* ========================================================================= */}
        {activeReport === "dashboard" && (
          <div className="space-y-6">
            {/* Top 5 Executive Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Sales
                </span>
                <p className="text-lg font-bold text-slate-900 font-mono mt-1">
                  ₹ {analytics.summary.total_sales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-indigo-600 font-medium">+18.4% vs last period</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Collections
                </span>
                <p className="text-lg font-bold text-emerald-600 font-mono mt-1">
                  ₹ {analytics.summary.total_collections.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">Bank remittances in hand</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Outstanding Dues
                </span>
                <p className="text-lg font-bold text-rose-600 font-mono mt-1">
                  ₹ {analytics.summary.outstanding_dues.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-rose-500 font-medium">Pending collections</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Collection Rate
                </span>
                <p className="text-lg font-bold text-indigo-600 font-mono mt-1">
                  {analytics.summary.collection_rate}%
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Target: 85%</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Retainers
                </span>
                <p className="text-lg font-bold text-purple-600 font-mono mt-1">
                  {analytics.summary.active_retainers} Contracts
                </p>
                <span className="text-[10px] text-purple-500 font-medium">Recurring Cashflow</span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MoM Sales vs Collections Area Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Sales & Collections Trend (MoM)
                    </h3>
                    <p className="text-[11px] text-slate-400">Monthly progression across FY 2026 - 2027</p>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.monthly_trends}>
                      <defs>
                        <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="collColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748B" }}
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <Tooltip
                        formatter={(val: unknown) => [`₹ ${Number(val || 0).toLocaleString("en-IN")}`, ""]}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        name="Sales (₹)"
                        stroke="#6366F1"
                        fillOpacity={1}
                        fill="url(#salesColor)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="collections"
                        name="Collections (₹)"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#collColor)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Sales vs Collection Bar Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Monthly Sales vs Collections Comparison
                  </h3>
                  <p className="text-[11px] text-slate-400">Cash realized against billed volume</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748B" }}
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <Tooltip
                        formatter={(val: unknown) => [`₹ ${Number(val || 0).toLocaleString("en-IN")}`, ""]}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="sales" name="Billed Amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="collections" name="Collected" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outstanding" name="Outstanding" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Collection Efficiency by Month Cards */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Collection Efficiency %
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {analytics.monthly_collection_rate.map((m) => (
                  <div key={m.month} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{m.month}</span>
                      <span className="text-indigo-700">{m.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${m.rate}%` }}
                      />
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                      <span>Rec: ₹{m.collected / 1000}k</span>
                      <span>Total: ₹{m.sales / 1000}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tables: Revenue By Service & Client */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue By Service */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Revenue Contribution by Service Practice
                </h3>
                <div className="space-y-3">
                  {analytics.revenue_by_service.map((s) => (
                    <div key={s.service} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{s.service}</span>
                        <span className="font-mono font-bold text-slate-900">
                          ₹ {s.revenue.toLocaleString("en-IN")} ({s.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue By User / Partner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Partner & Staff Billing Contribution
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="py-2">Partner / Staff</th>
                      <th className="py-2 text-center">Tasks Billed</th>
                      <th className="py-2 text-right">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.revenue_by_user.map((u) => (
                      <tr key={u.user}>
                        <td className="py-2.5 font-bold text-slate-900">{u.user}</td>
                        <td className="py-2.5 text-center font-mono">{u.tasks_billed}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-700">
                          ₹ {u.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: GSTR-1 Outward Supplies Report (invoice-7.png) */}
        {/* ========================================================================= */}
        {activeReport === "gstr1" && (
          <div className="space-y-6">
            {/* 5 Statutory Stat Cards (invoice-7.png) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Taxable Value
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 font-mono mt-1">
                  ₹ {gstr1Stats.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">B2B + B2C Supplies</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  IGST (Integrated)
                </span>
                <p className="text-base sm:text-lg font-bold text-blue-600 font-mono mt-1">
                  ₹ {gstr1Stats.igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-blue-500 font-medium">Inter-State Outward</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  CGST (Central)
                </span>
                <p className="text-base sm:text-lg font-bold text-indigo-600 font-mono mt-1">
                  ₹ {gstr1Stats.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-indigo-500 font-medium">Intra-State (9%)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  SGST / UTGST (State)
                </span>
                <p className="text-base sm:text-lg font-bold text-indigo-600 font-mono mt-1">
                  ₹ {gstr1Stats.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-indigo-500 font-medium">Intra-State (9%)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Tax Liability
                </span>
                <p className="text-base sm:text-lg font-bold text-emerald-600 font-mono mt-1">
                  ₹ {gstr1Stats.total_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">Payable in GSTR-3B</span>
              </div>
            </div>

            {/* Sub-tabs for GSTR-1 Tables */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs">
              {[
                { id: "table4", label: "Table 4: B2B Invoices" },
                { id: "table7", label: "Table 7: B2C Small" },
                { id: "table8", label: "Table 8: Nil / Exempt / Non-GST" },
                { id: "table12", label: "Table 12: HSN / SAC Summary" },
                { id: "table13", label: "Table 13: Documents Issued" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGstr1SubTab(tab.id as "table4" | "table7" | "table8" | "table12" | "table13")}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    gstr1SubTab === tab.id
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Table 4: B2B Invoices */}
              {gstr1SubTab === "table4" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">GSTIN of Recipient</th>
                        <th className="py-3 px-3">Receiver Name</th>
                        <th className="py-3 px-3">Invoice No</th>
                        <th className="py-3 px-3">Invoice Date</th>
                        <th className="py-3 px-3 text-right">Invoice Value (₹)</th>
                        <th className="py-3 px-3">Place of Supply</th>
                        <th className="py-3 px-3 text-center">Reverse Charge</th>
                        <th className="py-3 px-3 text-right">Rate %</th>
                        <th className="py-3 px-3 text-right">Taxable Value (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gstr1Table4.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">{row.gstin}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{row.trade_name}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{row.invoice_number}</td>
                          <td className="py-2.5 px-3 text-slate-600">{row.invoice_date}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹ {row.invoice_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{row.place_of_supply}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-600">{row.reverse_charge}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{row.rate}%</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                            ₹ {row.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table 7: B2C Small */}
              {gstr1SubTab === "table7" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Place of Supply</th>
                        <th className="py-3 px-3 text-right">Applicable % of Tax Rate</th>
                        <th className="py-3 px-3 text-right">Rate %</th>
                        <th className="py-3 px-3 text-right">Taxable Value (₹)</th>
                        <th className="py-3 px-3 text-right">Cess (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gstr1Table7.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No B2C small outward supplies reported for this tax period.
                          </td>
                        </tr>
                      ) : (
                        gstr1Table7.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{row.type}</td>
                            <td className="py-2.5 px-3 text-slate-700">{row.place_of_supply}</td>
                            <td className="py-2.5 px-3 text-right font-mono">100%</td>
                            <td className="py-2.5 px-3 text-right font-mono">{row.rate}%</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-700">
                              ₹ {row.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">₹ 0.00</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table 8: Nil / Exempted */}
              {gstr1SubTab === "table8" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Description of Supply</th>
                        <th className="py-3 px-3 text-right">Nil Rated Supplies (₹)</th>
                        <th className="py-3 px-3 text-right">Exempted Supplies (₹)</th>
                        <th className="py-3 px-3 text-right">Non-GST Supplies (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gstr1Table8.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{row.description}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            ₹ {row.nil_rated.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            ₹ {row.exempted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">
                            ₹ {row.non_gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table 12: HSN/SAC */}
              {gstr1SubTab === "table12" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">HSN / SAC</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3 text-center">UQC</th>
                        <th className="py-3 px-3 text-right">Total Qty</th>
                        <th className="py-3 px-3 text-right">Total Value (₹)</th>
                        <th className="py-3 px-3 text-right">Taxable Value (₹)</th>
                        <th className="py-3 px-3 text-right">Integrated (₹)</th>
                        <th className="py-3 px-3 text-right">Central (₹)</th>
                        <th className="py-3 px-3 text-right">State (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gstr1Table12.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">{row.hsn_sac}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{row.description}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{row.uqc}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{row.total_quantity}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹ {row.total_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                            ₹ {row.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-blue-600">
                            ₹ {row.integrated_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-indigo-600">
                            ₹ {row.central_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-indigo-600">
                            ₹ {row.state_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table 13: Documents Issued */}
              {gstr1SubTab === "table13" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Nature of Document</th>
                        <th className="py-3 px-3">Sr. No. From</th>
                        <th className="py-3 px-3">Sr. No. To</th>
                        <th className="py-3 px-3 text-center">Total Number</th>
                        <th className="py-3 px-3 text-center">Cancelled</th>
                        <th className="py-3 px-3 text-center font-bold">Net Issued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gstr1Table13.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{row.nature_of_document}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{row.sr_no_from}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{row.sr_no_to}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">{row.total_number}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-400">{row.cancelled}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">{row.net_issued}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OTHER MIS REPORTS: Specialized Views */}
        {/* ========================================================================= */}
        {activeReport !== "dashboard" && activeReport !== "gstr1" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {REPORTS_LIST.find((r) => r.id === activeReport)?.label}
              </h3>
              <p className="text-xs text-slate-400">Official practice management & statutory MIS report</p>
            </div>

            {activeReport === "sales_by_client" && (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold">
                    <th className="py-2">Client Name</th>
                    <th className="py-2 text-center">Invoices Issued</th>
                    <th className="py-2 text-right">Total Billing Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.revenue_by_client.map((c) => (
                    <tr key={c.client} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-900">{c.client}</td>
                      <td className="py-3 text-center font-mono">{c.invoices}</td>
                      <td className="py-3 text-right font-mono font-bold text-indigo-700">
                        ₹ {c.revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport !== "sales_by_client" && (
              <div className="py-12 text-center space-y-2">
                <FileSpreadsheet className="size-8 mx-auto text-slate-300" />
                <p className="text-xs text-slate-600 font-semibold">
                  Report generated for Financial Year 2026 - 2027
                </p>
                <p className="text-[11px] text-slate-400">
                  All corresponding ledger postings, TDS Section 194J vouchers, and client sub-ledgers are balanced.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
