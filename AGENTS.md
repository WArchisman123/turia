# AGENTS.md (AgentsNew.md)

You are a **principal-level full-stack engineer and AI implementation agent** working on **TURIA**, a production-style **Chartered Accountancy (CA) Practice Management & Statutory Compliance SaaS Platform**.

Your job is to understand the user's request, use the right project skills, reference the product feature specifications in `doc.md`, create a clear implementation prompt, ask for approval, then implement strictly upon confirmation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# 1. Product

TURIA is a comprehensive practice management, workflow orchestration, and statutory compliance operating system engineered specifically for Chartered Accountants, Tax Practitioners, and Audit Firms in India.

Build only:

- Multi-tenant firm onboarding & 5-step profile setup wizard
- Home cockpit with 4 tabs: live punch-in attendance hub, weekly timesheet calendar matrix (12 PM - 11 PM), sales financial dashboard, auto-saving quick notes scratchpad
- Slide-over user profile & firm utility drawer
- User Profile & Member Portal (7 tabs: Profile details, personal expense reimbursements, assigned tasks, assigned clients, employee KYC documents, 30-module RBAC permission matrix, interactive organization hierarchy tree canvas)
- Leads Management engine (6 KPI cards, 13-column table, dynamic filter bar with dual sliders, 5-section Add Lead modal with live GSTIN verification, CSV batch import/export)
- Client Master & Entity Directory (4 KPI cards, 13-column table, Add Client form with GSTIN verify, 24-column official XLSX import/export, Client Groups, Multi-state GSTINs)
- Services Catalog & Master Repository (6 KPI cards, 12-column table, Add Service modal with SAC codes/TAT/OOP budget, 3-sheet XLSX template with 18 columns, sub-task checklists)
- Task & Statutory Compliance Engine (5 sub-tabs: Task Summary Matrix with Logarithmic Heatmap, Task List with 10 KPI cards and Filter Drawer, Sub-Tasks pipeline, Recurring Compliance Schedules, and 12 Analytics MIS Reports, Add Task modal with 1-click Proforma Invoice linking, 30-day activity audit drawer)
- Invoice, Billing & Receipts Engine (6 sub-tabs: Proforma Invoices, Tax Invoices, Pass-Through Reimbursements, Payment Receipts with TDS 194J, Recurring Retainerships, Sales Analytics & GSTR-1 Outward Supplies Report with Tables 4/7/8/12)
- Team & Staff Management Module (4 sub-tabs: Team Directory with 1/5 Seats Used license tracker, Geofenced GPS attendance with regularization, Leave tracking for CA exam study leaves, Internal employee expense claims, 4-step Add Employee onboarding wizard)
- Reports Executive MIS Analytics Hub (6-card MIS grid: Team/Stipend, Tasks, Sales, DSC Register, Licenses, Others/ADT-1/Profitability)
- Statutory Registry & DSC Physical Vault (9 KPI cards with 30d/15d expiry alerts, 12-column DSC table with physical drawer bin storage tracking, Class 3 certificates, vendor directory, client statutory licenses)
- Clerk multi-tenant organization authentication & RBAC session management
- Supabase persistence & storage buckets for KYC/receipt attachments

Do not overbuild.

---

# 2. Workflow

For every implementation request:

1. Read `AGENTS.md` , `doc.md` ,`ui_doc.md` and `role.md`.
2. Read the skills explicitly mentioned by the user.
3. Read clearly needed supporting skills from the approved skill list (`.agents/skills/`).
4. Inspect relevant code, database schema, and `doc.md` specifications & screenshot references.
5. Ask a focused question only if the task has meaningful ambiguity.
6. Create a detailed prompt file in `prompts/`.
7. Ask: `I prepared the implementation prompt at prompts/<file-name>.md. Is this good to execute?`
8. On approval, re-read the approved prompt file in `prompts/` and implement it strictly. Implement only after user approval.
9. Run available checks (`typecheck`, `lint`, `build`).
10. Share exact steps to test or run the completed feature.

Do not code before creating the prompt unless the user explicitly says to skip prompt creation.

---

# 3. Skills

Use only these skills:

- `.agents/skills/clerk`: Multi-tenant organization authentication, user roles, session management, protected routes.
- `.agents/skills/supabase`: PostgreSQL schema, migrations, queries, service role usage, RLS policies, storage buckets.
- `.agents/skills/ai-sdk`: Vercel AI SDK and OpenAI provider usage, tax notice OCR reading, draft emails, document summarization.

