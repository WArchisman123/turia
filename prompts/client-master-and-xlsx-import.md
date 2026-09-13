# Implementation Prompt: 5. Client Master & Entity Directory

## Goal
Implement the comprehensive, production-grade **Client Master & Entity Directory** module for **TURIA** at `/clients`. This foundational directory of the CA practice manages corporate entities, LLPs, proprietorships, trusts, and HNIs with:
- **4 Top KPI Metric Cards**: `Total Clients`, `New Clients this month`, `Active Clients 90 days`, `No Activity 90 days` matching `Clients-1.png`.
- **13-Column Responsive Table**: Checkbox, `Client ID / Code`, `Business Name / Trade Name`, `Legal Name`, `Contact Name`, `Mobile No`, `Business Entity`, `Services`, `Employee List / Assigned Manager`, `Groups`, `Auditor / Associate Partner`, `Labels`, `Status / Created On`, and `Actions` with column headers and dropdown menus matching `Clients-1.png`.
- **Add Client Modal / Form**: 2-pane form matching `client-New.png` featuring `Business Info` (Business Entity, Business Name, Legal Name, Client ID, Referred By, Source, Currency, Client Creation Date) and `GST & Address` with live GSTIN verification, Place of Supply selection, multi-state GSTINs, and Key Contacts/Directors.
- **Official 24-Column XLSX/CSV Import & Export Engine**: Strict adherence to the 24-column structure matching `Clients_03-09-2026.xlsx` (`Client ID`, `Business Name`, `Legal Name`, `Contact Name`, `Email`, `Mobile No`, `Created On`, `Business PAN`, `Registration No`, `Business Entity`, `Currency`, `GSTIN`, `Place Of Supply`, `Address Line 1`, `Address Line 2`, `City`, `State`, `Country`, `Pin code`, `Status`, `Services`, `Employee List`, `Groups`, `Associate Partners`).
- **Multi-Entity & Group Support**: Unified grouping of parent companies, subsidiaries, branch entities, and authorized directors.
- **Client 360 Slide-over Drawer**: Detail inspection drawer showing GSTINs, contacts, group affiliations, assigned practitioners, and active compliance tasks.

---

## Skills Read
- `.agents/skills/clerk/SKILL.md`: Multi-tenant organization authentication, firm isolation, session tokens, user roles.
- `.agents/skills/supabase/SKILL.md`: PostgreSQL schema, Supabase service-role client, RLS policies, indexed queries.

---

## Existing Code Inspected
- `AGENTS.md`: Product requirements for Section 10 (Client Master & Entity Directory), architecture rules, and tech stack constraints.
- `contextImg/Clients-1.png`: Main client table view, 4 KPI cards, top bar action buttons, search bar, and 13 column headers.
- `contextImg/client-New.png`: Add Client modal layout with `Business Info` and `GST & Address` sections.
- `contextImg/clients-3 dots click.png`: 3-dots action menu (`Import Clients`, `Import Contacts`, `Export Clients`, `Export Contacts`).
- `contextImg/clients-Import clients.png`: Import clients drag-and-drop zone with `Download Sample` and `Import` buttons.
- `contextImg/Clients_03-09-2026.xlsx`: Inspected official 24-column headers and sheet structure.
- `supabase/schema.sql`: `clients`, `client_gstins`, `client_contacts`, `client_licenses` tables and RLS policies.
- `lib/supabase/types.ts`: Database types definition.
- `lib/supabase/server.ts`: Multi-tenant context extraction (`getTenantContext()`, `createAdminClient()`).
- `lib/gst/verifier.ts`: Live GSTIN validation and details extraction service.
- `app/leads/page.tsx` & `components/leads/*`: Reference patterns for KPI cards, action menus, modals, and API communication.

---

## Decisions & Assumptions
1. **Spreadsheet Engine**: Use `xlsx` (SheetJS) to read and generate real Excel `.xlsx` binary files matching the exact 24-column layout of `Clients_03-09-2026.xlsx` as well as CSV format.
2. **Schema Enrichment**: Extend the `clients` table with additional columns (`contact_name`, `currency`, `place_of_supply`, `address_line_1`, `address_line_2`, `city`, `state`, `country`, `pin_code`, `referred_by`, `source`, `client_group`, `auditor`, `labels`, `services`, `associate_partners`, `registration_no`) so that all 24 columns from the Excel file and Add Client form are persisted seamlessly.
3. **Tenant Isolation**: Every database query must filter by `firm_id` extracted from the authenticated Clerk session context.
4. **Optimistic UI with Resilience**: Client state updates immediately in the UI on create/edit/delete, while backing APIs persist to Supabase asynchronously with toast feedback.
5. **Sample Template Download**: Provide real `.xlsx` and `.csv` sample template generation with headers and example data for user onboarding.

---

## Files Likely to Change & Created

### 1. Database & Types
- `supabase/schema.sql`: Update `clients` table schema with all 24 required fields, indexes, and RLS policies.
- `lib/supabase/types.ts`: Synchronize TypeScript database definitions for `clients`, `client_gstins`, and `client_contacts`.

