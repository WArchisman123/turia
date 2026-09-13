# TURIA API Documentation & Integration Reference

TURIA is an enterprise Practice Management and Statutory Compliance SaaS Platform designed for Chartered Accountants, Tax Practitioners, and Audit Firms in India.

This document serves as the comprehensive API specification covering all endpoints, authentication flows, data structures, and database persistence guarantees.

---

## Table of Contents

1. [Architecture & Multi-Tenant Isolation](#1-architecture--multi-tenant-isolation)
2. [Authentication & Session Resolution](#2-authentication--session-resolution)
3. [Error Handling & Two-Tier Schema Resilience](#3-error-handling--two-tier-schema-resilience)
4. [Firm Management & Onboarding](#4-firm-management--onboarding)
5. [Leads Management Engine](#5-leads-management-engine)
6. [Client Master & Entity Directory](#6-client-master--entity-directory)
7. [Services Catalog & Repository](#7-services-catalog--repository)
8. [Task & Statutory Compliance Engine](#8-task--statutory-compliance-engine)
9. [Invoicing, Receipts & GSTR-1 Engine](#9-invoicing-receipts--gstr-1-engine)
10. [Team Directory & HR Management](#10-team-directory--hr-management)
11. [Statutory Registry & DSC Physical Vault](#11-statutory-registry--dsc-physical-vault)
12. [User Profile & 30-Module RBAC Matrix](#12-user-profile--30-module-rbac-matrix)
13. [Timesheets, Punch-In & Scratchpad](#13-timesheets-punch-in--scratchpad)
14. [Supabase Schema & Database Mappings](#14-supabase-schema--database-mappings)

---

## 1. Architecture & Multi-Tenant Isolation

TURIA follows a strict multi-tenant architecture:
- **Authentication**: Managed via **Clerk** (Organizations, User Roles, and Session Tokens).
- **Persistence**: Managed via **Supabase PostgreSQL**.
- **Tenant Isolation**: Every database operation is scoped by `firm_id`. All API handlers enforce `tenant.firmId` resolution. Cross-tenant access is rejected at both the API boundary and PostgreSQL Row Level Security (RLS).
- **Base URL**: `/api`

### Standard Response Envelope

All successful responses return JSON with status `200 OK` or `201 Created`.

```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Envelope

```json
{
  "error": "Descriptive error message",
  "code": "OPTIONAL_ERROR_CODE"
}
```

Standard HTTP status codes:
- `200 OK` / `201 Created`: Successful query or mutation
- `400 Bad Request`: Validation failure or missing required fields
- `401 Unauthorized`: Missing or invalid Clerk authentication token
- `403 Forbidden`: Insufficient RBAC permission
- `404 Not Found`: Resource not found or belonging to another tenant
- `500 Internal Server Error`: Unexpected server or database exception

---

## 2. Authentication & Session Resolution

All protected routes resolve tenant context using `getTenantContext()` from `@/lib/supabase/server`.

```ts
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const tenant = await getTenantContext();
  if (!tenant || !tenant.firmId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // tenant contains: firmId, userId, clerkOrgId, clerkUserId, role, fullName, email
}
```

### User Roles
- `admin`: Managing Partner / Firm Superadmin (unrestricted practice access)
- `partner`: Audit/Tax Partner (approval rights, high-level financials)
- `manager`: Practice Manager (task allocation, client assignment)
- `senior_associate`: Senior Associate / Qualified CA
- `article_trainee`: ICAI Article Assistant (restricted timesheets, sub-tasks)
- `staff`: General administrative staff
- `client`: External client portal user (view-only bills and tasks)

---

## 3. Error Handling & Two-Tier Schema Resilience

To ensure that the application functions seamlessly across database environments:
1. **Two-Tier Schema Fallback**: Endpoints that write to tables (`services_master`, `dsc_register`, `clients`) attempt to insert rich domain columns first. If remote PostgreSQL returns `PGRST204` (column not found in schema cache), the endpoint immediately catches and executes an automatic fallback inserting only verified core schema columns.
2. **Non-Blocking Audit Logs**: Auxiliary audit insertions (e.g., `dsc_movement_logs`, `task_activities`) are wrapped in non-blocking try/catch blocks so unmigrated audit tables never abort primary business workflows.

---

## 4. Firm Management & Onboarding

### Sync Clerk State to Supabase
- **Endpoint**: `POST /api/auth/sync`
- **Description**: Synchronizes the authenticated Clerk user and organization into Supabase `firms` and `firm_users`.
- **Request Body**: None (inferred from Clerk session)
- **Response**:
  ```json
  {
    "success": true,
    "firmId": "b70f92e0-9b5c-4ec5-8aff-99699c0ee2b1",
    "userId": "usr_99812",
    "role": "admin"
  }
  ```

### Get Firm Profile
- **Endpoint**: `GET /api/firm`
- **Response**:
  ```json
  {
    "firm": {
      "id": "firm-001",
      "brand_name": "Saha & Associates",
      "legal_name": "Saha & Associates Chartered Accountants",
      "business_entity": "Partnership",
      "pan_number": "AAAFF1234E",
      "gstin": "19AAAFF1234E1Z5",
      "onboarding_step": 5,
      "onboarding_completed": true,
      "total_license_seats": 5
    }
  }
  ```

### Update Firm Profile / Stepper Step
- **Endpoint**: `PATCH /api/firm`
- **Request Body**:
  ```json
  {
    "brandName": "Saha & Associates",
    "onboardingStep": 3,
    "gstin": "19AAAFF1234E1Z5"
  }
  ```

---

## 5. Leads Management Engine

### List Leads
- **Endpoint**: `GET /api/leads`
- **Query Parameters**:
  - `stage`: Filter by stage (`new_inquiry`, `contacted`, `proposal_sent`, `negotiation`, `won`, `lost`)
  - `status`: Filter by status (`Open`, `Converted`, `Lost`)
  - `assignedTo`: Assignee user ID
  - `source`: Lead source (`Website`, `Referral`, `LinkedIn`, `Cold Call`)
  - `minDealValue`, `maxDealValue`: Deal value range in INR
  - `minScore`, `maxScore`: Score range (0-100)
- **Response**: Returns 6 KPI metric cards and array of lead items:
  ```json
  {
    "leads": [
      {
        "id": "lead-001",
        "leadName": "Kolkata Logistics Corp",
        "contactPerson": "Anirban Sen",
        "email": "anirban@kolkatalogistics.com",
        "phone": "+91 98300 12345",
        "dealValue": 150000,
        "stage": "negotiation",
        "status": "Open",
        "score": 85,
        "assignedTo": "Archi Saha",
        "source": "Referral",
        "createdDate": "12/09/2026"
      }
    ],
    "kpi": {
      "openLeads": 14,
      "convertedLeads": 8,
      "lostLeads": 2,
      "totalLeads": 24,
      "openDealValue": 1850000,
      "conversionRate": 33.3
    }
  }
  ```

### Create Lead
- **Endpoint**: `POST /api/leads`
- **Request Body**:
  ```json
  {
    "leadName": "Tata Sons Pvt Ltd",
    "businessEntity": "Private Limited Company",
    "pan": "AAACT1234K",
    "gstin": "19AAACT1234K1Z2",
    "contactPerson": "Ratan Tata",
    "email": "compliance@tata.com",
    "phone": "+91 98201 99887",
    "dealValue": 500000,
    "stage": "proposal_sent",
    "assignedToId": "usr_001",
    "source": "Referral",
    "score": 90
  }
  ```

### 1-Click Convert Lead to Client
- **Endpoint**: `POST /api/leads/convert`
- **Description**: Converts a qualified lead directly into an active client in `clients`, records GSTIN in `client_gstins`, records contact person in `client_contacts`, and updates lead status to `Converted`.
- **Request Body**:
  ```json
  {
    "leadId": "lead-001",
    "tradeName": "Kolkata Logistics Corp",
    "legalName": "Kolkata Logistics Private Limited",
    "businessEntity": "Private Limited Company",
    "pan": "AAACK9988P",
    "gstin": "19AAACK9988P1Z8",
    "email": "anirban@kolkatalogistics.com",
    "phone": "+91 98300 12345",
    "contactPerson": "Anirban Sen",
    "assignedPartnerId": "usr_001"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "clientId": "f90119ec-cb6a-49aa-a1f9-ee43e62054ff",
    "message": "Lead converted to Client successfully"
  }
  ```

---

## 6. Client Master & Entity Directory

### List Clients
- **Endpoint**: `GET /api/clients`
- **Response**: 4 KPI cards and 13-column client records:
  ```json
  {
    "clients": [
      {
        "id": "client-001",
        "clientCode": "CLI-001",
        "tradeName": "Reliance Retail Ltd",
        "legalName": "Reliance Retail Limited",
        "businessEntity": "Public Limited",
        "businessPan": "AABCR1234F",
        "gstin": "27AABCR1234F1Z1",
        "email": "tax.compliance@ril.com",
        "mobileNo": "+91 98200 11223",
        "status": "active",
        "createdOn": "01/04/2026"
      }
    ],
    "kpi": {
      "totalClients": 42,
      "newClientsThisMonth": 6,
      "activeClients90Days": 38,
      "noActivity90Days": 4
    }
  }
  ```

### Create Client
- **Endpoint**: `POST /api/clients`
- **Request Body**:
  ```json
  {
    "businessName": "Infosys BPM Ltd",
    "legalName": "Infosys BPM Limited",
    "businessEntity": "Public Limited",
    "pan": "AAACI4432K",
    "gstin": "29AAACI4432K1Z5",
    "primaryEmail": "gst.filing@infosys.com",
    "primaryPhone": "+91 80285 20261",
    "contactName": "Sudha Murthy",
    "addressLine1": "Plot 44, Electronic City",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560100"
  }
  ```

### Update Client
- **Endpoint**: `PATCH /api/clients/[id]`
- **Request Body**: Partial update object (`tradeName`, `status`, `mobileNo`, etc.)

### Delete Client
- **Endpoint**: `DELETE /api/clients/[id]`

### XLSX Import & Export
- **Export**: `GET /api/clients/export` — Downloads 24-column `.xlsx` spreadsheet matching official ICAI practice standards.
- **Template**: `GET /api/clients/template` — Downloads empty 24-column `.xlsx` template.
- **Import**: `POST /api/clients/import` — Multipart form-data with `.xlsx` file for batch client creation.

---

## 7. Services Catalog & Repository

### List Services
- **Endpoint**: `GET /api/services`
- **Response**: 6 KPI cards and service menu:
  ```json
  {
    "services": [
      {
        "id": "srv-001",
        "serviceCode": "SRV-GST-001",
        "serviceName": "Monthly GSTR-1 & GSTR-3B Filing",
        "category": "Indirect Tax / GST",
        "sacCode": "998231",
        "billingType": "fixed",
        "baseFee": 15000,
        "gstRate": 18,
        "estimatedHours": 12,
        "tatDays": 5,
        "isRecurring": true,
        "recurrenceFrequency": "Monthly",
        "isActive": true
      }
    ],
    "kpi": {
      "activeServices": 28,
      "recurringServices": 18,
      "nonRecurringServices": 10,
      "defaultServices": 8,
      "inactiveServices": 2,
      "totalServices": 30
    }
  }
  ```

### Create Service
- **Endpoint**: `POST /api/services`
- **Resilience**: Features automatic fallback to core columns (`service_code`, `service_name`, `category`, `sac_code`, `base_fee`, `gst_rate`, `estimated_hours`, `tat_days`, `is_recurring`, `recurrence_frequency`, `is_active`).
- **Request Body**:
  ```json
  {
    "serviceName": "Transfer Pricing Documentation",
    "category": "International Tax",
    "sacCode": "998231",
    "professionalFee": 75000,
    "taxRate": 18,
    "tatDays": 14,
    "isRecurring": false,
    "frequency": "One Time"
  }
  ```

### Update Service
- **Endpoint**: `PATCH /api/services/[id]`
- **Request Body**: Partial update object (`serviceName`, `baseFee`, `isActive`, etc.)

---

## 8. Task & Statutory Compliance Engine

### List Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `status`: `pending`, `in_progress`, `review`, `completed`, `cancelled`
  - `priority`: `urgent`, `high`, `normal`, `low`
  - `assigneeId`: Practitioner ID
  - `clientId`: Client ID
- **Response**:
  - `tasks`: 14-column Task objects
  - `kpi`: 10 status KPI metrics (Total, Overdue, Due Today, Due This Week, In Progress, Under Review, Completed, etc.)
  - `subtasks`: Sub-task pipeline checklist items
  - `activities`: 30-day immutable activity log trail

### Create Task with 1-Click Proforma Invoice
- **Endpoint**: `POST /api/tasks`
- **Request Body**:
  ```json
  {
    "taskName": "GSTR-3B Monthly Return Filing (Sept 2026)",
    "clientId": "client-001",
    "serviceId": "srv-001",
    "financialYear": "FY 2026 - 2027",
    "selectPeriod": "September 2026",
    "startDate": "2026-09-01",
    "targetDueDate": "2026-09-18",
    "endDate": "2026-09-20",
    "assigneeId": "usr-001",
    "reviewerId": "usr-002",
    "priority": "high",
    "billingType": "Billable",
    "createProformaInvoice": true
  }
  ```
- **Description**: If `createProformaInvoice` is `true`, the system automatically inserts a corresponding draft Proforma Invoice in `invoices` and links `proforma_invoice_id` in `compliance_tasks`.

### Sub-Tasks Pipeline
- **Endpoint**: `GET /api/tasks/subtasks`, `POST /api/tasks/subtasks`, `PATCH /api/tasks/subtasks`
- **Description**: Verification checklist for 4-eyes audit review.

### Task Audit Activity Drawer
- **Endpoint**: `GET /api/tasks/activities`
- **Description**: Retrieves immutable event trail for the 30-day slide-over audit drawer.

---

## 9. Invoicing, Receipts & GSTR-1 Engine

### List Invoices & Outward Supplies
- **Endpoint**: `GET /api/invoices`
- **Query Parameters**: `type` (`proforma` | `tax_invoice` | `reimbursement` | `receipt` | `recurring`)
- **Response**:
  - `invoices`: Invoice records with line items, tax breakdowns (CGST 9%, SGST 9%, IGST 18%), and TDS deductions.
  - `kpi`: Unpaid balance, Collected revenue, Overdue receivables.
  - `gstr1`: Outward Supplies report aggregating Table 4 (B2B), Table 7 (B2C), Table 8 (Nil/Exempt), and Table 12 (HSN/SAC summary).

### Create Invoice
- **Endpoint**: `POST /api/invoices`
- **Request Body**:
  ```json
  {
    "clientId": "client-001",
    "invoiceType": "tax_invoice",
    "invoiceDate": "2026-09-15",
    "dueDate": "2026-09-30",
    "placeOfSupply": "19-West Bengal",
    "items": [
      {
        "description": "Statutory Audit FY 2025-26 Phase 1",
        "sacCode": "998231",
        "quantity": 1,
        "rate": 100000,
        "taxableValue": 100000,
        "gstRate": 18,
        "cgstAmount": 9000,
        "sgstAmount": 9000,
        "igstAmount": 0,
        "totalAmount": 118000,
        "isReimbursement": false
      }
    ],
    "notes": "Payment due within 15 days via NEFT/RTGS"
  }
  ```

### Convert Proforma Invoice to Tax Invoice
- **Endpoint**: `PATCH /api/invoices/[id]`
- **Request Body**:
  ```json
  {
    "action": "convert_to_tax_invoice",
    "taxInvoiceNumber": "INV-2026-089"
  }
  ```

### Payment Receipts & TDS Section 194J
- **Endpoint**: `GET /api/invoices/receipts`, `POST /api/invoices/receipts`
- **Description**: Records client payment remittances, TDS 194J (10% / 2%) deductions, and bank transaction UTR reference numbers.

---

## 10. Team Directory & HR Management

### List Team & Seat Capacity
- **Endpoint**: `GET /api/team`
- **Response**:
  - `users`: Employee roster with ICAI registration numbers, hourly cost, and billing rates.
  - `kpi`: Active users, Deactivated users, Resigned users, and **Seats Used / Total** (e.g. `1 / 5` capacity tracker).

### Add Employee (4-Step Stepper Wizard)
- **Endpoint**: `POST /api/team`
- **Fields**: First/Last Name, Email, Phone, Designation, Role, Department, Reporting Partner, Shift, Salary, `cost_per_hour`, `billing_rate`, ICAI Membership / Student Registration Number, KYC Address.

### Geofenced Attendance
- **Endpoint**: `GET /api/team/attendance`
- **Description**: GPS coordinates and radius tracking in meters with 4 views: Today, Weekly, Monthly, and Regularization requests.

### CA Exam Study Leaves
- **Endpoint**: `GET /api/team/leave`, `POST /api/team/leave`, `PATCH /api/team/leave`
- **Description**: Leave ledger tracking ICAI regulation study leaves for Article Assistants, casual leaves, and partner approvals.

---

## 11. Statutory Registry & DSC Physical Vault

Manages cryptographic USB tokens (ePass2003, ProxKey) for MCA, IT, and GST filings.

### List DSC Tokens
- **Endpoint**: `GET /api/registry`
- **Response**:
  - `dscList`: 12-column table records with physical bin numbers (e.g. `BIN-A12`), Class 3 certificates, vendors (eMudhra, Capricorn, VSign, Pantasign), and expiration dates.
  - `kpi`: 9 KPI metrics (`Total DSC`, `Active`, `Exp. in 30d`, `Exp. in 15d`, `Expired`, `CA Office`, `CS Office`, `Client Office`, `Missing`).

### Register New DSC Token
- **Endpoint**: `POST /api/registry`
- **Resilience**: Persists verified core fields (`signatory_name`, `business_name`, `vendor`, `bin_number`, `expiry_date`, `location`) and safely handles initial custody logging.
- **Request Body**:
  ```json
  {
    "signatoryName": "Rajesh Sharma",
    "businessName": "Sharma Steel Tubes Ltd",
    "panNumber": "AAGCS1234F",
    "vendor": "eMudhra",
    "dscClass": "Class 3",
    "issuedDate": "2026-01-10",
    "expiryDate": "2028-01-10",
    "location": "ca_office",
    "binNumber": "BIN-B05"
  }
  ```

### Physical Custody Transfer
- **Endpoint**: `PATCH /api/registry/[id]`
- **Request Body**:
  ```json
  {
    "action": "transfer_custody",
    "location": "client_office",
    "bin_number": "CLIENT-DESK",
    "handed_to": "Rajesh Sharma",
    "reason": "Handover for Annual Filing MCA board signing"
  }
  ```

---

## 12. User Profile & 30-Module RBAC Matrix

### Personal Profile & Monthly Calendar
- **Endpoint**: `GET /api/profile`, `PATCH /api/profile`
- **Description**: Personal practitioner details, assigned shifts, billing rates, and monthly attendance calendar with status badges.

### 30-Module Granular RBAC Permissions
- **Endpoint**: `GET /api/profile/permissions`, `PATCH /api/profile/permissions`
- **Description**: Manages granular module access across 5 action checkboxes (`View`, `Add/Edit`, `Delete`, `Import`, `Export`).

### Interactive Org Chart Canvas
- **Endpoint**: `GET /api/profile/org-tree`
- **Description**: Returns hierarchical node-edge graph for `@xyflow/react` rendering.

---

## 13. Timesheets, Punch-In & Scratchpad

### Attendance Punch-In / Punch-Out Hub
- **Endpoint**: `GET /api/attendance/punch`, `POST /api/attendance/punch`
- **Description**: Real-time punch-in/out recording with GPS coordinates and client audit site geotagging.

### Weekly Timesheet Matrix
- **Endpoint**: `GET /api/timesheet`, `POST /api/timesheet`
- **Description**: Calendar matrix (12 PM - 11 PM) tracking task hours, billable vs non-billable labor costing (`cost_per_hour` vs `billing_rate`).

### Auto-Saving Quick Notes
- **Endpoint**: `GET /api/notes`, `POST /api/notes`, `PATCH /api/notes`
- **Description**: Practitioner scratchpad with debounced persistence.

---

## 14. Supabase Schema & Database Mappings

All endpoints map directly to PostgreSQL tables in the Supabase instance:

| Module | Primary Table | Key Columns |
| :--- | :--- | :--- |
| **Firms** | `firms` | `id`, `clerk_org_id`, `brand_name`, `legal_name`, `pan_number`, `gstin`, `onboarding_step` |
| **Users** | `firm_users` | `id`, `firm_id`, `clerk_user_id`, `full_name`, `email`, `role`, `cost_per_hour`, `billing_rate` |
| **Leads** | `leads` | `id`, `firm_id`, `lead_name`, `deal_value`, `stage`, `status`, `score`, `assigned_to_id` |
| **Clients** | `clients` | `id`, `firm_id`, `client_code`, `trade_name`, `legal_name`, `entity_type`, `pan_number`, `status` |
| **Client GSTINs** | `client_gstins` | `id`, `firm_id`, `client_id`, `gstin`, `state`, `state_code`, `principal_place`, `is_primary` |
| **Client Contacts**| `client_contacts` | `id`, `firm_id`, `client_id`, `name`, `designation`, `email`, `phone`, `is_primary` |
| **Services** | `services_master` | `id`, `firm_id`, `service_code`, `service_name`, `category`, `sac_code`, `base_fee`, `tat_days` |
| **Tasks** | `compliance_tasks`| `id`, `firm_id`, `client_id`, `service_id`, `task_code`, `task_title`, `due_date`, `status` |
| **Subtasks** | `task_subtasks` | `id`, `task_id`, `title`, `is_completed`, `completed_at`, `completed_by_id` |
| **Invoices** | `invoices` | `id`, `firm_id`, `client_id`, `invoice_type`, `invoice_number`, `subtotal`, `total_amount`, `status` |
| **Invoice Items**| `invoice_items` | `id`, `invoice_id`, `description`, `sac_code`, `rate`, `gst_rate`, `total_amount` |
| **Receipts** | `payment_receipts`| `id`, `firm_id`, `invoice_id`, `receipt_number`, `amount_received`, `tds_amount`, `utr_number` |
| **Registry (DSC)**| `dsc_register` | `id`, `firm_id`, `dsc_code`, `business_name`, `signatory_name`, `bin_number`, `location`, `status` |
| **Attendance** | `attendance_logs` | `id`, `firm_id`, `user_id`, `date`, `punch_in`, `punch_out`, `latitude`, `longitude` |
| **Leaves** | `leave_applications`| `id`, `firm_id`, `user_id`, `leave_type`, `start_date`, `end_date`, `status` |
| **Timesheets** | `timesheet_entries`| `id`, `firm_id`, `user_id`, `task_id`, `date`, `hours_spent`, `is_billable` |
| **Notes** | `quick_notes` | `id`, `firm_id`, `user_id`, `content`, `title`, `updated_at` |

---
*TURIA Platform Engineering — Confidential & Proprietary*
