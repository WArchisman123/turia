-- ==============================================================================
-- TURIA - Chartered Accountancy Practice Management & Statutory Compliance SaaS
-- Master Supabase PostgreSQL Database Schema (Multi-Tenant Architecture)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. FIRMS (Multi-Tenant Root Entity)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id VARCHAR(255) UNIQUE NOT NULL,
  brand_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  business_entity VARCHAR(100) DEFAULT 'Partnership Firm',
  pan_number VARCHAR(10),
  gstin VARCHAR(15),
  cin_number VARCHAR(21),
  tan_number VARCHAR(10),
  udyam_number VARCHAR(50),
  pt_number VARCHAR(50),
  pf_number VARCHAR(50),
  esic_number VARCHAR(50),
  lut_number VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  address_line_1 TEXT,
  city VARCHAR(100) DEFAULT 'Kolkata',
  state VARCHAR(100) DEFAULT 'West Bengal',
  pin_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_firms_clerk_org ON firms(clerk_org_id);

-- ==============================================================================
-- 2. FIRM USERS / PRACTITIONERS DIRECTORY
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin',
    'partner',
    'manager',
    'senior_associate',
    'article_trainee',
    'staff',
    'client'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE employment_status_enum AS ENUM (
    'confirmed',
    'probation',
    'notice_period',
    'intern',
    'resigned',
    'deactivated'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS firm_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  clerk_user_id VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'staff',
  designation VARCHAR(100),
  department VARCHAR(100) DEFAULT 'Direct Tax',
  reporting_to_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  shift VARCHAR(100) DEFAULT 'General Shift (10:00 AM - 07:00 PM)',
  joining_date DATE,
  resignation_date DATE,
  confirmation_date DATE,
  salary NUMERIC(12, 2) DEFAULT 0.00,
  cost_per_hour NUMERIC(10, 2) DEFAULT 0.00,
  billing_rate NUMERIC(10, 2) DEFAULT 0.00,
  work_experience VARCHAR(50),
  employment_status employment_status_enum DEFAULT 'confirmed',
  dob DATE,
  gender VARCHAR(20),
  pan_number VARCHAR(10),
  aadhaar_number VARCHAR(12),
  icai_member_number VARCHAR(50),
  icai_student_number VARCHAR(50),
  avatar_url TEXT,
  address_line_1 TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pin_code VARCHAR(20),
  permissions_json JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_punch_in TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_firm_user UNIQUE (firm_id, clerk_user_id)
);

CREATE INDEX IF NOT EXISTS idx_firm_users_firm ON firm_users(firm_id);
CREATE INDEX IF NOT EXISTS idx_firm_users_clerk ON firm_users(clerk_user_id);

-- ==============================================================================
-- 3. USER KYC DOCUMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents(user_id);

-- ==============================================================================
-- 4. CLIENT MASTER & ENTITY DIRECTORY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_code VARCHAR(50) NOT NULL,
  trade_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  pan_number VARCHAR(10),
  cin_number VARCHAR(21),
  registration_no VARCHAR(100),
  primary_gstin VARCHAR(15),
  primary_email VARCHAR(255),
  primary_phone VARCHAR(50),
  contact_name VARCHAR(255),
  currency VARCHAR(10) DEFAULT 'INR',
  place_of_supply VARCHAR(100),
  address_line_1 TEXT,
  address_line_2 TEXT,
  city VARCHAR(100) DEFAULT 'Kolkata',
  state VARCHAR(100) DEFAULT 'West Bengal',
  country VARCHAR(100) DEFAULT 'India',
  pin_code VARCHAR(20),
  referred_by VARCHAR(255),
  source VARCHAR(100) DEFAULT 'Referral',
  client_group VARCHAR(255),
  auditor VARCHAR(255),
  labels TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  associate_partners VARCHAR(255),
  assigned_partner_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  assigned_manager_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helpers for clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS place_of_supply VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address_line_1 TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address_line_2 TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Kolkata';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'West Bengal';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS pin_code VARCHAR(20);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'Referral';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS client_group VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS auditor VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS associate_partners VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS registration_no VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_clients_firm ON clients(firm_id);
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients(client_code);