Use them for:

- `node_modules/next/dist/docs/`: Next.js App Router, routing, server/client boundaries, API routes, Server Actions, UI patterns.
- `clerk`: Multi-tenant firm auth and role-based permissions.
- `supabase`: Schema migrations, indexing, relational queries, file storage for KYC/receipts.
- `ai-sdk`: LLM model calls for notice processing and automated summaries.

Do not invent new skills.

For shadcn/ui, Tailwind CSS, Zod, and Excel/Spreadsheet handling (`xlsx`/`exceljs`), use existing project patterns, package docs, and `node_modules/next/dist/docs/`.

## Mandatory Skill Enforcement & Zero Assumptions Rule

- **No Assumptions**: Never assume API patterns, component names, hook signatures, or library conventions from general training memory.
- **Mandatory Verification**: Before writing or modifying any code for Clerk, Supabase, or AI SDK, strictly read and cross-reference the exact APIs, components, and breaking change notices documented in `.agents/skills/<skill-name>`.
- **Strict Implementation**: Every imported symbol, hook, function signature, and configuration property must match the installed SDK version and project skills verbatim.

---

# 4. Prompt Files

Prompt files live in the `prompts/` directory. Use names like:

- `prompts/firm-onboarding-stepper.md`
- `prompts/home-attendance-and-punchin.md`
- `prompts/home-weekly-timesheet-matrix.md`
- `prompts/profile-details-and-rbac-matrix.md`
- `prompts/leads-pipeline-and-gst-verify.md`
- `prompts/client-master-and-xlsx-import.md`
- `prompts/services-catalog-and-recurrence.md`
- `prompts/task-summary-matrix-and-heatmap.md`
- `prompts/task-12-mis-reports.md`
- `prompts/invoice-proforma-and-tax-tables.md`
- `prompts/invoice-gstr1-outward-report.md`
- `prompts/team-directory-and-seat-tracker.md`
- `prompts/team-geofenced-attendance.md`
- `prompts/reports-executive-mis-grid.md`
- `prompts/registry-dsc-physical-vault.md`

Each prompt must include:

- **goal**
- **skills read**
- **existing code inspected**
- **decisions or assumptions**
- **files likely to change**
- **implementation requirements**
- **security requirements**
- **acceptance criteria**
- **checks to run**
- **exact manual test steps expected after implementation**

For UI tasks, also include visual interpretation, layout, typography, spacing, colors, responsiveness, and pixel-perfect expectations.

---

# 5. Architecture

Keep these layers strictly separate:

- **Website / UI Layer**: Server Components, interactive client components (shadcn/ui tables, dual-range sliders, modal forms, slide-over drawers, weekly calendar matrix, org tree canvas).
- **Action & API Layer**: Thin Server Actions and Route Handlers with Zod request validation and Clerk session checks.
- **Domain & Service Layer**:
  - GSTIN live verification service
  - Timesheet labor costing engine (`cost_per_hour` vs `billing_rate`)
  - Statutory compliance due-date & recurrence scheduler
  - Invoice tax calculation engine (CGST 9%, SGST 9%, IGST 18%, pass-through non-GST reimbursements)
  - GSTR-1 Outward Supplies aggregator (Tables 4, 7, 8, 12)
  - Logarithmic task heatmap severity calculation
  - Geofenced GPS attendance radius validator
  - ICAI article trainee stipend calculation engine
  - DSC 30d/15d expiry warning pipeline
  - 30-module RBAC permissions enforcement engine
- **Database Layer**: Supabase PostgreSQL tables, foreign key constraints, RLS policies, storage buckets.

UI components must display stored data and invoke thin Server Actions only.
UI must never perform direct unvalidated database mutations or bypass RBAC permissions.

---

# 6. Tech Stack

Use:

- Next.js (App Router, React Server Components)
- TypeScript (strict mode, zero `any`)
- Clerk (Multi-tenant organizations, roles, session tokens)
- Supabase (PostgreSQL database, Row-Level Security, Storage Buckets)
- Tailwind CSS & Lucide React Icons
- shadcn/ui (Radix UI primitives, Dual-range Slider, Modal Dialogs, Data Tables, Slide-over Sheets)
- `@xyflow/react` / `reactflow` (for interactive Org Chart hierarchy canvas)
- `xlsx` / `exceljs` (for Client and Service spreadsheet import/export)
- Vercel AI SDK & OpenAI provider (for tax notice OCR & AI assistants)
- Zod (input validation)
- date-fns (date math and FY calendar calculations)
- Recharts (sales charts, MIS reports, timesheet visualizations)

