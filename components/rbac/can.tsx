"use client";

import React from "react";
import { useRBAC } from "@/lib/rbac/client-guard";
import { ModuleSlug, PermissionAction } from "@/lib/rbac/types";

interface CanProps {
  I: PermissionAction;
  a: ModuleSlug;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Declarative component for RBAC permission gating in React.
 * Example:
 *   <Can I="delete" a="clients" fallback={<p>Not allowed</p>}>
 *     <DeleteButton />
 *   </Can>
 */
export function Can({ I: action, a: module, fallback = null, children }: CanProps) {
  const { can } = useRBAC();

  if (!can(action, module)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
