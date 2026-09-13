import {
  Invoice,
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

export interface InvoicesApiResponse {
  proformas: Invoice[];
  taxInvoices: Invoice[];
  reimbursements: ClientReimbursement[];
  receipts: PaymentReceipt[];
  recurring: RecurringInvoice[];
  proformaKpi: ProformaKPIData;
  taxInvoiceKpi: TaxInvoiceKPIData;
  reimbursementKpi: ReimbursementKPIData;
  receiptsKpi: ReceiptsKPIData;
  recurringKpi: RecurringKPIData;
  analytics: SalesAnalyticsData;
  gstr1Stats: GSTR1StatCards;
  gstr1Table4: GSTR1Table4Row[];
  gstr1Table7: GSTR1Table7Row[];
  gstr1Table8: GSTR1Table8Row[];
  gstr1Table12: GSTR1Table12Row[];
  gstr1Table13: GSTR1Table13Row[];
}

export async function fetchInvoices(): Promise<InvoicesApiResponse> {
  const res = await fetch("/api/invoices", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch invoices: ${res.statusText}`);
  }

  return res.json();
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoiceData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create invoice");
  }

  const data = await res.json();
  return data.invoice;
}

export async function convertProformaToTaxInvoice(proformaId: string): Promise<Invoice> {
  const res = await fetch(`/api/invoices/${proformaId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "convert_to_tax_invoice" }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to convert proforma invoice");
  }

  const data = await res.json();
  return data.invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: string
): Promise<Invoice> {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update invoice");
  }

  const data = await res.json();
  return data.invoice;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete invoice");
  }

  return true;
}

export async function recordPayment(receiptData: {
  clientId: string;
  invoiceId?: string;
  amountReceived: number;
  tdsDeducted: number;
  paymentMode: string;
  utrReference?: string;
  bankName?: string;
  receiptDate: string;
  notes?: string;
}): Promise<PaymentReceipt> {
  const res = await fetch("/api/invoices/receipts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receiptData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to record payment receipt");
  }

  const data = await res.json();
  return data.receipt;
}

export async function toggleRecurringRetainer(id: string, isActive: boolean): Promise<boolean> {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "toggle_recurring", isActive }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to toggle recurring retainer");
  }

  return true;
}
