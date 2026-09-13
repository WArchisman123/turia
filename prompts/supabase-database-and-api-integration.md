# Implementation Prompt: Supabase Database Setup, Multi-Tenant Org Architecture & API Integration

## 1. Goal
Implement the complete **Supabase Database Architecture**, **Multi-Tenant Clerk Organization Synchronization**, and **Data API Layer** for TURIA SaaS. Ensure that:
1. Every user is strictly required to be part of an Organization (Clerk `orgId` linked to Supabase `firms` and `firm_users`).
2. Supabase schema includes all 24 core tables with relational integrity, foreign keys, timestamps, indexes, and Row-Level Security (RLS).
3. Robust Next.js Route Handlers (`/api/auth/sync`, `/api/leads`, `/api/leads/[id]`, `/api/firm`, `/api/team`) handle validated database CRUD with tenant isolation.
4. Demo data fixtures are preserved in `lib/data/` for future database seeding while the application consumes data from the API/Supabase layer.

---

## 2. Skills Read
- `.agents/skills/supabase/SKILL.md` (Client/Server Supabase configuration, RLS policies, error recovery)
- `.agents/skills/supabase-postgres-best-practices/SKILL.md` (Schema design, indexing on foreign keys, security invokers)
- `.agents/skills/clerk/SKILL.md` & `.agents/skills/clerk-orgs/SKILL.md` (Clerk multi-tenant organizations, `auth().orgId`, `clerkClient()`)
- `public/context/contextDoc/doc.md` (Section 12 Database Schema)
- `public/context/contextDoc/role.md` (Role-based access control and tenant isolation)
- `AGENTS.md` (Mandatory rules, strict TypeScript, zero `any`, environment variable standards)

---

## 3. Existing Code Inspected
- `.env.local`: Contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.
- `app/layout.tsx`: Root layout with ClerkProvider and RBACProvider.
- `app/leads/page.tsx`: Leads management workspace.
- `lib/rbac/`: RBAC matrix and guards.
- `proxy.ts`: Next.js 16 route proxy with Clerk middleware protecting application routes.

---

## 4. Architectural & Implementation Decisions

### 4.1 Clerk Organization Requirement ("User has to be part of an org")
- In a CA practice management SaaS, all practitioner work (clients, tasks, billing, attendance) belongs to a Firm (Organization).
- We will enforce organization membership:
  1. `lib/supabase/sync-org.ts`: Helper that takes current Clerk `userId` and `orgId`, checks if the firm exists in Supabase `firms`, creates or updates it, and creates/links the `firm_users` record.
  2. `/api/auth/sync`: Endpoint invoked upon session initialization to ensure `firms` and `firm_users` tables are synchronized with the active Clerk Organization and User.
  3. `components/auth/org-gate.tsx`: A lightweight guard component that renders when a user is authenticated but has not selected or created an organization, providing a clear prompt and `<OrganizationSwitcher hidePersonal={false} />` to select or create their CA firm workspace.

### 4.2 Supabase Schema & Database Layer (`supabase/schema.sql`)
Complete PostgreSQL schema with `uuid-ossp` or `gen_random_uuid()`:
1. `firms` (Multi-tenant firm entity with `clerk_org_id`, `onboarding_step`, `onboarding_completed`, PAN, GSTIN, legal name, branding)
2. `firm_users` (Practitioners, partners, managers, articles with `clerk_user_id`, `cost_per_hour`, `billing_rate`, `role`, permissions JSONB)
3. `user_documents` (KYC, articleship deeds)
4. `clients` (Trade name, legal name, PAN, CIN, entity type, status)
5. `client_gstins` (Multi-state GSTINs per client)
6. `client_contacts` (Client directors, POCs)
7. `client_licenses` (FSSAI, IEC, Trade licenses)
8. `services_master` (Services catalog with SAC code 9982xx, TAT, estimated hours, recurrence)
9. `compliance_tasks` (Statutory compliance tasks with FY, due dates, assignees, priorities)
10. `task_subtasks` (Checklists)
11. `task_activities` (Immutable 30-day activity audit log)
12. `invoices` (Proforma and Tax invoices with CGST, SGST, IGST, TDS 194J)
13. `invoice_items` (Line items for services and disbursements)
14. `client_reimbursements` (Pass-through non-GST ROC/court expenses)
15. `payment_receipts` (Receipt vouchers with UTR tracking)
16. `recurring_invoices` (Retainership schedules)
17. `leads` (Acquisition pipeline with deal value, stage, score 0-100, GSTIN verification)
18. `attendance_logs` (GPS geofenced attendance logs with radius in meters)
19. `leave_applications` (Casual, sick, and ICAI CA exam study leaves)
20. `leave_balances` (Leave ledger)
21. `employee_expense_claims` (Staff travel/audit expense claims)
22. `dsc_register` (Physical USB vault bin storage, expiry dates, Class 3)
23. `auditor_appointments_adt1` (Section 139 Form ADT-1 appointment registry)
24. `timesheet_entries` (Daily practitioner timesheet logs with billable rates)
25. `quick_notes` (Scratchpad entries)

