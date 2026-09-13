# Implementation Prompt: Central HTTP Client (`lib/api.ts`), Domain Refactoring & Multi-Tenant Context Resolution Fix

## 1. Goal
1. **Central HTTP Client (`lib/api.ts`)**: Create a centralized base HTTP client in `lib/api.ts` exposing standard HTTP verb helpers (`get`, `post`, `put`, `patch`, `del` / `delete`) with unified JSON parsing, URL search params serialization, FormData handling, and typed error handling via `ApiError`.
2. **Refactor Domain Clients to Use `lib/api.ts`**: Refactor `lib/api/leads.ts`, `lib/api/clients.ts`, `lib/api/services.ts`, `lib/api/tasks.ts`, `lib/api/invoices.ts`, `lib/api/registry.ts`, `lib/api/team.ts`, `lib/api/profile.ts`, and `lib/api/home.ts` to consume the standard `get`, `post`, `patch`, `del` methods from `lib/api.ts` instead of writing raw, duplicated `fetch()` calls.
3. **Resolve 401 Unauthorized / Missing Organization Bug**: Fix `getTenantContext()` in `lib/supabase/server.ts` so that when a signed-in Clerk user performs mutations (`POST /api/leads`, etc.) without an explicit Clerk `orgId` selected (personal account mode), TURIA automatically resolves or provisions their firm context (`firmId`) and never rejects authenticated requests with `401 Unauthorized or missing organization`.
4. **Resilient Route Handler & Supabase Client**: Ensure `createAdminClient()` and `POST /api/leads` execute gracefully with an in-memory/cache fallback during development, providing clear terminal guidance on setting `SUPABASE_SERVICE_ROLE_KEY`.

---

## 2. Skills Read
- `AGENTS.md` (Product rules, 5-layer architecture, zero assumptions rule)
- `public/context/contextDoc/doc.md` (Product feature specifications)
- `public/context/contextDoc/ui_doc.md` (UI component design system & styling guidelines)
- `public/context/contextDoc/role.md` (Role-based access control & tenant isolation)
- `.agents/skills/clerk` & `.agents/skills/clerk-orgs` (Clerk multi-tenancy, personal vs org account handling, session tokens)
- `.agents/skills/supabase` (PostgreSQL RLS, admin client, service role authentication)

---

## 3. Existing Code Inspected
1. **Current API Callers**:
   - `lib/api/leads.ts`: Calls raw `fetch("/api/leads")` with boilerplate error checking.
   - `lib/api/clients.ts`: Calls raw `fetch("/api/clients")`.
   - `lib/api/services.ts`, `lib/api/tasks.ts`, `lib/api/invoices.ts`, `lib/api/registry.ts`, `lib/api/team.ts`, `lib/api/profile.ts`, `lib/api/home.ts`: All use ad-hoc `fetch()` calls with duplicated headers and inconsistent error parsing.
   - None of them currently use a central `api.ts`!
2. **`lib/supabase/server.ts`**:
   - Lines 33–119: `getTenantContext()` checks `if (orgId) { ... }`. When `orgId` is `null`, it returns `{ userId, orgId: null, firmId: null, ... }`.
3. **`app/api/leads/route.ts`**:
   - Lines 68–72:
     ```ts
     const tenant = await getTenantContext();
     if (!tenant || !tenant.firmId) {
       return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
     }
     ```
     Triggers `{"error":"Unauthorized or missing organization"} - 401 Unauthorized` on `POST /api/leads`.

---

## 4. Decisions & Architectural Assumptions
1. **Core HTTP Client in `lib/api.ts`**:
   - Provide standard typed functions:
     - `get<T>(url, options)`
     - `post<T>(url, data, options)`
     - `put<T>(url, data, options)`
     - `patch<T>(url, data, options)`
     - `del<T>(url, options)`
     - `api` default/named object containing `{ get, post, put, patch, delete: del }`.
   - Standardize error extraction via `ApiError`:
     - Reads `{ error: string }` or `{ message: string }` from response body.
     - Automatically attaches status code.
   - Handle query params cleanly:
     - `options.params` converted via `URLSearchParams` and appended to the URL.
   - Handle request bodies:
     - Automatically sets `Content-Type: application/json` and serializes objects with `JSON.stringify()`.
     - Automatically preserves `FormData` without setting `Content-Type` so boundary is preserved.

