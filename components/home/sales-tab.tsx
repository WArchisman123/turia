"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Landmark,
  CreditCard,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchSalesSummary, SalesSummaryResponse } from "@/lib/api/home";

const WEEKLY_SALES_DATA = [
  { day: "Mon", revenue: 45000 },
  { day: "Tue", revenue: 62000 },
  { day: "Wed", revenue: 85000 },
  { day: "Thu", revenue: 120000 },
  { day: "Fri", revenue: 95000 },
  { day: "Sat", revenue: 40000 },
  { day: "Sun", revenue: 15000 },
];

const MONTHLY_INVOICE_DATA = [
  { month: "Apr", proforma: 1.2, taxInvoice: 1.0 },
  { month: "May", proforma: 1.5, taxInvoice: 1.3 },
  { month: "Jun", proforma: 2.1, taxInvoice: 1.9 },
  { month: "Jul", proforma: 1.8, taxInvoice: 1.6 },
  { month: "Aug", proforma: 2.4, taxInvoice: 2.1 },
  { month: "Sep", proforma: 2.8, taxInvoice: 2.5 },
  { month: "Oct", proforma: 1.9, taxInvoice: 1.7 },
  { month: "Nov", proforma: 2.2, taxInvoice: 2.0 },
  { month: "Dec", proforma: 3.1, taxInvoice: 2.9 },
  { month: "Jan", proforma: 2.5, taxInvoice: 2.3 },
  { month: "Feb", proforma: 2.7, taxInvoice: 2.4 },
  { month: "Mar", proforma: 3.8, taxInvoice: 3.5 },
];

const MONTHLY_COLLECTIONS_DATA = [
  { month: "Apr", collected: 0.9, pending: 0.3 },
  { month: "May", collected: 1.2, pending: 0.3 },
  { month: "Jun", collected: 1.7, pending: 0.4 },
  { month: "Jul", collected: 1.5, pending: 0.3 },
  { month: "Aug", collected: 1.9, pending: 0.5 },
  { month: "Sep", collected: 2.2, pending: 0.6 },
  { month: "Oct", collected: 1.5, pending: 0.4 },
  { month: "Nov", collected: 1.8, pending: 0.4 },
  { month: "Dec", collected: 2.6, pending: 0.5 },
  { month: "Jan", collected: 2.1, pending: 0.4 },
  { month: "Feb", collected: 2.2, pending: 0.5 },
  { month: "Mar", collected: 3.2, pending: 0.6 },
];

const TOP_SERVICES = [
  { name: "Statutory & Tax Audit (Sec 44AB)", amount: 480000, percent: 85 },
  { name: "GST Compliance & Annual Filing (GSTR-9)", amount: 320000, percent: 65 },
  { name: "MCA Company Secretarial & AOC-4 / MGT-7", amount: 210000, percent: 45 },
  { name: "Direct Tax Litigation & CIT(A) Appeals", amount: 165000, percent: 35 },
  { name: "Transfer Pricing & Cross-Border Advisory", amount: 140000, percent: 30 },
];

const TOP_CLIENTS = [
  { code: "CLI-001", name: "Acme Global Logistics Pvt Ltd", billed: "₹3,45,000", collected: "₹3,00,000", outstanding: "₹45,000", status: "Active" },
  { code: "CLI-002", name: "Reliance Retail Ventures Ltd", billed: "₹2,80,000", collected: "₹2,50,000", outstanding: "₹30,000", status: "Active" },
  { code: "CLI-003", name: "Tata Consumer Products Ltd", billed: "₹2,10,000", collected: "₹1,80,000", outstanding: "₹30,000", status: "Active" },
  { code: "CLI-004", name: "HDFC Life Insurance Co Ltd", billed: "₹1,90,000", collected: "₹1,50,000", outstanding: "₹40,000", status: "Active" },
];

const DONUT_DATA = [
  { name: "Collected", value: 78, color: "#10B981" },
  { name: "Pending", value: 22, color: "#6366F1" },
];

