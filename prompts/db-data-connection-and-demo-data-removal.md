# Implementation Prompt: Connect Home, Profile & Leads to Live Supabase API & Remove Hardcoded Demo Data

## 1. Goal
1. Remove all hardcoded mock data fallbacks and static initial states across **Home Cockpit (`/`)**, **User Profile & Member Portal (`/profile`)**, and **Leads Management Engine (`/leads`)**.
2. Connect all 3 modules (`Home`, `Profile` with its 7 tabs, `Leads` with pipeline & filters) directly to live Next.js App Router API Route Handlers backed by Supabase PostgreSQL.
3. Enhance the Database Seeder (`lib/supabase/seeder.ts` and `POST /api/seed`) to populate rich, valid, relational Indian CA practice data across all 25 tables in Supabase (including profile details, KYC documents, leave applications, expense claims, tasks, clients, and org tree).

---

## 2. Skills Read & Applied
- `.agents/skills/clerk`: Tenant resolution from Clerk organization claims (`getTenantContext()`).
- `.agents/skills/supabase`: Supabase service role client, multi-tenant isolation with `firm_id`, typed queries, and RLS compliance.
- Next.js App Router documentation in `node_modules/next/dist/docs/`.

---

## 3. Existing Code Inspected
- `app/page.tsx` & `components/home/*`: Attendance punch-in, weekly timesheet calendar matrix, sales summary cards, auto-saving notes scratchpad.
- `app/profile/page.tsx` & `components/profile/*`:
  - Tab 1: `profile-details-tab.tsx` (Bio, employment, personal, labor costing, monthly attendance calendar matrix, leave history).
  - Tab 2: `reimbursement-tab.tsx` (Internal employee expense claims).
  - Tab 3: `tasks-tab.tsx` (Assigned compliance tasks & re-assignment).
  - Tab 4: `clients-tab.tsx` (Assigned client portfolios & re-assignment).
  - Tab 5: `documents-tab.tsx` (Employee KYC documents vault).
  - Tab 6: `permissions-tab.tsx` (30-module RBAC permissions matrix).
  - Tab 7: `organization-tab.tsx` (Interactive reporting hierarchy tree).
- `app/leads/page.tsx` & `app/api/leads/route.ts`: Leads list, filters, KPI strip, Add Lead modal, conversion to client.
- `lib/supabase/seeder.ts`: Initial seeding for 12 tables.

---

## 4. Key Architectural Decisions & Assumptions
1. **No Static Mock Fallbacks**:
   - Initial component states default to empty arrays `[]` or null, with sleek loading indicators / skeletons while fetching.
   - API routes query Supabase directly filtering by `firm_id`. If rows are empty, return empty sets `[]` rather than injecting fake in-memory fixtures.
2. **Profile API Layer**:
   - Create unified and specialized API endpoints:
     - `GET & PATCH /api/profile`: Returns full profile details for the authenticated practitioner (`firm_users`), attendance days for the calendar matrix, and leaves.
     - `GET & POST /api/profile/reimbursements`: CRUD for `employee_expense_claims`.
     - `GET & POST /api/profile/leaves`: Leave applications management.
     - `GET & PATCH /api/profile/tasks`: Assigned statutory tasks with client/service joins + re-assignment.
     - `GET & PATCH /api/profile/clients`: Assigned client portfolios + re-assignment.
     - `GET, POST & DELETE /api/profile/documents`: KYC documents vault (`user_documents`).
     - `GET & PATCH /api/profile/permissions`: RBAC permissions JSON persistence in `firm_users`.
     - `GET /api/profile/org-tree`: Dynamically builds hierarchical organization tree from `firm_users` based on `reporting_to_id`.
3. **Rich Seeding Engine**:
   - Expand `seedTenantDatabase` in `lib/supabase/seeder.ts` to insert:
     - Comprehensive `firm_users` records with personal details (DOB, PAN, Aadhaar, ICAI numbers, emergency contacts, addresses, labor costing `cost_per_hour` & `billing_rate`).
     - `leave_applications` & `leave_balances` for the firm users.
     - `employee_expense_claims` (internal staff reimbursements).
     - `user_documents` (KYC vault attachments).
     - `clients` & `client_gstins`.
     - `services_master`.
     - `compliance_tasks` assigned to firm users.
     - `invoices`, `invoice_items`, `payment_receipts`.
     - `attendance_logs` for current month calendar view.
     - `timesheet_entries`.
     - `quick_notes`.
     - `leads` pipeline.
     - `dsc_register` tokens.