-- ==============================================================================
-- 5. CLIENT MULTI-STATE GSTINs
-- ==============================================================================
CREATE TABLE IF NOT EXISTS client_gstins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  gstin VARCHAR(15) NOT NULL,
  state VARCHAR(100) NOT NULL,
  state_code VARCHAR(2) NOT NULL,
  principal_place TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_gstins_client ON client_gstins(client_id);

-- ==============================================================================
-- 6. CLIENT KEY CONTACT PERSONS & DIRECTORS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  din_number VARCHAR(8),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_contacts_client ON client_contacts(client_id);

-- ==============================================================================
-- 7. CLIENT STATUTORY LICENSES (FSSAI, IEC, Trade, Factory, Shops)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS client_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  license_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  issuing_authority VARCHAR(100),
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_licenses_client ON client_licenses(client_id);

-- ==============================================================================
-- 8. SERVICES MASTER & CATALOG
-- ==============================================================================
CREATE TABLE IF NOT EXISTS services_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  service_code VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sac_code VARCHAR(20) DEFAULT '998231',
  billing_type VARCHAR(50) DEFAULT 'fixed',
  base_fee NUMERIC(12, 2) DEFAULT 0.00,
  gst_rate NUMERIC(5, 2) DEFAULT 18.00,
  estimated_hours NUMERIC(5, 2) DEFAULT 0.00,
  tat_days INTEGER DEFAULT 7,
  tat_hours VARCHAR(20) DEFAULT '00:00',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_frequency VARCHAR(50),
  difficulty_level VARCHAR(50) DEFAULT 'Intermediate',
  description TEXT,
  due_timing VARCHAR(50) DEFAULT 'Within period',
  start_day VARCHAR(50),
  target_due_day VARCHAR(50),
  end_day VARCHAR(50),
  exemption_reason VARCHAR(100),
  out_of_pocket_budget NUMERIC(10, 2) DEFAULT 0.00,
  sop_count INTEGER DEFAULT 0,
  subtasks_count INTEGER DEFAULT 0,
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  subtask_templates JSONB DEFAULT '[]'::jsonb,
  checklist_templates JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helpers for services_master
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS tat_hours VARCHAR(20) DEFAULT '00:00';
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(50) DEFAULT 'Intermediate';
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS due_timing VARCHAR(50) DEFAULT 'Within period';
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS start_day VARCHAR(50);
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS target_due_day VARCHAR(50);
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS end_day VARCHAR(50);
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS exemption_reason VARCHAR(100);
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS out_of_pocket_budget NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS sop_count INTEGER DEFAULT 0;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS subtasks_count INTEGER DEFAULT 0;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS subtask_templates JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS checklist_templates JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services_master ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_services_master_firm ON services_master(firm_id);

