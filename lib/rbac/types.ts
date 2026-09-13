export type RoleSlug =
  | "admin"
  | "partner"
  | "manager"
  | "associate"
  | "trainee"
  | "accountant"
  | "client";

export type PermissionAction =
  | "view"
  | "add_edit"
  | "delete"
  | "import"
  | "export";

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

export interface RoleDefinition {
  slug: RoleSlug;
  name: string;
  description: string;
  clerkRole: string;
  isExecutive: boolean;
}

export type ModulePermissionMap = Record<PermissionAction, boolean>;

export type RolePermissionMatrix = Record<RoleSlug, Record<ModuleSlug, ModulePermissionMap>>;

export interface UserRBACContext {
  userId: string;
  orgId: string | null;
  role: RoleSlug;
  clerkRole: string;
  isLoaded: boolean;
  can: (action: PermissionAction, module: ModuleSlug) => boolean;
}
