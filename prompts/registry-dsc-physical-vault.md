# Implementation Prompt: Statutory Registry Module & DSC Physical Vault

## 1. Goal
Implement **Module 11: Statutory Registry Module & DSC Physical Vault** (`/registry`) for the TURIA CA Practice Management & Statutory Compliance SaaS Platform. This module manages physical cryptographic USB tokens (ePass2003, ProxKey, Watchdata, mToken) used for MCA ROC forms, Income Tax returns, and GST filings on behalf of client directors, tracks vault bin locations (e.g. `BIN-A12`), enforces 30-day and 15-day expiration alert countdowns, records token checkout custody transfers, and manages client statutory licenses (FSSAI, IEC, Trade, Shop & Establishment).

The visual design and layout strictly replicate the reference screenshot in `public/context/contextImg/registry-dsc.png`, aligning with the TURIA UI Design System in `public/context/contextDoc/ui_doc.md`.

---

## 2. Skills Read
- `.agents/skills/supabase`: PostgreSQL schema, RLS policies, multi-tenant queries, server-side admin client.
- `.agents/skills/clerk`: Multi-tenant organization authentication, user roles, session verification, tenant isolation.
- `AGENTS.md`, `public/context/contextDoc/doc.md`, `public/context/contextDoc/ui_doc.md`, `public/context/contextDoc/role.md`.

---

## 3. Existing Code Inspected
- `public/context/contextImg/registry-dsc.png`: Reference UI screenshot showing Topbar, 9 KPI cards, table controls, 12-column table header, empty state, and pagination.
- `components/layout/sidebar.tsx`: Already includes `{ label: "Registry", href: "/registry", icon: Shield }` (active route).
- `lib/rbac/types.ts` & `lib/rbac/matrix.ts`: `dsc` permission module already defined with role actions (`view`, `add_edit`, `delete`, `import`, `export`).
- `supabase/schema.sql`: Lines 605-645 define `dsc_register` table with `dsc_location_enum` and `dsc_status_enum`. Table needs migration verification in Supabase.
- `lib/supabase/types.ts`: Has `DSCLocation` and `DSCStatus` types; needs `dsc_register` and `client_licenses` table types in `Database['public']['Tables']`.
- `lib/supabase/server.ts`: Provides `getTenantContext()` and `createAdminClient()`.
- `app/api/clients/route.ts`: Pattern for tenant-isolated GET/POST route handlers.

---

## 4. Visual Interpretation & UI Design System
- **Layout Shell**: Wrapped in `<AppShell>` (`components/layout/app-shell.tsx`) with `<div className="space-y-4">`.
- **9 Metric KPI Metric Cards (Single Row / Grid)**:
  1. `Total DSC`: Indigo/Slate icon badge, total count.
  2. `Active`: Emerald check icon badge, green number.
  3. `Exp. in 30d`: Amber clock icon badge, warning count (expiring within 16-30 days).
  4. `Exp. in 15d`: Orange alert-triangle icon badge, urgent count (expiring within 15 days).
  5. `Expired`: Rose flame/alert icon badge, expired count (`expiry_date < today`).
  6. `CA Office`: Indigo building icon badge, tokens in firm office custody.
  7. `CS Office`: Amber building-2 icon badge, tokens in Company Secretary custody.
  8. `Client Office`: Emerald user/contact icon badge, tokens in client director custody.
  9. `Missing`: Rose alert-octagon icon badge, missing/untraceable tokens.
  *Interactive Behavior*: Clicking any KPI card toggles an active filter state on the table below.
- **Section Controls & Actions Bar**:
  - Heading: `Digital Signature (<count>)` (`text-base font-bold text-slate-900`).
  - Search Input: `🔍 Search name, ID, role...` with quick clear icon (`text-xs`).
  - `Group ⌄` dropdown: Group by Location, Status, Vendor, Class, or None.
  - `Filters` button: Opens slide-over drawer / filter menu with multi-criteria badges.
  - `History` / Audit icon button: Opens Activity Log drawer for token movements.
  - `+ Add` button: `#6366F1` (indigo-600) primary button with plus icon.
  - More actions `⋮`: Export to Excel (`.xlsx`), Refresh data.
