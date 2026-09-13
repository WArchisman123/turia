# TURIA - Role-Based Access Control (RBAC) & Permission Architecture
## Comprehensive Role Specifications, 30-Module Matrix & Security Blueprint

---

## 1. Overview & RBAC Philosophy

**TURIA** is engineered specifically for Indian Chartered Accountancy (CA) firms, Tax Practitioners, and Multi-Partner Audit Practices. 

In a CA practice, access control must balance **statutory confidentiality** (e.g., sensitive client financial statements, tax audit observations, partner profit share, employee hourly billing vs. internal cost rates) with **operational efficiency** (e.g., article assistants logging compliance checklists, managers assigning statutory tasks, and accountants tracking TDS 194J receipts).

TURIA implements a **Multi-Tenant Hierarchical Role-Based Access Control (RBAC)** architecture combining:
1. **Tenant Isolation**: Strict segregation by `firm_id` across all database queries and storage buckets.
2. **Standard Practice Roles**: Pre-configured CA practice roles with standardized industry default privileges.
3. **30-Module Granular Permission Matrix**: Five distinct action capabilities (`View`, `Add/Edit`, `Delete`, `Import`, `Export`) per module.
4. **Data Scope Boundaries**: Practice-wide scope vs. Assigned-Only scope (restricting users to only assigned clients, tasks, and timesheets).
5. **Sensitive Field-Level Masking**: Automatic redacting of internal labor costs (`cost_per_hour`), staff payroll (`salary`), and practice net profit margins from non-partner roles.

---

