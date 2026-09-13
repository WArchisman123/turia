"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Receipt,
  CheckSquare,
  Users,
  FileText,
  Shield,
  Network,
  GripVertical,
} from "lucide-react";

import { ProfileDetailsTab } from "@/components/profile/profile-details-tab";
import { ReimbursementTab } from "@/components/profile/reimbursement-tab";
import { TasksTab } from "@/components/profile/tasks-tab";
import { ClientsTab } from "@/components/profile/clients-tab";
import { DocumentsTab } from "@/components/profile/documents-tab";
import { PermissionsTab } from "@/components/profile/permissions-tab";
import { OrganizationTab } from "@/components/profile/organization-tab";

export default function ProfilePage() {
  return (
    <AppShell>
      {/* Top Header Breadcrumb Strip */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            User Profile &amp; Member Portal
          </h1>
          <p className="text-xs text-slate-500">
            Personal compliance workbench, leave tracking, KYC vault &amp; 30-module RBAC permissions
          </p>
        </div>
      </div>

      {/* 7-Tabbed Member Portal */}
      <Tabs defaultValue="profile" className="w-full">
        {/* Master Tab Trigger Strip */}
        <div className="bg-white rounded-t-xl border-x border-t border-[#E2E8F0] px-4 pt-2 shadow-xs overflow-x-auto">
          <TabsList variant="line" className="gap-6">
            {/* Tab 1: Profile Details */}
            <TabsTrigger
              variant="line"
              value="profile"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <User className="size-4 text-slate-500" />
              Profile Details
            </TabsTrigger>

            {/* Tab 2: Reimbursement */}
            <TabsTrigger
              variant="line"
              value="reimbursement"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Receipt className="size-4 text-slate-500" />
              Reimbursement
            </TabsTrigger>

            {/* Tab 3: Tasks */}
            <TabsTrigger
              variant="line"
              value="tasks"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <CheckSquare className="size-4 text-slate-500" />
              Tasks
            </TabsTrigger>

            {/* Tab 4: Clients */}
            <TabsTrigger
              variant="line"
              value="clients"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Users className="size-4 text-slate-500" />
              Clients
            </TabsTrigger>

            {/* Tab 5: Documents */}
            <TabsTrigger
              variant="line"
              value="documents"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <FileText className="size-4 text-slate-500" />
              Documents
            </TabsTrigger>

            {/* Tab 6: Permissions */}
            <TabsTrigger
              variant="line"
              value="permissions"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Shield className="size-4 text-indigo-600" />
              Permissions
            </TabsTrigger>

            {/* Tab 7: Organization */}
            <TabsTrigger
              variant="line"
              value="organization"
              className="gap-2 text-xs font-semibold whitespace-nowrap"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Network className="size-4 text-slate-500" />
              Organization
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-4">
          <TabsContent value="profile" className="mt-0">
            <ProfileDetailsTab />
          </TabsContent>

          <TabsContent value="reimbursement" className="mt-0">
            <ReimbursementTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TasksTab />
          </TabsContent>

          <TabsContent value="clients" className="mt-0">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="documents" className="mt-0">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="permissions" className="mt-0">
            <PermissionsTab />
          </TabsContent>

          <TabsContent value="organization" className="mt-0">
            <OrganizationTab />
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}
