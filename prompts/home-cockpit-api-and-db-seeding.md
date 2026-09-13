# Implementation Prompt: Home Cockpit API Integration & Supabase Database Seeding

## 1. Goal
Implement complete **Data API Integration** for the **Home Cockpit** (`/`) and a **Comprehensive Database Seeding Engine** (`/api/seed` + SQL migration fixtures) to populate all Supabase tables (`firms`, `firm_users`, `clients`, `services_master`, `compliance_tasks`, `invoices`, `payment_receipts`, `attendance_logs`, `timesheet_entries`, `quick_notes`, `leads`, `dsc_register`) with rich, realistic Indian Chartered Accountancy practice data.

---

## 2. Skills Read
- `.agents/skills/supabase/SKILL.md` (Server-side queries, RLS, transactional batch inserts, error recovery)
- `.agents/skills/supabase-postgres-best-practices/SKILL.md` (Foreign key integrity, composite types, bulk inserts)
- `.agents/skills/clerk/SKILL.md` & `.agents/skills/clerk-orgs/SKILL.md` (Tenant isolation per active `orgId`)
- `public/context/contextDoc/doc.md` (Section 2 Home Cockpit, Section 12 Database Schema)
- `public/context/contextDoc/role.md` (RBAC rules and practitioner roles)
- `AGENTS.md` (Mandatory verification, zero assumptions, strict TypeScript)

---

## 3. Existing Code Inspected
- `app/page.tsx`: Home Cockpit page with 4 master tabs (`Attendance`, `Timesheet`, `Sales`, `Notes`) and `OnboardingBanner`.
- `components/home/attendance-tab.tsx`: Punch-in hub, today's attendance table, upcoming leaves, and compliance notices.
- `components/home/timesheet-tab.tsx`: 12 PM - 11 PM weekly calendar matrix and time entry modal.
- `components/home/sales-tab.tsx`: Financial charts (Recharts), collections, top 10 services, and top clients.
- `components/home/notes-tab.tsx`: Auto-saving scratchpad with CA templates.
- `lib/supabase/server.ts`: Server Supabase client and tenant context resolver.

---

## 4. Architectural & Implementation Plan

### 4.1 Supabase Demo Database Seeder (`/api/seed` & `lib/supabase/seeder.ts`)
Creates a comprehensive seeding service that populates the active firm's database with:
1. **Firm Profile**: Updated legal info, brand name "Saha & Sons", PAN `AACFS1234F`, GSTIN `19AACFS1234F1Z8`, onboarding step 3.
2. **Team Directory (`firm_users`)**: 4 practitioners (Managing Partner, Tax Manager, Senior Associate, Article Trainee) with hourly labor costs (`cost_per_hour`) and billing rates (`billing_rate`).
3. **Clients Master (`clients` + `client_gstins`)**: 6 corporate clients (Acme Global Logistics, Reliance Retail, Tata Consumer, HDFC Life, Zenith Agro, Bengal Logistics).
4. **Services Catalog (`services_master`)**: 6 CA services with SAC codes `9982xx`, TAT, base fees, and recurrence frequencies.
5. **Compliance Tasks (`compliance_tasks` + `task_subtasks`)**: Active statutory audit, GST filing, and ROC tasks with due dates.
6. **Billing & Invoices (`invoices` + `invoice_items` + `payment_receipts`)**: Proforma and Tax invoices with CGST/SGST/IGST breakdown, payment receipts with TDS 194J.
7. **Attendance Logs (`attendance_logs`)**: Real-time punch-in records for staff with GPS coordinates and geofenced distance calculations.
8. **Timesheet Matrix (`timesheet_entries`)**: Daily time logs categorized by client, service, and billable hours.
9. **Quick Notes (`quick_notes`)**: Pinned scratchpad notes with statutory checklists.
10. **DSC Register (`dsc_register`)**: Class 3 physical USB tokens with vault BIN numbers.