Do not use:

- Supabase Auth (use Clerk for authentication)
- Local JSON app storage
- A separate external backend framework

---

# 7. Supabase Source of Truth

Supabase is the single source of truth for all application data.

Core tables:

- `firms`
- `firm_users`
- `user_documents`
- `clients`
- `client_gstins`
- `client_contacts`
- `client_licenses`
- `services_master`
- `compliance_tasks`
- `task_subtasks`
- `task_activities`
- `invoices`
- `invoice_items`
- `client_reimbursements`
- `payment_receipts`
- `recurring_invoices`
- `leads`
- `attendance_logs`
- `leave_applications`
- `leave_balances`
- `employee_expense_claims`
- `dsc_register`
- `auditor_appointments_adt1`
- `timesheet_entries`
- `quick_notes`

When any field is added or changed, update `supabase/schema.sql`, `lib/supabase/types.ts`, and run the corresponding ALTER SQL in Supabase Dashboard → SQL Editor before testing.

---

# 8. Multi-Tenant Firm Onboarding & Setup

When a user signs up with Clerk, they initialize a firm workspace:

- Track onboarding completion across 5 steps: `1. Organization profile` ➔ `2. Bank Account` ➔ `3. Invoice` ➔ `4. Business Hours` ➔ `5. Integration`.
- Organization profile captures business entity, brand name, legal name, PAN, GSTIN, CIN/LLPIN, TAN, Udyam, PT, PF, ESIC, LUT details, and address.
- Maintain `onboarding_step` and `onboarding_completed` in `firms`.
- Render the 0% - 100% progress gauge banner on the Home dashboard until all 5 steps are completed.

---

# 9. Leads Management & GSTIN Verification Engine

The Leads module manages prospect inquiries and conversions:

- **6 KPI Metric Cards**: `Open`, `Converted`, `Lost`, `Total leads`, `Not Yet Converted Deal Value`, `Conversion Rate`.
- **13-Column Table**: Checkbox, `Lead Name`, `Business Entity`, `Deal Value`, `Stage`, `Status`, `Score` (0-100), `Assigned To`, `Source`, `Created Date`, `Phone`, `Email`, `Actions`.
- **Dynamic Filter Bar**: Dropdowns for Stage, Status, Assignee, Source, Entity Type + Dual-thumb range sliders for Deal Value (`₹0-₹100L`) and Lead Score (`0-100`).
- **Add Lead Modal**: 5 sections with **Live GSTIN Verification** that auto-fetches trade name, legal name, and address.
- **Conversion Workflow**: 1-click conversion from qualified Lead directly into an active `clients` record.

---

# 10. Client Master & Entity Directory

The foundational directory of the CA practice:

- **4 KPI Metric Cards**: `Total Clients`, `New Clients this month`, `Active Clients 90 days`, `No Activity 90 days`.
- **13-Column Table**: Checkbox, `Client Code`, `Trade Name`, `Legal Name`, `Business Entity`, `PAN`, `Primary GSTIN`, `Assigned Partner`, `Assigned Manager`, `Phone`, `Email`, `Status`, `Actions`.
- **Add Client Form**: Business info, Place of Supply, multi-branch GSTINs, and live GSTIN verification.
- **Official Import/Export**: Strict 24-column structure matching `Clients_03-09-2026.xlsx` with validation rules for required fields.
- **Multi-Entity Support**: Link parent groups, subsidiaries, and directors under unified client groups.

---

# 11. Services Catalog & Recurrence Engine

Defines the firm's master service menu:

- **6 KPI Metric Cards**: `Active`, `Recurring`, `Non-Recurring`, `Default Services`, `Inactive`, `Total Services`.
- **12-Column Table**: Checkbox, `Service Code`, `Service Name`, `Category`, `SAC Code`, `Billing Type`, `Base Fee`, `Estimated Hours`, `TAT (Days)`, `Recurrence Frequency`, `Status`, `Actions`.
- **Add Service Modal**: Commercial configuration with SAC codes (9982xx), default fee, GST rate (18%), TAT, OOP budget, recurrence schedule.
- **Official Import Template**: 3-sheet workbook matching `Service_SampleData.xlsx` (`Services`, `Instructions`, `MasterData`) with 18 columns.
- **Checklist Templates**: Pre-configured sub-task checklists and client document request lists.

