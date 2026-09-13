"use client";

import React, { useEffect, useState } from "react";
import { X, History, User, RefreshCw } from "lucide-react";
import { DSCMovementLog } from "./types";
import { fetchDSCActivityLogs } from "@/lib/api/registry";

interface DSCActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DSCActivityDrawer({ isOpen, onClose }: DSCActivityDrawerProps) {
  const [logs, setLogs] = useState<DSCMovementLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDSCActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error("Error loading activity logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      async function load() {
        try {
          const data = await fetchDSCActivityLogs();
          if (isMounted) setLogs(data);
        } catch (err) {
          console.error("Error loading activity logs:", err);
        }
      }
      load();
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <History className="size-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Token Movement & Audit Log
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Immutable custody trail of physical USB cryptographic tokens
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={loadLogs}
                disabled={isLoading}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Refresh log"
              >
                <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading audit trail...
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No token custody movements logged yet.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {logs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    {/* Circle Node */}
                    <div className="absolute -left-[1.85rem] top-1 size-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />

                    <div className="bg-slate-50/75 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400">
                          {log.dscCode}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          {formatTimestamp(log.createdAt)}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {log.signatoryName}
                      </p>

                      {/* Location Transfer Indicator */}
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {log.fromLocation || "Initial Register"}
                          {log.fromBin ? ` (${log.fromBin})` : ""}
                        </span>
                        <span className="text-indigo-600 font-bold">➔</span>
                        <span className="font-bold text-slate-900 dark:text-white capitalize">
                          {log.toLocation.replace("_", " ")}
                          {log.toBin ? ` (${log.toBin})` : ""}
                        </span>
                      </div>

                      {log.handedTo && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1">
                          <User className="size-3 text-slate-400" />
                          <span>
                            Custody with: <strong>{log.handedTo}</strong>
                          </span>
                        </div>
                      )}

                      {log.reason && (
                        <p className="text-[11px] text-slate-500 italic bg-slate-100/50 dark:bg-slate-800/40 p-1.5 rounded">
                          &ldquo;{log.reason}&rdquo;
                        </p>
                      )}

                      {log.loggedBy && (
                        <div className="text-[10px] text-slate-400 text-right">
                          Logged by: {log.loggedBy}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
