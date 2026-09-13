# Implementation Prompt: Module 9 - Team & Staff Management Module

## Goal
Implement Module 9 (**Team & Staff Management Module**) as specified in `doc.md` (Section 9), `AGENTS.md` (Section 14), `role.md`, and screenshot references (`team-1.png`, `team-2.png`, `team-3.png`, `team-4.png`, `team-add user.png`).

The module provides full practice HR governance for Indian Chartered Accountancy firms, encompassing:
1. **Master Team Cockpit (`/team`)** wrapped in `AppShell` with 4 top-level sub-tabs:
   - **Tab 1: Team Directory & License Seat Tracker** (`team-1.png`): 4 KPI metric cards (`Active Users`, `Deactivated Users`, `Resigned Users`, and **`Seats Used / Total`** e.g. `1 / 5` subscription capacity tracker), 11-column Users table, department/role filters, search, and action menus.
   - **Tab 2: Attendance & Geofenced Clock-In Tracking** (`team-2.png`): 4 view modes (`Today's Attendance`, `Weekly Attendance`, `Monthly Attendance`, `Regularization`), date selector, 11-column attendance table with work location (Office, Remote, Client Site), client entity, Geo/IP coordinates, office location, and geofenced distance radius in meters. Regularization review workflow.
   - **Tab 3: Leave Management & CA Exam Study Leave Pipeline** (`team-3.png`): 2 view modes (`All Applications` and `Summary` balance ledger), date range filters, 11-column applications table with CA Exam Study Leave under ICAI rules, leave balance counters, approval/rejection workflows, and `Assign / Apply Leave` modal.
   - **Tab 4: Employee Reimbursement Claims** (`team-4.png`): 8-column internal staff expense table (outstation audit travel, MCA stamp papers, court conveyance), receipt attachment links, status tracking (`Approved`, `Pending`, `Rejected`), settlement tracking (`Settled` vs `Unsettled`), and `New Expense Claim` modal.
2. **Add Employee 4-Step Stepper Wizard** (`team-add user.png`):
   - Stepper sidebar: `1 Employment Details`, `2 Personal Details`, `3 Address`, `4 Role Permissions`.
   - **Step 1 (Employment Details)**: First Name, Last Name, Email ID, Mobile (`IN +91`), Designation (Partner, Manager, Senior Associate, Article Trainee, Staff), Role (Admin, Partner, Manager, Senior Associate, Article Trainee, Staff), Department (Direct Tax, GST, Audit, ROC, Accounting, Admin), Reporting To (manager hierarchy), Shift (General Shift 10:00 AM - 07:00 PM), Employee ID, Joining Date, Resignation Date, Salary, `Cost Per Hour` (labor costing), `Billing Rate` (timesheet billing), Work Experience, Employment Status (`Confirmed`, `Probation`, `Notice Period`, `Intern`), Confirmation Date.
   - **Step 2 (Personal Details)**: DOB, Gender, Blood Group, PAN, Aadhaar, Emergency Contact, ICAI Membership No / Student Registration No (e.g. `WRO...` / `ERO...` for article trainees).
   - **Step 3 (Address)**: Current & Permanent Address Line 1 & Line 2, City, State, Country (`India`), Pin Code.
   - **Step 4 (Role Permissions)**: 30-module granular RBAC permissions matrix with View, Add/Edit, Delete, Import, Export checkboxes.
3. **Backend API Route Handlers**:
   - `GET /api/team`: Aggregates team members, KPI counts (`active`, `deactivated`, `resigned`, `seats_used`, `seats_total`), attendance logs, leave applications, leave balances summary, and employee expense claims.
   - `POST /api/team`: Creates a new team member and initializes leave balance records.
   - `PATCH /api/team/[id]`: Updates employee status, role, designation, or employment details.
   - `POST /api/team/attendance`: Logs attendance clock-in/out or processes regularization requests.
   - `POST /api/team/leave`: Creates leave application or updates approval status (`approved`/`rejected`).
   - `POST /api/team/reimbursement`: Submits staff expense claim or processes settlement.

---

