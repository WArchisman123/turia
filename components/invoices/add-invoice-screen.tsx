"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Building2,
  Receipt,
  AlertCircle,
  Check,
  FileText,
} from "lucide-react";
import { Invoice, InvoiceItem } from "./types";

interface AddInvoiceScreenProps {
  initialType?: "proforma" | "tax_invoice";
  onCancel: () => void;
  onSave: (invoice: Partial<Invoice>) => Promise<void>;
}

const DEFAULT_CLIENTS = [
  {
    id: "client-001",
    name: "Reliance Retail Ltd",
    trade_name: "Reliance Smart",
    code: "CLI-001",
    gstin: "19AABCR1234F1Z1",
    pan: "AABCR1234F",
    place_of_supply: "19-West Bengal",
    email: "accounts@relianceretail.com",
    phone: "+91 98300 12345",
    address: "Plot 34, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
  },
  {
    id: "client-002",
    name: "Tata Consultancy Services",
    trade_name: "TCS Enterprise Solutions",
    code: "CLI-002",
    gstin: "27AAACT1987M1ZR",
    pan: "AAACT1987M",
    place_of_supply: "27-Maharashtra",
    email: "finance.billing@tcs.com",
    phone: "+91 98200 98765",
    address: "TCS House, Raveline Street, Fort, Mumbai, Maharashtra - 400001",
  },
  {
    id: "client-003",
    name: "Infosys Technologies Ltd",
    trade_name: "Infosys Digital",
    code: "CLI-003",
    gstin: "19AABCI5678G1Z3",
    pan: "AABCI5678G",
    place_of_supply: "19-West Bengal",
    email: "taxation@infosys.com",
    phone: "+91 98450 11223",
    address: "Plot 12, Action Area II, New Town, Kolkata, West Bengal - 700156",
  },
  {
    id: "client-004",
    name: "Larsen & Toubro Ltd",
    trade_name: "L&T Construction",
    code: "CLI-004",
    gstin: "19AABCL9988H1Z8",
    pan: "AABCL9988H",
    place_of_supply: "19-West Bengal",
    email: "audit.accounts@intec.com",
    phone: "+91 98110 55443",
    address: "L&T House, Ballard Estate, Mumbai, Maharashtra - 400001",
  },
  {
    id: "client-005",
    name: "ITC Limited",
    trade_name: "ITC Foods & Agri",
    code: "CLI-005",
    gstin: "19AAACI1122K1Z9",
    pan: "AAACI1122K",
    place_of_supply: "19-West Bengal",
    email: "gst.compliance@itc.in",
    phone: "+91 98311 88776",
    address: "37 J.L. Nehru Road, Park Street, Kolkata, West Bengal - 700071",
  },
];