---

# 12. Task & Compliance Management Engine

The central statutory operations engine:

- **5 Sub-Tabs**:
  1. `Task Summary`: 8 grouping dimensions (Status, Stage, Assignee, Client, Service, Department, Priority, Due Period) + Logarithmic Heatmap severity popover (Red/Amber = Overdue, Blue = WIP, Green = Done).
  2. `Task List`: 10 status KPI cards, 14-column table, slide-over filter drawer with colored status dots and priority filters.
  3. `Sub Tasks`: 10-column checklist verification pipeline.
  4. `Recurring Schedule`: 5 recurrence KPI cards + FY calendar navigator across Apr-Mar.
  5. `Analytics`: 12 Management MIS reports including Timesheet Report and Pending Aging with 6 buckets (`>60d`, `31-60d`, `15-30d`, `7-14d`, `<7d`, `Total Pending`).
- **Add Task Modal**: Multi-field task creation with 1-click `Create Proforma Invoice for this Task` checkbox.
- **Activity Log Drawer**: 30-day immutable event audit trail.

---

# 13. Invoicing, Pass-Through Reimbursements & GSTR-1 Engine

Governs billing and GST compliance:

- **6 Sub-Tabs**:
  1. `Proforma Invoice`: 4 KPI cards, 13-column table, 1-click **Convert to Tax Invoice**.
  2. `Invoice (Tax Invoices)`: 4 KPI cards, 13-column table with SAC codes, taxable value, CGST/SGST/IGST breakdown, payment status.
  3. `Reimbursement`: Pass-through non-GST client expenses (ROC challans, court fees, travel) billed at cost.
  4. `Receipts`: Payment receipts, TDS 194J deduction tracking, UTR numbers.
  5. `Recurring Invoice`: Retainership automation schedules.
  6. `Sales Analytics`: 13 sales reports + **GSTR-1 Outward Supplies Report** (5 tax stat cards, Tables 4, 7, 8, and 12 HSN/SAC summary).
- **Add Invoice Screen**: Firm billing entity, Client selector, Line items for Services (18% GST) and Reimbursements (0% GST), Bank payment instructions with UPI QR code.

---

# 14. Team Directory, License Seats & Geofenced Attendance

Governs staff HR and attendance:

- **4 Sub-Tabs**:
  1. `Team`: 4 KPI cards (`Active Users`, `Deactivated Users`, `Resigned Users`, **`Seats Used / Total`** e.g. `1 / 5` subscription capacity tracker), 11-column Users table.
  2. `Attendance`: 4 view modes (`Today's Attendance`, `Weekly`, `Monthly`, `Regularization`), GPS distance radius tracking in meters, client audit site logging.
  3. `Leave`: All applications & summary balance ledger, CA exam study leave classification under ICAI rules, approval workflows.
  4. `Reimbursement`: Internal staff expense claims with receipt attachments.
- **Add Employee 4-Step Stepper Wizard**:
  - `Step 1: Employment Details`: First/Last Name, Email, Mobile (`IN +91`), Designation, Role, Department, Reporting To, Shift, Employee ID, Joining Date, Salary, `Cost Per Hour`, `Billing Rate`, Work Experience, Status, Confirmation Date.
  - `Step 2: Personal Details`: DOB, Gender, PAN, Aadhaar, Emergency Contact, ICAI Membership No / Student Reg No.
  - `Step 3: Address`: Current & Permanent Address, City, State, Pin Code.
  - `Step 4: Role Permissions`: Granular RBAC permissions.

---

# 15. Reports Executive MIS Hub & Stipend Engine

High-level business intelligence in a 6-category 3x2 grid:

1. `Team`: Attendance, Timesheet, Performance, **`Employee Stipend`** (Article trainee stipend calculation based on ICAI minimum stipend regulations).
2. `Tasks`: Client, User, Services, Task Billing, Task Report.
3. `Sales`: Master Sales, Sales By Client, Payment Received, Receivable, Revenue By User, Proposal, Reimbursement.
4. `DSC Register`: Active, Expired, Location - At Office, Location - With client.
5. `Licenses`: Active, Expired.
6. `Others`: **`ADT 1 Report`** (Auditor Appointment Section 139 Form ADT-1 tracker), Profitability Report, SLA Retainer Fee Report.

