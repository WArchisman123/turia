"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import { X, CreditCard, Check, AlertCircle, Percent } from "lucide-react";
import { Invoice } from "./types";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  defaultInvoiceId?: string | null;
  onSuccess: (receiptData: {
    clientId: string;
    invoiceId?: string;
    amountReceived: number;
    tdsDeducted: number;
    paymentMode: string;
    utrReference?: string;
    bankName?: string;
    receiptDate: string;
    notes?: string;
  }) => Promise<void> | void;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  invoices,
  defaultInvoiceId,
  onSuccess,
}: RecordPaymentModalProps) {
  const selectedDefaultInv = invoices.find((i) => i.id === defaultInvoiceId);

  const [clientId, setClientId] = useState<string>(selectedDefaultInv?.client_id || "client-001");
  const [invoiceId, setInvoiceId] = useState<string>(defaultInvoiceId || "");
  const [amountReceived, setAmountReceived] = useState<number>(
    selectedDefaultInv ? selectedDefaultInv.balance_due * 0.9 : 50000
  );
  const [tdsDeducted, setTdsDeducted] = useState<number>(
    selectedDefaultInv ? selectedDefaultInv.balance_due * 0.1 : 5000
  );
  const [paymentMode, setPaymentMode] = useState<string>("NEFT/RTGS");
  const [utrReference, setUtrReference] = useState<string>("");
  const [bankName, setBankName] = useState<string>("HDFC Bank Ltd");
  const [receiptDate, setReceiptDate] = useState<string>(
    new Date().toLocaleDateString("en-GB")
  );
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Available invoices for client
  const clientInvoices = invoices.filter(
    (inv) => (!clientId || inv.client_id === clientId) && inv.status !== "paid"
  );

  const handleInvoiceChange = (invId: string) => {
    setInvoiceId(invId);
    const found = invoices.find((i) => i.id === invId);
    if (found) {
      setClientId(found.client_id);
      const balance = found.balance_due > 0 ? found.balance_due : found.total_amount;
      // standard 10% TDS 194J
      const tds = Math.round(balance * 0.1);
      const net = balance - tds;
      setAmountReceived(net);
      setTdsDeducted(tds);
    }
  };

  const handleApplyStandardTds = () => {
    const total = amountReceived + tdsDeducted;
    const standardTds = Math.round(total * 0.1);
    setTdsDeducted(standardTds);
    setAmountReceived(total - standardTds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amountReceived <= 0) {
      setError("Please enter a valid amount received.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSuccess({
        clientId,
        invoiceId: invoiceId || undefined,
        amountReceived: Number(amountReceived),
        tdsDeducted: Number(tdsDeducted) || 0,
        paymentMode,
        utrReference: utrReference || undefined,
        bankName: bankName || undefined,
        receiptDate,
        notes,
      });
      posthog.capture("payment_recorded", {
        payment_mode: paymentMode,
        invoice_linked: Boolean(invoiceId),
        amount_received: Number(amountReceived),
        tds_deducted: Number(tdsDeducted) || 0,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record receipt");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSettled = Number(amountReceived) + Number(tdsDeducted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Record Payment Receipt</h3>
              <p className="text-xs text-slate-500">Log inward remittance & TDS Section 194J adjustment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Link to Invoice */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Invoice to Settle (Optional)
            </label>
            <select
              value={invoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">-- Direct Advance / Client Advance --</option>
              {clientInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.client_name} (Due: ₹ {inv.balance_due.toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          {/* Monetary Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Net Amount Received (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountReceived}
                onChange={(e) => setAmountReceived(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  TDS Deducted (u/s 194J) (₹)
                </label>
                <button
                  type="button"
                  onClick={handleApplyStandardTds}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                  title="Apply standard 10% TDS calculation"
                >
                  <Percent className="size-3" /> 10% Calc
                </button>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tdsDeducted}
                onChange={(e) => setTdsDeducted(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Settlement Summary Pill */}
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Total Settlement Credit:</span>
            <span className="font-bold text-indigo-900 text-sm">
              ₹ {totalSettled.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Payment Mode & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="NEFT/RTGS">NEFT / RTGS</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Receipt Date</label>
              <input
                type="text"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Bank & UTR Reference */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank Ltd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UTR / Ref Number</label>
              <input
                type="text"
                value={utrReference}
                onChange={(e) => setUtrReference(e.target.value)}
                placeholder="e.g. HDFC0001928374"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Narration / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Received via NEFT towards tax audit settlement"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="size-3.5" />
              <span>{isSubmitting ? "Saving..." : "Save Receipt"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
