import { auth } from "@clerk/nextjs/server";
import { ModuleSlug, PermissionAction, RoleSlug } from "./types";
import { RBAC_MATRIX, mapClerkRoleToSlug, ROLES } from "./matrix";

export interface ServerAuthContext {
  userId: string;
  orgId: string | null;
  clerkRole: string | null;
  role: RoleSlug;
  isExecutive: boolean;
}

/**
 * Retrieves the current authenticated user and organization context on the server.
 */
export async function getServerAuthContext(): Promise<ServerAuthContext> {
  const session = await auth();

  if (!session.userId) {
    throw new Error("401 Unauthorized: User is not authenticated");
  }

  const roleSlug = mapClerkRoleToSlug(session.orgRole);
  const isExecutive = ROLES[roleSlug]?.isExecutive ?? false;

  return {
    userId: session.userId,
    orgId: session.orgId ?? null,
    clerkRole: session.orgRole ?? null,
    role: roleSlug,
    isExecutive,
  };
}

/**
 * Checks if the current authenticated user has a specific permission on a module.
 */
export async function checkServerPermission(
  module: ModuleSlug,
  action: PermissionAction
): Promise<boolean> {
  try {
    const context = await getServerAuthContext();
    return RBAC_MATRIX[context.role]?.[module]?.[action] ?? false;
  } catch {
    return false;
  }
}

/**
 * Enforces permission check on Server Actions / API Routes.
 * Throws 403 Forbidden error if permission is denied.
 */
export async function requirePermission(
  module: ModuleSlug,
  action: PermissionAction
): Promise<ServerAuthContext> {
  const context = await getServerAuthContext();

  const allowed = RBAC_MATRIX[context.role]?.[module]?.[action] ?? false;

  if (!allowed) {
    throw new Error(
      `403 Forbidden: Role [${context.role}] does not have [${action}] permission on module [${module}]`
    );
  }

  return context;
}
