import { RoleSlug, RolePermissionMatrix, RoleDefinition } from "./types";

export const ROLES: Record<RoleSlug, RoleDefinition> = {
  admin: {
    slug: "admin",
    name: "Super Admin / Managing Partner",
    description: "Full practice governance, billing, firm settings, subscriptions, and banking.",
    clerkRole: "org:admin",
    isExecutive: true,
  },
  partner: {
    slug: "partner",
    name: "Partner",
    description: "Practice oversight, all clients/tasks, sales analytics, MIS, and DSC vault.",
    clerkRole: "org:partner",
    isExecutive: true,
  },
  manager: {
    slug: "manager",
    name: "Senior Manager / Manager",
    description: "Assigned portfolio, task assignment, timesheet approvals, and leave approvals.",
    clerkRole: "org:manager",
    isExecutive: false,
  },
  associate: {
    slug: "associate",
    name: "Paid Assistant / Senior Associate",
    description: "Task execution, compliance filings, sub-tasks, and client data entry.",
    clerkRole: "org:associate",
    isExecutive: false,
  },
  trainee: {
    slug: "trainee",
    name: "Article Trainee / CA Intern",
    description: "ICAI articleship, checklist execution, punch-in, and study leave requests.",
    clerkRole: "org:trainee",
    isExecutive: false,
  },
  accountant: {
    slug: "accountant",
    name: "Accountant / Billing Specialist",
    description: "Invoices, receipts, TDS 194J, and GSTR-1 outward reports.",
    clerkRole: "org:accountant",
    isExecutive: false,
  },
  client: {
    slug: "client",
    name: "Client Portal User",
    description: "External guest viewing filed forms, invoices, and payments.",
    clerkRole: "org:client_guest",
    isExecutive: false,
  },
};

const full = { view: true, add_edit: true, delete: true, import: true, export: true };
const viewOnly = { view: true, add_edit: false, delete: false, import: false, export: false };
const viewExport = { view: true, add_edit: false, delete: false, import: false, export: true };
const none = { view: false, add_edit: false, delete: false, import: false, export: false };