- **12-Column Table Structure**:
  - `[ ]` Checkbox (Multi-select)
  - `DSC ID`: Monospace font `font-mono text-[10px] text-slate-500` with copy badge.
  - `Business Name`: Bold client trade name.
  - `Legal Name`: Subdued client legal entity name.
  - `Name`: Signatory / Director full name.
  - `Issued Date`: Date formatted `DD/MM/YYYY`.
  - `Expiry Date`: Date formatted `DD/MM/YYYY` with warning badge if expiring soon.
  - `Location`: Soft pill badge (`CA Office` in blue/indigo, `CS Office` in amber, `Client Office` in emerald, `Missing` in rose, `In Transit` in purple).
  - `Status`: Soft pill badge (`Active` in emerald, `Expired` in rose, `Revoked` in slate).
  - `Bin Number`: Vault bin badge e.g. `BIN-A12` (`bg-slate-100 font-mono text-[10px] text-slate-700`).
  - `Vendor`: Brand badge (`eMudhra`, `Capricorn`, `VSign`, `Pantasign`).
  - `Class`: `Class 3` / `Class 2`.
  - `Email`: Director email with mailto link.
  - `Actions`: `⋮` dropdown for Edit, Transfer Custody / Move Bin, Mark Missing, Delete.
- **Sub-Tabs**:
  - Sub-tab 1: `Digital Signatures (Vault)` (Default view matching screenshot)
  - Sub-tab 2: `Client Statutory Licenses` (FSSAI, IEC, Trade, Shop & Establishment licenses with expiry countdowns)
  - Sub-tab 3: `Vault Bin Map` (Visual bin drawer grid overview: Drawer A, Drawer B, Drawer C)

---

## 5. Files Likely to Change & Files to Create
### New Files:
1. `app/registry/page.tsx` — Main Registry page with sub-tabs, KPI cards, table, and drawers.
2. `components/registry/types.ts` — TypeScript interfaces for DSC records, KPIs, filters, audit logs, and licenses.
3. `components/registry/dsc-kpi-strip.tsx` — 9-card KPI component with live counts and active filter highlights.
4. `components/registry/dsc-table.tsx` — 12-column interactive table with sorting, grouping, selection, and row actions.
5. `components/registry/add-dsc-modal.tsx` — Modal form to register new DSC with client linking and bin allocation.
6. `components/registry/transfer-custody-modal.tsx` — Modal/drawer for checking out or moving token location and bin.
7. `components/registry/dsc-filter-drawer.tsx` — Slide-over filter drawer.
8. `components/registry/dsc-activity-drawer.tsx` — Slide-over activity log drawer for physical token movements.
9. `components/registry/statutory-licenses-tab.tsx` — Sub-tab for FSSAI, IEC, Trade licenses.
10. `components/registry/vault-bin-map.tsx` — Visual grid representation of the physical vault bins.
11. `lib/api/registry.ts` — Client-side API fetching and mutation functions.
12. `app/api/registry/route.ts` — Route handler for GET (listing DSCs & KPIs) and POST (creating DSC).
13. `app/api/registry/[id]/route.ts` — Route handler for PATCH (updates & location transfer) and DELETE.
14. `app/api/registry/activity/route.ts` — Route handler for logging and fetching token movements.
15. `app/api/registry/licenses/route.ts` — Route handler for client statutory licenses.

### Modified Files:
1. `lib/supabase/types.ts` — Add `dsc_register` and `client_licenses` table typings.
2. `lib/supabase/seeder.ts` — Add realistic DSC seed data for CA firms with diverse statuses, upcoming expiries, and vault bins.
3. `supabase/schema.sql` — Ensure `dsc_register` and token movement table schema, indexes, and RLS policies are up-to-date.

---

## 6. Implementation Requirements
### A. Database Layer
- Table `dsc_register` with columns:
  - `id` (UUID PK)
  - `firm_id` (UUID FK to firms)
  - `client_id` (UUID FK to clients, nullable)
  - `dsc_code` (VARCHAR e.g. `DSC-1001`)
  - `business_name` (VARCHAR)
  - `legal_name` (VARCHAR)
  - `signatory_name` (VARCHAR)
  - `pan_number` (VARCHAR(10))
  - `din_number` (VARCHAR(8))
  - `vendor` (VARCHAR default `eMudhra`)
  - `dsc_class` (VARCHAR default `Class 3`)
  - `issued_date` (DATE)
  - `expiry_date` (DATE)
  - `location` (`ca_office`, `cs_office`, `client_office`, `in_transit`, `missing`)
  - `bin_number` (VARCHAR e.g. `BIN-A12`)
  - `status` (`active`, `expired`, `revoked`)
  - `email` (VARCHAR)
  - `phone` (VARCHAR)
  - `token_pin_encrypted` (TEXT)
  - `token_hardware_model` (VARCHAR e.g. `ePass2003`, `ProxKey`)
  - `notes` (TEXT)
  - `created_at`, `updated_at`
