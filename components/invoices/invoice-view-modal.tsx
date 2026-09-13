"use client";

import React from "react";
import { X, Printer, Building2 } from "lucide-react";
import { Invoice } from "./types";

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceViewModal({ isOpen, onClose, invoice }: InvoiceViewModalProps) {
  if (!isOpen || !invoice) return null;

  const isTaxInvoice = invoice.invoice_type === "tax_invoice";
  const isIntraState = invoice.place_of_supply?.startsWith("19");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8 print:border-none print:shadow-none print:my-0">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Document Preview</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
              {invoice.invoice_type.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="size-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Canvas */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 text-xs bg-white">
          {/* Header Firm Details */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="size-9 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  T
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    TURIA & ASSOCIATES
                  </h1>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                    Chartered Accountants • ICAI Firm Reg No: 328912E
                  </p>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                <p>12, Park Street, Camac Square, 4th Floor, Suite 402</p>
                <p>Kolkata, West Bengal - 700016, India</p>
                <p className="font-medium text-slate-800 mt-1">
                  GSTIN: <span className="font-mono font-bold">19AAACT0123M1Z5</span> | PAN: <span className="font-mono font-bold">AAACT0123M</span>
                </p>
                <p>Email: billing@turia-ca.in | Phone: +91 33 2288 4400</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                {isTaxInvoice ? "TAX INVOICE" : "PROFORMA INVOICE"}
              </div>
              <p className="text-[10px] text-slate-400 italic">Original for Recipient</p>
              <div className="mt-2 text-right">
                <p className="font-mono text-sm font-black text-indigo-900">{invoice.invoice_number}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Date: <span className="font-semibold text-slate-700">{invoice.invoice_date}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Due Date: <span className="font-semibold text-slate-700">{invoice.due_date}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Place of Supply: <span className="font-semibold text-slate-800">{invoice.place_of_supply}</span>
                </p>
                <p className="text-[11px] text-slate-500">Reverse Charge (Y/N): <span className="font-semibold text-slate-700">N</span></p>
              </div>
            </div>
          </div>

          {/* Billed To / Client Information */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Billed To (Client):
              </span>
              <h2 className="text-sm font-bold text-slate-900">{invoice.client_name}</h2>
              {invoice.client_trade_name && invoice.client_trade_name !== invoice.client_name && (
                <p className="text-[11px] text-slate-500 font-medium">Trade Name: {invoice.client_trade_name}</p>
              )}
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {invoice.client_address || "Corporate Office, Sector V, Salt Lake, Kolkata, West Bengal - 700091"}
              </p>
            </div>

            <div className="space-y-1 text-right sm:text-left sm:pl-8">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Client Statutory IDs:
              </span>
              <p className="text-[11px] text-slate-600">
                GSTIN: <span className="font-mono font-bold text-slate-900">{invoice.client_gstin || "Unregistered"}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                PAN: <span className="font-mono font-bold text-slate-900">{invoice.client_pan || "—"}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Client Code: <span className="font-mono font-semibold text-indigo-700">{invoice.client_code || "CLI-001"}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Email: <span className="text-slate-800">{invoice.client_email || "accounts@client.com"}</span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Description of Services / SAC</th>
                  <th className="py-2.5 px-3 text-center">SAC</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value (₹)</th>
                  {isIntraState ? (
                    <>
                      <th className="py-2.5 px-3 text-right">CGST 9%</th>
                      <th className="py-2.5 px-3 text-right">SGST 9%</th>
                    </>
                  ) : (
                    <th className="py-2.5 px-3 text-right">IGST 18%</th>
                  )}
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.items && invoice.items.length > 0 ? invoice.items : [
                  {
                    description: invoice.notes || "Professional Legal & Accounting Services",
                    sac_code: "998231",
                    quantity: 1,
                    rate: invoice.subtotal,
                    taxable_value: invoice.subtotal,
                    gst_rate: 18,
                    cgst_amount: invoice.cgst_amount,
                    sgst_amount: invoice.sgst_amount,
                    igst_amount: invoice.igst_amount,
                    total_amount: invoice.total_amount,
                    is_reimbursement: false,
                  },
                ]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {item.description}
                      {item.is_reimbursement && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pass-Through (0% GST)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">{item.sac_code}</td>
                    <td className="py-3 px-3 text-right font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                      {item.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    {isIntraState ? (
                      <>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {item.cgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {item.sgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </>
                    ) : (
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {item.igst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {item.total_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Monetary Summary & Bank Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Left: Bank Details & UPI QR */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Bank Payment Details (RTGS / NEFT)
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1 font-mono">
                <p>Account Name: <span className="font-bold text-slate-900">TURIA & ASSOCIATES</span></p>
                <p>Bank: <span className="font-bold text-slate-900">HDFC Bank Limited</span></p>
                <p>Account No: <span className="font-bold text-slate-900">50200049281726</span></p>
                <p>Account Type: <span className="font-semibold text-slate-800">Current Account</span></p>
                <p>IFSC Code: <span className="font-bold text-indigo-700">HDFC0000008</span></p>
                <p>Branch: <span className="text-slate-800">Park Street Branch, Kolkata</span></p>
                <p>UPI ID: <span className="font-bold text-emerald-700">turia.ca@okhdfcbank</span></p>
              </div>
            </div>

            {/* Right: Tax Breakdown Totals */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Taxable Value):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ₹ {invoice.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {isIntraState ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Central GST (CGST @ 9%):</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₹ {invoice.cgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>State GST (SGST @ 9%):</span>
                    <span className="font-mono font-semibold text-slate-900">
                      ₹ {invoice.sgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>Integrated GST (IGST @ 18%):</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ₹ {invoice.igst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Total Tax Amount:</span>
                <span className="font-mono font-semibold text-indigo-700">
                  ₹ {invoice.total_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-slate-300 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Grand Total (INR):</span>
                <span className="font-mono text-indigo-950 text-base">
                  ₹ {invoice.total_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {invoice.paid_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                  <span>Amount Paid / Settled:</span>
                  <span className="font-mono">
                    - ₹ {invoice.paid_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-1 flex justify-between text-slate-700 font-bold">
                <span>Balance Due:</span>
                <span className="font-mono text-rose-700">
                  ₹ {invoice.balance_due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Signatory Block */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
            <div className="text-[10px] text-slate-500 leading-relaxed">
              <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Terms & Conditions:</p>
              <p>1. Invoices are due upon receipt or within stipulated credit terms.</p>
              <p>2. Please deduct TDS u/s 194J at 10% (or 2% if applicable) and submit Form 16A quarterly.</p>
              <p>3. Disputes, if any, subject to Kolkata jurisdiction only.</p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-slate-900">For TURIA & ASSOCIATES</p>
              <p className="text-[10px] text-slate-500">Chartered Accountants</p>
              <div className="h-12 flex items-end justify-end">
                <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-mono text-indigo-700 font-bold">
                  [DIGITALLY SIGNED]
                </div>
              </div>
              <p className="font-bold text-slate-800 text-xs">Rahul Sen, FCA, DISA</p>
              <p className="text-[10px] text-slate-500">Senior Partner • Membership No: 054812</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