## 2. Standard Firm Roles & Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      👑 Super Admin / Managing Partner                           │
│     (Full practice governance, billing, firm settings, subscriptions, banking)   │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────────┐
│                             👔 Partner                                          │
│     (Practice oversight, all clients/tasks, sales analytics, MIS, DSC vault)     │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────────┐
│                       💼 Senior Manager / Manager                               │
│     (Assigned portfolio, task assignment, timesheet approval, leave approvals)  │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────────┐
│                   🧑‍💻 Paid Assistant / Senior Associate                          │
│     (Task execution, compliance filings, sub-tasks, client data entry)          │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────────┐
│                   🎓 Article Trainee / CA Intern                                │
│     (ICAI articleship, checklist execution, punch-in, study leave requests)     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────────┐
│ 💰 Accountant / Billing Specialist │ 🌐 Client Portal User (External Guest)     │
│ (Invoices, receipts, TDS 194J, GSTR-1) │ (Read-only view of filed forms, invoices)│
└────────────────────────────────────┴────────────────────────────────────────────┘
```

---

### 2.1 Role Profiles & Core Responsibilities

#### 1. Super Admin / Managing Partner
- **Target User**: Senior Partner, Founder, Managing Partner, Practice IT Administrator.
- **Clerk Org Role**: `org:admin`
- **Scope**: Unrestricted Practice-Wide.
- **Key Responsibilities**:
  - Full control across all 30 modules and system configuration.
  - Subscription management, license seat allocation (e.g., `1 / 5 seats used`), and firm profile setup.
  - Bank account configuration, payment gateway setup, and UPI QR configurations.
  - Modifying user RBAC permission overrides for any team member.
  - Master access to DSC Physical Vault, credential vault, and immutable 30-day activity audit logs.

#### 2. Partner
- **Target User**: Practicing Chartered Accountants who are equity/salaried partners of the firm.
- **Clerk Org Role**: `org:partner` (or `org:admin`)
- **Scope**: Unrestricted Practice-Wide.
- **Key Responsibilities**:
  - Full visibility into all client entities, compliance tasks, and billing registers.
  - Access to Executive MIS Reports, Sales Analytics, Profitability, and Form ADT-1 register.
  - Approval of staff expense claims, leave requests, and timesheets.
  - Commercial proposals, fee negotiation, and Proforma/Tax invoice sign-offs.
  - DSC token checkout and release authorizations.

#### 3. Senior Manager / Manager
- **Target User**: Qualified CAs or experienced non-CA managers leading Direct Tax, GST, Audit, or ROC teams.
- **Clerk Org Role**: `org:manager` (or `org:member`)
- **Scope**: Assigned Clients & Supervised Team Members.
- **Key Responsibilities**:
  - Allocating compliance tasks and sub-tasks to Senior Associates and Article Trainees.
  - Reviewing and approving daily/weekly timesheets and leave applications.
  - Generating draft Proforma Invoices for billable completed tasks.
  - Physical DSC token tracking (updating token Bin location e.g., `BIN-A12` or `With Client`).
  - Monitoring team turnaround time (TAT) and pending aging compliance buckets (`>60d`, `31-60d`, `15-30d`).
  - *Restricted from*: Deleting clients, editing firm banking settings, or viewing partner profit shares and peer salaries.

#### 4. Paid Assistant / Senior Associate
- **Target User**: Semi-qualified CAs (CA Inter/PCC passed), senior accountants, and compliance executives.
- **Clerk Org Role**: `org:associate` (or `org:member`)
- **Scope**: Assigned Clients & Tasks Only.
- **Key Responsibilities**:
  - Executing statutory compliance tasks (GSTR-3B, GSTR-1, Form 3CD, MCA AOC-4, MGT-7, ITR filing).
  - Executing sub-task checklists and uploading working papers and draft computations.
  - Logging daily billable timesheet entries against tasks.
  - Submitting out-of-pocket conveyance and reimbursement claims with receipt attachments.
  - *Restricted from*: Viewing firm-wide sales dashboards, modifying billing rates, deleting client master records, or exporting sensitive client bulk data.

#### 5. Article Trainee / CA Intern
- **Target User**: Article assistants registered under ICAI regulation (3-year / 2-year practical training).
- **Clerk Org Role**: `org:trainee` (or `org:member`)
- **Scope**: Strictly Assigned Tasks & Personal Records.
- **Key Responsibilities**:
  - Executing assigned statutory checklists and document collection pipelines.
  - Punching daily GPS geofenced attendance (punch-in / punch-out).
  - Logging daily timesheet hours (12 PM - 11 PM hourly matrix).
  - Applying for ICAI exam preparation study leaves under ICAI regulations.
  - Uploading personal KYC documents (Aadhaar, PAN, Form 102/103 articleship deed).
  - *Restricted from*: Viewing fees, invoices, billing amounts, client fee realization, staff salaries, internal cost per hour, DSC PINs, or firm MIS reports.

#### 6. Accountant / Billing Specialist
- **Target User**: Internal firm accountant responsible for firm bookkeeping, accounts receivable, and fee collections.
- **Clerk Org Role**: `org:accountant` (or `org:member`)
- **Scope**: Billing, Receipts, Reimbursements, and Invoicing Practice-Wide.
- **Key Responsibilities**:
  - Creating Proforma Invoices and converting them to Tax Invoices with SAC code `998222` and 18% GST.
  - Recording client payment receipts, bank UTR numbers, and TDS Section 194J deductions (10% / 2%).
  - Managing pass-through client out-of-pocket expense reimbursements (ROC challans, court stamp fees, travel).
  - Generating GSTR-1 Outward Supplies reports (Tables 4, 7, 8, 12).
  - *Restricted from*: Modifying audit task checklists, accessing statutory credential passwords, or modifying employee payroll/designations.

#### 7. Client Portal User (External)
- **Target User**: Client Managing Director, CFO, or authorized accounts executive.
- **Clerk Org Role**: `org:client_guest`
- **Scope**: Strictly Own Client Entity.
- **Key Responsibilities**:
  - Viewing real-time status of active compliance filings (GST, Income Tax, ROC, Audit).
  - Downloading finalized tax returns, filed Form 3CD audit reports, and Challan receipts.
  - Viewing and paying Proforma / Tax Invoices via UPI QR code.
  - Uploading requested source documents (bank statements, purchase registers).

---

## 3. The 30-Module RBAC Permissions Matrix

TURIA enforces permissions across **30 distinct functional modules** with 5 action flags:
- **`V` (View)**: Can view listings, detail pages, and dashboards.
- **`A` (Add/Edit)**: Can create new records, edit existing entries, and trigger status updates.
- **`D` (Delete)**: Can delete records or soft-archive items.
- **`I` (Import)**: Can execute batch spreadsheet / CSV imports (e.g. 24-column client XLSX).
- **`E` (Export)**: Can export data tables to Excel, CSV, or PDF formats.

### Comprehensive Permission Matrix by Role

| # | Module Name | Super Admin / Managing Partner | Partner | Senior Manager | Senior Associate | Article Trainee | Accountant | Client User |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **Leads Management** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, I, E` | `V, A, -, -, -` *(Assigned)* | `-` | `V, -, -, -, -` | `-` |
| **2** | **Client Master & Entities** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, I, E` | `V, A, -, -, -` *(Assigned)* | `V, -, -, -, -` *(Assigned)* | `V, A, -, -, E` | `V, -, -, -, -` *(Own)* |
| **3** | **Services Master Catalog** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` |
| **4** | **Task & Statutory Compliance** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` *(Assigned)* | `V, A, -, -, -` *(Assigned)* | `V, -, -, -, -` | `V, -, -, -, -` *(Own)* |
| **5** | **Tax Invoices** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` | `-` | `-` | `V, A, D, I, E` | `V, -, -, -, E` *(Own)* |
| **6** | **Payment Receipts & TDS 194J** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `-` | `-` | `V, A, D, -, E` | `V, -, -, -, E` *(Own)* |
| **7** | **Digital Signatures (DSC Vault)** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` | `V, A, -, -, -` *(Location)* | `V, A, -, -, -` *(Location)* | `V, -, -, -, -` | `V, -, -, -, -` *(Own)* |
| **8** | **Client Statutory Licenses** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, I, E` | `V, A, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` *(Own)* |
| **9** | **Credential Vault (Passwords)** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, -` *(Assigned)* | `V, -, -, -, -` *(Assigned)* | `-` | `-` | `-` |
| **10** | **Team & Staff Management** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` *(Team)* | `V, -, -, -, -` *(Self)* | `V, -, -, -, -` *(Self)* | `V, -, -, -, -` | `-` |
| **11** | **Time Sheet Matrix** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, D, -, E` *(Team)* | `V, A, -, -, E` *(Self)* | `V, A, -, -, -` *(Self)* | `V, -, -, -, -` | `-` |
| **12** | **Attendance & Leave** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` *(Team)* | `V, A, -, -, -` *(Self)* | `V, A, -, -, -` *(Self)* | `V, -, -, -, -` | `-` |
| **13** | **Recurring Schedules** | `V, A, D, I, -` | `V, A, D, I, -` | `V, A, -, -, -` | `V, -, -, -, -` | `-` | `V, A, -, -, -` | `-` |
| **14** | **Firm Settings & Profile** | `V, A, -, -, -` | `V, A, -, -, -` | `V, -, -, -, -` | `-` | `-` | `-` | `-` |
| **15** | **Executive MIS Reports** | `V, -, -, -, E` | `V, -, -, -, E` | `V, -, -, -, E` *(Ops MIS)* | `-` | `-` | `V, -, -, -, E` *(Sales)* | `-` |
| **16** | **Billing & Proforma Invoices** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `-` | `-` | `V, A, D, -, E` | `V, -, -, -, E` *(Own)* |
| **17** | **Document In-Out Register** | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, D, I, E` | `V, A, -, -, E` | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` *(Own)* |
| **18** | **Calendar & Statutory Due Dates** | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` |
| **19** | **Compliance Tracker** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `V, A, -, -, -` | `V, A, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` *(Own)* |
| **20** | **Firm Chat & Messaging** | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `-` |
| **21** | **Sprint Planner** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `V, A, -, -, -` | `V, -, -, -, -` | `-` | `-` |
| **22** | **Action Center** | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `-` |
| **23** | **To-Do Tasks** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, D, -, -` | `V, A, D, -, -` | `-` |
| **24** | **Notice Management** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `V, -, -, -, -` | `V, -, -, -, -` | `V, -, -, -, -` | `-` |
| **25** | **Email Communications** | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `V, -, -, -, -` | `-` | `V, A, -, -, -` | `-` |
| **26** | **Agents (AI Tax Notice OCR)** | `V, A, -, -, E` | `V, A, -, -, E` | `V, A, -, -, E` | `V, A, -, -, -` | `-` | `-` | `-` |
| **27** | **WhatsApp Business Gateway** | `V, A, -, -, -` | `V, A, -, -, -` | `V, A, -, -, -` | `-` | `-` | `V, A, -, -, -` | `-` |
| **28** | **Visitor Management** | `V, A, D, -, E` | `V, A, D, -, E` | `V, A, -, -, E` | `V, A, -, -, -` | `V, -, -, -, -` | `V, A, -, -, -` | `-` |
| **29** | **File Manager (Document Cloud)** | `V, A, -, -, E` | `V, A, -, -, E` | `V, A, -, -, E` | `V, A, -, -, -` *(Assigned)* | `V, A, -, -, -` *(Assigned)* | `V, A, -, -, -` | `V, A, -, -, -` *(Own)* |
| **30** | **Sales Financial Dashboard** | `V, -, -, -, E` | `V, -, -, -, E` | `-` | `-` | `-` | `V, -, -, -, E` | `-` |