export const RBAC_MATRIX: RolePermissionMatrix = {
  // 1. Super Admin / Managing Partner (Full 30-Module access matching profile-6.png)
  admin: {
    leads: full,
    clients: full,
    services: full,
    tasks: full,
    invoices: full,
    payments: { view: true, add_edit: true, delete: true, import: false, export: true },
    dsc: full,
    licenses: full,
    credentials: full,
    team: full,
    timesheet: { view: true, add_edit: true, delete: true, import: false, export: true },
    attendance: { view: true, add_edit: true, delete: true, import: false, export: true },
    recurring: { view: true, add_edit: true, delete: true, import: true, export: false },
    settings: { view: true, add_edit: true, delete: false, import: false, export: false },
    reports: viewExport,
    billing: { view: true, add_edit: true, delete: false, import: false, export: true },
    document_in_out: full,
    calendar: { view: true, add_edit: true, delete: false, import: false, export: false },
    compliance_tracker: { view: true, add_edit: true, delete: true, import: false, export: true },
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: { view: true, add_edit: true, delete: true, import: false, export: true },
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: true },
    notices: { view: true, add_edit: true, delete: true, import: false, export: true },
    email: viewOnly,
    ai_agents: { view: true, add_edit: true, delete: false, import: false, export: true },
    whatsapp: viewOnly,
    visitors: { view: true, add_edit: true, delete: true, import: false, export: true },
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: true },
    sales_dashboard: viewExport,
  },

  // 2. Partner (Practice-wide oversight & executive dashboards)
  partner: {
    leads: full,
    clients: full,
    services: full,
    tasks: full,
    invoices: full,
    payments: { view: true, add_edit: true, delete: true, import: false, export: true },
    dsc: full,
    licenses: full,
    credentials: full,
    team: full,
    timesheet: { view: true, add_edit: true, delete: true, import: false, export: true },
    attendance: { view: true, add_edit: true, delete: true, import: false, export: true },
    recurring: { view: true, add_edit: true, delete: true, import: true, export: false },
    settings: { view: true, add_edit: true, delete: false, import: false, export: false },
    reports: viewExport,
    billing: { view: true, add_edit: true, delete: false, import: false, export: true },
    document_in_out: full,
    calendar: { view: true, add_edit: true, delete: false, import: false, export: false },
    compliance_tracker: { view: true, add_edit: true, delete: true, import: false, export: true },
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: { view: true, add_edit: true, delete: true, import: false, export: true },
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: true },
    notices: { view: true, add_edit: true, delete: true, import: false, export: true },
    email: viewOnly,
    ai_agents: { view: true, add_edit: true, delete: false, import: false, export: true },
    whatsapp: viewOnly,
    visitors: { view: true, add_edit: true, delete: true, import: false, export: true },
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: true },
    sales_dashboard: viewExport,
  },

  // 3. Senior Manager / Manager (Assigned portfolio & supervised team scope)
  manager: {
    leads: { view: true, add_edit: true, delete: false, import: true, export: true },
    clients: { view: true, add_edit: true, delete: false, import: true, export: true },
    services: { view: true, add_edit: true, delete: false, import: false, export: true },
    tasks: { view: true, add_edit: true, delete: true, import: false, export: true },
    invoices: { view: true, add_edit: true, delete: false, import: false, export: true },
    payments: { view: true, add_edit: true, delete: false, import: false, export: true },
    dsc: { view: true, add_edit: true, delete: false, import: false, export: true },
    licenses: { view: true, add_edit: true, delete: false, import: true, export: true },
    credentials: { view: true, add_edit: true, delete: false, import: false, export: false },
    team: { view: true, add_edit: true, delete: false, import: false, export: true },
    timesheet: { view: true, add_edit: true, delete: true, import: false, export: true },
    attendance: { view: true, add_edit: true, delete: false, import: false, export: true },
    recurring: { view: true, add_edit: true, delete: false, import: false, export: false },
    settings: { view: true, add_edit: false, delete: false, import: false, export: false },
    reports: viewExport,
    billing: { view: true, add_edit: true, delete: false, import: false, export: true },
    document_in_out: full,
    calendar: { view: true, add_edit: true, delete: false, import: false, export: false },
    compliance_tracker: { view: true, add_edit: true, delete: false, import: false, export: true },
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: { view: true, add_edit: true, delete: false, import: false, export: true },
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: true },
    notices: { view: true, add_edit: true, delete: false, import: false, export: true },
    email: viewOnly,
    ai_agents: { view: true, add_edit: true, delete: false, import: false, export: true },
    whatsapp: viewOnly,
    visitors: { view: true, add_edit: true, delete: false, import: false, export: true },
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: true },
    sales_dashboard: none,
  },

  // 4. Paid Assistant / Senior Associate (Task execution & compliance filings)
  associate: {
    leads: { view: true, add_edit: true, delete: false, import: false, export: false },
    clients: { view: true, add_edit: true, delete: false, import: false, export: false },
    services: viewOnly,
    tasks: { view: true, add_edit: true, delete: false, import: false, export: true },
    invoices: none,
    payments: none,
    dsc: { view: true, add_edit: true, delete: false, import: false, export: false },
    licenses: { view: true, add_edit: true, delete: false, import: false, export: false },
    credentials: { view: true, add_edit: false, delete: false, import: false, export: false },
    team: { view: true, add_edit: false, delete: false, import: false, export: false },
    timesheet: { view: true, add_edit: true, delete: false, import: false, export: true },
    attendance: { view: true, add_edit: true, delete: false, import: false, export: false },
    recurring: viewOnly,
    settings: none,
    reports: none,
    billing: none,
    document_in_out: { view: true, add_edit: true, delete: false, import: false, export: true },
    calendar: { view: true, add_edit: true, delete: false, import: false, export: false },
    compliance_tracker: { view: true, add_edit: true, delete: false, import: false, export: false },
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: { view: true, add_edit: true, delete: false, import: false, export: false },
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: false },
    notices: viewOnly,
    email: viewOnly,
    ai_agents: { view: true, add_edit: true, delete: false, import: false, export: false },
    whatsapp: none,
    visitors: { view: true, add_edit: true, delete: false, import: false, export: false },
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: false },
    sales_dashboard: none,
  },

  // 5. Article Trainee / CA Intern (Statutory checklist execution, timesheet & punch-in)
  trainee: {
    leads: none,
    clients: viewOnly,
    services: viewOnly,
    tasks: { view: true, add_edit: true, delete: false, import: false, export: false },
    invoices: none,
    payments: none,
    dsc: { view: true, add_edit: true, delete: false, import: false, export: false },
    licenses: viewOnly,
    credentials: none,
    team: viewOnly,
    timesheet: { view: true, add_edit: true, delete: false, import: false, export: false },
    attendance: { view: true, add_edit: true, delete: false, import: false, export: false },
    recurring: none,
    settings: none,
    reports: none,
    billing: none,
    document_in_out: { view: true, add_edit: true, delete: false, import: false, export: false },
    calendar: viewOnly,
    compliance_tracker: { view: true, add_edit: true, delete: false, import: false, export: false },
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: viewOnly,
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: false },
    notices: viewOnly,
    email: none,
    ai_agents: none,
    whatsapp: none,
    visitors: viewOnly,
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: false },
    sales_dashboard: none,
  },

  // 6. Accountant / Billing Specialist (Invoices, Receipts, TDS 194J, GSTR-1 Outward)
  accountant: {
    leads: viewOnly,
    clients: { view: true, add_edit: true, delete: false, import: false, export: true },
    services: viewOnly,
    tasks: viewOnly,
    invoices: full,
    payments: { view: true, add_edit: true, delete: true, import: false, export: true },
    dsc: viewOnly,
    licenses: viewOnly,
    credentials: none,
    team: viewOnly,
    timesheet: viewOnly,
    attendance: viewOnly,
    recurring: { view: true, add_edit: true, delete: false, import: false, export: false },
    settings: none,
    reports: viewExport,
    billing: full,
    document_in_out: { view: true, add_edit: true, delete: false, import: false, export: false },
    calendar: viewOnly,
    compliance_tracker: viewOnly,
    chat: { view: true, add_edit: true, delete: false, import: false, export: false },
    sprint: none,
    action_center: viewOnly,
    todo: { view: true, add_edit: true, delete: true, import: false, export: false },
    notices: viewOnly,
    email: { view: true, add_edit: true, delete: false, import: false, export: false },
    ai_agents: none,
    whatsapp: { view: true, add_edit: true, delete: false, import: false, export: false },
    visitors: { view: true, add_edit: true, delete: false, import: false, export: false },
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: false },
    sales_dashboard: viewExport,
  },

  // 7. Client Portal User (External guest restricted to own documents/invoices)
  client: {
    leads: none,
    clients: viewOnly,
    services: viewOnly,
    tasks: viewOnly,
    invoices: viewExport,
    payments: viewExport,
    dsc: viewOnly,
    licenses: viewOnly,
    credentials: none,
    team: none,
    timesheet: none,
    attendance: none,
    recurring: none,
    settings: none,
    reports: none,
    billing: viewExport,
    document_in_out: { view: true, add_edit: true, delete: false, import: false, export: false },
    calendar: viewOnly,
    compliance_tracker: viewOnly,
    chat: none,
    sprint: none,
    action_center: none,
    todo: none,
    notices: none,
    email: none,
    ai_agents: none,
    whatsapp: none,
    visitors: none,
    file_manager: { view: true, add_edit: true, delete: false, import: false, export: false },
    sales_dashboard: none,
  },
};

export function mapClerkRoleToSlug(clerkRole?: string | null): RoleSlug {
  if (!clerkRole) return "admin"; // Default fallback for dev/local

  switch (clerkRole) {
    case "org:admin":
    case "admin":
      return "admin";
    case "org:partner":
    case "partner":
      return "partner";
    case "org:manager":
    case "manager":
      return "manager";
    case "org:associate":
    case "associate":
      return "associate";
    case "org:trainee":
    case "trainee":
      return "trainee";
    case "org:accountant":
    case "accountant":
      return "accountant";
    case "org:client_guest":
    case "client":
      return "client";
    default:
      return "admin";
  }
}