-- ==============================================================================
-- 9. COMPLIANCE TASKS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS compliance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services_master(id) ON DELETE SET NULL,
  task_code VARCHAR(50),
  task_title VARCHAR(255) NOT NULL,
  financial_year VARCHAR(20) NOT NULL,
  period VARCHAR(50),
  start_date DATE,
  target_date DATE NOT NULL,
  due_date DATE NOT NULL,
  assigned_to_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  priority VARCHAR(50) DEFAULT 'normal',
  stage VARCHAR(50) DEFAULT 'not_started',
  status VARCHAR(50) DEFAULT 'open',
  is_billable BOOLEAN DEFAULT TRUE,
  proforma_invoice_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_firm ON compliance_tasks(firm_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client ON compliance_tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON compliance_tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due ON compliance_tasks(due_date);

-- ==============================================================================
-- 10. TASK SUBTASKS (Verification Checklists)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS task_subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES compliance_tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  assigned_to_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtasks_task ON task_subtasks(task_id);

-- ==============================================================================
-- 11. TASK ACTIVITY LOGS (Immutable 30-Day Audit Trail)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS task_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES compliance_tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_task ON task_activities(task_id);

-- ==============================================================================
-- 12. INVOICES (Proforma & Tax Invoices)
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE invoice_type_enum AS ENUM ('proforma', 'tax_invoice');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_type invoice_type_enum DEFAULT 'tax_invoice',
  invoice_number VARCHAR(100) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  place_of_supply VARCHAR(100),
  subtotal NUMERIC(12, 2) DEFAULT 0.00,
  cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  igst_amount NUMERIC(12, 2) DEFAULT 0.00,
  total_tax NUMERIC(12, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) DEFAULT 0.00,
  paid_amount NUMERIC(12, 2) DEFAULT 0.00,
  tds_amount NUMERIC(12, 2) DEFAULT 0.00,
  balance_due NUMERIC(12, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'unpaid',
  notes TEXT,
  converted_tax_invoice_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_firm ON invoices(firm_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- ==============================================================================
-- 13. INVOICE LINE ITEMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services_master(id) ON DELETE SET NULL,
  description VARCHAR(255) NOT NULL,
  sac_code VARCHAR(20) DEFAULT '998231',
  quantity NUMERIC(10, 2) DEFAULT 1.00,
  rate NUMERIC(12, 2) DEFAULT 0.00,
  taxable_value NUMERIC(12, 2) DEFAULT 0.00,
  gst_rate NUMERIC(5, 2) DEFAULT 18.00,
  cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
  igst_amount NUMERIC(12, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) DEFAULT 0.00,
  is_reimbursement BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ==============================================================================
-- 14. PASS-THROUGH CLIENT EXPENSE REIMBURSEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS client_reimbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  challan_number VARCHAR(100),
  receipt_url TEXT,
  is_billed BOOLEAN DEFAULT FALSE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reimbursements_client ON client_reimbursements(client_id);

-- ==============================================================================
-- 15. PAYMENT RECEIPTS & TDS 194J TRACKING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payment_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  receipt_number VARCHAR(100) NOT NULL,
  receipt_date DATE NOT NULL,
  amount_received NUMERIC(12, 2) NOT NULL,
  tds_deducted NUMERIC(12, 2) DEFAULT 0.00,
  payment_mode VARCHAR(50) DEFAULT 'NEFT/RTGS',
  utr_reference VARCHAR(100),
  bank_name VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_receipts_client ON payment_receipts(client_id);

-- ==============================================================================
-- 16. RECURRING INVOICES / RETAINERSHIPS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS recurring_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  frequency VARCHAR(50) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  next_run_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_invoices_client ON recurring_invoices(client_id);

-- ==============================================================================
-- 17. LEADS & CLIENT ACQUISITION PIPELINE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  lead_code VARCHAR(50) NOT NULL,
  lead_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  business_entity VARCHAR(100) NOT NULL,
  deal_value NUMERIC(12, 2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'INR',
  stage VARCHAR(50) DEFAULT 'New',
  status VARCHAR(50) DEFAULT 'Open',
  score INTEGER DEFAULT 50,
  assigned_to VARCHAR(100),
  source VARCHAR(50) DEFAULT 'Referral',
  service_interest VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  gstin VARCHAR(15),
  pan VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(100),
  notes TEXT,
  converted_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_firm ON leads(firm_id);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- ==============================================================================
-- 18. GEOFENCED ATTENDANCE LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  total_minutes INTEGER DEFAULT 0,
  work_location VARCHAR(50) DEFAULT 'Office',
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  in_geo_coords VARCHAR(100),
  out_geo_coords VARCHAR(100),
  distance_meters NUMERIC(10, 2),
  status VARCHAR(50) DEFAULT 'present',
  is_regularized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance_logs(user_id, attendance_date);

-- ==============================================================================
-- 19. LEAVE APPLICATIONS & CA EXAM STUDY LEAVES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days_count NUMERIC(5, 2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reviewer_id UUID REFERENCES firm_users(id) ON DELETE SET NULL,
  rejection_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_user ON leave_applications(user_id);

-- ==============================================================================
-- 20. LEAVE BALANCES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  financial_year VARCHAR(20) NOT NULL,
  casual_leave_quota NUMERIC(5, 2) DEFAULT 12.00,
  casual_leave_taken NUMERIC(5, 2) DEFAULT 0.00,
  sick_leave_quota NUMERIC(5, 2) DEFAULT 10.00,
  sick_leave_taken NUMERIC(5, 2) DEFAULT 0.00,
  exam_leave_quota NUMERIC(5, 2) DEFAULT 90.00,
  exam_leave_taken NUMERIC(5, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_leave_balance UNIQUE (user_id, financial_year)
);

CREATE INDEX IF NOT EXISTS idx_leave_balances_user ON leave_balances(user_id);

-- ==============================================================================
-- 21. INTERNAL EMPLOYEE EXPENSE CLAIMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS employee_expense_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  claim_date DATE NOT NULL,
  reason TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  receipt_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  is_settled BOOLEAN DEFAULT FALSE,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expense_claims_user ON employee_expense_claims(user_id);

-- ==============================================================================
-- 22. DIGITAL SIGNATURE CERTIFICATE (DSC) PHYSICAL VAULT
-- ==============================================================================
DO $$ BEGIN
  CREATE TYPE dsc_location_enum AS ENUM ('ca_office', 'cs_office', 'client_office', 'in_transit', 'missing');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dsc_status_enum AS ENUM ('active', 'expired', 'revoked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS dsc_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  dsc_code VARCHAR(50) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  signatory_name VARCHAR(255) NOT NULL,
  pan_number VARCHAR(10),
  din_number VARCHAR(8),
  vendor VARCHAR(100) DEFAULT 'eMudhra',
  dsc_class VARCHAR(50) DEFAULT 'Class 3',
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  location dsc_location_enum DEFAULT 'ca_office',
  bin_number VARCHAR(50),
  status dsc_status_enum DEFAULT 'active',
  email VARCHAR(255),
  phone VARCHAR(50),
  token_pin_encrypted TEXT,
  token_hardware_model VARCHAR(100) DEFAULT 'ePass2003',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration helpers
ALTER TABLE dsc_register ADD COLUMN IF NOT EXISTS token_hardware_model VARCHAR(100) DEFAULT 'ePass2003';
ALTER TABLE dsc_register ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_dsc_firm ON dsc_register(firm_id);
CREATE INDEX IF NOT EXISTS idx_dsc_expiry ON dsc_register(expiry_date);
CREATE INDEX IF NOT EXISTS idx_dsc_status ON dsc_register(status);
CREATE INDEX IF NOT EXISTS idx_dsc_location ON dsc_register(location);

-- ==============================================================================
-- 22B. DSC CUSTODY MOVEMENT & CHECKOUT AUDIT LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS dsc_movement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  dsc_id UUID NOT NULL REFERENCES dsc_register(id) ON DELETE CASCADE,
  from_location VARCHAR(50),
  to_location VARCHAR(50) NOT NULL,
  from_bin VARCHAR(50),
  to_bin VARCHAR(50),
  handed_to VARCHAR(255),
  reason VARCHAR(255),
  logged_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dsc_movement_firm ON dsc_movement_logs(firm_id);
CREATE INDEX IF NOT EXISTS idx_dsc_movement_dsc ON dsc_movement_logs(dsc_id);

-- ==============================================================================
-- 23. STATUTORY AUDITOR APPOINTMENTS (FORM ADT-1)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS auditor_appointments_adt1 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  financial_year VARCHAR(20) NOT NULL,
  agm_date DATE NOT NULL,
  appointment_date DATE NOT NULL,
  tenure_years INTEGER DEFAULT 5,
  expiry_financial_year VARCHAR(20) NOT NULL,
  roc_srn_number VARCHAR(50),
  filing_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_adt1_firm ON auditor_appointments_adt1(firm_id);
CREATE INDEX IF NOT EXISTS idx_adt1_client ON auditor_appointments_adt1(client_id);

-- ==============================================================================
-- 24. DAILY PRACTITIONER TIMESHEET ENTRIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  task_id UUID REFERENCES compliance_tasks(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services_master(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL,
  hours_spent NUMERIC(5, 2) NOT NULL,
  hourly_rate NUMERIC(10, 2) DEFAULT 0.00,
  cost_rate NUMERIC(10, 2) DEFAULT 0.00,
  is_billable BOOLEAN DEFAULT TRUE,
  work_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timesheet_user_date ON timesheet_entries(user_id, entry_date);

-- ==============================================================================
-- 25. QUICK NOTES SCRATCHPAD
-- ==============================================================================
CREATE TABLE IF NOT EXISTS quick_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES firm_users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user ON quick_notes(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE firm_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_gstins ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsc_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsc_movement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditor_appointments_adt1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_notes ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically; Anon/Authenticated policies can be tuned per auth requirements.
