import React from "react";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Building2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="size-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-100 ring-2 ring-indigo-50 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-wider font-sans">T</span>
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 block leading-tight font-sans">
              TURIA
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase block">
              Practice Management SaaS
            </span>
          </div>
        </Link>

        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-slate-900 font-sans">
          Initialize your CA Firm Workspace
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Set up multi-partner access, license seat tracking & statutory compliance engine
        </p>
      </div>

      {/* Main Card with Clerk Component */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
        <div className="w-full flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-lg border border-slate-200/80 rounded-2xl bg-white p-6",
                headerTitle: "text-base font-bold text-slate-900",
                headerSubtitle: "text-xs text-slate-500",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold py-2.5 rounded-lg shadow-sm transition-all",
                formFieldInput:
                  "rounded-lg border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                footerActionLink: "text-indigo-600 hover:text-indigo-700 text-xs font-semibold",
              },
            }}
          />
        </div>
      </div>

      {/* Feature Highlights Footer */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
          <div className="flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
            <Building2 className="size-3.5 text-indigo-600" />
            <span>Multi-Tenant</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>5-Step Setup</span>
          </div>
          <div className="flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
            <CheckCircle2 className="size-3.5 text-purple-600" />
            <span>GSTR-1 Outward</span>
          </div>
        </div>
      </div>
    </div>
  );
}