---

## 4. How RBAC Works: Technical Implementation Blueprint

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. USER AUTHENTICATION                                                                 │
│ Clerk Auth ➔ Session Token (orgId: firm_xxx, userId: user_yyy, orgRole: org:partner)   │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ 2. PERMISSION RESOLUTION & CACHING                                                     │
│ - Supabase table `firm_users` fetched by (firm_id, clerk_user_id)                      │
│ - Overrides merged from `user_permissions` table (JSONB bitmask or slug array)         │
│ - Cached in Next.js Server Request context                                             │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
┌──────────────────────────────────────────▼─────────────────────────────────────────────┐
│ 3. MULTI-LAYER DEFENSE & ENFORCEMENT                                                   │
│                                                                                        │
│ ┌────────────────────────┐  ┌────────────────────────┐  ┌───────────────────────────┐  │
│ │ Layer A: UI Gating     │  │ Layer B: Route/Action  │  │ Layer C: Supabase RLS     │  │
│ │ - Conditional buttons  │  │ - Zod validation       │  │ - Row-Level Security      │  │
│ │ - Column masking       │  │ - Session check        │  │ - firm_id isolation       │  │
│ │ - Disabled actions     │  │ - Permission guard     │  │ - Assigned scope policies │  │
│ └────────────────────────┘  └────────────────────────┘  └───────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.1 Layer 1: Clerk Multi-Tenant Session & Metadata
When a user signs in, Clerk provides:
- `auth().orgId`: The unique tenant firm identifier (`firm_id`).
- `auth().userId`: The Clerk user ID.
- `auth().orgRole`: High-level Clerk role (`org:admin`, `org:partner`, `org:manager`, `org:associate`, `org:trainee`).

