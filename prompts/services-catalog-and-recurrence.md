# Implementation Prompt: 6. Services Catalog & Recurrence Engine

## Goal
Implement the comprehensive, production-grade **Services Catalog & Master Repository** module for **TURIA** at `/services`. This central catalog serves as the CA practice's statutory menu with commercial rates, SAC codes, recurring schedules, and sub-task checklists:
- **6 Top KPI Metric Cards**: `Active`, `Recurring`, `Non-Recurring`, `Default Services`, `Inactive`, `Total Services` matching `services-1.png`.
- **12-Column Responsive Data Table**: `Checkbox`, `Created On`, `Service` (Service Name with Category badge), `Category`, `Recurring` (Badge), `Frequency`, `Professional Fee` (Formatted INR `₹`), `SOP` (Checklist badge), `Sub Tasks` (Step badge), `Difficulty` (Pill badge: Beginner/Intermediate/Advanced/Expert), `Status` (Active/Inactive toggle pill), `Updated On` / `Actions` matching `services-1.png`.
- **Add Service Modal & Stepper**: Full modal matching `services-new.png` with:
  - Left Form: `SERVICE DETAILS` (Service Name, Category, Frequency, Difficulty, Description with 0/300 counter, Recurring Yes/No toggle), `COMMERCIAL & TAX` (Professional Fee, Tax Rate 18%, SAC Code 9982xx, Exemption Reason, Max OOP Budget, TAT in days, TAT in hours), and `ADDITIONAL NOTE` (0/500 counter).
  - Right Helper Sidebar: `Service Checklist` with statutory guidance and parameter explanations.
- **Official 3-Sheet XLSX Template Import & Export Engine**: Strict compatibility with `Service_SampleData.xlsx` featuring:
  - Sheet 1: `Service Data` (18 columns: `Service Name *`, `Category`, `Difficulty Level`, `Description`, `Frequency`, `Recurring`, `Due Timing`, `Start Day`, `Target Due Day`, `End Day`, `Professional Fee`, `Tax Rate`, `SAC Code`, `Exemption Reason`, `Out of Pocket Expenses`, `Maximum Budget`, `TAT - in Days`, `TAT - in Hrs (00:00)`).
  - Sheet 2: `Instruction` (Field guidance & validation rules).
  - Sheet 3: `Master` (Pre-configured drop-down values for Indian CA practice categories, SAC codes, frequencies).
- **Service Checklist & Sub-Task Templates**: Pre-configured verification steps for Statutory Audit, GST, TDS, ROC, and ITR compliance.
- **Service 360 Slide-over Drawer**: Detail drawer to inspect SAC codes, recurrence cycles, SOP checklists, and linked client tasks.

---

## Skills Read
- `.agents/skills/clerk/SKILL.md`: Multi-tenant organization authentication, firm isolation, session tokens, user roles.
- `.agents/skills/supabase/SKILL.md`: PostgreSQL schema, Supabase service-role client, RLS policies, relational queries.

---

## Existing Code Inspected
- `AGENTS.md`: Product requirements for Section 11 (Services Catalog & Recurrence Engine).
- `contextImg/services-1.png`: Main services table view, 6 KPI cards, top bar action buttons, search bar, sort dropdown, and 12 column headers.
- `contextImg/services-new.png`: Add Service modal layout with 3 form sections and right-hand service checklist guidance panel.
- `contextImg/Service_SampleData.xlsx`: Inspected 3 sheets (`Service Data`, `Instruction`, `Master`) and 18 columns.
- `supabase/schema.sql`: `services_master`, foreign key relations with `compliance_tasks`.
- `lib/supabase/types.ts`: Database types definition for `services_master`.
- `lib/supabase/server.ts`: Multi-tenant context extraction (`getTenantContext()`, `createAdminClient()`).
- `components/clients/*` & `app/clients/page.tsx`: Established patterns for KPI strips, tables, modals, drawers, and API helpers.

---

## Decisions & Assumptions
1. **Spreadsheet Handling**: Use `xlsx` (SheetJS) to generate the multi-sheet official template matching `Service_SampleData.xlsx` with `Service Data`, `Instruction`, and `Master` sheets.
2. **Schema Enrichment**: Extend `services_master` with columns: `description`, `difficulty_level`, `due_timing`, `start_day`, `target_due_day`, `end_day`, `exemption_reason`, `out_of_pocket_budget`, `tat_hours`, `sop_count`, `subtasks_count`, `notes`, `is_default`, `subtask_templates`, `checklist_templates`, `updated_at`.
3. **Tenant Isolation**: Every database operation filters strictly by `firm_id`.
4. **Pre-Seeded Master Services**: Provide pre-configured standard Indian CA practice services (Statutory Audit under Companies Act 2013, Tax Audit u/s 44AB, Monthly GSTR-1 & 3B, TDS 26Q/24Q, ROC AOC-4/MGT-7, ITR-6 Corporate Tax, Form 3CEB Transfer Pricing, Virtual CFO Retainer).
5. **Optimistic UI with Resilience**: Service creation, status toggle, and deletion update the UI instantly while saving asynchronously with toast feedback.