export function SalesTab() {
  const [reportView, setReportView] = useState("Consolidated View");
  const [salesSummary, setSalesSummary] = useState<SalesSummaryResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSales() {
      const data = await fetchSalesSummary();
      if (isMounted && data) {
        setSalesSummary(data);
      }
    }
    loadSales();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Row 1: Revenue Growth & Revenue Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Revenue Growth Card (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Growth</h3>
              <p className="text-xs text-slate-500 mt-0.5">Weekly Sales &amp; Inflow Trajectory</p>
            </div>

            <select
              value={reportView}
              onChange={(e) => setReportView(e.target.value)}
              className="h-7 px-2 text-xs bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 rounded-md cursor-pointer"
            >
              <option>Consolidated View</option>
              <option>Partner View</option>
              <option>Service Line View</option>
            </select>
          </div>

          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                ₹4,62,000
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold mt-1">
                +18.4% MoM <ArrowUpRight className="size-3" />
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Current Week Total
            </span>
          </div>

          {/* Recharts Line Chart */}
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_SALES_DATA}>
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => [
                    `₹${Number(value || 0).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#6366F1" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7-day pill strip */}
          <div className="grid grid-cols-7 gap-1 pt-3 border-t border-slate-100 text-center">
            {WEEKLY_SALES_DATA.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-700 font-mono">
                  ₹{(item.revenue / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trends Card (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Trends</h3>
              <p className="text-xs text-slate-500 mt-0.5">FY 2026-27 Financial Highlights</p>
            </div>
            <select className="h-7 px-2 text-xs bg-white text-slate-700 border border-slate-200 rounded-md cursor-pointer font-medium">
              <option>FY 2026-27</option>
              <option>All Time</option>
            </select>
          </div>

          {/* 3 Metric Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Sales */}
            <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl">
              <div className="size-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 shadow-xs">
                <TrendingUp className="size-3.5" />
              </div>
              <div className="text-lg font-bold text-indigo-700 font-mono">
                ₹{salesSummary ? salesSummary.totalBilled.toLocaleString("en-IN") : "0"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Total Invoiced Sales
              </span>
            </div>

            {/* Total Collection */}
            <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl">
              <div className="size-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs">
                <Landmark className="size-3.5" />
              </div>
              <div className="text-lg font-bold text-emerald-700 font-mono">
                ₹{salesSummary ? salesSummary.totalCollected.toLocaleString("en-IN") : "0"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Realized Collections
              </span>
            </div>

            {/* Total Outstanding */}
            <div className="p-3.5 bg-amber-50/40 border border-amber-100 rounded-xl">
              <div className="size-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 shadow-xs">
                <CreditCard className="size-3.5" />
              </div>
              <div className="text-lg font-bold text-amber-700 font-mono">
                ₹{salesSummary ? salesSummary.totalPending.toLocaleString("en-IN") : "0"}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Outstanding Balance
              </span>
            </div>
          </div>

          {/* Collection Efficiency Ratio */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Collection Efficiency:{" "}
              <span className="font-bold text-emerald-600">
                {salesSummary && salesSummary.totalBilled > 0
                  ? `${((salesSummary.totalCollected / salesSummary.totalBilled) * 100).toFixed(1)}%`
                  : "0.0%"}
              </span>
            </span>
            <span className="text-slate-400 text-[11px]">
              TDS 194J Deductions Logged:{" "}
              <strong className="text-slate-700">
                ₹{salesSummary ? salesSummary.totalTds.toLocaleString("en-IN") : "0"}
              </strong>
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Monthly Proforma vs Tax Invoices & Payment Collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Proforma vs Tax Invoice Bar Chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Proforma vs Tax Invoices (in ₹ Lakhs)
              </h3>
              <p className="text-[11px] text-slate-400">Monthly billing volume across FY</p>
            </div>
            <select className="h-7 px-2 text-xs bg-white text-slate-700 border border-slate-200 rounded-md cursor-pointer">
              <option>Current FY (26-27)</option>
            </select>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_INVOICE_DATA}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit="L" />
                <Tooltip
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => [
                    `₹${value} Lakhs`,
                  ]}
                  contentStyle={{ borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="proforma" name="Proforma Invoices" fill="#C7D2FE" radius={[3, 3, 0, 0]} />
                <Bar dataKey="taxInvoice" name="Tax Invoices" fill="#6366F1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collections vs Pending Bar Chart */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fee Collections vs Pending Receivables
              </h3>
              <p className="text-[11px] text-slate-400">Monthly inflows in ₹ Lakhs</p>
            </div>
            <select className="h-7 px-2 text-xs bg-white text-slate-700 border border-slate-200 rounded-md cursor-pointer">
              <option>Current FY (26-27)</option>
            </select>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_COLLECTIONS_DATA}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit="L" />
                <Tooltip
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => [
                    `₹${value} Lakhs`,
                  ]}
                  contentStyle={{ borderRadius: "8px", fontSize: "11px" }}
                />
                <Bar dataKey="collected" name="Collected Inflows" fill="#10B981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pending" name="Pending Balance" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Client Rankings Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Top Clients Financial Matrix
            </h3>
          </div>
          <select className="h-7 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium">
            <option>September 2026</option>
            <option>All Clients</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Client Code</th>
                <th className="py-2.5 px-3">Trade / Legal Name</th>
                <th className="py-2.5 px-3">Gross Billed</th>
                <th className="py-2.5 px-3">Total Collected</th>
                <th className="py-2.5 px-3">Outstanding Due</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TOP_CLIENTS.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-600">
                    {c.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {c.name}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {c.billed}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-600">
                    {c.collected}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-amber-600">
                    {c.outstanding}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Top 10 Services & Revenue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Top Services (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Top Practice Revenue Lines
            </h3>
            <select className="h-7 px-2 text-xs bg-white text-slate-700 border border-slate-200 rounded-md">
              <option>Current FY</option>
            </select>
          </div>

          <div className="space-y-3">
            {TOP_SERVICES.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{s.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${s.percent}%` }}
                    className="h-full bg-[#6366F1] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview Donut (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Revenue Overview</h3>
            <select className="h-7 px-2 text-xs bg-white text-slate-700 border border-slate-200 rounded-md">
              <option>Current Month</option>
            </select>
          </div>

          <div className="h-36 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DONUT_DATA}
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Gross Invoiced</span>
              <span className="font-bold text-slate-800 font-mono">₹12,45,000</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Collections</span>
              <span className="font-bold text-emerald-600 font-mono">₹9,80,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