- Table `dsc_movement_logs` for immutable custody tracking:
  - `id`, `firm_id`, `dsc_id`, `from_location`, `to_location`, `from_bin`, `to_bin`, `handed_to`, `reason`, `logged_by`, `created_at`.
- Enable RLS on all tables with tenant isolation.

### B. Business & Service Logic
- **Expiry Calculations**:
  - Days until expiry: `Math.ceil((new Date(expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))`.
  - `Exp. in 15d`: `0 <= daysUntilExpiry && daysUntilExpiry <= 15`.
  - `Exp. in 30d`: `0 <= daysUntilExpiry && daysUntilExpiry <= 30`.
  - `Expired`: `daysUntilExpiry < 0 || status === 'expired'`.
- **Location Status**:
  - Automatically track physical custody across `CA Office`, `CS Office`, `Client Office`, `In Transit`, and `Missing`.
- **Excel Export**:
  - Single-click export of the full or filtered DSC Register to `.xlsx` using the installed `xlsx` package with proper column widths and headers.

### C. RBAC Permissions Enforcement
- Protect routes and mutations using `checkPermission("dsc", action)`.
- Restrict token PIN visibility to Authorized Managers and Partners.
- Allow Article Trainees and Associates to update location and bin numbers (`add_edit`).
- Restrict DSC deletion to `admin` and `partner`.

---

## 7. Security Requirements
- All database queries must enforce `firm_id = tenant.firmId`.
- Sensitive token PINs are never sent in plaintext logs.
- Client requests validate Clerk session using `getTenantContext()`. Reject unauthenticated requests with `401 Unauthorized`.

---

## 8. Acceptance Criteria
1. `/registry` loads seamlessly inside `<AppShell>` with matching sidebar active highlight.
2. All 9 KPI cards show accurate computed values from the database.
3. Clicking any KPI card instantly filters the table to match that category.
4. The 12-column table renders all required columns with copyable DSC IDs, colored status/location badges, and bin numbers.
5. Search bar filters records in real-time across signatory name, DSC code, business name, and email.
6. The `+ Add` modal successfully validates and inserts a new DSC record linked to an existing client or ad-hoc signatory.
7. Custody transfer modal allows moving token between locations (`CA Office`, `CS Office`, `Client Office`) and updating Bin numbers.
8. Activity log drawer records custody transfers and shows recent movements.
9. Sub-tabs allow toggling between `Digital Signatures (Vault)`, `Client Statutory Licenses`, and `Vault Bin Map`.
10. Excel export generates a valid `.xlsx` file containing the DSC register data.

---

## 9. Checks to Run
- `npm run typecheck` — Must pass with 0 errors.
- `npm run lint` — Must pass with 0 errors.
- `npm run build` — Next.js production build check.

---

## 10. Exact Manual Test Steps Expected After Implementation
1. Navigate to `http://localhost:3000/registry`.
2. Verify all 9 KPI cards render with respective counts and colored icons.
3. Click on the "Exp. in 15d" KPI card; confirm the table filters to only DSCs expiring within 15 days. Click again or click "Total DSC" to reset filter.
4. Type a director or business name into the search bar; verify the table filters immediately.
5. Click `+ Add`, fill out the 5 mandatory fields (Signatory Name, Client, Issue Date, Expiry Date, Location, Bin Number), and submit. Confirm the new DSC appears in the table and KPIs increment.
6. Click the row action `⋮` on any DSC and select "Transfer Custody"; change location from "CA Office" to "Client Office", set receiver name, and save. Confirm location badge updates to "Client Office".
7. Click the "History" audit button; verify the custody movement is logged with timestamp and details.
8. Switch to the "Client Statutory Licenses" sub-tab and verify license tracking cards and table.
9. Click "Export" from the `⋮` menu; confirm the `.xlsx` file downloads with 12 columns.