---

## Files Likely to Change & Created

### 1. Database & Types
- `supabase/schema.sql`: Update `services_master` table schema with all 18 columns, default values, and migration helpers.
- `lib/supabase/types.ts`: Synchronize TypeScript database types for `services_master`.

### 2. Service Types & Helper Library
- `components/services/types.ts`: TypeScript definitions for `ServiceItem`, `ServiceFormData`, `ServiceKpiData`, `OfficialServiceXlsxRow`, and `ServiceChecklistItem`.
- `lib/api/services.ts`: Client-side API functions (`fetchServices`, `createService`, `updateService`, `deleteService`, `importServicesFile`, `exportServicesXlsx`, `downloadServiceSampleTemplate`).

### 3. Backend API Routes
- `app/api/services/route.ts`: GET (list all firm services with calculated 6 KPIs) & POST (create service).
- `app/api/services/[id]/route.ts`: GET (single service details), PATCH (update service/status), DELETE (delete service).
- `app/api/services/import/route.ts`: POST (parse and batch upsert 18-column `Service Data` sheet).
- `app/api/services/export/route.ts`: GET (generate and stream multi-sheet `TURIA_Services_Catalog_<date>.xlsx`).
- `app/api/services/template/route.ts`: GET (generate and stream 3-sheet `Service_SampleData_Template.xlsx`).

### 4. UI Components (`components/services/`)
- `components/services/services-kpi-strip.tsx`: 6 KPI Metric Cards (`Active`, `Recurring`, `Non-Recurring`, `Default Services`, `Inactive`, `Total Services`).
- `components/services/services-table.tsx`: 12-column interactive data table with search, sorting, status toggles, difficulty pills, 3-dots menus, and pagination.
- `components/services/add-service-modal.tsx`: 2-pane modal matching `services-new.png` with form sections and right-side checklist guidance panel.
- `components/services/import-services-modal.tsx`: Drag-and-drop modal for multi-sheet `.xlsx` service imports with validation summary.
- `components/services/service-detail-drawer.tsx`: 360° slide-over drawer to inspect service commercial terms, SOPs, and subtask checklists.

### 5. Main Route
- `app/services/page.tsx`: Complete page with AppShell, header, search bar, sort selector, Add Service button, 3-dots actions menu, 6 KPI cards strip, and 12-column table.

---

## Visual Design & Pixel-Perfect Specs
- **Colors**:
  - Active: Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Recurring: Purple (`bg-purple-50 text-purple-700 border-purple-200`)
  - Non-Recurring: Sky Blue (`bg-sky-50 text-sky-700 border-sky-200`)
  - Default Services: Slate (`bg-slate-50 text-slate-700 border-slate-200`)
  - Inactive: Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - Total Services: Indigo (`bg-indigo-50 text-indigo-700 border-indigo-200`)
  - Primary Accent: Indigo (`#6366F1` / `bg-indigo-600`)
- **Typography**: Crisp typography with clean hierarchies (`text-xs font-semibold`, `text-[11px] text-slate-500`, `font-mono text-[11px]`).
- **Layout**: 24px container padding, responsive card grids, sticky-header table with smooth horizontal scroll and slide-over sheets.

---

## Security Requirements
- Verify Clerk organization auth session on all `/api/services/*` routes.
- Restrict all Supabase queries to `firm_id = tenant.firmId`.
- Strictly validate input payloads with TypeScript definitions.

---

## Acceptance Criteria
1. Navigating to `/services` renders the complete Services Catalog cockpit with 6 KPI cards and 12-column table.
2. Clicking `+ Add` opens the modal matching `services-new.png` with `SERVICE DETAILS`, `COMMERCIAL & TAX`, and `ADDITIONAL NOTE` alongside the `Service Checklist` helper sidebar.
3. Submitting the Add Service form persists the service to Supabase and updates the table and KPI strip immediately.
4. Clicking top `...` &rarr; `Export Services` downloads an `.xlsx` file containing the service catalog.
5. Importing `Service_SampleData.xlsx` parses the 18 columns and inserts standard CA services.
6. Search filters services across Name, Category, SAC Code, and Description.
7. TypeScript checks (`npm run typecheck`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass with 0 errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps Expected After Implementation
1. **Navigate to `/services`**: Verify 6 KPI cards display accurate counts.
2. **Search Bar**: Type "GST" or "Audit" to verify real-time table filtering.
3. **Add Service Modal**:
   - Click `Add`.
   - Fill in Service Name (e.g. `TDS Payment (Monthly)`), Category (`Direct Tax`), Fee (`₹2,500`), SAC Code (`998231`), Recurring (`Yes`).
   - Click `Save Service` and verify it appears in the table.
4. **Excel Export**:
   - Click 3-dots menu &rarr; `Export Services` &rarr; Verify downloaded `.xlsx` opens with 18 columns.
5. **Excel Import**:
   - Click 3-dots menu &rarr; `Import Services` &rarr; Click `Download Sample` to test template generation or upload `contextImg/Service_SampleData.xlsx`.
