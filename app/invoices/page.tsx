"use client";

import React, { useState, useEffect, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  FileText,
  Receipt,
  Repeat,
  BarChart3,
  CreditCard,
  Plus,
  RotateCw,
} from "lucide-react";
import {
  Invoice,
  InvoiceTab,
  ClientReimbursement,
  PaymentReceipt,
  RecurringInvoice,
  ProformaKPIData,
  TaxInvoiceKPIData,
  ReimbursementKPIData,
  ReceiptsKPIData,
  RecurringKPIData,
  SalesAnalyticsData,
  GSTR1StatCards,
  GSTR1Table4Row,
  GSTR1Table7Row,
  GSTR1Table8Row,
  GSTR1Table12Row,
  GSTR1Table13Row,
} from "@/components/invoices/types";
import {
  fetchInvoices,
  createInvoice,
  convertProformaToTaxInvoice,
  deleteInvoice,
  recordPayment,
  toggleRecurringRetainer,
} from "@/lib/api/invoices";
import { ProformaTab } from "@/components/invoices/proforma-tab";
import { TaxInvoicesTab } from "@/components/invoices/tax-invoices-tab";
import { ReimbursementsTab } from "@/components/invoices/reimbursements-tab";
import { ReceiptsTab } from "@/components/invoices/receipts-tab";
import { RecurringInvoicesTab } from "@/components/invoices/recurring-invoices-tab";
import { SalesAnalyticsTab } from "@/components/invoices/sales-analytics-tab";
import { AddInvoiceScreen } from "@/components/invoices/add-invoice-screen";
import { InvoiceViewModal } from "@/components/invoices/invoice-view-modal";
import { RecordPaymentModal } from "@/components/invoices/record-payment-modal";

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<InvoiceTab>("proforma");
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Screen Mode: List vs Add
  const [isAdding, setIsAdding] = useState(false);
  const [addType, setAddType] = useState<"proforma" | "tax_invoice">("proforma");

  // Modals
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState<string | null>(null);

  // Master Data State
  const [proformas, setProformas] = useState<Invoice[]>([]);
  const [taxInvoices, setTaxInvoices] = useState<Invoice[]>([]);
  const [reimbursements, setReimbursements] = useState<ClientReimbursement[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [recurring, setRecurring] = useState<RecurringInvoice[]>([]);

  // KPI summaries
  const [proformaKpi, setProformaKpi] = useState<ProformaKPIData>({
    all_proforma: 0,
    all_proforma_count: 0,
    receivable: 0,
    receivable_count: 0,
    partially_paid: 0,
    partially_paid_count: 0,
    advance_paid: 0,
    advance_paid_count: 0,
  });

  const [taxInvoiceKpi, setTaxInvoiceKpi] = useState<TaxInvoiceKPIData>({
    all_invoices: 0,
    all_invoices_count: 0,
    receivable: 0,
    receivable_count: 0,
    partially_paid: 0,
    partially_paid_count: 0,
    paid: 0,
    paid_count: 0,
  });

  const [reimbursementKpi, setReimbursementKpi] = useState<ReimbursementKPIData>({
    all_reimbursements: 0,
    all_reimbursements_count: 0,
    receivable: 0,
    receivable_count: 0,
    partially_paid: 0,
    partially_paid_count: 0,
    paid: 0,
    paid_count: 0,
  });

  const [receiptsKpi, setReceiptsKpi] = useState<ReceiptsKPIData>({
    total_receipts: 0,
    total_receipts_count: 0,
    receipts: 0,
    receipts_count: 0,
    advance_amount: 0,
    advance_amount_count: 0,
  });

  const [recurringKpi, setRecurringKpi] = useState<RecurringKPIData>({
    total: 0,
    monthly: 0,
    quarterly: 0,
    half_yearly: 0,
    yearly: 0,
  });

  // Sales Analytics & GSTR-1
  const [analytics, setAnalytics] = useState<SalesAnalyticsData>({
    summary: {
      total_sales: 0,
      total_collections: 0,
      outstanding_dues: 0,
      collection_rate: 0,
      active_retainers: 0,
    },
    monthly_trends: [],
    monthly_collection_rate: [],
    revenue_by_service: [],
    revenue_by_client: [],
    revenue_by_user: [],
  });

  const [gstr1Stats, setGstr1Stats] = useState<GSTR1StatCards>({
    taxable_value: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    total_tax: 0,
  });
  const [gstr1Table4, setGstr1Table4] = useState<GSTR1Table4Row[]>([]);
  const [gstr1Table7, setGstr1Table7] = useState<GSTR1Table7Row[]>([]);
  const [gstr1Table8, setGstr1Table8] = useState<GSTR1Table8Row[]>([]);
  const [gstr1Table12, setGstr1Table12] = useState<GSTR1Table12Row[]>([]);
  const [gstr1Table13, setGstr1Table13] = useState<GSTR1Table13Row[]>([]);

  // Load Data
  const loadInvoicesData = async () => {
    try {
      const data = await fetchInvoices();
      setProformas(data.proformas || []);
      setTaxInvoices(data.taxInvoices || []);
      setReimbursements(data.reimbursements || []);
      setReceipts(data.receipts || []);
      setRecurring(data.recurring || []);
      if (data.proformaKpi) setProformaKpi(data.proformaKpi);
      if (data.taxInvoiceKpi) setTaxInvoiceKpi(data.taxInvoiceKpi);
      if (data.reimbursementKpi) setReimbursementKpi(data.reimbursementKpi);
      if (data.receiptsKpi) setReceiptsKpi(data.receiptsKpi);
      if (data.recurringKpi) setRecurringKpi(data.recurringKpi);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.gstr1Stats) setGstr1Stats(data.gstr1Stats);
      if (data.gstr1Table4) setGstr1Table4(data.gstr1Table4);
      if (data.gstr1Table7) setGstr1Table7(data.gstr1Table7);
      if (data.gstr1Table8) setGstr1Table8(data.gstr1Table8);
      if (data.gstr1Table12) setGstr1Table12(data.gstr1Table12);
      if (data.gstr1Table13) setGstr1Table13(data.gstr1Table13);
    } catch (err) {
      console.error("Failed to load invoice data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const data = await fetchInvoices();
        if (!isMounted) return;
        setProformas(data.proformas || []);
        setTaxInvoices(data.taxInvoices || []);
        setReimbursements(data.reimbursements || []);
        setReceipts(data.receipts || []);
        setRecurring(data.recurring || []);
        if (data.proformaKpi) setProformaKpi(data.proformaKpi);
        if (data.taxInvoiceKpi) setTaxInvoiceKpi(data.taxInvoiceKpi);
        if (data.reimbursementKpi) setReimbursementKpi(data.reimbursementKpi);
        if (data.receiptsKpi) setReceiptsKpi(data.receiptsKpi);
        if (data.recurringKpi) setRecurringKpi(data.recurringKpi);
        if (data.analytics) setAnalytics(data.analytics);
        if (data.gstr1Stats) setGstr1Stats(data.gstr1Stats);
        if (data.gstr1Table4) setGstr1Table4(data.gstr1Table4);
        if (data.gstr1Table7) setGstr1Table7(data.gstr1Table7);
        if (data.gstr1Table8) setGstr1Table8(data.gstr1Table8);
        if (data.gstr1Table12) setGstr1Table12(data.gstr1Table12);
        if (data.gstr1Table13) setGstr1Table13(data.gstr1Table13);
      } catch (err) {
        console.error("Failed to load invoice data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleAddNew = (type: "proforma" | "tax_invoice") => {
    setAddType(type);
    setIsAdding(true);
  };

  const handleSaveNewInvoice = async (invoiceData: Partial<Invoice>) => {
    const created = await createInvoice(invoiceData);
    setIsAdding(false);
    startTransition(() => {
      if (created.invoice_type === "tax_invoice") {
        setTaxInvoices((prev) => [created, ...prev]);
        setActiveTab("tax_invoice");
      } else {
        setProformas((prev) => [created, ...prev]);
        setActiveTab("proforma");
      }
    });
    loadInvoicesData();
  };

  const handleConvertToTaxInvoice = async (proformaId: string) => {
    try {
      const converted = await convertProformaToTaxInvoice(proformaId);
      startTransition(() => {
        setProformas((prev) =>
          prev.map((p) => (p.id === proformaId ? { ...p, status: "converted" } : p))
        );
        if (converted) {
          setTaxInvoices((prev) => [converted, ...prev]);
        }
      });
      loadInvoicesData();
    } catch (err) {
      console.error("Failed to convert proforma:", err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    startTransition(() => {
      setProformas((prev) => prev.filter((p) => p.id !== id));
      setTaxInvoices((prev) => prev.filter((inv) => inv.id !== id));
    });
    try {
      await deleteInvoice(id);
      loadInvoicesData();
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  const handleOpenRecordPayment = (invoiceId?: string) => {
    setPaymentInvoiceId(invoiceId || null);
    setIsPaymentModalOpen(true);
  };

  const handleRecordPaymentSuccess = async (receiptData: {
    clientId: string;
    invoiceId?: string;
    amountReceived: number;
    tdsDeducted: number;
    paymentMode: string;
    utrReference?: string;
    bankName?: string;
    receiptDate: string;
    notes?: string;
  }) => {
    await recordPayment(receiptData);
    loadInvoicesData();
  };

  const handleToggleRecurring = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    startTransition(() => {
      setRecurring((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_active: newActive } : r))
      );
    });
    try {
      await toggleRecurringRetainer(id, newActive);
      loadInvoicesData();
    } catch (err) {
      console.error("Failed to toggle retainer:", err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* If Adding Invoice / Proforma Screen */}
        {isAdding ? (
          <AddInvoiceScreen
            initialType={addType}
            onCancel={() => setIsAdding(false)}
            onSave={handleSaveNewInvoice}
          />
        ) : (
          <>
            {/* Top Operational Navigation & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
              {/* 6 Sub-Tabs Navigation */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                {[
                  {
                    id: "proforma",
                    label: "Proforma Invoice",
                    icon: FileText,
                    count: proformas.length,
                  },
                  {
                    id: "tax_invoice",
                    label: "Invoice",
                    icon: Receipt,
                    count: taxInvoices.length,
                  },
                  {
                    id: "reimbursement",
                    label: "Reimbursement",
                    icon: Receipt,
                    count: reimbursements.length,
                  },
                  {
                    id: "receipts",
                    label: "Receipts",
                    icon: CreditCard,
                    count: receipts.length,
                  },
                  {
                    id: "recurring",
                    label: "Recurring Invoice",
                    icon: Repeat,
                    count: recurring.length,
                  },
                  {
                    id: "analytics",
                    label: "Sales Analytics",
                    icon: BarChart3,
                    count: null,
                  },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as InvoiceTab)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-indigo-50/90 text-indigo-700 shadow-2xs border border-indigo-200/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`size-3.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Master Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  type="button"
                  onClick={loadInvoicesData}
                  className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl cursor-pointer shadow-2xs transition-colors"
                  title="Reload Invoices"
                >
                  <RotateCw className="size-3.5" />
                </button>

                {activeTab === "proforma" && (
                  <button
                    type="button"
                    onClick={() => handleAddNew("proforma")}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>Add Proforma</span>
                  </button>
                )}

                {activeTab === "tax_invoice" && (
                  <button
                    type="button"
                    onClick={() => handleAddNew("tax_invoice")}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>Add Tax Invoice</span>
                  </button>
                )}

                {activeTab === "receipts" && (
                  <button
                    type="button"
                    onClick={() => handleOpenRecordPayment()}
                    className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>Record Payment</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
                <div className="size-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-600">
                  Loading Practice Invoicing & Statutory Tax Engine...
                </p>
              </div>
            ) : (
              <>
                {activeTab === "proforma" && (
                  <ProformaTab
                    proformas={proformas}
                    kpi={proformaKpi}
                    onAddNew={() => handleAddNew("proforma")}
                    onViewInvoice={setViewingInvoice}
                    onConvertToTaxInvoice={handleConvertToTaxInvoice}
                    onRecordPayment={handleOpenRecordPayment}
                    onDeleteInvoice={handleDeleteInvoice}
                  />
                )}

                {activeTab === "tax_invoice" && (
                  <TaxInvoicesTab
                    invoices={taxInvoices}
                    kpi={taxInvoiceKpi}
                    onAddNew={() => handleAddNew("tax_invoice")}
                    onViewInvoice={setViewingInvoice}
                    onRecordPayment={handleOpenRecordPayment}
                    onDeleteInvoice={handleDeleteInvoice}
                  />
                )}

                {activeTab === "reimbursement" && (
                  <ReimbursementsTab
                    reimbursements={reimbursements}
                    kpi={reimbursementKpi}
                  />
                )}

                {activeTab === "receipts" && (
                  <ReceiptsTab
                    receipts={receipts}
                    kpi={receiptsKpi}
                    onOpenRecordPayment={() => handleOpenRecordPayment()}
                  />
                )}

                {activeTab === "recurring" && (
                  <RecurringInvoicesTab
                    recurring={recurring}
                    kpi={recurringKpi}
                    onToggleActive={handleToggleRecurring}
                  />
                )}

                {activeTab === "analytics" && (
                  <SalesAnalyticsTab
                    analytics={analytics}
                    gstr1Stats={gstr1Stats}
                    gstr1Table4={gstr1Table4}
                    gstr1Table7={gstr1Table7}
                    gstr1Table8={gstr1Table8}
                    gstr1Table12={gstr1Table12}
                    gstr1Table13={gstr1Table13}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Modal: View / Print Invoice */}
        <InvoiceViewModal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          invoice={viewingInvoice}
        />

        {/* Modal: Record Payment Receipt */}
        <RecordPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          invoices={[...taxInvoices, ...proformas]}
          defaultInvoiceId={paymentInvoiceId}
          onSuccess={handleRecordPaymentSuccess}
        />
      </div>
    </AppShell>
  );
}