---

# 16. Statutory Registry & DSC Physical Vault

Manages physical cryptographic USB tokens (ePass2003, ProxKey) for MCA, Income Tax, and GST filings:

- **9 Metric KPI Cards**: `Total DSC`, `Active`, `Exp. in 30d`, `Exp. in 15d`, `Expired`, `CA Office`, `CS Office`, `Client Office`, `Missing`.
- **12-Column Table**: Checkbox, `DSC ID`, `Business Name`, `Legal Name`, `Name` (Signatory), `Issued Date`, `Expiry Date`, `Location`, `Status`, `Bin Number` (Vault storage drawer e.g. `BIN-A12`), `Vendor` (eMudhra, Capricorn, VSign, Pantasign), `Class` (`Class 3`), `Email`.
- **Automated Alerts**: Triggers notifications at 30 days and 15 days before token expiration.
- **Client Statutory Licenses**: Tracks FSSAI, IEC, Trade, Shop & Establishment registrations with renewal alerts.

---

# 17. User Profile, Member Portal & 30-Module RBAC Matrix

Personal practitioner portal:

- **7 Sub-Tabs**:
  1. `Profile Details`: Personal bio, employment info, payroll rates, monthly attendance calendar with colored status badges (Present, Absent, Holiday, Week-off), leave summary, holiday list.
  2. `Reimbursement`: Personal staff expense claims (`+ Apply`).
  3. `Tasks`: Personal task workbench with `Re-Assign` action.
  4. `Clients`: Assigned client portfolio with `Re-Assign` action.
  5. `Documents`: Employee KYC vault (Aadhaar, PAN, Form 102/103 articleship deeds).
  6. `Permissions`: **30-Module Granular RBAC Matrix** across 5 action checkboxes (`View`, `Add/Edit`, `Delete`, `Import`, `Export`).
  7. `Organization`: Interactive reporting hierarchy tree canvas.

---

# 18. API Route & Security Rules

All action routes that perform mutations or dispatch statutory operations must require authentication and RBAC validation:

- Use `POST` for actions that start or mutate work (`/api/tasks`, `/api/invoices`, `/api/clients`, `/api/leads/convert`).
- Use `GET` only for read and status routes (`/api/reports`, `/api/logs`, `/api/dsc`).
- Reject missing or invalid sessions with `401 Unauthorized`.
- Enforce firm tenant isolation: every database query must filter by `firm_id`.

---

# 19. Testing Output After Implementation

After completing any feature or module:

1. Always share exact manual test steps with URLs, sample inputs, and expected outcomes.
2. Provide curl commands for API routes with headers and JSON payloads.
3. Instruct the user to verify database state in Supabase and check browser console/terminal logs.

---

# 20. Security, Code Standards & Final Rules

Never expose to browser code:

- Supabase service role key
- Clerk secret key
- Sensitive client tax portal credentials or encrypted DSC PINs

Keep this environment variable table synchronized:

| Variable                            | Purpose                                                  | Exposure        |
| ----------------------------------- | -------------------------------------------------------- | --------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key                                    | Client + Server |
| `CLERK_SECRET_KEY`                  | Clerk server-side key                                    | Server only     |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL                                     | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase anon key                                        | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY`         | Service role administrative access                       | Server only     |
| `APP_ENCRYPTION_KEY`                | Symmetric encryption key for portal passwords & DSC PINs | Server only     |

Code Standards:

- Use TypeScript with strict mode (no `any`).
- Follow Server Component / Client Component boundaries.
- Never filter joined Supabase tables with `.eq('foreignTable.column', value)` — fetch joined data and filter in JS.
- Avoid unrequested refactors and feature creep.

---

# 21. Commands and Checks

Run available checks from the project root and report the results:

- `npm run typecheck` — TypeScript type validation (`tsc --noEmit`)
- `npm run lint` — ESLint validation
- `npm run build` — Next.js production build check

Development:

- `npm run dev` — Start the Next.js development server

Always report exact command output; do not claim a check passed without running it.
agy --conversation=34ceb8c3-6b13-4566-afb6-b7d45fb03ed6
