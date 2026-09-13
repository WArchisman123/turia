"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { OnboardingBanner } from "@/components/home/onboarding-banner";
import { AttendanceTab } from "@/components/home/attendance-tab";
import { TimesheetTab } from "@/components/home/timesheet-tab";
import { SalesTab } from "@/components/home/sales-tab";
import { NotesTab } from "@/components/home/notes-tab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, BarChart2, FileText, GripVertical } from "lucide-react";

export default function HomePage() {
  return (
    <AppShell>
      {/* 5-Step Onboarding Profile Setup Banner */}
      <OnboardingBanner />

      {/* Home Cockpit 4-Tabbed Workspace */}
      <Tabs defaultValue="attendance" className="w-full">
        {/* Master Tab Trigger Strip */}
        <div className="bg-white rounded-t-xl border-x border-t border-[#E2E8F0] px-4 pt-2 shadow-xs">
          <TabsList variant="line" className="gap-8">
            {/* Attendance Tab */}
            <TabsTrigger
              variant="line"
              value="attendance"
              className="gap-2 text-xs font-semibold"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Calendar className="size-4 text-slate-500" />
              Attendance
            </TabsTrigger>

            {/* Timesheet Tab */}
            <TabsTrigger
              variant="line"
              value="timesheet"
              className="gap-2 text-xs font-semibold"
            >
              <GripVertical className="size-3 text-slate-300" />
              <Clock className="size-4 text-slate-500" />
              TimeSheet
            </TabsTrigger>

            {/* Sales Tab */}
            <TabsTrigger
              variant="line"
              value="sales"
              className="gap-2 text-xs font-semibold"
            >
              <GripVertical className="size-3 text-slate-300" />
              <BarChart2 className="size-4 text-slate-500" />
              Sales
            </TabsTrigger>

            {/* Notes Tab */}
            <TabsTrigger
              variant="line"
              value="notes"
              className="gap-2 text-xs font-semibold"
            >
              <GripVertical className="size-3 text-slate-300" />
              <FileText className="size-4 text-slate-500" />
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Panels */}
        <div className="pt-4">
          <TabsContent value="attendance" className="mt-0">
            <AttendanceTab />
          </TabsContent>

          <TabsContent value="timesheet" className="mt-0">
            <TimesheetTab />
          </TabsContent>

          <TabsContent value="sales" className="mt-0">
            <SalesTab />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <NotesTab />
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}
