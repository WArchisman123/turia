"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";
import { ModuleSlug, PermissionAction, RoleSlug, UserRBACContext } from "./types";
import { RBAC_MATRIX, mapClerkRoleToSlug } from "./matrix";

const RBACContext = createContext<UserRBACContext | null>(null);

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { userId, orgId, orgRole, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();
  const { isLoaded: orgLoaded } = useOrganization();

  const isLoaded = authLoaded && userLoaded && orgLoaded;

  const role: RoleSlug = useMemo(() => {
    return mapClerkRoleToSlug(orgRole);
  }, [orgRole]);

  const can = useMemo(() => {
    return (action: PermissionAction, module: ModuleSlug): boolean => {
      if (!isLoaded || !userId) return false;
      const rolePerms = RBAC_MATRIX[role];
      if (!rolePerms) return false;
      return rolePerms[module]?.[action] ?? false;
    };
  }, [role, isLoaded, userId]);

  const value = useMemo<UserRBACContext>(
    () => ({
      userId: userId ?? "",
      orgId: orgId ?? null,
      role,
      clerkRole: orgRole ?? "org:admin",
      isLoaded,
      can,
    }),
    [userId, orgId, role, orgRole, isLoaded, can]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function useRBAC(): UserRBACContext {
  const ctx = useContext(RBACContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    return {
      userId: "",
      orgId: null,
      role: "admin",
      clerkRole: "org:admin",
      isLoaded: true,
      can: (action: PermissionAction, module: ModuleSlug) => {
        return RBAC_MATRIX.admin[module]?.[action] ?? true;
      },
    };
  }
  return ctx;
}
