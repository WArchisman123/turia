"use client";

import React, { useState, useEffect } from "react";
import { Shield, Check, RotateCcw, RotateCw } from "lucide-react";
import { RoleSlug, ModuleSlug, PermissionAction } from "@/lib/rbac/types";
import { RBAC_MATRIX, ROLES } from "@/lib/rbac/matrix";
import { fetchPermissions, savePermissions, SingleRolePermissions } from "@/lib/api/profile";

interface ModuleMeta {
  slug: ModuleSlug;
  name: string;
  category: "Core Practice" | "Billing & Finance" | "HR & Operations" | "Communication & AI";
}

const MODULE_LIST: ModuleMeta[] = [
  // Core Practice
  { slug: "leads", name: "Leads Management", category: "Core Practice" },
  { slug: "clients", name: "Client Master & Entities", category: "Core Practice" },
  { slug: "services", name: "Services Master Catalog", category: "Core Practice" },
  { slug: "tasks", name: "Task & Statutory Compliance", category: "Core Practice" },
  { slug: "recurring", name: "Recurring Compliance Schedules", category: "Core Practice" },
  { slug: "compliance_tracker", name: "Compliance Tracker", category: "Core Practice" },
  { slug: "calendar", name: "Calendar & Statutory Due Dates", category: "Core Practice" },
  { slug: "sprint", name: "Sprint Planner", category: "Core Practice" },
  { slug: "todo", name: "To-Do Tasks", category: "Core Practice" },
  { slug: "action_center", name: "Action Center", category: "Core Practice" },

  // Billing & Finance
  { slug: "invoices", name: "Tax Invoices & Billing", category: "Billing & Finance" },
  { slug: "billing", name: "Billing & Proforma Invoices", category: "Billing & Finance" },
  { slug: "payments", name: "Payment Receipts & TDS 194J", category: "Billing & Finance" },
  { slug: "sales_dashboard", name: "Sales Financial Dashboard", category: "Billing & Finance" },
  { slug: "reports", name: "Executive MIS Analytics Hub", category: "Billing & Finance" },

  // Registry & HR Operations
  { slug: "dsc", name: "Digital Signatures (DSC Physical Vault)", category: "HR & Operations" },
  { slug: "licenses", name: "Client Statutory Licenses", category: "HR & Operations" },
  { slug: "credentials", name: "Credential Vault (Passwords)", category: "HR & Operations" },
  { slug: "team", name: "Team Directory & License Seats", category: "HR & Operations" },
  { slug: "timesheet", name: "Time Sheet Matrix & Costing", category: "HR & Operations" },
  { slug: "attendance", name: "Attendance & Geofenced Clock-In", category: "HR & Operations" },
  { slug: "settings", name: "Firm Profile & Bank Settings", category: "HR & Operations" },
  { slug: "visitors", name: "Visitor Management", category: "HR & Operations" },

  // Communication, Docs & AI
  { slug: "document_in_out", name: "Document In-Out Register", category: "Communication & AI" },
  { slug: "file_manager", name: "File Manager (Document Cloud)", category: "Communication & AI" },
  { slug: "notices", name: "Notice Management", category: "Communication & AI" },
  { slug: "email", name: "Email Communications", category: "Communication & AI" },
  { slug: "whatsapp", name: "WhatsApp Business Gateway", category: "Communication & AI" },
  { slug: "ai_agents", name: "Agents (AI Tax Notice OCR)", category: "Communication & AI" },
  { slug: "chat", name: "Firm Chat & Messaging", category: "Communication & AI" },
];

export function PermissionsTab() {
  const [selectedRole, setSelectedRole] = useState<RoleSlug>("admin");
  const [permissionsState, setPermissionsState] = useState<SingleRolePermissions>(() => {
    return JSON.parse(JSON.stringify(RBAC_MATRIX.admin));
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadRolePermissions() {
      setIsLoading(true);
      try {
        const matrix = await fetchPermissions(selectedRole);
        if (isMounted && matrix) {
          setPermissionsState(matrix);
        }
      } catch (err) {
        console.error("Failed to load permissions:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadRolePermissions();
    return () => {
      isMounted = false;
    };
  }, [selectedRole]);

  const handleRoleChange = async (role: RoleSlug) => {
    setSelectedRole(role);
  };

  const handleToggle = async (module: ModuleSlug, action: PermissionAction) => {
    const updated = {
      ...permissionsState,
      [module]: {
        ...permissionsState[module],
        [action]: !permissionsState[module]?.[action],
      },
    };
    setPermissionsState(updated);
    setSaveStatus("Saving changes...");
    await savePermissions(updated);
    setSaveStatus("✓ Permissions updated & saved to Supabase");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleResetToDefaults = async () => {
    const defaultMatrix = JSON.parse(JSON.stringify(RBAC_MATRIX[selectedRole]));
    setPermissionsState(defaultMatrix);
    setSaveStatus("Saving defaults...");
    await savePermissions(defaultMatrix);
    setSaveStatus(`Reset to default ${ROLES[selectedRole].name} matrix`);
    setTimeout(() => setSaveStatus(null), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Role Preset Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                30-Module Granular RBAC Permissions Matrix
              </h3>
              {isLoading && <RotateCw className="size-3.5 text-slate-400 animate-spin" />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configures operational capabilities across View, Add/Edit, Delete, Import, and Export
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                {saveStatus}
              </span>
            )}
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5 text-slate-500" /> Reset Role Defaults
            </button>
          </div>
        </div>

        {/* Role Presets Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Role:</span>
          {(Object.keys(ROLES) as RoleSlug[]).map((roleKey) => {
            const role = ROLES[roleKey];
            const isSelected = selectedRole === roleKey;
            return (
              <button
                key={roleKey}
                type="button"
                onClick={() => handleRoleChange(roleKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {role.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-[11px] w-64">Module Name</th>
                <th className="py-3 px-4 font-bold text-[11px] w-36">Category</th>
                <th className="py-3 px-4 font-bold text-[11px] text-center w-24">View</th>
                <th className="py-3 px-4 font-bold text-[11px] text-center w-24">Add / Edit</th>
                <th className="py-3 px-4 font-bold text-[11px] text-center w-24">Delete</th>
                <th className="py-3 px-4 font-bold text-[11px] text-center w-24">Import</th>
                <th className="py-3 px-4 font-bold text-[11px] text-center w-24">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODULE_LIST.map((module) => {
                const perms = permissionsState[module.slug] || {
                  view: false,
                  add_edit: false,
                  delete: false,
                  import: false,
                  export: false,
                };

                return (
                  <tr key={module.slug} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{module.name}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {module.category}
                      </span>
                    </td>
                    {(["view", "add_edit", "delete", "import", "export"] as PermissionAction[]).map(
                      (action) => {
                        const checked = perms[action] ?? false;
                        return (
                          <td key={action} className="py-2.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggle(module.slug, action)}
                              className={`size-5 rounded-md border flex items-center justify-center mx-auto transition-all cursor-pointer ${
                                checked
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-slate-300 hover:border-slate-400 bg-white"
                              }`}
                            >
                              {checked && <Check className="size-3 stroke-[3]" />}
                            </button>
                          </td>
                        );
                      }
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