## Skills Read
- `.agents/skills/clerk/SKILL.md`: Multi-tenant organization session management, `getTenantContext()`, user roles, tenant isolation.
- `.agents/skills/supabase/SKILL.md`: PostgreSQL schema, RLS policies, tenant isolation by `firm_id`, typed queries, service role client.
- `.agents/skills/clerk-orgs/SKILL.md`: License seat tracking and organization memberships.

---

## Existing Code Inspected
- `public/context/contextDoc/doc.md` (Section 9: Team & Staff Management Module, Section 12: Database Schemas).
- `public/context/contextDoc/ui_doc.md`: Design tokens (`#6366F1` indigo brand, slate palette, table header styling, zero horizontal borders, badge styles, modals).
- `public/context/contextDoc/role.md`: 6 CA practice roles (Super Admin, Partner, Manager, Senior Associate, Article Trainee, Staff) and 30-module RBAC structure.
- `public/context/contextDoc/contextImg/`:
  - `team-1.png`: Team directory, 4 KPI cards with seat capacity tracker `1 / 5`, toolbar, 11-column table.
  - `team-2.png`: Attendance cockpit with 4 view modes, geofenced radius distance column.
  - `team-3.png`: Leave pipeline with `All Applications` & `Summary`, ICAI CA exam leave classification.
  - `team-4.png`: Employee reimbursement claims with receipt attachments and settlement status.
  - `team-add user.png`: 4-step wizard with 3-column inputs, icons, and stepper.
- `supabase/schema.sql`: Lines 75-115 (`firm_users`), lines 524-540 (`attendance_logs`), lines 548-561 (`leave_applications`), lines 569-581 (`leave_balances`), lines 589-601 (`employee_expense_claims`).
- `components/ui/data-table.tsx`: Table components (`TableHeaderCell`, `TableEmptyState`, `ColumnSort`).
- `components/layout/sidebar.tsx`: Navigation item `{ label: "Team", href: "/team", icon: Users2 }`.

---

## Decisions or Assumptions
1. **License Seat Tracking**: The firm's total seats are governed by `firms.total_license_seats` (defaulting to 5 seats in our CA practice tenant). The 4th KPI card displays `Seats Used / Total` (e.g. `1 / 5`) with visual alert if capacity is reached.
2. **Geofenced Attendance Model**: Each attendance log captures GPS coordinates (`in_geo_coords`), work location (`Office`, `Remote`, `Client Site`), client name (if client audit), office location, and calculated distance in meters (`distance_meters`). Distances within 100m are flagged as verified on-site.
3. **ICAI CA Exam Study Leave**: Special statutory leave type (`ca_exam_leave`) with 90-day entitlement for article assistants preparing for CA Intermediate or CA Final exams under ICAI regulations.
4. **Seed Fallbacks**: If Supabase credentials are in development/mock mode or database tables are initially empty, the API provides realistic CA practice seed data (Archi Saha as Admin Partner, Rahul Sharma as Senior Audit Manager, Priya Patel as Direct Tax Associate, Vikram Malhotra as Article Trainee, Sneha Roy as Accounts Executive) matching all screenshot UI states.

---

## Files Likely to Change / Be Created
1. `lib/supabase/types.ts`: Add `firm_users`, `attendance_logs`, `leave_applications`, `leave_balances`, and `employee_expense_claims` table types.
2. `components/team/types.ts`: Define TypeScript interfaces for Team, Attendance, Leave, Reimbursement, Stepper Wizard, and KPI data.
3. `lib/api/team.ts`: Client API layer for fetching and mutating team members, attendance, leaves, and claims.
4. `components/team/team-directory-tab.tsx`: Tab 1 component with 4 KPI cards (including `1 / 5` Seat tracker), filters, search, and 11-column table.
5. `components/team/attendance-tab.tsx`: Tab 2 component with 4 view modes (Today, Weekly, Monthly, Regularization), date filter, and geofenced radius table.
6. `components/team/leave-tab.tsx`: Tab 3 component with Applications list and Summary balance ledger, approval actions, and Assign Leave modal.
7. `components/team/reimbursement-tab.tsx`: Tab 4 component with staff expense claims, receipt viewer, settlement triggers, and New Claim modal.
8. `components/team/add-employee-wizard.tsx`: Full-screen 4-step wizard matching `team-add user.png`.
9. `app/api/team/route.ts`: Master GET & POST endpoint for team data and employee creation.
10. `app/api/team/[id]/route.ts`: PATCH & DELETE endpoint for employee updates.
11. `app/api/team/attendance/route.ts`: Attendance logging and regularization endpoint.
12. `app/api/team/leave/route.ts`: Leave applications and status review endpoint.
13. `app/api/team/reimbursement/route.ts`: Staff expense claim submission and settlement endpoint.
14. `app/team/page.tsx`: Main page orchestrating the 4 tabs and the Add Employee wizard.

