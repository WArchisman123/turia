# Implementation Prompt: Invoice, Billing & Receipts Engine (Module 8)

## Goal
Implement Module 8: **Invoice, Billing & Receipts Engine** (`doc.md` Section 8 & `AGENTS.md` Section 13) for TURIA. The module governs the firm's financial cashflow, billing lifecycle, pass-through client reimbursements, payment receipts with TDS 194J, recurring retainer billing, and GSTR-1 compliance reporting across 6 sub-tabs (`Proforma Invoice`, `Invoice`, `Reimbursement`, `Receipts`, `Recurring Invoice`, `Sales Analytics`), an `Add Invoice / Proforma` screen (`invoice-add.png`), and a `Record Payment` receipt modal.

---

## Skills Read
- `.agents/skills/supabase`: PostgreSQL schema, migrations, queries, service role usage, RLS policies.
- `.agents/skills/clerk`: Multi-tenant organization authentication, user roles, session management.
- Next.js App Router guidelines (`node_modules/next/dist/docs/`).
- `ui_doc.md`: Design system, color tokens, 4-card & 6-card KPI strips, `@/components/ui/data-table` primitives, badge tokens.

---

## Existing Code & Visual Evidence Inspected
1. **Screenshots Inspected**:
   - `invoice-1.png`: Tab 1 - Proforma Invoice with 4 KPI cards (`All Proforma`, `Receivable`, `Partially Paid`, `Advance Paid`), Date Range, FY 2026-2027 navigator, currency filter, search, `+ Add` button, and 13-column table.
   - `invoice-2.png`: Tab 2 - Tax Invoice with 4 KPI cards (`All Invoices`, `Receivable`, `Partially Paid`, `Paid`), 13-column table with SAC code, Taxable value, CGST/SGST/IGST breakdown, Paid amount, Balance due, and status badges.
   - `invoice-3.png`: Tab 3 - Pass-Through Reimbursements with 4 KPI cards (`All Reimbursements`, `Receivable`, `Partially Paid`, `Paid`), 10-column table for out-of-pocket client expenses (ROC challans, court fees, official conveyance) billed at cost with 0% GST.
   - `invoice-4.png`: Tab 4 - Payment Receipts & Advance Tracking with 3 KPI cards (`Total Receipts`, `Receipts`, `Advance Amount`), 12-column table with Payment Mode, UTR Reference, TDS Deducted (194J), Net Inflow, and `+ Record Payment` action.
   - `invoice-5.png`: Tab 5 - Recurring Invoice Retainer Engine with 5 KPI cards (`Total`, `Monthly`, `Quarterly`, `Half-Yearly`, `Yearly`), Grid/List view toggle, and retainer schedule table.
   - `invoice-6.png`: Tab 6 - Sales Analytics with 13-report sidebar, 5 executive stat cards, Month-over-Month MoM trend line/area chart, Monthly Sales vs Collection bar chart, Collection Rate by month cards, and revenue breakdowns by service, client, and team member.
   - `invoice-7.png`: Tab 6 - GSTR-1 Outward Supplies Report with 5 tax stat cards (`Taxable Value`, `IGST`, `CGST`, `SGST/UTGST`, `Total Tax`) and 5 GSTR-1 tables (`Table 4 B2B`, `Table 7 B2C Small`, `Table 8 Nil/Exempt`, `Table 12 HSN/SAC Summary`, `Table 13 Documents Issued`).
   - `invoice-add.png`: Add Proforma / Tax Invoice screen with breadcrumb (`‹ Proforma List > Add Proforma`), Billing Org details, Client selector with auto-filled GSTIN & address, professional services line items table with SAC 9982xx rates, pass-through reimbursement items, tax summary (CGST 9% + SGST 9% or IGST 18%), firm bank account instructions, and notes.
2. **Database Schema Inspected**:
   - `supabase/schema.sql` (lines 368–485): Tables `invoices`, `invoice_items`, `client_reimbursements`, `payment_receipts`, and `recurring_invoices` already have PostgreSQL DDL defined.
   - `lib/supabase/types.ts`: Needs typed interfaces for `invoices`, `invoice_items`, `client_reimbursements`, `payment_receipts`, and `recurring_invoices`.
3. **Sidebar Navigation**:
   - `components/layout/sidebar.tsx` links to `/invoices`.

---

