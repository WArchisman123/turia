"use client";

import React from "react";

interface PageLoadingStateProps {
  title: string;
  subtitle?: string;
  showKpiSkeleton?: boolean;
  kpiCount?: number;
  skeletonRows?: number;
}

export function PageLoadingState({
  title,
  subtitle,
  showKpiSkeleton = true,
  kpiCount = 4,
  skeletonRows = 5,
}: PageLoadingStateProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Optional Skeleton KPI Cards */}
      {showKpiSkeleton && (
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
          }}
        >
          {Array.from({ length: kpiCount }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-2.5 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="size-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
              </div>
              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-2 w-28 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Main Elevated Loading Card with Spinner and Table Shimmer */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 shadow-xs text-center space-y-6">
        {/* Animated Dual-Ring Indigo Spinner */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative size-10">
            <div className="absolute inset-0 rounded-full border-3 border-indigo-100 dark:border-indigo-950" />
            <div className="absolute inset-0 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Shimmer Table Row Placeholders */}
        {skeletonRows > 0 && (
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-pulse text-left">
            {/* Header skeleton */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 px-4 py-2.5 flex items-center gap-4">
              <div className="size-3.5 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded ml-auto" />
            </div>

            {/* Row skeletons */}
            {Array.from({ length: skeletonRows }).map((_, idx) => (
              <div key={idx} className="px-4 py-3.5 flex items-center gap-4">
                <div className="size-3.5 bg-slate-100 dark:bg-slate-800 rounded shrink-0" />
                <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3.5 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-3.5 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full ml-auto" />
                <div className="size-5 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageLoadingState;