### 2. Client Types & Services
- `components/clients/types.ts`: TypeScript interfaces for `ClientItem`, `ClientFormData`, `ClientFilterState`, `ClientKpiData`, `ClientGstin`, `ClientContact`, and `OfficialClientXlsxRow` (24 columns).
- `lib/api/clients.ts`: Client-side service methods (`fetchClients`, `createClient`, `updateClient`, `deleteClient`, `importClientsXlsx`, `exportClientsXlsx`, `downloadClientSampleTemplate`).

### 3. Backend API Routes
- `app/api/clients/route.ts`: GET (fetch all firm clients with KPI calculations) & POST (create client with primary GSTIN and key contact).
- `app/api/clients/[id]/route.ts`: GET (single client details), PATCH (update client), DELETE (delete client).
- `app/api/clients/import/route.ts`: POST (parse and batch upsert 24-column `.xlsx` / `.csv` rows).
- `app/api/clients/export/route.ts`: GET (generate and stream 24-column `TURIA_Clients_Master_<date>.xlsx`).
- `app/api/clients/template/route.ts`: GET (generate and stream `Clients_Sample_Template.xlsx`).

### 4. UI Components (`components/clients/`)
- `components/clients/client-kpi-strip.tsx`: 4 KPI Metric Cards (`Total Clients`, `New Clients this month`, `Active Clients 90 days`, `No Activity 90 days`).
- `components/clients/clients-table.tsx`: 13-column interactive data table with sorting, search highlighting, status badges, multi-select checkboxes, 3-dot column headers, row actions, and pagination.
- `components/clients/add-client-modal.tsx`: 2-pane modal matching `client-New.png` with `Business Info`, `GST & Address` (with Live GSTIN Verify button), Multi-branch GSTINs, Key Contacts, and Group Linking.
- `components/clients/import-clients-modal.tsx`: Drag-and-drop file upload modal matching `clients-Import clients.png` with `.xlsx`/`.csv` parsing, validation preview, and sample download.
- `components/clients/client-detail-drawer.tsx`: Slide-over detail drawer for 360° client inspection.

### 5. Main Route
- `app/clients/page.tsx`: Complete page with AppShell, header, search bar, Add Client button, 3-dots actions menu, KPI metrics strip, and data table.

---

## Implementation Requirements

### 1. KPI Cards (4 Cards)
- **Card 1 (Total Clients)**: Count of all registered clients in the firm with purple user icon container.
- **Card 2 (New Clients this month)**: Clients created in current calendar month with blue user-plus icon container.
- **Card 3 (Active Clients 90 days)**: Clients with active compliance tasks, invoices, or activity within last 90 days with emerald user-check icon.
- **Card 4 (No Activity 90 days)**: Clients with zero task or invoice activity in 90+ days with amber alert icon.

### 2. Main Table (13 Columns matching screenshot `Clients-1.png`)
- Column 1: Checkbox (Select all / individual selection)
- Column 2: `Client ID` (e.g. `ACM-001`, `REL-002`)
- Column 3: `Business Name` (Trade name with avatar/badge)
- Column 4: `Legal Name` (Registered entity name)
- Column 5: `Contact Name` (Primary director / signatory)
- Column 6: `Mobile No` (Formatted mobile number `+91 XXXXX XXXXX`)
- Column 7: `Business Entity` (Private Limited, LLP, Sole Prop, etc.)
- Column 8: `Services` (Pill badges for active services like `Statutory Audit`, `GST`, `TDS`)
- Column 9: `Employee List` (Assigned Partner / Manager with avatar pills)
- Column 10: `Groups` (Parent client group badge e.g. `Tata Group`, `Reliance Entities`)
- Column 11: `Auditor` (Appointed Statutory Auditor / Associate Partner)
- Column 12: `Labels` (Tags like `Corporate`, `High-Volume`, `Retainer`)
- Column 13: `Created On / Actions` (Date formatted `DD/MM/YYYY` + 3-dots row menu for Edit, View 360, Add Task, Create Invoice, Delete)

### 3. Add Client Form (matching `client-New.png`)
- **Breadcrumb Navigation**: `< Clients > Add Client`
- **Section 1: Business Info**:
  - `Business Entity *` (Dropdown: `Private Limited Company`, `Public Limited Company`, `Limited Liability Partnership (LLP)`, `Partnership Firm`, `Sole Proprietorship`, `Trust / Society`, `HUF`, `Foreign Entity`)
  - `Business Name *` (Trade Name)
  - `Legal Name *` (Full Legal Registered Name)
  - `Client ID` (Auto-generated prefix e.g. `CL-2026-001` or custom)
  - `Referred By` (Text)
  - `Source` (Dropdown: `Referral`, `Website`, `LinkedIn`, `Direct Walk-in`, `Bank Branch`, `Other`)
  - `Currency *` (Dropdown: `Rupees INR ₹`, `USD $`, `EUR €`, `GBP £`)
  - `Client Creation Date` (Date picker defaulting to today)
