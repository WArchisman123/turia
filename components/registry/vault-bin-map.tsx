"use client";

import React, { useState } from "react";
import { Vault } from "lucide-react";
import { DSCItem } from "./types";
import { cn } from "@/lib/utils";

interface VaultBinMapProps {
  items: DSCItem[];
  onSelectToken: (item: DSCItem) => void;
}

export function VaultBinMap({ items, onSelectToken }: VaultBinMapProps) {
  const [selectedDrawer, setSelectedDrawer] = useState<"A" | "B" | "C">("A");
  const [activeBin, setActiveBin] = useState<string | null>(null);

  // Group tokens physically in CA office by bin number
  const tokensInOffice = items.filter((item) => item.location === "ca_office");
  const binMap: Record<string, DSCItem> = {};
  tokensInOffice.forEach((t) => {
    if (t.binNumber) {
      binMap[t.binNumber.toUpperCase().trim()] = t;
    }
  });

  // Generate 12 slots per drawer (BIN-A01 to BIN-A12, BIN-B01 to BIN-B12, etc.)
  const binSlots = Array.from({ length: 12 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, "0");
    const code = `BIN-${selectedDrawer}${num}`;
    return {
      code,
      item: binMap[code] || null,
    };
  });

  const occupiedCount = binSlots.filter((s) => s.item !== null).length;
  const totalCapacity = binSlots.length;

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Vault className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Physical USB Token Vault Drawer Matrix
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Interactive physical bin mapping inside CA Office secure cryptographic cabinet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>
              Occupied: <strong>{occupiedCount} / {totalCapacity}</strong>
            </span>
          </div>

          {/* Drawer Selector Tabs */}
          <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            {(["A", "B", "C"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setSelectedDrawer(d);
                  setActiveBin(null);
                }}
                className={cn(
                  "px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer",
                  selectedDrawer === d
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                Drawer {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Bins */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {binSlots.map((slot) => {
          const isOccupied = slot.item !== null;
          const isSelected = activeBin === slot.code;

          return (
            <div
              key={slot.code}
              onClick={() => {
                setActiveBin(slot.code);
                if (slot.item) onSelectToken(slot.item);
              }}
              className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] relative group",
                isSelected
                  ? "ring-2 ring-indigo-500 border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40"
                  : isOccupied
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs"
                  : "bg-slate-50/60 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  {slot.code}
                </span>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isOccupied ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                  )}
                />
              </div>

              {slot.item ? (
                <div className="space-y-1 my-auto">
                  <p className="font-semibold text-slate-900 dark:text-white text-xs truncate" title={slot.item.signatoryName}>
                    {slot.item.signatoryName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate" title={slot.item.businessName}>
                    {slot.item.businessName}
                  </p>
                  <div className="flex items-center gap-1 pt-1">
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {slot.item.tokenHardwareModel || "USB"}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {slot.item.vendor}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center py-2">
                  <span className="text-[11px] text-slate-400 font-medium">Empty Slot</span>
                </div>
              )}

              <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                {slot.item ? slot.item.dscCode : "Available"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