```typescript
// Example Clerk session claim structure
interface ClerkSessionClaims {
  org_id: string;          // e.g. "firm_9081a2bc"
  org_role: string;        // e.g. "org:manager"
  user_id: string;         // e.g. "user_2xABC123"
  firm_name: string;       // e.g. "Saha And Sons"
}
```

---

### 4.2 Layer 2: Permission Resolution Helper (`lib/rbac/permissions.ts`)

```typescript
export type PermissionAction = "view" | "add_edit" | "delete" | "import" | "export";

export type ModuleSlug =
  | "leads"
  | "clients"
  | "services"
  | "tasks"
  | "invoices"
  | "payments"
  | "dsc"
  | "licenses"
  | "credentials"
  | "team"
  | "timesheet"
  | "attendance"
  | "recurring"
  | "settings"
  | "reports"
  | "billing"
  | "document_in_out"
  | "calendar"
  | "compliance_tracker"
  | "chat"
  | "sprint"
  | "action_center"
  | "todo"
  | "notices"
  | "email"
  | "ai_agents"
  | "whatsapp"
  | "visitors"
  | "file_manager"
  | "sales_dashboard";

export interface UserPermissionProfile {
  firmId: string;
  userId: string;
  role: "admin" | "partner" | "manager" | "associate" | "trainee" | "accountant" | "client";
  assignedClientIds: string[];
  assignedTaskIds: string[];
  modulePermissions: Record<ModuleSlug, Record<PermissionAction, boolean>>;
}
```

---

### 4.3 Layer 3: Server Action & API Route Guard (`lib/rbac/guards.ts`)

Every Server Action and API route mutator calls a centralized RBAC enforcement function before executing:

```typescript
import { auth } from "@clerk/nextjs/server";
import { getUserPermissions } from "@/lib/rbac/service";

export async function requirePermission(module: ModuleSlug, action: PermissionAction) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("401 Unauthorized: Session missing or invalid");
  }

  const userPerms = await getUserPermissions(orgId, userId);
  
  const hasAccess = userPerms.modulePermissions[module]?.[action] ?? false;

  if (!hasAccess) {
    throw new Error(
      `403 Forbidden: User role [${userPerms.role}] does not have [${action}] permission on module [${module}]`
    );
  }

  return userPerms;
}
```