### 4.2 Home Cockpit API Endpoints
1. `GET /api/dashboard/summary`: Aggregated endpoint returning punch-in state, attendance stats, weekly timesheet logs, sales KPIs, notices, and quick notes.
2. `POST /api/attendance/punch`: Handles practitioner clock-in / clock-out logging to `attendance_logs`.
3. `GET /api/timesheet` & `POST /api/timesheet`: Fetches weekly timesheet entries and inserts new time logs into `timesheet_entries`.
4. `GET /api/sales/summary`: Returns live financial aggregates, invoice vs collection trends, and top services.
5. `GET /api/notes` & `POST /api/notes`: Fetches and saves practitioner quick notes.
6. `POST /api/seed`: 1-click database seeding trigger that populates all tables in Supabase for the current firm workspace.

### 4.3 Client Components Live Wiring
- Update `AttendanceTab` to fetch today's attendance logs via API, update punch timer, and record clock-ins.
- Update `TimesheetTab` to load weekly entries via API and persist modal entries to Supabase.
- Update `SalesTab` to load revenue numbers, monthly invoice bar charts, and top clients from live API.
- Update `NotesTab` to sync notes with Supabase.
- Add 1-click **"Seed Demo Data"** action button in the development banner / topbar or onboarding banner for instant database population.

---

## 5. Files Likely to Change / Be Created

1. `lib/supabase/seeder.ts`: Master multi-table database seeding service for Supabase.
2. `app/api/seed/route.ts`: POST endpoint to trigger complete tenant database seeding.
3. `app/api/dashboard/summary/route.ts`: Master Home Cockpit summary aggregator API.
4. `app/api/attendance/punch/route.ts`: Punch-in / clock-out API handler.
5. `app/api/timesheet/route.ts`: Timesheet entries list & create API.
6. `app/api/sales/summary/route.ts`: Sales KPIs and chart aggregator API.
7. `app/api/notes/route.ts`: Quick notes list & save API.
8. `lib/api/home.ts`: Client-side API fetchers and mutation helpers.
9. `components/home/attendance-tab.tsx`: Wired to live attendance API.
10. `components/home/timesheet-tab.tsx`: Wired to live timesheet API.
11. `components/home/sales-tab.tsx`: Wired to live sales API.
12. `components/home/notes-tab.tsx`: Wired to live notes API.
13. `components/home/onboarding-banner.tsx`: Add 1-click "Seed Demo Database" trigger button.

---

## 6. Security Requirements
- All API routes verify Clerk authentication (`auth().userId` and `auth().orgId`).
- Tenant isolation strictly enforced on every Supabase query by filtering with `firm_id`.
- Secret keys (`SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`) strictly confined to server-side.

---

## 7. Acceptance Criteria
1. `POST /api/seed` successfully populates all core Supabase tables (`firms`, `firm_users`, `clients`, `services_master`, `compliance_tasks`, `invoices`, `payment_receipts`, `attendance_logs`, `timesheet_entries`, `quick_notes`, `leads`, `dsc_register`).
2. Home Cockpit tabs (`Attendance`, `Timesheet`, `Sales`, `Notes`) consume data from the API and render dynamically.
3. Clocking in/out records a real entry in `attendance_logs`.
4. Adding a timesheet entry saves to `timesheet_entries` and updates the matrix.
5. Sales Tab renders charts and figures computed from database invoices and receipts.
6. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## 8. Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Navigate to `http://localhost:3000/`.
2. Click **"Seed Demo Database"** button in the banner to populate all Supabase tables.
3. Verify the **Attendance Tab**: Check punch-in timer and today's team attendance table loaded from API.
4. Verify the **Timesheet Tab**: Check weekly matrix entries across 12 PM - 11 PM. Click "+ Add Time Entry" to test saving a new entry.
5. Verify the **Sales Tab**: Check revenue growth, invoice charts, and top clients.
6. Verify the **Notes Tab**: Check auto-saving scratchpad and statutory templates.
7. Open Supabase Dashboard → Table Editor and verify all tables contain populated rows.