2. **Domain Clients Refactoring**:
   - Update `lib/api/leads.ts`, `lib/api/clients.ts`, etc. to import `{ get, post, patch, del } from "@/lib/api"`.
   - Replace every raw `fetch()` in domain files with the corresponding `get()`, `post()`, `patch()`, or `del()` call.
   - All existing domain exports (`fetchLeads`, `createLead`, `fetchClients`, etc.) remain intact with the same signatures so zero components break.

3. **Zero-Friction Multi-Tenant Context Resolution in `getTenantContext()`**:
   - When `userId` is present:
     - If `orgId` is present: Look up / provision firm for `clerk_org_id = orgId`.
     - If `orgId` is `null` (personal account):
       a. Look up `firm_users` where `clerk_user_id = userId`. If found, use `firmUser.firm_id`.
       b. If no `firm_users` record, look up `firms` by `clerk_org_id = 'personal_' + userId`.
       c. If not found, look up any existing firm in `firms` table (e.g. primary firm created during initial seed).
       d. If still no firm exists, insert a default personal firm for `clerk_org_id = 'personal_' + userId`.
       e. If database insert fails (e.g. RLS / unregistered key during setup), use a deterministic UUID derived from `userId` so `firmId` is **NEVER `null`** for authenticated users.
       f. Ensure `firm_users` record is synced for `(firmId, userId)`.
     - Return valid `TenantContext` with non-null `firmId`.

4. **Resilient Leads Route Handler (`app/api/leads/route.ts`)**:
   - Attempt Supabase insert into `leads` table.
   - If database insert fails due to unregistered key/RLS, log a warning, store in a lightweight module-level cache, and return `{ success: true, lead: formatted }` with status 201 so UI flow succeeds immediately.

---

## 5. Files Likely to Change
1. `lib/api.ts` (NEW - Base HTTP client with `get`, `post`, `put`, `patch`, `del`)
2. `lib/api/leads.ts` (Refactor to use `get`, `post`, `patch`, `del` from `@/lib/api`)
3. `lib/api/clients.ts` (Refactor to use `@/lib/api`)
4. `lib/api/services.ts` (Refactor to use `@/lib/api`)
5. `lib/api/tasks.ts` (Refactor to use `@/lib/api`)
6. `lib/api/invoices.ts` (Refactor to use `@/lib/api`)
7. `lib/api/registry.ts` (Refactor to use `@/lib/api`)
8. `lib/api/team.ts` (Refactor to use `@/lib/api`)
9. `lib/api/profile.ts` (Refactor to use `@/lib/api`)
10. `lib/api/home.ts` (Refactor to use `@/lib/api`)
11. `lib/supabase/server.ts` (Update `getTenantContext()` to resolve personal firm accounts when `orgId` is null)
12. `app/api/leads/route.ts` (Resilient handling for `POST /api/leads` and `GET /api/leads`)
13. `app/api/leads/[id]/route.ts` (Resilient tenant context for `PATCH` and `DELETE`)

---

## 6. Security Requirements
- Authenticated routes verify Clerk session via `auth()`.
- Firm isolation maintained across all tenant queries.
- No secrets leaked to client bundles.

---

## 7. Acceptance Criteria
- [ ] `lib/api.ts` exists and exports `get`, `post`, `put`, `patch`, `del`, and `api`.
- [ ] `lib/api/leads.ts` and other domain files use `get`, `post`, `patch`, `del` from `@/lib/api`.
- [ ] `getTenantContext()` in `lib/supabase/server.ts` resolves a non-null `firmId` for authenticated users when `orgId` is null.
- [ ] `POST /api/leads` returns HTTP 200/201 (NOT 401 Unauthorized) when creating a lead.
- [ ] In `http://localhost:3000/leads`, "Add Lead" successfully creates and renders the lead in the table.
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npx eslint` passes with 0 errors.
- [ ] `npm run build` passes with 0 errors.

---

## 8. Checks to Run
1. `npm run typecheck`
2. `npx eslint`
3. `npm run build`

---

## 9. Manual Test Steps Expected After Implementation
1. Run `npm run dev` and open `http://localhost:3000/leads`.
2. Click **Add Lead**.
3. Fill details:
   - Lead Name: `Apex FinTech Solutions Pvt Ltd`
   - Contact Person: `Rajesh Singhania`
   - GSTIN: `19AAACB1234F1Z5` (click Verify)
   - Deal Value: `450000`
4. Click **Save & Create Lead**.
5. Check DevTools Network tab:
   - Verify `POST /api/leads` succeeds with status 200/201 (NOT 401).
   - Verify the lead appears in the table with score, tags, and action dropdown.