---

### 4.4 Layer 4: Supabase PostgreSQL Row-Level Security (RLS)

Database queries enforce both **Tenant Isolation** (`firm_id`) and **Scope Boundaries**:

```sql
-- 1. Strict Tenant Isolation on Tasks Table
ALTER TABLE compliance_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for compliance tasks"
ON compliance_tasks
FOR ALL
USING (
  firm_id = auth.jwt() ->> 'org_id'
);

-- 2. Scoped Access Policy for Article Trainees & Associates
CREATE POLICY "Scoped view for non-admin firm members"
ON compliance_tasks
FOR SELECT
USING (
  firm_id = auth.jwt() ->> 'org_id'
  AND (
    -- Admin & Partners see all
    (auth.jwt() ->> 'org_role') IN ('org:admin', 'org:partner')
    -- Or assigned directly
    OR assigned_to = auth.jwt() ->> 'sub'
    OR reviewer_id = auth.jwt() ->> 'sub'
  )
);
```

---

### 4.5 Layer 5: UI Declarative Gating Components

In React Client Components, use clean declarative wrappers to show/hide controls without messy nested ternaries:

```tsx
// Using the Can component wrapper
<Can I="delete" a="clients">
  <button onClick={handleDeleteClient} className="text-rose-600">
    <Trash2 className="size-4" /> Delete Client
  </button>
</Can>

// Using the usePermission hook
const { can } = usePermission();
if (can("invoices", "add_edit")) {
  // Render "+ Add Invoice" button
}
```

---

## 5. Sensitive Field-Level Security & Masking Rules

In Indian CA practices, specific financial metrics must **never leak** to junior team members:

| Sensitive Field | Who Can See | Who Is Masked (Shows `₹ --` or Hidden) |
|---|---|---|
| **Employee `cost_per_hour`** | Super Admin, Managing Partner, Salaried Partner | Managers, Senior Associates, Article Trainees, Accountants |
| **Employee `salary`** | Super Admin, Managing Partner | All other roles |
| **Service Net Profit Margin** | Super Admin, Managing Partner, Partner | Managers, Senior Associates, Article Trainees, Accountants |
| **Client Total Fee Retainership** | Super Admin, Partner, Accountant | Article Trainees, Senior Associates |
| **DSC Crypto PIN / Password** | Authorized Manager, Partner | Article Trainees, Visitors |
| **Tax Portal Credentials** | Assigned Associate, Manager, Partner | Article Trainees (unless explicitly granted) |

---

## 6. Onboarding & Member Role Assignment Flow

1. **Firm Creation**: The founding CA creates the firm workspace on Clerk and is automatically assigned `Role: Super Admin / Managing Partner`.
2. **Adding Team Members** (`< > Teams > Add Employee` 4-Step Stepper):
   - **Step 1**: Sets Designation (Partner, Manager, Senior Associate, Article Trainee) & Role (Admin, Manager, Staff).
   - **Step 2**: Enters Personal KYC & ICAI Student / Membership Registration Number.
   - **Step 3**: Enters Permanent & Current Addresses.
   - **Step 4 (Role Permissions)**: 
     - Pre-fills default permissions based on the chosen role.
     - Allows Managing Partner to selectively grant or revoke specific checkboxes across the 30 modules before sending the Clerk invitation.
3. **Invitation Acceptance**: The employee clicks the invitation link, authenticates via Clerk, and inherits their assigned permissions.
4. **Modifying Permissions**: The Managing Partner can view and edit any user's 30-module matrix at any time in `User Profile > Tab 6 (Permissions)`.

---

## 7. Audit Logging & Non-Repudiation

All security-sensitive operations generate an immutable log entry in `task_activities` and `firm_audit_logs`:
- Role changes & permission overrides
- Client deletions or mass data exports
- DSC token checkout / location transfers
- Tax Invoice deletions or credit note issuances
- Access to client credential vaults

Each audit log captures: `timestamp`, `firm_id`, `actor_user_id`, `actor_role`, `module`, `action`, `resource_id`, `ip_address`, and `changes_diff`.