export function AddInvoiceScreen({
  initialType = "tax_invoice",
  onCancel,
  onSave,
}: AddInvoiceScreenProps) {
  const [invoiceType, setInvoiceType] = useState<"proforma" | "tax_invoice">(initialType);
  const [selectedClientId, setSelectedClientId] = useState<string>("client-001");
  const selectedClient = DEFAULT_CLIENTS.find((c) => c.id === selectedClientId) || DEFAULT_CLIENTS[0];

  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    initialType === "tax_invoice" ? "INV-2026-006" : "PI-2026-006"
  );
  const [invoiceDate, setInvoiceDate] = useState<string>("10/09/2026");
  const [dueDate, setDueDate] = useState<string>("25/09/2026");
  const [placeOfSupply, setPlaceOfSupply] = useState<string>(selectedClient.place_of_supply);
  const [notes, setNotes] = useState<string>(
    "Professional services rendered for statutory compliance & taxation advisory."
  );

  // Line items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "Statutory Tax Audit & Direct Tax Advisory Services",
      sac_code: "998231",
      quantity: 1,
      rate: 75000,
      taxable_value: 75000,
      gst_rate: 18,
      cgst_amount: 6750,
      sgst_amount: 6750,
      igst_amount: 0,
      total_amount: 88500,
      is_reimbursement: false,
    },
  ]);

  // Reimbursement line items (0% GST pass-through)
  const [reimbursements, setReimbursements] = useState<
    { category: string; description: string; amount: number }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIntraState = placeOfSupply.startsWith("19");

  // Recalculate item amounts
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number | boolean) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    const qty = Number(current.quantity) || 1;
    const rate = Number(current.rate) || 0;
    const taxable = qty * rate;
    current.taxable_value = taxable;

    if (isIntraState) {
      current.cgst_amount = taxable * 0.09;
      current.sgst_amount = taxable * 0.09;
      current.igst_amount = 0;
    } else {
      current.cgst_amount = 0;
      current.sgst_amount = 0;
      current.igst_amount = taxable * 0.18;
    }

    current.total_amount = taxable + current.cgst_amount + current.sgst_amount + current.igst_amount;
    updated[index] = current;
    setItems(updated);
  };

  const addItem = () => {
    const defaultTaxable = 25000;
    const cgst = isIntraState ? defaultTaxable * 0.09 : 0;
    const sgst = isIntraState ? defaultTaxable * 0.09 : 0;
    const igst = !isIntraState ? defaultTaxable * 0.18 : 0;

    setItems([
      ...items,
      {
        description: "Statutory Filing & Compliance Verification",
        sac_code: "998231",
        quantity: 1,
        rate: defaultTaxable,
        taxable_value: defaultTaxable,
        gst_rate: 18,
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        total_amount: defaultTaxable + cgst + sgst + igst,
        is_reimbursement: false,
      },
    ]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const addReimbursement = () => {
    setReimbursements([
      ...reimbursements,
      {
        category: "ROC / MCA Filing Fee",
        description: "MCA V3 Challan for Annual Return filing",
        amount: 5000,
      },
    ]);
  };

  const removeReimbursement = (idx: number) => {
    setReimbursements(reimbursements.filter((_, i) => i !== idx));
  };

  const updateReimbursement = (
    idx: number,
    field: "category" | "description" | "amount",
    val: string | number
  ) => {
    const updated = [...reimbursements];
    updated[idx] = { ...updated[idx], [field]: val };
    setReimbursements(updated);
  };

  // Compute Grand Totals
  const subtotalServices = items.reduce((sum, item) => sum + item.taxable_value, 0);
  const totalCgst = isIntraState ? subtotalServices * 0.09 : 0;
  const totalSgst = isIntraState ? subtotalServices * 0.09 : 0;
  const totalIgst = !isIntraState ? subtotalServices * 0.18 : 0;
  const totalTax = totalCgst + totalSgst + totalIgst;
  const subtotalReimbursements = reimbursements.reduce(
    (sum, r) => sum + (Number(r.amount) || 0),
    0
  );
  const grandTotal = subtotalServices + totalTax + subtotalReimbursements;

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = DEFAULT_CLIENTS.find((c) => c.id === clientId);
    if (client) {
      setPlaceOfSupply(client.place_of_supply);
      // Recalculate tax for intra vs inter state
      const clientIsIntra = client.place_of_supply.startsWith("19");
      const updated = items.map((item) => {
        const taxable = item.taxable_value;
        const cgst = clientIsIntra ? taxable * 0.09 : 0;
        const sgst = clientIsIntra ? taxable * 0.09 : 0;
        const igst = !clientIsIntra ? taxable * 0.18 : 0;
        return {
          ...item,
          cgst_amount: cgst,
          sgst_amount: sgst,
          igst_amount: igst,
          total_amount: taxable + cgst + sgst + igst,
        };
      });
      setItems(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      // Combine items and reimbursements
      const combinedItems: InvoiceItem[] = [
        ...items,
        ...reimbursements.map((r) => ({
          description: `[Pass-Through] ${r.description}`,
          sac_code: "998239",
          quantity: 1,
          rate: Number(r.amount) || 0,
          taxable_value: Number(r.amount) || 0,
          gst_rate: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 0,
          total_amount: Number(r.amount) || 0,
          is_reimbursement: true,
        })),
      ];

      await onSave({
        client_id: selectedClient.id,
        client_name: selectedClient.name,
        client_trade_name: selectedClient.trade_name,
        client_code: selectedClient.code,
        client_gstin: selectedClient.gstin,
        client_pan: selectedClient.pan,
        client_email: selectedClient.email,
        client_phone: selectedClient.phone,
        client_address: selectedClient.address,
        invoice_type: invoiceType,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: dueDate,
        place_of_supply: placeOfSupply,
        subtotal: subtotalServices + subtotalReimbursements,
        cgst_amount: totalCgst,
        sgst_amount: totalSgst,
        igst_amount: totalIgst,
        total_tax: totalTax,
        total_amount: grandTotal,
        balance_due: grandTotal,
        status: "unpaid",
        notes,
        items: combinedItems,
      });
      posthog.capture("invoice_created", {
        invoice_type: invoiceType,
        line_item_count: items.length,
        reimbursement_count: reimbursements.length,
        total_amount: grandTotal,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span onClick={onCancel} className="hover:text-slate-600 cursor-pointer">
                {invoiceType === "tax_invoice" ? "Invoice List" : "Proforma List"}
              </span>
              <span>›</span>
              <span className="text-slate-700 font-semibold">
                {invoiceType === "tax_invoice" ? "Add Tax Invoice" : "Add Proforma"}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              Create New {invoiceType === "tax_invoice" ? "Tax Invoice" : "Proforma Invoice"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Invoice Type Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setInvoiceType("tax_invoice");
                setInvoiceNumber(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                invoiceType === "tax_invoice"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tax Invoice
            </button>
            <button
              type="button"
              onClick={() => {
                setInvoiceType("proforma");
                setInvoiceNumber(`PI-2026-${Math.floor(100 + Math.random() * 900)}`);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                invoiceType === "proforma"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Proforma
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="size-3.5" />
            <span>{isSubmitting ? "Saving..." : "Save Invoice"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Billing Org Details & Client Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Billing Org Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="size-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Billing Organization Details
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Entity Name</span>
              <p className="font-bold text-slate-900 mt-0.5">TURIA & ASSOCIATES</p>
              <p className="text-[10px] text-slate-500">Chartered Accountants (FRN: 328912E)</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Firm GSTIN & PAN</span>
              <p className="font-mono font-bold text-indigo-900 mt-0.5">19AAACT0123M1Z5</p>
              <p className="font-mono text-[10px] text-slate-500">PAN: AAACT0123M</p>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px]">Registered Office & State</span>
              <p className="text-slate-700 mt-0.5">
                12, Park Street, Camac Square, Kolkata - 700016 • State: 19-West Bengal
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Client Selector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Client (Billed To) Details
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
              {selectedClient.code}
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Select Client <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {DEFAULT_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.gstin || "No GSTIN"}) - {c.place_of_supply}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Client GSTIN</span>
              <p className="font-mono font-bold text-slate-900 mt-0.5">
                {selectedClient.gstin || "Unregistered"}
              </p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Place of Supply</span>
              <p className="font-bold text-slate-900 mt-0.5">{placeOfSupply}</p>
              <span
                className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  isIntraState
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {isIntraState ? "Intra-State (CGST+SGST)" : "Inter-State (IGST)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Meta Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Invoice Date</label>
            <input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800">
              <option value="net15">Net 15 Days</option>
              <option value="immediate">Immediate on Receipt</option>
              <option value="net30">Net 30 Days</option>
              <option value="net45">Net 45 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Line Items Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Professional Service Line Items (18% GST)
            </h3>
            <p className="text-[11px] text-slate-400">
              Accounting, Audit, Legal and Taxation services under SAC 9982xx
            </p>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add Service Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-2.5 px-3">Service Description</th>
                <th className="py-2.5 px-3 w-28">SAC Code</th>
                <th className="py-2.5 px-3 w-20 text-right">Qty</th>
                <th className="py-2.5 px-3 w-32 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 w-32 text-right">Taxable (₹)</th>
                {isIntraState ? (
                  <>
                    <th className="py-2.5 px-3 w-24 text-right">CGST 9%</th>
                    <th className="py-2.5 px-3 w-24 text-right">SGST 9%</th>
                  </>
                ) : (
                  <th className="py-2.5 px-3 w-28 text-right">IGST 18%</th>
                )}
                <th className="py-2.5 px-3 w-32 text-right">Total (₹)</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.sac_code}
                      onChange={(e) => updateItem(idx, "sac_code", e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right text-xs font-mono"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.rate}
                      onChange={(e) => updateItem(idx, "rate", Number(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right text-xs font-mono font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {item.taxable_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  {isIntraState ? (
                    <>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {item.cgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {item.sgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </>
                  ) : (
                    <td className="py-2 px-3 text-right font-mono text-slate-600">
                      {item.igst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  )}
                  <td className="py-2 px-3 text-right font-mono font-bold text-indigo-900">
                    {item.total_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => removeItem(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-30"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pass-Through Client Reimbursements Card (0% GST) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pass-Through Client Expenses & Reimbursements (0% GST)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              ROC challans, government stamp duty, court fees billed at exact cost without markup
            </p>
          </div>
          <button
            type="button"
            onClick={addReimbursement}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add Reimbursement Item</span>
          </button>
        </div>

        {reimbursements.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            No pass-through reimbursements added to this invoice.
          </div>
        ) : (
          <div className="space-y-2">
            {reimbursements.map((r, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <select
                  value={r.category}
                  onChange={(e) => updateReimbursement(idx, "category", e.target.value)}
                  className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                >
                  <option value="ROC / MCA Filing Fee">ROC / MCA Filing Fee</option>
                  <option value="Court Fee / Stamp Duty">Court Fee / Stamp Duty</option>
                  <option value="Conveyance & Travel">Conveyance & Travel</option>
                  <option value="Government Challan">Government Challan</option>
                </select>

                <input
                  type="text"
                  value={r.description}
                  onChange={(e) => updateReimbursement(idx, "description", e.target.value)}
                  placeholder="Expense description / challan details"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />

                <div className="w-36 flex items-center gap-1">
                  <span className="text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={r.amount}
                    onChange={(e) => updateReimbursement(idx, "amount", Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-right font-mono font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeReimbursement(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Summary & Bank Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Notes & Bank Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Notes & Narration
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-1">
            <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider">
              Settlement Instructions
            </span>
            <p className="text-slate-600 text-[11px]">
              Bank: HDFC Bank Ltd • A/c: 50200049281726 • IFSC: HDFC0000008
            </p>
            <p className="text-slate-600 text-[11px]">
              UPI VPA: <span className="font-mono font-bold text-indigo-700">turia.ca@okhdfcbank</span>
            </p>
          </div>
        </div>

        {/* Right: Calculations Totals Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            Tax & Financial Breakdown
          </h3>

          <div className="flex justify-between text-slate-600">
            <span>Subtotal (Professional Services):</span>
            <span className="font-mono font-semibold text-slate-900">
              ₹ {subtotalServices.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {isIntraState ? (
            <>
              <div className="flex justify-between text-slate-600">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono text-slate-900">
                  ₹ {totalCgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono text-slate-900">
                  ₹ {totalSgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-slate-600">
              <span>Integrated GST (IGST @ 18%):</span>
              <span className="font-mono text-slate-900">
                ₹ {totalIgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {subtotalReimbursements > 0 && (
            <div className="flex justify-between text-amber-700 font-medium">
              <span>Pass-Through Reimbursements (0% GST):</span>
              <span className="font-mono">
                + ₹ {subtotalReimbursements.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
            <span>Grand Total:</span>
            <span className="font-mono text-indigo-950 text-base">
              ₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="size-4" />
              <span>{isSubmitting ? "Generating Invoice..." : "Save & Issue Invoice"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