## Decisions & Assumptions
1. **GST Tax Engine**:
   - Firm state default is West Bengal (`State Code: 19`).
   - **Intra-state supplies** (Client Place of Supply in West Bengal `19`): CGST 9% + SGST 9% (Total 18%).
   - **Inter-state supplies** (Client Place of Supply outside West Bengal e.g. Maharashtra `27`, Delhi `07`, Karnataka `29`): IGST 18%.
   - **Pass-through Reimbursements**: 0% GST (ROC challans, government filing fees, stamp duty) billed at exact cost without markup.
2. **1-Click Proforma to Tax Invoice Conversion**:
   - Clicking "Convert to Tax Invoice" on an approved/draft proforma invoice generates a new Tax Invoice record with an official sequential number (e.g., `INV-2026-001`), marks the proforma status as `Converted`, and links `converted_tax_invoice_id`.
3. **Payment Receipts & TDS 194J**:
   - Recording a payment allows specifying TDS 194J deduction (standard 10% for professional technical services or custom).
   - The invoice balance is reduced by `amount_received + tds_deducted`, updating the invoice status from `unpaid` to `partially_paid` or `paid`.
4. **Seed Data Volume**:
   - Provide realistic CA firm seed records for 10 invoices (5 tax invoices, 5 proforma invoices), 4 reimbursements, 5 payment receipts, and 4 recurring retainers so every KPI card, chart, and GSTR-1 table populates with verified numbers.

---

## Visual & UI Expectations
- **Tabs**: 6 sub-tabs with pill badges and Lucide icons matching `invoice-1.png` through `invoice-6.png`.
- **KPI Cards**:
  - Proforma: 4 cards with `₹` currency formatting, colored icons in rounded containers (`bg-purple-50`, `bg-red-50`, `bg-amber-50`, `bg-emerald-50`).
  - Tax Invoices: 4 cards matching `invoice-2.png`.
  - Reimbursements: 4 cards matching `invoice-3.png`.
  - Receipts: 3 cards matching `invoice-4.png`.
  - Recurring: 5 cards matching `invoice-5.png`.
  - GSTR-1: 5 cards matching `invoice-7.png`.
- **Tables**: Strict adherence to `ui_doc.md`:
  - Outer container: `bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`.
  - Header: `bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]`.
  - Zero border-collapse artifacts, `divide-y divide-slate-100` on tbody.
  - Interactive 3-dot portal dropdown menus for row actions.
  - Sorting and column visibility integration with `@/components/ui/data-table`.
- **Add Invoice / Proforma Screen (`invoice-add.png`)**:
  - Clean card sections for Billing Organization and Client details.
  - Interactive line items with dynamic tax calculation and pass-through line item adder.
  - Firm bank details preview with UPI QR code placeholder.
- **View / Print Invoice Modal**:
  - Clean printable invoice preview with CA firm header, client GSTIN, SAC table, tax breakup, bank account IFSC details, and authorized signatory block.

---

## Files Likely to Change / Create
1. `lib/supabase/types.ts`: Add typed database interfaces for `invoices`, `invoice_items`, `client_reimbursements`, `payment_receipts`, `recurring_invoices`.
2. `components/invoices/types.ts`: Frontend interfaces for invoices, proformas, reimbursements, receipts, retainers, GSTR-1, and KPI cards.
3. `lib/api/invoices.ts`: API client functions (`fetchInvoices`, `createInvoice`, `convertProformaToTaxInvoice`, `recordPaymentReceipt`, `createReimbursement`, `toggleRecurringInvoice`).
4. `app/api/invoices/route.ts`: Master API handler with seed fallback and Supabase persistence.
5. `app/api/invoices/[id]/route.ts`: Individual invoice status updates, conversion, and deletion.
6. `app/api/invoices/receipts/route.ts`: Payment receipt recording with TDS 194J invoice reconciliation.
7. `components/invoices/proforma-tab.tsx`: Tab 1 - Proforma Invoices with 4 KPI cards, table, and 1-click conversion.
8. `components/invoices/tax-invoices-tab.tsx`: Tab 2 - Tax Invoices with 4 KPI cards, table with GST breakup, and payment status.
9. `components/invoices/reimbursements-tab.tsx`: Tab 3 - Pass-Through Reimbursements with 4 KPI cards and recovery tracking.
10. `components/invoices/receipts-tab.tsx`: Tab 4 - Receipts with 3 KPI cards, TDS 194J column, and Record Payment modal.
11. `components/invoices/recurring-invoices-tab.tsx`: Tab 5 - Retainer automation with 5 KPI cards and Grid/List view.
12. `components/invoices/sales-analytics-tab.tsx`: Tab 6 - Sales Analytics dashboard with 13 reports and GSTR-1 Outward Supplies tables.
13. `components/invoices/add-invoice-screen.tsx`: Full-screen / drawer matching `invoice-add.png` for creating Proformas and Tax Invoices with live GST calculation.
14. `components/invoices/invoice-view-modal.tsx`: Professional printable CA invoice preview.
15. `components/invoices/record-payment-modal.tsx`: Modal to record payments with TDS 194J reconciliation.
16. `app/invoices/page.tsx`: Main page wrapping AppShell and orchestrating the 6 sub-tabs.

