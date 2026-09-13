# Implementation Prompt: Lead Conversion to Client Master & CRUD Pipeline Verification

## 1. Goal
1. **Implement Real Lead-to-Client Conversion (`POST /api/leads/convert`)**:
   - Enable true 1-click conversion from a qualified Lead into an active Client record in the `clients` table, auto-populating trade name, legal name, business entity, PAN, GSTIN, primary contact, email, phone, city, state, and source (`"Lead Conversion"`).
   - Insert associated records into `client_gstins` and `client_contacts` if GSTIN and contact person are present.
   - Update the `leads` table record to mark `status: "Converted"`, `stage: "Closed Won"`, and link `converted_client_id: newClient.id`.
2. **Wire Up Batch Convert & Batch Delete in Leads Module**:
   - Connect the batch actions toolbar in `components/leads/leads-table.tsx` to execute real API operations:
     - Batch Convert: converts all selected leads into clients via `/api/leads/convert`.
     - Batch Delete: deletes all selected leads via `/api/leads/[id]` or batch delete handler.
3. **Verify and Solidify CRUD Across All App Modules**:
   - Ensure resilient error handling, status code checks, and optimistic UI updates for:
     - Leads (`/api/leads`, `/api/leads/[id]`, `/api/leads/convert`)
     - Clients (`/api/clients`, `/api/clients/[id]`)
     - Services (`/api/services`, `/api/services/[id]`)
     - Compliance Tasks (`/api/tasks`, `/api/tasks/[id]`, `/api/tasks/subtasks`)
     - Invoices (`/api/invoices`, `/api/invoices/[id]`, `/api/invoices/receipts`)
     - Team (`/api/team`, `/api/team/[id]`, `/api/team/leave`, `/api/team/reimbursement`)
     - Registry (`/api/registry`, `/api/registry/[id]`)

---

## 2. Skills Read
- `AGENTS.md` (Workflow, Multi-tenant rules, Section 9 Leads Management, Section 18 API Route & Security Rules)
- `public/context/contextDoc/doc.md` (Product specifications)
- `public/context/contextDoc/ui_doc.md` (UI design standards)
- `.agents/skills/supabase` (Supabase relational queries, RLS, service role client, multi-tenant isolation)

---

## 3. Existing Code Inspected
1. **`app/leads/page.tsx`**:
   - `handleConvertLead`: Currently only executes `updateLeadStatus(id, "Converted", "Closed Won")`. It does **not** create a client in the `clients` table, nor does it link `converted_client_id`.
   - `handleBatchConvert`: Only mutates local React state without invoking any API endpoint.
   - `handleBatchDelete`: Only filters local React state without invoking DELETE requests.
2. **`app/api/leads/route.ts` & `app/api/leads/[id]/route.ts`**:
   - `POST /api/leads` and `PATCH /api/leads/[id]` exist and function properly.
   - `POST /api/leads/convert` is **missing** entirely despite being explicitly required in `AGENTS.md` section 18.
3. **`lib/api/leads.ts`**:
   - Lacks `convertLeadToClient(leadId)`, `batchConvertLeads(leadIds)`, and `batchDeleteLeads(leadIds)`.
4. **`supabase/schema.sql`**:
   - Table `leads` already contains column `converted_client_id UUID REFERENCES clients(id) ON DELETE SET NULL`.
   - Table `clients` contains all matching columns (`trade_name`, `legal_name`, `entity_type`, `pan_number`, `primary_gstin`, `primary_email`, `primary_phone`, `contact_name`, `city`, `state`, `source`, `status`).
5. **Other Modules Inspected**:
   - `app/invoices/page.tsx` & `app/api/invoices/[id]/route.ts`: Proforma to Tax Invoice conversion works via `action: "convert_to_tax_invoice"`.
   - `app/tasks/page.tsx` & `app/api/tasks/route.ts`: Task creation auto-creates proforma invoice if selected and records activity logs.
   - `app/clients/page.tsx` & `app/api/clients/route.ts`: Full CRUD with GSTIN and contact table inserts is operational.
   - `app/services/page.tsx`: Full CRUD with SAC codes and commercial TAT is operational.
   - `app/registry/page.tsx`: Custody transfer, Bin numbers, and token CRUD are operational.
   - `app/team/page.tsx`: Staff onboarding, leave applications, and reimbursement claims are operational.

---

