"use client";

import React, { useState, useEffect } from "react";
import { X, Repeat } from "lucide-react";
import { DSCItem, DSCLocation, CustodyTransferData } from "./types";

interface TransferCustodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dsc: DSCItem | null;
  onTransfer: (data: CustodyTransferData) => Promise<void>;
}

export function TransferCustodyModal({
  isOpen,
  onClose,
  dsc,
  onTransfer,
}: TransferCustodyModalProps) {
  const [toLocation, setToLocation] = useState<DSCLocation>("client_office");
  const [toBin, setToBin] = useState("");
  const [handedTo, setHandedTo] = useState("");
  const [reason, setReason] = useState("Filing compliance on client tax portal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (dsc) {
      const timer = setTimeout(() => {
        setToLocation(dsc.location === "ca_office" ? "client_office" : "ca_office");
        setToBin(dsc.binNumber || "BIN-A01");
        setHandedTo(dsc.signatoryName || "");
        setErrorMsg("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [dsc]);

  if (!isOpen || !dsc) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handedTo.trim()) {
      setErrorMsg("Please specify who the token is handed to");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await onTransfer({
        dscId: dsc.id,
        toLocation,
        toBin: toLocation === "ca_office" ? toBin : "",
        handedTo,
        reason,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Failed to update custody transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Repeat className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Transfer Physical Custody
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log token checkout, bin transfer, or release to client
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-4 border-b border-indigo-100 dark:border-indigo-900/40 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                DSC Token Code
              </span>
              <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                {dsc.dscCode}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Signatory / Director
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {dsc.signatoryName}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Current Location
              </span>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {dsc.locationLabel}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                Current Bin Drawer
              </span>
              <p className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {dsc.binNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              New Custody Location *
            </label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value as DSCLocation)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="ca_office">CA Office (In Vault Bin)</option>
              <option value="cs_office">CS Office (Company Secretary)</option>
              <option value="client_office">Client Office (With Client / Director)</option>
              <option value="in_transit">In Transit (Courier / Dispatch)</option>
              <option value="missing">Missing / Untraceable (Flag Alert)</option>
            </select>
          </div>

          {toLocation === "ca_office" && (
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Vault Bin Drawer #
              </label>
              <input
                type="text"
                placeholder="e.g. BIN-A12, BIN-B04"
                value={toBin}
                onChange={(e) => setToBin(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Handed Over To / Receiver Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Singhania (Director), Rohit Sen (CS)"
              value={handedTo}
              onChange={(e) => setHandedTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Reason / Purpose for Custody Transfer
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Handover for Annual ROC filing, Client physical verification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Recording..." : "Confirm Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