---

## 5. Files to Create & Modify

### Backend API & Database Layer:
1. `lib/supabase/seeder.ts`: Expand seeding to populate `leave_applications`, `leave_balances`, `employee_expense_claims`, `user_documents`, and full `firm_users` profiles.
2. `app/api/profile/route.ts`: `GET` (fetch profile details + attendance log summary) & `PATCH` (update profile details).
3. `app/api/profile/reimbursements/route.ts`: `GET` & `POST` for `employee_expense_claims`.
4. `app/api/profile/leaves/route.ts`: `GET` & `POST` for `leave_applications`.
5. `app/api/profile/tasks/route.ts`: `GET` (assigned tasks) & `PATCH` (batch reassign).
6. `app/api/profile/clients/route.ts`: `GET` (assigned clients) & `PATCH` (batch reassign).
7. `app/api/profile/documents/route.ts`: `GET`, `POST`, `DELETE` for `user_documents`.
8. `app/api/profile/permissions/route.ts`: `GET` & `PATCH` for role/user permissions JSON.
9. `app/api/profile/org-tree/route.ts`: `GET` dynamic org hierarchy structure.
10. `app/api/leads/route.ts`: Remove `MOCK_LEADS` fallback; query Supabase `leads` table cleanly.
11. `app/api/leads/[id]/route.ts`: Implement `PATCH` and `DELETE` on Supabase `leads`.

### Client API Layer:
12. `lib/api/profile.ts`: Typed client-side functions for all profile tabs.
13. `lib/api/leads.ts`: Update to communicate with live `/api/leads` and `/api/leads/[id]`.

### UI Component Layer:
14. `app/leads/page.tsx`: Switch initial state from `MOCK_LEADS` to `[]`, wire real loading states and error toasts.
15. `components/profile/profile-details-tab.tsx`: Fetch profile bio, monthly attendance matrix, and leave history from `/api/profile`.
16. `components/profile/reimbursement-tab.tsx`: Fetch and apply expense claims via `/api/profile/reimbursements`.
17. `components/profile/tasks-tab.tsx`: Fetch and reassign tasks via `/api/profile/tasks`.
18. `components/profile/clients-tab.tsx`: Fetch and reassign clients via `/api/profile/clients`.
19. `components/profile/documents-tab.tsx`: Fetch, upload, and delete KYC documents via `/api/profile/documents`.
20. `components/profile/permissions-tab.tsx`: Fetch and persist 30-module RBAC permissions via `/api/profile/permissions`.
21. `components/profile/organization-tab.tsx`: Fetch and render dynamic org hierarchy tree via `/api/profile/org-tree`.
22. `components/home/*`: Ensure attendance, timesheet, sales, and notes tabs render live API data with clean empty & loading states.

---

## 6. Security Requirements
- All API routes verify `getTenantContext()` to extract authenticated Clerk `userId` and `firmId`.
- Every database query strictly filters by `firm_id`.
- Profile mutations verify that users can only edit allowed fields or their own assigned records.

---

## 7. Acceptance Criteria
- [ ] No hardcoded mock data is displayed by default on Leads, Profile, or Home.
- [ ] Database seeder populates rich, realistic Indian CA practice data for the active organization.
- [ ] Clicking **"Seed Demo Database"** seeds all 25 tables in Supabase and instantly updates Home, Profile, and Leads.
- [ ] Leads table, KPI cards, filter sliders, Add Lead modal, and Convert to Client work with live Supabase data.
- [ ] Profile page (all 7 tabs) displays real data from Supabase and persists updates (leaves, reimbursements, documents, permissions, task/client reassignments).
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## 8. Checks to Run
- `npm run typecheck` (`tsc --noEmit`)
- `npm run lint` (`eslint`)
- `npm run build` (`next build`)