## 4. Decisions & Architectural Assumptions
1. **Dedicated Endpoint `POST /api/leads/convert`**:
   - Conforms strictly to `AGENTS.md` section 18 (`POST /api/leads/convert`).
   - Accepts payload: `{ leadId: string }` or `{ leadIds: string[] }`.
   - Checks tenant session via `getTenantContext()` to isolate queries by `firm_id`.
   - Converts the lead data into a new `clients` record:
     - `client_code`: `CL-${Date.now().toString().slice(-4)}`
     - `trade_name`: `lead.lead_name`
     - `legal_name`: `lead.legal_name || lead.lead_name`
     - `entity_type`: `lead.business_entity`
     - `pan_number`: `lead.pan || (lead.gstin?.length >= 12 ? lead.gstin.substring(2, 12) : null)`
     - `primary_gstin`: `lead.gstin || null`
     - `primary_email`: `lead.email || null`
     - `primary_phone`: `lead.phone || null`
     - `contact_name`: `lead.contact_person`
     - `city`: `lead.city || "Kolkata"`
     - `state`: `lead.state || "West Bengal"`
     - `source`: `"Lead Conversion"`
     - `status`: `"active"`
   - Inserts into `client_gstins` and `client_contacts` when data exists.
   - Updates `leads` table: sets `status = 'Converted'`, `stage = 'Closed Won'`, `converted_client_id = newClient.id`.
   - In-memory fallback support: if the lead is in session memory, it also syncs to the memory clients store for seamless local dev.
2. **Batch Actions Support**:
   - `handleBatchConvert(ids)` will invoke `batchConvertLeads(ids)` so that selecting multiple leads and clicking "Convert Selected" converts every selected lead into active clients.
   - `handleBatchDelete(ids)` will invoke `batchDeleteLeads(ids)` to remove all selected leads from the database.
3. **User Feedback & Toast Notification**:
   - On successful conversion, display an inline toast or notification confirming:
     `"Lead converted to Client successfully! View in Client Master"`, with an action link to `/clients`.

---

## 5. Files Likely to Change
1. `app/api/leads/convert/route.ts` (NEW: Endpoint for converting lead(s) to client(s))
2. `lib/api/leads.ts` (Add `convertLeadToClient`, `batchConvertLeads`, `batchDeleteLeads`)
3. `app/leads/page.tsx` (Wire `handleConvertLead`, `handleBatchConvert`, and `handleBatchDelete` to real API calls)
4. `components/leads/leads-table.tsx` (Ensure convert action visual feedback is clear)

---

## 6. Visual Interpretation & UI Expectations
- When practitioner clicks **Convert to Client** in the 3-dots action menu:
  - Lead row immediately updates status pill to `Converted` (emerald badge) and stage to `Closed Won`.
  - A brief confirmation message notifies the practitioner: `"Lead successfully converted into Client Master!"`.
  - Visiting `/clients` immediately shows the new client record in the Client Directory.
- When practitioner selects 2+ checkboxes in the leads table:
  - Indigo action bar appears: `N leads selected`.
  - Clicking **Convert Selected** converts all selected leads and updates their statuses.
  - Clicking **Delete Selected** prompts confirmation and permanently deletes selected leads.

---

## 7. Security Requirements
- All routes must require valid tenant context (`getTenantContext()`).
- All Supabase queries must filter strictly by `firm_id`.
- 401 Unauthorized returned if no valid session or firm ID exists.
- Inputs must be sanitized and validated before database persistence.

---

## 8. Acceptance Criteria
- [ ] `POST /api/leads/convert` is created and functional for single and batch conversions.
- [ ] Converting a lead creates a client in the `clients` table (with contact and GSTIN if available) and links `converted_client_id`.
- [ ] Converted client appears immediately on `http://localhost:3000/clients`.
- [ ] Batch Convert and Batch Delete in `app/leads/page.tsx` call the API and update the database.
- [ ] All checks pass:
  - `npm run typecheck` (0 errors)
  - `npm run lint` (0 errors)
  - `npm run build` (0 errors)

---

## 9. Checks to Run
1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`

---

## 10. Manual Test Steps Expected After Implementation
1. **Single Lead Conversion**:
   - Go to `http://localhost:3000/leads`.
   - Find an `Open` lead (e.g. *Apex Logistics Solutions* or create a new lead).
   - Click the 3-dots action icon (⋮) in the row.
   - Click **Convert to Client**.
   - Verify lead status changes to `Converted` (green badge) and stage changes to `Closed Won`.
   - Navigate to `http://localhost:3000/clients` and verify *Apex Logistics Solutions* is listed in the Client Master table.
2. **Batch Lead Conversion**:
   - Select 2 open leads using the table checkboxes.
   - In the batch action bar, click **Convert Selected**.
   - Verify both leads are marked `Converted` and appear in `http://localhost:3000/clients`.
3. **Batch Delete**:
   - Select 1 or more test leads and click **Delete Selected**.
   - Verify the leads are removed from the database and table.