### 4.3 Supabase TypeScript Types (`lib/supabase/types.ts`)
- Strict TypeScript database interface `Database` matching the schema tables, row types, insert types, and update types.

### 4.4 Supabase Client & Server Instances
- `lib/supabase/client.ts`: Browser-side Supabase client initialized via `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
- `lib/supabase/server.ts`: Server-side Supabase client for Server Actions and Route Handlers, using `SUPABASE_SERVICE_ROLE_KEY` with firm tenant isolation filters.

### 4.5 Data API Layer & Route Handlers
1. `GET /api/auth/sync`: Checks and syncs Clerk user & active org to Supabase `firms` and `firm_users`. Returns current firm and user info.
2. `GET /api/leads`: Fetches leads for the active firm from Supabase (or seeds/returns fallback data if none exists).
3. `POST /api/leads`: Validates input with Zod, inserts lead into Supabase `leads` table with `firm_id`.
4. `PATCH /api/leads/[id]`: Updates lead stage, status (e.g. Convert to Client, Mark Lost).
5. `DELETE /api/leads/[id]`: Deletes lead with firm isolation check.
6. `GET /api/firm`: Returns current firm profile and onboarding status.
7. `PATCH /api/firm`: Updates onboarding step and firm profile details.

### 4.6 Demo Data Retention
- Save complete rich Indian CA practice mock fixtures in `lib/data/mock-data.ts` (Leads, Clients, Services, Tasks, DSCs, Team) so they are preserved and can be seeded into the database or used as high-fidelity fallbacks.

---

## 5. Files Likely to Change / Be Created

1. `package.json`: Install `@supabase/supabase-js`.
2. `supabase/schema.sql`: Full 24-table multi-tenant PostgreSQL schema with RLS and indexes.
3. `lib/supabase/types.ts`: Comprehensive TypeScript database schema definitions.
4. `lib/supabase/client.ts`: Browser Supabase client helper.
5. `lib/supabase/server.ts`: Server Supabase client helper with service-role security.
6. `lib/supabase/sync-org.ts`: Clerk Org <-> Supabase Firm sync utility.
7. `lib/data/mock-data.ts`: Preserved demo data fixtures for all modules.
8. `components/auth/org-gate.tsx`: Organization membership verification banner/modal.
9. `app/api/auth/sync/route.ts`: Sync user & active organization route.
10. `app/api/leads/route.ts`: Leads list & create route.
11. `app/api/leads/[id]/route.ts`: Leads update & delete route.
12. `app/api/firm/route.ts`: Firm profile & onboarding status route.
13. `app/leads/page.tsx`: Update to connect with `/api/leads` and `/api/auth/sync`.

---

## 6. Security Requirements
- **Tenant Isolation**: Every database operation MUST filter by `firm_id` derived from the verified Clerk `orgId`.
- **Clerk Authentication**: All API routes verify `const { userId, orgId } = await auth()` and return `401 Unauthorized` if unauthenticated.
- **Org Requirement**: Users without an active `orgId` are prompted to select/create an organization.
- **Secret Keys**: `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` are strictly server-only.

---

## 7. Acceptance Criteria
1. `@supabase/supabase-js` is installed and properly configured.
2. `supabase/schema.sql` provides the complete, error-free SQL DDL ready to execute in Supabase SQL Editor.
3. Database types in `lib/supabase/types.ts` strictly match the schema.
4. Route handlers `/api/auth/sync`, `/api/leads`, `/api/leads/[id]`, and `/api/firm` execute with proper Clerk authentication and tenant isolation.
5. Organization guard ensures users select/create an organization.
6. Demo data is safely preserved in `lib/data/mock-data.ts`.
7. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## 8. Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Verify `supabase/schema.sql` can be pasted into Supabase Dashboard SQL editor.
2. Run `npm run dev` and navigate to `http://localhost:3000/leads`.
3. Check browser network tab for call to `/api/auth/sync` and `/api/leads`.
4. Create a new lead and verify API `POST /api/leads` returns status 200/201.
5. Test Convert to Client and verify API `PATCH /api/leads/[id]` updates database.
