import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import {
  Invoice,
  InvoiceItem,
  ClientReimbursement,
  PaymentReceipt,
  RecurringInvoice,
  ProformaKPIData,
  TaxInvoiceKPIData,
  ReimbursementKPIData,
  ReceiptsKPIData,
  RecurringKPIData,
  GSTR1StatCards,
  GSTR1Table4Row,
  GSTR1Table7Row,
  GSTR1Table8Row,
  GSTR1Table12Row,
  GSTR1Table13Row,
  SalesAnalyticsData,
  InvoiceStatus,
} from "@/components/invoices/types";

// Seed Tax Invoices (5 realistic records)
const SEED_TAX_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    client_gstin: "19AABCR1234F1Z1",
    client_pan: "AABCR1234F",
    client_email: "accounts@relianceretail.com",
    client_phone: "+91 98300 12345",
    client_address: "Plot 34, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
    invoice_type: "tax_invoice",
    invoice_number: "INV-2026-001",
    invoice_date: "05/08/2026",
    due_date: "20/08/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 150000,
    cgst_amount: 13500,
    sgst_amount: 13500,
    igst_amount: 0,
    total_tax: 27000,
    total_amount: 177000,
    paid_amount: 177000,
    tds_amount: 15000,
    balance_due: 0,
    status: "paid",
    notes: "Statutory Tax Audit Fee for FY 2025-26 under Section 44AB of the Income Tax Act.",
    items: [
      {
        description: "Statutory Tax Audit u/s 44AB of Income Tax Act",
        sac_code: "998231",
        quantity: 1,
        rate: 150000,
        taxable_value: 150000,
        gst_rate: 18,
        cgst_amount: 13500,
        sgst_amount: 13500,
        igst_amount: 0,
        total_amount: 177000,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-08-05T10:00:00Z",
    updated_at: "2026-08-20T14:30:00Z",
  },
  {
    id: "inv-002",
    firm_id: "firm-001",
    client_id: "client-002",
    client_name: "Tata Consultancy Services",
    client_trade_name: "TCS Enterprise Solutions",
    client_code: "CLI-002",
    client_gstin: "27AAACT1987M1ZR",
    client_pan: "AAACT1987M",
    client_email: "finance.billing@tcs.com",
    client_phone: "+91 98200 98765",
    client_address: "TCS House, Raveline Street, Fort, Mumbai, Maharashtra - 400001",
    invoice_type: "tax_invoice",
    invoice_number: "INV-2026-002",
    invoice_date: "12/08/2026",
    due_date: "27/08/2026",
    place_of_supply: "27-Maharashtra",
    subtotal: 360000,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 64800,
    total_tax: 64800,
    total_amount: 424800,
    paid_amount: 250000,
    tds_amount: 36000,
    balance_due: 138800,
    status: "partially_paid",
    notes: "Transfer Pricing Study & 3CEB Form Documentation retainer fee for Q1.",
    items: [
      {
        description: "Transfer Pricing Documentation & Section 92E Certification",
        sac_code: "998231",
        quantity: 1,
        rate: 360000,
        taxable_value: 360000,
        gst_rate: 18,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 64800,
        total_amount: 424800,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-08-12T11:15:00Z",
    updated_at: "2026-08-25T16:00:00Z",
  },
  {
    id: "inv-003",
    firm_id: "firm-001",
    client_id: "client-003",
    client_name: "Infosys Technologies Ltd",
    client_trade_name: "Infosys Digital",
    client_code: "CLI-003",
    client_gstin: "19AABCI5678G1Z3",
    client_pan: "AABCI5678G",
    client_email: "taxation@infosys.com",
    client_phone: "+91 98450 11223",
    client_address: "Plot 12, Action Area II, New Town, Kolkata, West Bengal - 700156",
    invoice_type: "tax_invoice",
    invoice_number: "INV-2026-003",
    invoice_date: "18/08/2026",
    due_date: "02/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 240000,
    cgst_amount: 21600,
    sgst_amount: 21600,
    igst_amount: 0,
    total_tax: 43200,
    total_amount: 283200,
    paid_amount: 0,
    tds_amount: 0,
    balance_due: 283200,
    status: "unpaid",
    notes: "Internal Financial Controls (IFC) Audit and Process Review for Phase 1.",
    items: [
      {
        description: "Internal Financial Controls Testing & Advisory Services",
        sac_code: "998232",
        quantity: 1,
        rate: 240000,
        taxable_value: 240000,
        gst_rate: 18,
        cgst_amount: 21600,
        sgst_amount: 21600,
        igst_amount: 0,
        total_amount: 283200,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-08-18T14:20:00Z",
    updated_at: "2026-08-18T14:20:00Z",
  },
  {
    id: "inv-004",
    firm_id: "firm-001",
    client_id: "client-004",
    client_name: "Larsen & Toubro Ltd",
    client_trade_name: "L&T Construction",
    client_code: "CLI-004",
    client_gstin: "19AABCL9988H1Z8",
    client_pan: "AABCL9988H",
    client_email: "audit.accounts@intec.com",
    client_phone: "+91 98110 55443",
    client_address: "L&T House, Ballard Estate, Mumbai, Maharashtra - 400001",
    invoice_type: "tax_invoice",
    invoice_number: "INV-2026-004",
    invoice_date: "24/08/2026",
    due_date: "08/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 310000,
    cgst_amount: 27900,
    sgst_amount: 27900,
    igst_amount: 0,
    total_tax: 55800,
    total_amount: 365800,
    paid_amount: 365800,
    tds_amount: 31000,
    balance_due: 0,
    status: "paid",
    notes: "GST Departmental Audit Scrutiny Assistance under Section 65.",
    items: [
      {
        description: "GST Audit Representation & Legal Submissions before Superintendent",
        sac_code: "998231",
        quantity: 1,
        rate: 310000,
        taxable_value: 310000,
        gst_rate: 18,
        cgst_amount: 27900,
        sgst_amount: 27900,
        igst_amount: 0,
        total_amount: 365800,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-08-24T09:40:00Z",
    updated_at: "2026-09-02T11:10:00Z",
  },
  {
    id: "inv-005",
    firm_id: "firm-001",
    client_id: "client-005",
    client_name: "ITC Limited",
    client_trade_name: "ITC Foods & Agri",
    client_code: "CLI-005",
    client_gstin: "19AAACI1122K1Z9",
    client_pan: "AAACI1122K",
    client_email: "gst.compliance@itc.in",
    client_phone: "+91 98311 88776",
    client_address: "37 J.L. Nehru Road, Park Street, Kolkata, West Bengal - 700071",
    invoice_type: "tax_invoice",
    invoice_number: "INV-2026-005",
    invoice_date: "01/09/2026",
    due_date: "16/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 143389.83,
    cgst_amount: 12905.08,
    sgst_amount: 12905.08,
    igst_amount: 0,
    total_tax: 25810.16,
    total_amount: 169200,
    paid_amount: 0,
    tds_amount: 0,
    balance_due: 169200,
    status: "unpaid",
    notes: "Monthly Retainer Billing for Corporate Secretarial & ROC Filing Compliance.",
    items: [
      {
        description: "Corporate Secretarial & MCA Annual Filing Retainer (August 2026)",
        sac_code: "998231",
        quantity: 1,
        rate: 143389.83,
        taxable_value: 143389.83,
        gst_rate: 18,
        cgst_amount: 12905.08,
        sgst_amount: 12905.08,
        igst_amount: 0,
        total_amount: 169200,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-01T15:00:00Z",
    updated_at: "2026-09-01T15:00:00Z",
  },
];

// Seed Proforma Invoices (5 realistic records)
const SEED_PROFORMA_INVOICES: Invoice[] = [
  {
    id: "pi-001",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    client_gstin: "19AABCR1234F1Z1",
    client_pan: "AABCR1234F",
    client_email: "accounts@relianceretail.com",
    client_phone: "+91 98300 12345",
    client_address: "Plot 34, Sector V, Salt Lake, Kolkata, West Bengal - 700091",
    invoice_type: "proforma",
    invoice_number: "PI-2026-001",
    invoice_date: "01/09/2026",
    due_date: "15/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 500000,
    cgst_amount: 45000,
    sgst_amount: 45000,
    igst_amount: 0,
    total_tax: 90000,
    total_amount: 590000,
    paid_amount: 200000,
    tds_amount: 50000,
    balance_due: 340000,
    status: "partially_paid",
    notes: "Proforma Estimate for Comprehensive Forensic Audit of East Coast Logistics Hub.",
    items: [
      {
        description: "Forensic Investigation & Fraud Risk Assessment Engagement",
        sac_code: "998231",
        quantity: 1,
        rate: 500000,
        taxable_value: 500000,
        gst_rate: 18,
        cgst_amount: 45000,
        sgst_amount: 45000,
        igst_amount: 0,
        total_amount: 590000,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-01T09:00:00Z",
    updated_at: "2026-09-05T12:00:00Z",
  },
  {
    id: "pi-002",
    firm_id: "firm-001",
    client_id: "client-002",
    client_name: "Tata Consultancy Services",
    client_trade_name: "TCS Enterprise Solutions",
    client_code: "CLI-002",
    client_gstin: "27AAACT1987M1ZR",
    client_pan: "AAACT1987M",
    client_email: "finance.billing@tcs.com",
    client_phone: "+91 98200 98765",
    client_address: "TCS House, Raveline Street, Fort, Mumbai, Maharashtra - 400001",
    invoice_type: "proforma",
    invoice_number: "PI-2026-002",
    invoice_date: "03/09/2026",
    due_date: "18/09/2026",
    place_of_supply: "27-Maharashtra",
    subtotal: 450000,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 81000,
    total_tax: 81000,
    total_amount: 531000,
    paid_amount: 0,
    tds_amount: 0,
    balance_due: 531000,
    status: "unpaid",
    notes: "Advance Proforma for Overseas Inbound Expatriate Tax Advisory.",
    items: [
      {
        description: "Expatriate Cross-Border Taxation & DTAA Advisory Services",
        sac_code: "998231",
        quantity: 1,
        rate: 450000,
        taxable_value: 450000,
        gst_rate: 18,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 81000,
        total_amount: 531000,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-03T10:30:00Z",
    updated_at: "2026-09-03T10:30:00Z",
  },
  {
    id: "pi-003",
    firm_id: "firm-001",
    client_id: "client-003",
    client_name: "Infosys Technologies Ltd",
    client_trade_name: "Infosys Digital",
    client_code: "CLI-003",
    client_gstin: "19AABCI5678G1Z3",
    client_pan: "AABCI5678G",
    client_email: "taxation@infosys.com",
    client_phone: "+91 98450 11223",
    client_address: "Plot 12, Action Area II, New Town, Kolkata, West Bengal - 700156",
    invoice_type: "proforma",
    invoice_number: "PI-2026-003",
    invoice_date: "06/09/2026",
    due_date: "21/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 280000,
    cgst_amount: 25200,
    sgst_amount: 25200,
    igst_amount: 0,
    total_tax: 50400,
    total_amount: 330400,
    paid_amount: 330400,
    tds_amount: 28000,
    balance_due: 0,
    status: "paid",
    notes: "Advance full retainer payment received for ERP System Audit.",
    items: [
      {
        description: "ERP Audit & Automated Accounting System Certification",
        sac_code: "998232",
        quantity: 1,
        rate: 280000,
        taxable_value: 280000,
        gst_rate: 18,
        cgst_amount: 25200,
        sgst_amount: 25200,
        igst_amount: 0,
        total_amount: 330400,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-06T11:45:00Z",
    updated_at: "2026-09-08T15:10:00Z",
  },
  {
    id: "pi-004",
    firm_id: "firm-001",
    client_id: "client-004",
    client_name: "Larsen & Toubro Ltd",
    client_trade_name: "L&T Construction",
    client_code: "CLI-004",
    client_gstin: "19AABCL9988H1Z8",
    client_pan: "AABCL9988H",
    client_email: "audit.accounts@intec.com",
    client_phone: "+91 98110 55443",
    client_address: "L&T House, Ballard Estate, Mumbai, Maharashtra - 400001",
    invoice_type: "proforma",
    invoice_number: "PI-2026-004",
    invoice_date: "08/09/2026",
    due_date: "23/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 180000,
    cgst_amount: 16200,
    sgst_amount: 16200,
    igst_amount: 0,
    total_tax: 32400,
    total_amount: 212400,
    paid_amount: 0,
    tds_amount: 0,
    balance_due: 212400,
    status: "draft",
    notes: "Draft Proforma for Customs Duty Special Valuation Branch (SVB) clearance.",
    items: [
      {
        description: "SVB Customs Valuation Representation & Report Submission",
        sac_code: "998231",
        quantity: 1,
        rate: 180000,
        taxable_value: 180000,
        gst_rate: 18,
        cgst_amount: 16200,
        sgst_amount: 16200,
        igst_amount: 0,
        total_amount: 212400,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-08T16:20:00Z",
    updated_at: "2026-09-08T16:20:00Z",
  },
  {
    id: "pi-005",
    firm_id: "firm-001",
    client_id: "client-005",
    client_name: "ITC Limited",
    client_trade_name: "ITC Foods & Agri",
    client_code: "CLI-005",
    client_gstin: "19AAACI1122K1Z9",
    client_pan: "AAACI1122K",
    client_email: "gst.compliance@itc.in",
    client_phone: "+91 98311 88776",
    client_address: "37 J.L. Nehru Road, Park Street, Kolkata, West Bengal - 700071",
    invoice_type: "proforma",
    invoice_number: "PI-2026-005",
    invoice_date: "09/09/2026",
    due_date: "24/09/2026",
    place_of_supply: "19-West Bengal",
    subtotal: 154000,
    cgst_amount: 13860,
    sgst_amount: 13860,
    igst_amount: 0,
    total_tax: 27720,
    total_amount: 181720,
    paid_amount: 0,
    tds_amount: 0,
    balance_due: 181720,
    status: "unpaid",
    notes: "Proforma Invoice for ESG Sustainability Assurance Readiness Review.",
    items: [
      {
        description: "ESG & BRSR Core Assurance Assessment under SEBI guidelines",
        sac_code: "998231",
        quantity: 1,
        rate: 154000,
        taxable_value: 154000,
        gst_rate: 18,
        cgst_amount: 13860,
        sgst_amount: 13860,
        igst_amount: 0,
        total_amount: 181720,
        is_reimbursement: false,
      },
    ],
    created_at: "2026-09-09T14:10:00Z",
    updated_at: "2026-09-09T14:10:00Z",
  },
];

// Seed Pass-Through Reimbursements (4 realistic records)
const SEED_REIMBURSEMENTS: ClientReimbursement[] = [
  {
    id: "reimb-001",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    expense_date: "02/08/2026",
    category: "ROC / MCA Filing Fee",
    description: "ROC Form MGT-7 & AOC-4 filing fee paid via MCA V3 Portal Challan",
    amount: 18000,
    challan_number: "MCA-CH-9928172",
    receipt_url: "/docs/challans/mca-9928172.pdf",
    is_billed: true,
    invoice_id: "inv-001",
    invoice_number: "INV-2026-001",
    created_at: "2026-08-02T10:00:00Z",
  },
  {
    id: "reimb-002",
    firm_id: "firm-001",
    client_id: "client-002",
    client_name: "Tata Consultancy Services",
    client_trade_name: "TCS Enterprise Solutions",
    client_code: "CLI-002",
    expense_date: "10/08/2026",
    category: "Court Fee / Stamp Duty",
    description: "High Court Commercial Division Stamp Duty for Scheme of Arrangement",
    amount: 54000,
    challan_number: "E-STAMP-CAL-8812",
    receipt_url: "/docs/stamps/estamp-8812.pdf",
    is_billed: true,
    invoice_id: "inv-002",
    invoice_number: "INV-2026-002",
    created_at: "2026-08-10T11:30:00Z",
  },
  {
    id: "reimb-003",
    firm_id: "firm-001",
    client_id: "client-003",
    client_name: "Infosys Technologies Ltd",
    client_trade_name: "Infosys Digital",
    client_code: "CLI-003",
    expense_date: "25/08/2026",
    category: "Conveyance & Travel",
    description: "Senior Audit Team Onsite Verification conveyance to Bhubaneswar campus",
    amount: 24500,
    challan_number: "AIR-EXP-7721",
    receipt_url: "/docs/bills/travel-7721.pdf",
    is_billed: false,
    invoice_id: null,
    invoice_number: null,
    created_at: "2026-08-25T14:15:00Z",
  },
  {
    id: "reimb-004",
    firm_id: "firm-001",
    client_id: "client-004",
    client_name: "Larsen & Toubro Ltd",
    client_trade_name: "L&T Construction",
    client_code: "CLI-004",
    expense_date: "04/09/2026",
    category: "Government Challan",
    description: "Directorate General of Foreign Trade (DGFT) Advance Authorization application fee",
    amount: 32000,
    challan_number: "DGFT-PAY-44019",
    receipt_url: "/docs/challans/dgft-44019.pdf",
    is_billed: false,
    invoice_id: null,
    invoice_number: null,
    created_at: "2026-09-04T12:00:00Z",
  },
];

// Seed Payment Receipts & TDS 194J (5 realistic records)
const SEED_PAYMENT_RECEIPTS: PaymentReceipt[] = [
  {
    id: "rcp-001",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    invoice_id: "inv-001",
    invoice_number: "INV-2026-001",
    receipt_number: "RCP-2026-001",
    receipt_date: "20/08/2026",
    amount_received: 162000,
    tds_deducted: 15000,
    net_amount: 162000,
    payment_mode: "NEFT/RTGS",
    utr_reference: "HDFC000123498765",
    bank_name: "HDFC Bank Ltd",
    notes: "Full settlement for Tax Audit Invoice INV-2026-001 with 10% TDS Section 194J deduction.",
    created_at: "2026-08-20T14:30:00Z",
  },
  {
    id: "rcp-002",
    firm_id: "firm-001",
    client_id: "client-002",
    client_name: "Tata Consultancy Services",
    client_trade_name: "TCS Enterprise Solutions",
    client_code: "CLI-002",
    invoice_id: "inv-002",
    invoice_number: "INV-2026-002",
    receipt_number: "RCP-2026-002",
    receipt_date: "25/08/2026",
    amount_received: 250000,
    tds_deducted: 36000,
    net_amount: 250000,
    payment_mode: "NEFT/RTGS",
    utr_reference: "ICIC000009988112",
    bank_name: "ICICI Bank Ltd",
    notes: "Part payment received for Transfer Pricing assignment. Balance due ₹ 1,38,800.",
    created_at: "2026-08-25T16:00:00Z",
  },
  {
    id: "rcp-003",
    firm_id: "firm-001",
    client_id: "client-004",
    client_name: "Larsen & Toubro Ltd",
    client_trade_name: "L&T Construction",
    client_code: "CLI-004",
    invoice_id: "inv-004",
    invoice_number: "INV-2026-004",
    receipt_number: "RCP-2026-003",
    receipt_date: "02/09/2026",
    amount_received: 334800,
    tds_deducted: 31000,
    net_amount: 334800,
    payment_mode: "NEFT/RTGS",
    utr_reference: "SBIN000456123987",
    bank_name: "State Bank of India",
    notes: "Full payment received for GST Audit representation u/s 65.",
    created_at: "2026-09-02T11:10:00Z",
  },
  {
    id: "rcp-004",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    invoice_id: "pi-001",
    invoice_number: "PI-2026-001",
    receipt_number: "RCP-2026-004",
    receipt_date: "05/09/2026",
    amount_received: 200000,
    tds_deducted: 50000,
    net_amount: 200000,
    payment_mode: "NEFT/RTGS",
    utr_reference: "HDFC000123555444",
    bank_name: "HDFC Bank Ltd",
    notes: "Advance payment credited against Forensic Audit Proforma PI-2026-001.",
    created_at: "2026-09-05T12:00:00Z",
  },
  {
    id: "rcp-005",
    firm_id: "firm-001",
    client_id: "client-003",
    client_name: "Infosys Technologies Ltd",
    client_trade_name: "Infosys Digital",
    client_code: "CLI-003",
    invoice_id: "pi-003",
    invoice_number: "PI-2026-003",
    receipt_number: "RCP-2026-005",
    receipt_date: "08/09/2026",
    amount_received: 302400,
    tds_deducted: 28000,
    net_amount: 302400,
    payment_mode: "NEFT/RTGS",
    utr_reference: "KKBK000998811223",
    bank_name: "Kotak Mahindra Bank",
    notes: "Full advance settlement for ERP System Audit Proforma PI-2026-003.",
    created_at: "2026-09-08T15:10:00Z",
  },
];

// Seed Recurring Retainers (4 realistic records)
const SEED_RECURRING_INVOICES: RecurringInvoice[] = [
  {
    id: "rec-001",
    firm_id: "firm-001",
    client_id: "client-001",
    client_name: "Reliance Retail Ltd",
    client_trade_name: "Reliance Smart",
    client_code: "CLI-001",
    service_name: "Monthly GST & TDS Retainership",
    frequency: "Monthly",
    amount: 65000,
    start_date: "01/04/2026",
    end_date: "31/03/2027",
    next_run_date: "01/10/2026",
    is_active: true,
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "rec-002",
    firm_id: "firm-001",
    client_id: "client-002",
    client_name: "Tata Consultancy Services",
    client_trade_name: "TCS Enterprise Solutions",
    client_code: "CLI-002",
    service_name: "Transfer Pricing Compliance Retainer",
    frequency: "Quarterly",
    amount: 75000,
    start_date: "01/04/2026",
    end_date: "31/03/2027",
    next_run_date: "01/10/2026",
    is_active: true,
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "rec-003",
    firm_id: "firm-001",
    client_id: "client-003",
    client_name: "Infosys Technologies Ltd",
    client_trade_name: "Infosys Digital",
    client_code: "CLI-003",
    service_name: "Monthly Virtual CFO & MIS Reporting Retainer",
    frequency: "Monthly",
    amount: 55000,
    start_date: "01/05/2026",
    end_date: "30/04/2027",
    next_run_date: "01/10/2026",
    is_active: true,
    created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "rec-004",
    firm_id: "firm-001",
    client_id: "client-005",
    client_name: "ITC Limited",
    client_trade_name: "ITC Foods & Agri",
    client_code: "CLI-005",
    service_name: "Corporate Secretarial & ROC Retainer",
    frequency: "Yearly",
    amount: 50000,
    start_date: "01/04/2026",
    end_date: "31/03/2027",
    next_run_date: "01/04/2027",
    is_active: true,
    created_at: "2026-04-01T10:00:00Z",
  },
];

// Helper calculations
function calculateProformaKpi(proformas: Invoice[]): ProformaKPIData {
  let all_proforma = 0;
  let receivable = 0;
  let receivable_count = 0;
  let partially_paid = 0;
  let partially_paid_count = 0;
  let advance_paid = 0;
  let advance_paid_count = 0;

  for (const p of proformas) {
    all_proforma += p.total_amount;
    if (p.status === "unpaid" || p.status === "draft") {
      receivable += p.balance_due;
      receivable_count++;
    } else if (p.status === "partially_paid") {
      partially_paid += p.paid_amount;
      partially_paid_count++;
      receivable += p.balance_due;
    } else if (p.status === "paid") {
      advance_paid += p.paid_amount;
      advance_paid_count++;
    }
  }

  return {
    all_proforma,
    all_proforma_count: proformas.length,
    receivable,
    receivable_count,
    partially_paid,
    partially_paid_count,
    advance_paid,
    advance_paid_count,
  };
}

function calculateTaxInvoiceKpi(invoices: Invoice[]): TaxInvoiceKPIData {
  let all_invoices = 0;
  let receivable = 0;
  let receivable_count = 0;
  let partially_paid = 0;
  let partially_paid_count = 0;
  let paid = 0;
  let paid_count = 0;

  for (const inv of invoices) {
    all_invoices += inv.total_amount;
    if (inv.status === "paid") {
      paid += inv.paid_amount;
      paid_count++;
    } else if (inv.status === "partially_paid") {
      partially_paid += inv.paid_amount;
      partially_paid_count++;
      receivable += inv.balance_due;
    } else {
      receivable += inv.balance_due;
      receivable_count++;
    }
  }

  return {
    all_invoices,
    all_invoices_count: invoices.length,
    receivable,
    receivable_count,
    partially_paid,
    partially_paid_count,
    paid,
    paid_count,
  };
}

function calculateReimbursementKpi(reimbursements: ClientReimbursement[]): ReimbursementKPIData {
  let all_reimbursements = 0;
  let receivable = 0;
  let receivable_count = 0;
  const partially_paid = 0;
  const partially_paid_count = 0;
  let paid = 0;
  let paid_count = 0;

  for (const r of reimbursements) {
    all_reimbursements += r.amount;
    if (r.is_billed) {
      paid += r.amount;
      paid_count++;
    } else {
      receivable += r.amount;
      receivable_count++;
    }
  }

  return {
    all_reimbursements,
    all_reimbursements_count: reimbursements.length,
    receivable,
    receivable_count,
    partially_paid,
    partially_paid_count,
    paid,
    paid_count,
  };
}

function calculateReceiptsKpi(receipts: PaymentReceipt[]): ReceiptsKPIData {
  let total_receipts = 0;
  let receipts_amount = 0;
  let receipts_count = 0;
  let advance_amount = 0;
  let advance_amount_count = 0;

  for (const r of receipts) {
    total_receipts += r.amount_received;
    if (r.invoice_number?.startsWith("PI-")) {
      advance_amount += r.amount_received;
      advance_amount_count++;
    } else {
      receipts_amount += r.amount_received;
      receipts_count++;
    }
  }

  return {
    total_receipts,
    total_receipts_count: receipts.length,
    receipts: receipts_amount,
    receipts_count,
    advance_amount,
    advance_amount_count,
  };
}

function calculateRecurringKpi(recurring: RecurringInvoice[]): RecurringKPIData {
  let total = 0;
  let monthly = 0;
  let quarterly = 0;
  let half_yearly = 0;
  let yearly = 0;

  for (const r of recurring) {
    if (!r.is_active) continue;
    total++;
    if (r.frequency === "Monthly") monthly++;
    else if (r.frequency === "Quarterly") quarterly++;
    else if (r.frequency === "Half-Yearly") half_yearly++;
    else if (r.frequency === "Yearly") yearly++;
  }

  return { total, monthly, quarterly, half_yearly, yearly };
}

// Generate GSTR-1 Outward Supplies Tables from Tax Invoices
function generateGSTR1Data(taxInvoices: Invoice[]) {
  let total_taxable = 0;
  let total_igst = 0;
  let total_cgst = 0;
  let total_sgst = 0;

  const table4: GSTR1Table4Row[] = [];
  const table7: GSTR1Table7Row[] = [];
  const table8: GSTR1Table8Row[] = [
    {
      description: "Non-GST / Pass-through Out-of-pocket client reimbursements",
      nil_rated: 0,
      exempted: 0,
      non_gst: 128500,
    },
    {
      description: "Statutory Free Certifications & ICAI Pro-Bono Services",
      nil_rated: 25000,
      exempted: 0,
      non_gst: 0,
    },
  ];

  const sacMap = new Map<string, GSTR1Table12Row>();

  for (const inv of taxInvoices) {
    total_taxable += inv.subtotal;
    total_igst += inv.igst_amount;
    total_cgst += inv.cgst_amount;
    total_sgst += inv.sgst_amount;

    if (inv.client_gstin) {
      table4.push({
        gstin: inv.client_gstin,
        trade_name: inv.client_name || inv.client_trade_name || "Client",
        invoice_number: inv.invoice_number,
        invoice_date: inv.invoice_date,
        invoice_value: inv.total_amount,
        place_of_supply: inv.place_of_supply,
        reverse_charge: "N",
        rate: 18,
        taxable_value: inv.subtotal,
        cess_amount: 0,
      });
    } else {
      table7.push({
        type: "OE",
        place_of_supply: inv.place_of_supply,
        rate: 18,
        taxable_value: inv.subtotal,
        cess_amount: 0,
      });
    }

    const sac = inv.items?.[0]?.sac_code || "998231";
    const existing = sacMap.get(sac);
    if (existing) {
      existing.total_value += inv.total_amount;
      existing.taxable_value += inv.subtotal;
      existing.integrated_tax += inv.igst_amount;
      existing.central_tax += inv.cgst_amount;
      existing.state_tax += inv.sgst_amount;
      existing.total_quantity += 1;
    } else {
      sacMap.set(sac, {
        hsn_sac: sac,
        description: sac === "998231" ? "Legal & Accounting Professional Services" : "Corporate Audit & Assurance",
        uqc: "OTH",
        total_quantity: 1,
        total_value: inv.total_amount,
        taxable_value: inv.subtotal,
        integrated_tax: inv.igst_amount,
        central_tax: inv.cgst_amount,
        state_tax: inv.sgst_amount,
        cess: 0,
      });
    }
  }

  const table13: GSTR1Table13Row[] = [
    {
      nature_of_document: "Invoices for Outward Supply (Tax Invoices)",
      sr_no_from: "INV-2026-001",
      sr_no_to: `INV-2026-00${taxInvoices.length}`,
      total_number: taxInvoices.length,
      cancelled: 0,
      net_issued: taxInvoices.length,
    },
    {
      nature_of_document: "Proforma Invoices Issued",
      sr_no_from: "PI-2026-001",
      sr_no_to: "PI-2026-005",
      total_number: 5,
      cancelled: 0,
      net_issued: 5,
    },
  ];

  const gstr1Stats: GSTR1StatCards = {
    taxable_value: total_taxable,
    igst: total_igst,
    cgst: total_cgst,
    sgst: total_sgst,
    total_tax: total_igst + total_cgst + total_sgst,
  };

  return {
    gstr1Stats,
    table4,
    table7,
    table8,
    table12: Array.from(sacMap.values()),
    table13,
  };
}

const SEED_ANALYTICS: SalesAnalyticsData = {
  summary: {
    total_sales: 1420000,
    total_collections: 1145000,
    outstanding_dues: 275000,
    collection_rate: 80.6,
    active_retainers: 4,
  },
  monthly_trends: [
    { month: "Apr 2026", sales: 180000, collections: 150000, outstanding: 30000 },
    { month: "May 2026", sales: 220000, collections: 210000, outstanding: 10000 },
    { month: "Jun 2026", sales: 310000, collections: 270000, outstanding: 40000 },
    { month: "Jul 2026", sales: 290000, collections: 240000, outstanding: 50000 },
    { month: "Aug 2026", sales: 420000, collections: 275000, outstanding: 145000 },
  ],
  monthly_collection_rate: [
    { month: "Apr 2026", rate: 83.3, sales: 180000, collected: 150000 },
    { month: "May 2026", rate: 95.4, sales: 220000, collected: 210000 },
    { month: "Jun 2026", rate: 87.1, sales: 310000, collected: 270000 },
    { month: "Jul 2026", rate: 82.7, sales: 290000, collected: 240000 },
    { month: "Aug 2026", rate: 65.5, sales: 420000, collected: 275000 },
  ],
  revenue_by_service: [
    { service: "Tax Audit u/s 44AB", revenue: 460000, percentage: 32.4 },
    { service: "Transfer Pricing & Form 3CEB", revenue: 360000, percentage: 25.4 },
    { service: "GST Audit & Representation", revenue: 310000, percentage: 21.8 },
    { service: "Internal Financial Controls", revenue: 240000, percentage: 16.9 },
    { service: "ROC Retainership", revenue: 50000, percentage: 3.5 },
  ],
  revenue_by_client: [
    { client: "Tata Consultancy Services", revenue: 424800, invoices: 1 },
    { client: "Larsen & Toubro Ltd", revenue: 365800, invoices: 1 },
    { client: "Infosys Technologies Ltd", revenue: 283200, invoices: 1 },
    { client: "Reliance Retail Ltd", revenue: 177000, invoices: 1 },
    { client: "ITC Limited", revenue: 169200, invoices: 1 },
  ],
  revenue_by_user: [
    { user: "Rahul Sen (Partner)", revenue: 840000, tasks_billed: 8 },
    { user: "Archi Saha (Manager)", revenue: 380000, tasks_billed: 5 },
    { user: "Sneha Roy (Associate)", revenue: 200000, tasks_billed: 4 },
  ],
};

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      const gstr1 = generateGSTR1Data(SEED_TAX_INVOICES);
      return NextResponse.json({
        proformas: SEED_PROFORMA_INVOICES,
        taxInvoices: SEED_TAX_INVOICES,
        reimbursements: SEED_REIMBURSEMENTS,
        receipts: SEED_PAYMENT_RECEIPTS,
        recurring: SEED_RECURRING_INVOICES,
        proformaKpi: calculateProformaKpi(SEED_PROFORMA_INVOICES),
        taxInvoiceKpi: calculateTaxInvoiceKpi(SEED_TAX_INVOICES),
        reimbursementKpi: calculateReimbursementKpi(SEED_REIMBURSEMENTS),
        receiptsKpi: calculateReceiptsKpi(SEED_PAYMENT_RECEIPTS),
        recurringKpi: calculateRecurringKpi(SEED_RECURRING_INVOICES),
        analytics: SEED_ANALYTICS,
        gstr1Stats: gstr1.gstr1Stats,
        gstr1Table4: gstr1.table4,
        gstr1Table7: gstr1.table7,
        gstr1Table8: gstr1.table8,
        gstr1Table12: gstr1.table12,
        gstr1Table13: gstr1.table13,
      });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    // Check DB invoices
    const { data: dbInvoices, error: invError } = await supabase
      .from("invoices")
      .select("*, clients(id, trade_name, legal_name, pan_number, email, phone, address_line_1, city, state, pin_code, gstin)")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    if (invError || !dbInvoices || dbInvoices.length === 0) {
      const gstr1 = generateGSTR1Data(SEED_TAX_INVOICES);
      return NextResponse.json({
        proformas: SEED_PROFORMA_INVOICES,
        taxInvoices: SEED_TAX_INVOICES,
        reimbursements: SEED_REIMBURSEMENTS,
        receipts: SEED_PAYMENT_RECEIPTS,
        recurring: SEED_RECURRING_INVOICES,
        proformaKpi: calculateProformaKpi(SEED_PROFORMA_INVOICES),
        taxInvoiceKpi: calculateTaxInvoiceKpi(SEED_TAX_INVOICES),
        reimbursementKpi: calculateReimbursementKpi(SEED_REIMBURSEMENTS),
        receiptsKpi: calculateReceiptsKpi(SEED_PAYMENT_RECEIPTS),
        recurringKpi: calculateRecurringKpi(SEED_RECURRING_INVOICES),
        analytics: SEED_ANALYTICS,
        gstr1Stats: gstr1.gstr1Stats,
        gstr1Table4: gstr1.table4,
        gstr1Table7: gstr1.table7,
        gstr1Table8: gstr1.table8,
        gstr1Table12: gstr1.table12,
        gstr1Table13: gstr1.table13,
      });
    }

    // Map invoices
    const mappedTaxInvoices: Invoice[] = [];
    const mappedProformas: Invoice[] = [];

    for (const inv of dbInvoices) {
      const client = (inv as Record<string, unknown>).clients as Record<string, unknown> | null;
      const formatted: Invoice = {
        id: inv.id,
        firm_id: inv.firm_id,
        client_id: inv.client_id,
        client_name: (client?.trade_name as string) || (client?.legal_name as string) || "Client",
        client_trade_name: (client?.trade_name as string) || "",
        client_code: `CLI-${inv.client_id.slice(0, 4).toUpperCase()}`,
        client_gstin: (client?.gstin as string) || null,
        client_pan: (client?.pan_number as string) || null,
        client_email: (client?.email as string) || null,
        client_phone: (client?.phone as string) || null,
        client_address: client?.address_line_1
          ? `${client.address_line_1}, ${client.city || ""}, ${client.state || ""}`
          : null,
        invoice_type: inv.invoice_type as "proforma" | "tax_invoice",
        invoice_number: inv.invoice_number,
        invoice_date: inv.invoice_date,
        due_date: inv.due_date,
        place_of_supply: inv.place_of_supply || "19-West Bengal",
        subtotal: Number(inv.subtotal) || 0,
        cgst_amount: Number(inv.cgst_amount) || 0,
        sgst_amount: Number(inv.sgst_amount) || 0,
        igst_amount: Number(inv.igst_amount) || 0,
        total_tax: Number(inv.total_tax) || 0,
        total_amount: Number(inv.total_amount) || 0,
        paid_amount: Number(inv.paid_amount) || 0,
        tds_amount: Number(inv.tds_amount) || 0,
        balance_due: Number(inv.balance_due) || 0,
        status: inv.status as InvoiceStatus,
        notes: inv.notes,
        converted_tax_invoice_id: inv.converted_tax_invoice_id,
        created_at: inv.created_at || new Date().toISOString(),
        updated_at: inv.updated_at || new Date().toISOString(),
      };

      if (inv.invoice_type === "tax_invoice") {
        mappedTaxInvoices.push(formatted);
      } else {
        mappedProformas.push(formatted);
      }
    }

    // Fetch reimbursements
    const { data: dbReimb } = await supabase
      .from("client_reimbursements")
      .select("*, clients(trade_name, legal_name)")
      .eq("firm_id", firmId);

    const mappedReimb: ClientReimbursement[] = (dbReimb || []).map((r) => {
      const client = (r as Record<string, unknown>).clients as Record<string, unknown> | null;
      return {
        id: r.id,
        firm_id: r.firm_id,
        client_id: r.client_id,
        client_name: (client?.trade_name as string) || "Client",
        client_trade_name: (client?.trade_name as string) || "",
        client_code: `CLI-${r.client_id.slice(0, 4).toUpperCase()}`,
        expense_date: r.expense_date,
        category: r.category,
        description: r.description,
        amount: Number(r.amount) || 0,
        challan_number: r.challan_number,
        receipt_url: r.receipt_url,
        is_billed: r.is_billed,
        invoice_id: r.invoice_id,
        created_at: r.created_at || new Date().toISOString(),
      };
    });

    // Fetch receipts
    const { data: dbReceipts } = await supabase
      .from("payment_receipts")
      .select("*, clients(trade_name, legal_name), invoices(invoice_number)")
      .eq("firm_id", firmId);

    const mappedReceipts: PaymentReceipt[] = (dbReceipts || []).map((rcp) => {
      const client = (rcp as Record<string, unknown>).clients as Record<string, unknown> | null;
      const inv = (rcp as Record<string, unknown>).invoices as Record<string, unknown> | null;
      return {
        id: rcp.id,
        firm_id: rcp.firm_id,
        client_id: rcp.client_id,
        client_name: (client?.trade_name as string) || "Client",
        client_trade_name: (client?.trade_name as string) || "",
        client_code: `CLI-${rcp.client_id.slice(0, 4).toUpperCase()}`,
        invoice_id: rcp.invoice_id,
        invoice_number: (inv?.invoice_number as string) || null,
        receipt_number: rcp.receipt_number,
        receipt_date: rcp.receipt_date,
        amount_received: Number(rcp.amount_received) || 0,
        tds_deducted: Number(rcp.tds_deducted) || 0,
        net_amount: Number(rcp.amount_received) || 0,
        payment_mode: rcp.payment_mode || "NEFT/RTGS",
        utr_reference: rcp.utr_reference,
        bank_name: rcp.bank_name,
        notes: rcp.notes,
        created_at: rcp.created_at || new Date().toISOString(),
      };
    });

    // Fetch recurring
    const { data: dbRecurring } = await supabase
      .from("recurring_invoices")
      .select("*, clients(trade_name, legal_name)")
      .eq("firm_id", firmId);

    const mappedRecurring: RecurringInvoice[] = (dbRecurring || []).map((rec) => {
      const client = (rec as Record<string, unknown>).clients as Record<string, unknown> | null;
      return {
        id: rec.id,
        firm_id: rec.firm_id,
        client_id: rec.client_id,
        client_name: (client?.trade_name as string) || "Client",
        client_trade_name: (client?.trade_name as string) || "",
        client_code: `CLI-${rec.client_id.slice(0, 4).toUpperCase()}`,
        frequency: rec.frequency as RecurringInvoice["frequency"],
        amount: Number(rec.amount) || 0,
        start_date: rec.start_date,
        end_date: rec.end_date,
        next_run_date: rec.next_run_date,
        is_active: rec.is_active ?? true,
        created_at: rec.created_at || new Date().toISOString(),
      };
    });

    const taxInvoicesToUse = mappedTaxInvoices.length > 0 ? mappedTaxInvoices : SEED_TAX_INVOICES;
    const proformasToUse = mappedProformas.length > 0 ? mappedProformas : SEED_PROFORMA_INVOICES;
    const reimbursementsToUse = mappedReimb.length > 0 ? mappedReimb : SEED_REIMBURSEMENTS;
    const receiptsToUse = mappedReceipts.length > 0 ? mappedReceipts : SEED_PAYMENT_RECEIPTS;
    const recurringToUse = mappedRecurring.length > 0 ? mappedRecurring : SEED_RECURRING_INVOICES;

    const gstr1 = generateGSTR1Data(taxInvoicesToUse);

    return NextResponse.json({
      proformas: proformasToUse,
      taxInvoices: taxInvoicesToUse,
      reimbursements: reimbursementsToUse,
      receipts: receiptsToUse,
      recurring: recurringToUse,
      proformaKpi: calculateProformaKpi(proformasToUse),
      taxInvoiceKpi: calculateTaxInvoiceKpi(taxInvoicesToUse),
      reimbursementKpi: calculateReimbursementKpi(reimbursementsToUse),
      receiptsKpi: calculateReceiptsKpi(receiptsToUse),
      recurringKpi: calculateRecurringKpi(recurringToUse),
      analytics: SEED_ANALYTICS,
      gstr1Stats: gstr1.gstr1Stats,
      gstr1Table4: gstr1.table4,
      gstr1Table7: gstr1.table7,
      gstr1Table8: gstr1.table8,
      gstr1Table12: gstr1.table12,
      gstr1Table13: gstr1.table13,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/invoices:", error);
    const gstr1 = generateGSTR1Data(SEED_TAX_INVOICES);
    return NextResponse.json({
      proformas: SEED_PROFORMA_INVOICES,
      taxInvoices: SEED_TAX_INVOICES,
      reimbursements: SEED_REIMBURSEMENTS,
      receipts: SEED_PAYMENT_RECEIPTS,
      recurring: SEED_RECURRING_INVOICES,
      proformaKpi: calculateProformaKpi(SEED_PROFORMA_INVOICES),
      taxInvoiceKpi: calculateTaxInvoiceKpi(SEED_TAX_INVOICES),
      reimbursementKpi: calculateReimbursementKpi(SEED_REIMBURSEMENTS),
      receiptsKpi: calculateReceiptsKpi(SEED_PAYMENT_RECEIPTS),
      recurringKpi: calculateRecurringKpi(SEED_RECURRING_INVOICES),
      analytics: SEED_ANALYTICS,
      gstr1Stats: gstr1.gstr1Stats,
      gstr1Table4: gstr1.table4,
      gstr1Table7: gstr1.table7,
      gstr1Table8: gstr1.table8,
      gstr1Table12: gstr1.table12,
      gstr1Table13: gstr1.table13,
    });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const isTaxInvoice = body.invoice_type === "tax_invoice";
    const placeOfSupply = body.place_of_supply || "19-West Bengal";
    const isIntraState = placeOfSupply.startsWith("19");

    const items: InvoiceItem[] = body.items || [
      {
        description: body.notes || "Professional Legal & Accounting Services",
        sac_code: "998231",
        quantity: 1,
        rate: Number(body.subtotal) || 10000,
        taxable_value: Number(body.subtotal) || 10000,
        gst_rate: 18,
        cgst_amount: isIntraState ? (Number(body.subtotal) || 10000) * 0.09 : 0,
        sgst_amount: isIntraState ? (Number(body.subtotal) || 10000) * 0.09 : 0,
        igst_amount: !isIntraState ? (Number(body.subtotal) || 10000) * 0.18 : 0,
        total_amount: (Number(body.subtotal) || 10000) * 1.18,
        is_reimbursement: false,
      },
    ];

    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    for (const item of items) {
      if (item.is_reimbursement) {
        subtotal += Number(item.rate);
      } else {
        const taxable = Number(item.rate) * (Number(item.quantity) || 1);
        subtotal += taxable;
        if (isIntraState) {
          cgst += taxable * 0.09;
          sgst += taxable * 0.09;
        } else {
          igst += taxable * 0.18;
        }
      }
    }

    const totalTax = cgst + sgst + igst;
    const totalAmount = subtotal + totalTax;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      firm_id: tenant?.firmId || "firm-001",
      client_id: body.client_id || "client-001",
      client_name: body.client_name || "Client Name",
      client_trade_name: body.client_trade_name || body.client_name || "Client Name",
      client_code: body.client_code || "CLI-001",
      client_gstin: body.client_gstin || null,
      client_pan: body.client_pan || null,
      client_email: body.client_email || null,
      client_phone: body.client_phone || null,
      client_address: body.client_address || null,
      invoice_type: isTaxInvoice ? "tax_invoice" : "proforma",
      invoice_number:
        body.invoice_number ||
        (isTaxInvoice
          ? `INV-2026-${Math.floor(100 + Math.random() * 900)}`
          : `PI-2026-${Math.floor(100 + Math.random() * 900)}`),
      invoice_date: body.invoice_date || new Date().toLocaleDateString("en-GB"),
      due_date: body.due_date || new Date(Date.now() + 15 * 86400000).toLocaleDateString("en-GB"),
      place_of_supply: placeOfSupply,
      subtotal,
      cgst_amount: cgst,
      sgst_amount: sgst,
      igst_amount: igst,
      total_tax: totalTax,
      total_amount: totalAmount,
      paid_amount: 0,
      tds_amount: 0,
      balance_due: totalAmount,
      status: (body.status as InvoiceStatus) || "unpaid",
      notes: body.notes || null,
      items,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase.from("invoices").insert({
        firm_id: tenant.firmId,
        client_id: newInvoice.client_id,
        invoice_type: newInvoice.invoice_type,
        invoice_number: newInvoice.invoice_number,
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        place_of_supply: newInvoice.place_of_supply,
        subtotal: newInvoice.subtotal,
        cgst_amount: newInvoice.cgst_amount,
        sgst_amount: newInvoice.sgst_amount,
        igst_amount: newInvoice.igst_amount,
        total_tax: newInvoice.total_tax,
        total_amount: newInvoice.total_amount,
        paid_amount: 0,
        tds_amount: 0,
        balance_due: newInvoice.balance_due,
        status: newInvoice.status,
        notes: newInvoice.notes,
      });
    }

    return NextResponse.json({ invoice: newInvoice }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/invoices:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create invoice" },
      { status: 500 }
    );
  }
}