- **Section 2: GST & Address**:
  - **GST Details Panel**:
    - `GSTIN` (Input with live `Verify` button)
    - `Type` (Auto-populated: Regular, Composition, SEZ)
    - `Status` (Auto-populated: Active, Inactive, Suspended)
    - `GST Registration Date` (Auto-populated / editable)
    - `Last Updated` (Timestamp)
    - `Preference` (Filing frequency: Monthly / QRMP)
  - **Address Panel**:
    - `Place of Supply *` (Dropdown with all 36 Indian States & UTs with 2-digit GST state codes)
    - `Address Line 1`
    - `Address Line 2`
    - `City`
    - `Country *` (Default `India`)
    - `State` (Dropdown)
    - `Pincode` (6-digit PIN code)
- **Multi-Branch GSTINs & Contacts**:
  - Option to add secondary state GSTINs
  - Option to add Key Contacts (Name, Designation, Email, Phone, DIN)
- **Footer**: `Cancel` & `Save` buttons with full validation.

### 4. Official 24-Column Import & Export Engine
- **Import Modal (`clients-Import clients.png`)**:
  - Drag-and-drop zone supporting `.xlsx` and `.csv` files.
  - `Download Sample` button downloading the exact `Clients_03-09-2026.xlsx` template with all 24 columns and sample records.
  - Real-time client-side file reading with `xlsx` library, validating required columns (`Client ID`, `Business Name`, `Legal Name`, `Business Entity`, `Place Of Supply`).
  - Progress bar and import summary with inserted/skipped count.
- **3-Dots Top Menu (`clients-3 dots click.png`)**:
  - `Import Clients` -> Opens Import Modal
  - `Import Contacts` -> Bulk import key contact persons
  - `Export Clients` -> Downloads official 24-column `TURIA_Clients_Master_<date>.xlsx` workbook
  - `Export Contacts` -> Exports key contacts CSV

---

## Visual Design & Pixel-Perfect Specs
- **Colors**:
  - Primary Accent: Indigo (`#6366F1` / `bg-indigo-600`)
  - KPI Container Backgrounds: Purple (`bg-purple-50 text-purple-600`), Blue (`bg-sky-50 text-sky-600`), Emerald (`bg-emerald-50 text-emerald-600`), Amber (`bg-amber-50 text-amber-600`)
  - Borders: Neutral Slate (`border-slate-200`, `border-[#E2E8F0]`)
  - Backgrounds: Clean SaaS White (`bg-white`), Canvas (`bg-slate-50/50`)
- **Typography**: Inter / sans-serif with crisp font sizes (`text-xl font-bold`, `text-xs font-semibold`, `text-[11px] text-slate-500`).
- **Layout & Spacing**: 24px grid alignment, rounded-2xl cards with soft shadows (`shadow-2xs` / `shadow-sm`), responsive scrollable tables with sticky headers.

---

## Security Requirements
- All Server Actions and API route handlers (`/api/clients/*`) must verify the Clerk user session.
- Every Supabase query must enforce tenant isolation by querying only `firm_id = tenant.firmId`.
- No sensitive service keys exposed to browser clients.

---

## Acceptance Criteria
1. Navigating to `/clients` renders the complete Client Master cockpit with 4 KPI cards and 13-column table.
2. Clicking `+ Add` opens the 2-pane Add Client modal matching `client-New.png`.
3. Typing a GSTIN (e.g. `19AAACA1122B1Z4`) and clicking `Verify` fetches live GST details and auto-populates Trade Name, Legal Name, Entity Type, PAN, State, and Address.
4. Submitting the Add Client form creates the client in Supabase and immediately displays it in the table.
5. Clicking the 3-dots menu allows exporting all clients into the official 24-column `Clients_03-09-2026.xlsx` format.
6. Importing `Clients_03-09-2026.xlsx` via the Import Modal parses the 24 columns, creates client records in Supabase, and updates the table and KPI cards.
7. Search filters rows instantly across Client Code, Trade Name, Legal Name, PAN, GSTIN, and City.
8. TypeScript checks (`npm run typecheck`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps Expected After Implementation
1. **Navigate to `/clients`**: Verify 4 KPI cards show accurate totals.
2. **Search Bar**: Type "Acme" or "Reliance" to verify instant table filtering.
3. **Add Client Modal**:
   - Click `Add`.
   - Enter GSTIN `27AAACR9988C1Z6` and click `Verify`.
   - Verify trade name, legal name, PAN, and address are auto-populated.
   - Click `Save` and verify new client is in the table.
4. **Excel Export**:
   - Click the 3-dots menu -> `Export Clients`.
   - Verify downloaded `.xlsx` opens in Excel with all 24 columns populated accurately.
5. **Excel Import**:
   - Click 3-dots menu -> `Import Clients`.
   - Click `Download Sample` to download sample template.
   - Drag and drop the downloaded `.xlsx` or `Clients_03-09-2026.xlsx`.
   - Click `Import` and verify new records are created.
