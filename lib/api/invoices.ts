import { get, post, patch, del } from "@/lib/api";
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
  return get<InvoicesApiResponse>("/api/invoices", { cache: "no-store" });
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  const data = await post<{ invoice: Invoice }>("/api/invoices", invoiceData);
  return data.invoice;
}

export async function convertProformaToTaxInvoice(proformaId: string): Promise<Invoice> {
  const data = await patch<{ invoice: Invoice }>(`/api/invoices/${proformaId}`, {
    action: "convert_to_tax_invoice",
  });
  return data.invoice;
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  const data = await patch<{ invoice: Invoice }>(`/api/invoices/${id}`, { status });
  return data.invoice;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  await del(`/api/invoices/${id}`);
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
  const data = await post<{ receipt: PaymentReceipt }>("/api/invoices/receipts", receiptData);
  return data.receipt;
}

export async function toggleRecurringRetainer(id: string, isActive: boolean): Promise<boolean> {
  await patch(`/api/invoices/${id}`, {
    action: "toggle_recurring",
    isActive,
  });
  return true;
}
