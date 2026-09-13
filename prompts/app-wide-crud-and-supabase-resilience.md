# Implementation Prompt: App-Wide CRUD & Supabase Schema Resilience

## 1. Goal
1. **Harden App-Wide CRUD Against Schema Discrepancies**:
   - Ensure that all remaining create and update mutation endpoints across the application (`services`, `registry`, `clients`) write cleanly to Supabase PostgreSQL without throwing PGRST204 (`column not found in schema cache`) errors.
   - Ensure that optional or unmigrated auxiliary fields gracefully fallback to core database schema columns.
2. **Harmonize Error Handling & Safe Logging**:
   - In `app/api/registry/route.ts` and `app/api/registry/[id]/route.ts`, safeguard `dsc_movement_logs` insertion with try/catch so unmigrated audit tables do not block primary DSC token creation or custody transfers.
   - In `app/api/services/route.ts` and `app/api/services/[id]/route.ts`, persist core service commercial columns (`service_code`, `service_name`, `category`, `sac_code`, `billing_type`, `base_fee`, `gst_rate`, `estimated_hours`, `tat_days`, `is_recurring`, `recurrence_frequency`, `is_active`) to `services_master`.
   - In `app/api/clients/[id]/route.ts`, ensure client status and core field updates fallback gracefully if optional migration columns are absent.
3. **End-to-End Build & Operational Verification**:
   - Run typecheck, lint, and build checks across all 50 routes.
   - Provide comprehensive verification instructions across all 6 core modules: Leads, Clients, Services, Tasks, Invoices, and Registry.

---

## 2. Skills Read
- `AGENTS.md` (Product specifications, Multi-tenant rules, Section 7 Supabase Source of Truth, Section 20 Security & Code Standards)
- `public/context/contextDoc/doc.md` (Domain specifications)
- `.agents/skills/supabase` (Postgres schema design, RLS, service role client, schema cache gotchas)

---

## 3. Existing Code Inspected
1. **`app/api/services/route.ts`**:
   - Lines 346–377: Inserts non-existent columns (`tat_hours`, `difficulty_level`, `description`, `due_timing`, `start_day`, `target_due_day`, `end_day`, `exemption_reason`, `out_of_pocket_budget`, `sop_count`, `subtasks_count`, `notes`, `is_default`) into `services_master`, causing Supabase to reject insertions with code PGRST204 (`tat_hours column not found`).
2. **`app/api/services/[id]/route.ts`**:
   - Lines 58–66: Attempts to update `tat_hours`, `difficulty_level`, `description`, `out_of_pocket_budget`, `exemption_reason`, which causes update failures if columns are unmigrated.
3. **`app/api/registry/route.ts`**:
   - Line 274: Inserts `token_hardware_model` and `notes` into `dsc_register`, which does not exist in the remote database table.
   - Line 308: Inserts into `dsc_movement_logs` without try/catch, causing 500 failure if the movement logs table has not been created yet.
4. **`app/api/registry/[id]/route.ts`**:
   - Line 103: Updates `token_hardware_model` and `notes` without core column fallback.
5. **`app/api/clients/[id]/route.ts`**:
   - Line 83: Does not have core column fallback on `clients` update.

---

## 4. Decisions & Architectural Assumptions
1. **Two-Tier Insertion Pattern (Schema Resilience)**:
   - For `services_master`, attempt the rich insertion first. If Supabase returns PGRST204 (column missing), fall back to inserting the verified core columns (`firm_id`, `service_code`, `service_name`, `category`, `sac_code`, `billing_type`, `base_fee`, `gst_rate`, `estimated_hours`, `tat_days`, `is_recurring`, `recurrence_frequency`, `is_active`).
   - For `dsc_register`, write the verified columns (`firm_id`, `client_id`, `dsc_code`, `business_name`, `legal_name`, `signatory_name`, `pan_number`, `din_number`, `vendor`, `dsc_class`, `issued_date`, `expiry_date`, `location`, `bin_number`, `status`, `email`, `phone`, `token_pin_encrypted`).
   - For `dsc_movement_logs`, wrap custody audit log insertion in a non-blocking try/catch so custody transfers succeed even if the separate movement table is unmigrated.
2. **Consistency Across Modules**:
   - Every module maintains full TypeScript type safety with strict zero `any`.
   - Every route validates `getTenantContext()` and filters by `firm_id`.

---

## 5. Files Likely to Change
1. `app/api/services/route.ts` (Resilient service insertion)
2. `app/api/services/[id]/route.ts` (Resilient service update)
3. `app/api/registry/route.ts` (Resilient DSC insertion & movement log handling)
4. `app/api/registry/[id]/route.ts` (Resilient DSC update & custody transfer)
5. `app/api/clients/[id]/route.ts` (Resilient client update)

---

## 6. Security Requirements
- All routes must check `getTenantContext()` and return 401 Unauthorized for unauthenticated or unorganized requests.
- All Supabase mutations must be restricted to `firm_id = tenant.firmId`.
- Sensitive token PINs must only be handled server-side.

---

## 7. Acceptance Criteria
- [ ] `POST /api/services` successfully creates services directly in Supabase `services_master`.
- [ ] `PATCH /api/services/[id]` successfully updates services in Supabase `services_master`.
- [ ] `POST /api/registry` successfully creates DSC tokens in Supabase `dsc_register`.
- [ ] `PATCH /api/registry/[id]` successfully transfers custody and updates DSC tokens.
- [ ] `PATCH /api/clients/[id]` successfully updates clients in Supabase `clients`.
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
1. **Services Creation & Toggle**:
   - Go to `http://localhost:3000/services`.
   - Click **+ Add Service** and submit a new service (e.g. *Transfer Pricing Documentation*).
   - Verify it appears in the table and in Supabase `services_master`.
   - Toggle the active status switch in the row and confirm the update persists.
2. **Statutory Registry (DSC)**:
   - Go to `http://localhost:3000/registry`.
   - Click **+ Add DSC** and submit a new token (e.g. for *Rajesh Sharma*, *BIN-B05*).
   - Verify it appears in the table and in Supabase `dsc_register`.
   - Transfer custody to "Client Office" and verify the status pill updates.
3. **Client Master**:
   - Go to `http://localhost:3000/clients`.
   - Toggle status or edit client details; verify persistence.