---

## Security Requirements
- Enforce firm tenant isolation: queries must filter by `firm_id`.
- Protect all mutation routes (`POST`, `PATCH`, `DELETE`) with authenticated Clerk session checks.
- Zero client-side exposure of secret keys.
- Input validation on all invoice monetary figures and GST calculations using strict number checks.

---

## Acceptance Criteria
1. Navigation to `/invoices` renders the master cockpit with 6 sub-tabs and active tab indication.
2. **Proforma Invoices (Tab 1)**:
   - 4 KPI cards calculate correct monetary sums.
   - 13-column table displays all proforma invoices with proper status badges.
   - Clicking "Convert to Tax Invoice" creates a corresponding Tax Invoice and updates proforma status to `Converted`.
3. **Tax Invoices (Tab 2)**:
   - 4 KPI cards display Total Invoiced, Receivable, Partially Paid, and Paid amounts.
   - 13-column table displays SAC code (`998231`), Taxable value, CGST/SGST/IGST breakdown, and balance due.
   - Status badges: `Paid` (emerald), `Partially Paid` (amber), `Unpaid` (rose), `Overdue` (red).
4. **Reimbursements (Tab 3)**:
   - 4 KPI cards track incurred vs recovered pass-through client expenses.
   - Table displays category (ROC challan, court fee, conveyance) and billing reference.
5. **Receipts (Tab 4)**:
   - 3 KPI cards display Total Receipts, Allocated Receipts, and Advance Amount.
   - `+ Record Payment` modal logs receipt, deducts TDS 194J, and updates invoice balance.
6. **Recurring Invoices (Tab 5)**:
   - 5 KPI cards display frequency distribution.
   - Grid and List views toggle smoothly.
7. **Sales Analytics & GSTR-1 (Tab 6)**:
   - 13-item sidebar navigates between MIS reports.
   - `Analytics Dashboard` renders MoM trend charts, sales vs collections, and revenue by service.
   - `GST Report` renders 5 tax stat cards and GSTR-1 Tables 4 (B2B), 7 (B2C), 8 (Nil/Exempt), 12 (HSN/SAC), and 13 (Docs Issued).
8. **Add Invoice Screen (`invoice-add.png`)**:
   - Breadcrumb navigation, Billing Org selector, Client selector.
   - Dynamic GST computation: intra-state (CGST 9% + SGST 9%) vs inter-state (IGST 18%).
   - Pass-through reimbursement line items with 0% GST.
   - Bank details and note field.
9. **Invoice View / Print Modal**:
   - Formats complete printable invoice with GSTIN, SAC codes, and bank instructions.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000/invoices`.
2. Verify all 6 tabs load and display populated data:
   - Tab 1: Proforma Invoices with 4 KPI cards. Click "Convert to Tax Invoice" on a draft proforma and verify it converts.
   - Tab 2: Tax Invoices with 4 KPI cards, SAC codes, and GST breakdown. Click on an invoice to view the printable preview.
   - Tab 3: Reimbursements with pass-through non-GST expenses.
   - Tab 4: Receipts with TDS 194J deductions. Click `+ Record Payment` and verify payment recording against an invoice.
   - Tab 5: Recurring Invoices with Grid/List view toggle.
   - Tab 6: Sales Analytics dashboard and GST Report (GSTR-1 Tables 4, 7, 8, 12, 13).
3. Click `+ Add` button on Tab 1 or Tab 2:
   - Verify the Add Invoice screen matches `invoice-add.png`.
   - Select a client, add a service line item, verify automatic 18% GST tax calculation.
   - Add a pass-through reimbursement, verify it incurs 0% GST.
   - Save invoice and verify it appears in the table.
