export type InvoiceTab =
  | "proforma"
  | "tax_invoice"
  | "reimbursement"
  | "receipts"
  | "recurring"
  | "analytics";

export type InvoiceStatus = "draft" | "unpaid" | "partially_paid" | "paid" | "overdue" | "cancelled" | "converted";

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  service_id?: string | null;
  description: string;
  sac_code: string;
  quantity: number;
  rate: number;
  taxable_value: number;
  gst_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_amount: number;
  is_reimbursement: boolean;
}

export interface Invoice {
  id: string;
  firm_id: string;
  client_id: string;
  client_name?: string;
  client_trade_name?: string;
  client_code?: string;
  client_gstin?: string | null;
  client_pan?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  client_address?: string | null;
  invoice_type: "proforma" | "tax_invoice";
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  place_of_supply: string;
  subtotal: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax: number;
  total_amount: number;
  paid_amount: number;
  tds_amount: number;
  balance_due: number;
  status: InvoiceStatus;
  notes?: string | null;
  converted_tax_invoice_id?: string | null;
  items?: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface ClientReimbursement {
  id: string;
  firm_id: string;
  client_id: string;
  client_name?: string;
  client_trade_name?: string;
  client_code?: string;
  expense_date: string;
  category: string;
  description: string;
  amount: number;
  challan_number?: string | null;
  receipt_url?: string | null;
  is_billed: boolean;
  invoice_id?: string | null;
  invoice_number?: string | null;
  created_at: string;
}

export interface PaymentReceipt {
  id: string;
  firm_id: string;
  client_id: string;
  client_name?: string;
  client_trade_name?: string;
  client_code?: string;
  invoice_id?: string | null;
  invoice_number?: string | null;
  receipt_number: string;
  receipt_date: string;
  amount_received: number;
  tds_deducted: number;
  net_amount: number;
  payment_mode: string;
  utr_reference?: string | null;
  bank_name?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface RecurringInvoice {
  id: string;
  firm_id: string;
  client_id: string;
  client_name?: string;
  client_trade_name?: string;
  client_code?: string;
  service_name?: string;
  frequency: "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly";
  amount: number;
  start_date: string;
  end_date?: string | null;
  next_run_date: string;
  is_active: boolean;
  created_at: string;
}

export interface ProformaKPIData {
  all_proforma: number;
  all_proforma_count: number;
  receivable: number;
  receivable_count: number;
  partially_paid: number;
  partially_paid_count: number;
  advance_paid: number;
  advance_paid_count: number;
}

export interface TaxInvoiceKPIData {
  all_invoices: number;
  all_invoices_count: number;
  receivable: number;
  receivable_count: number;
  partially_paid: number;
  partially_paid_count: number;
  paid: number;
  paid_count: number;
}

export interface ReimbursementKPIData {
  all_reimbursements: number;
  all_reimbursements_count: number;
  receivable: number;
  receivable_count: number;
  partially_paid: number;
  partially_paid_count: number;
  paid: number;
  paid_count: number;
}

export interface ReceiptsKPIData {
  total_receipts: number;
  total_receipts_count: number;
  receipts: number;
  receipts_count: number;
  advance_amount: number;
  advance_amount_count: number;
}

export interface RecurringKPIData {
  total: number;
  monthly: number;
  quarterly: number;
  half_yearly: number;
  yearly: number;
}

export interface GSTR1StatCards {
  taxable_value: number;
  igst: number;
  cgst: number;
  sgst: number;
  total_tax: number;
}

export interface GSTR1Table4Row {
  gstin: string;
  trade_name: string;
  invoice_number: string;
  invoice_date: string;
  invoice_value: number;
  place_of_supply: string;
  reverse_charge: "N" | "Y";
  rate: number;
  taxable_value: number;
  cess_amount: number;
}

export interface GSTR1Table7Row {
  type: "OE" | "E-Commerce";
  place_of_supply: string;
  rate: number;
  taxable_value: number;
  cess_amount: number;
}

export interface GSTR1Table8Row {
  description: string;
  nil_rated: number;
  exempted: number;
  non_gst: number;
}

export interface GSTR1Table12Row {
  hsn_sac: string;
  description: string;
  uqc: string;
  total_quantity: number;
  total_value: number;
  taxable_value: number;
  integrated_tax: number;
  central_tax: number;
  state_tax: number;
  cess: number;
}

export interface GSTR1Table13Row {
  nature_of_document: string;
  sr_no_from: string;
  sr_no_to: string;
  total_number: number;
  cancelled: number;
  net_issued: number;
}

export interface SalesAnalyticsData {
  summary: {
    total_sales: number;
    total_collections: number;
    outstanding_dues: number;
    collection_rate: number;
    active_retainers: number;
  };
  monthly_trends: {
    month: string;
    sales: number;
    collections: number;
    outstanding: number;
  }[];
  monthly_collection_rate: {
    month: string;
    rate: number;
    sales: number;
    collected: number;
  }[];
  revenue_by_service: {
    service: string;
    revenue: number;
    percentage: number;
  }[];
  revenue_by_client: {
    client: string;
    revenue: number;
    invoices: number;
  }[];
  revenue_by_user: {
    user: string;
    revenue: number;
    tasks_billed: number;
  }[];
}