---

## Visual Interpretation & UI Expectations
- **Design Tokens**: Match `ui_doc.md` and screenshots:
  - Brand indigo: `#6366F1`, hover `#4F46E5`.
  - Cards: White `bg-white`, border `border-[#E2E8F0]`, shadow-xs, rounded-lg.
  - KPI Card 1: Value in green `#059669`, label `Active Users`, green icon pill.
  - KPI Card 2: Value in slate `#64748B`, label `Deactivated Users`, gray icon pill.
  - KPI Card 3: Value in orange `#D97706`, label `Resigned Users`, orange icon pill.
  - KPI Card 4: Value in indigo `#6366F1`, label `Seats Used / Total` (e.g. `1 / 5`), indigo armchair icon pill.
  - Tabs: Clean top borderless tabs with active indigo underline indicator and icon.
  - Tables: Zero horizontal border between table cells, light hover `hover:bg-slate-50/60`, uppercase column headers `text-[10px] font-semibold uppercase tracking-wider text-slate-500`, avatar circles with initials.
  - Status Pills:
    - Active: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Inactive / Deactivated: `bg-slate-100 text-slate-600 border-slate-200`
    - Approved: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Pending: `bg-amber-50 text-amber-700 border-amber-200`
    - Rejected: `bg-rose-50 text-rose-700 border-rose-200`
    - Settled: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Unsettled: `bg-amber-50 text-amber-700 border-amber-200`

---

## Security & Architectural Requirements
- Strict tenant isolation: every query filters by `firm_id`.
- Zero unvalidated database mutations from client components.
- Zero TypeScript `any`. Strict types across all components and endpoints.
- Proper Server/Client boundaries (`"use client"` on interactive client components only).

---

## Acceptance Criteria
1. `/team` renders within `AppShell` with the 4 tabs: `Team`, `Attendance`, `Leave`, `Reimbursement`.
2. Tab 1 displays the 4 KPI cards with active user counts and `Seats Used / Total` (e.g. `1 / 5` or `4 / 5`).
3. Tab 1 displays the 11-column Users table with search, role badges, designation, department, clients count, tasks count, and last punch-in.
4. Clicking `+ Add Users` switches to the 4-step Add Employee wizard matching `team-add user.png`.
5. Wizard Step 1 allows entering First/Last Name, Email, Mobile (`IN +91`), Designation, Role, Department, Shift, Salary, Cost Per Hour, and Billing Rate.
6. Wizard Step 2 captures Personal Details (DOB, Gender, PAN, Aadhaar, ICAI Reg No).
7. Wizard Step 3 captures Address details.
8. Wizard Step 4 provides RBAC permissions configuration. Completing the wizard creates the employee and updates seat counts.
9. Tab 2 provides the 4 Attendance views (Today, Weekly, Monthly, Regularization) with GPS distance tracking.
10. Tab 3 provides Leave Management with CA Exam Study Leave tracking, balance ledger, and approval triggers.
11. Tab 4 provides Reimbursement claims with receipt links and settlement triggers.
12. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps Expected After Implementation
1. Navigate to `http://localhost:3000/team`.
2. Verify all 4 tabs and inspect the 4 KPI cards on the Team tab.
3. Verify the 11-column Users directory table and test the search bar and department filters.
4. Click `+ Add Users` button, verify the 4-step wizard renders matching `team-add user.png`.
5. Step through the wizard, fill in required fields, and submit. Verify the user appears in the team directory.
6. Switch to the `Attendance` tab: test the 4 views (`Today`, `Weekly`, `Monthly`, `Regularization`).
7. Switch to the `Leave` tab: toggle between `All Applications` and `Summary`, click `Assign Leave`, submit a CA study leave application, and approve/reject.
8. Switch to the `Reimbursement` tab: inspect staff expense claims, test adding a claim and settling it.
