"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  UserCheck,
  UserX,
  LogOut,
  Armchair,
  Search,
  Plus,
  MoreVertical,
  ChevronDown,
  Trash2,
  Eye,
} from "lucide-react";
import { TeamMember, TeamKPIData } from "./types";
import { RowActionDropdown } from "@/components/ui/data-table";

interface TeamDirectoryTabProps {
  members: TeamMember[];
  kpi: TeamKPIData;
  onAddNewUser: () => void;
  onDeactivateUser: (id: string) => void;
  onViewUser?: (member: TeamMember) => void;
}

export function TeamDirectoryTab({
  members,
  kpi,
  onAddNewUser,
  onDeactivateUser,
  onViewUser,
}: TeamDirectoryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Department");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedGroup, setSelectedGroup] = useState("All");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.full_name.toLowerCase().includes(q);
        const matchEmail = m.email.toLowerCase().includes(q);
        const matchPhone = m.phone ? m.phone.toLowerCase().includes(q) : false;
        const matchDesig = m.designation.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchDesig) {
          return false;
        }
      }

      // Dept filter
      if (selectedDept !== "All Department") {
        if (m.department !== selectedDept && m.department !== "All Department") {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== "All Roles") {
        if (m.role !== selectedRole.toLowerCase().replace(/ /g, "_")) {
          return false;
        }
      }

      // Group filter
      if (selectedGroup === "Partners" && m.role !== "admin" && m.role !== "partner") return false;
      if (selectedGroup === "Managers" && m.role !== "manager") return false;
      if (selectedGroup === "Articles" && m.role !== "article_trainee") return false;

      return true;
    });
  }, [members, searchQuery, selectedDept, selectedRole, selectedGroup]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredMembers.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">Admin</span>;
      case "partner":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F3FF] text-[#7C3AED] border border-[#EDE9FE]">Partner</span>;
      case "manager":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">Manager</span>;
      case "senior_associate":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">Senior Associate</span>;
      case "article_trainee":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]">Article Trainee</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">Staff</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 Metric KPI Cards matching team-1.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#059669]">
              {kpi.active_users}
            </div>
            <div className="text-xs font-semibold text-[#059669] mt-0.5">
              Active Users
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
            <UserCheck className="size-5" />
          </div>
        </div>

        {/* Deactivated Users */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#64748B]">
              {kpi.deactivated_users}
            </div>
            <div className="text-xs font-semibold text-[#64748B] mt-0.5">
              Deactivated Users
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
            <UserX className="size-5" />
          </div>
        </div>

        {/* Resigned Users */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#D97706]">
              {kpi.resigned_users}
            </div>
            <div className="text-xs font-semibold text-[#D97706] mt-0.5">
              Resigned Users
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
            <LogOut className="size-5" />
          </div>
        </div>

        {/* Seats Used / Total (1 / 5 subscription capacity) */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#6366F1]">
              {kpi.seats_used} / {kpi.seats_total}
            </div>
            <div className="text-xs font-semibold text-[#6366F1] mt-0.5">
              Seats Used / Total
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#6366F1]">
            <Armchair className="size-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-900 mr-2">
            Users List ({filteredMembers.length})
          </span>

          {/* Group dropdown */}
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              aria-label="Filter users by group"
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded-md cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">Group: All</option>
              <option value="Partners">Partners</option>
              <option value="Managers">Managers</option>
              <option value="Articles">Article Trainees</option>
            </select>
            <ChevronDown className="size-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dept dropdown */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter users by department"
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded-md cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All Department">All Dept</option>
              <option value="Direct Tax">Direct Tax</option>
              <option value="GST">GST</option>
              <option value="Audit">Audit</option>
              <option value="ROC">ROC</option>
              <option value="Accounting">Accounting</option>
            </select>
            <ChevronDown className="size-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Role dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter users by role"
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-[#E2E8F0] text-xs font-medium text-slate-700 py-1.5 pl-2.5 pr-7 rounded-md cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Partner">Partner</option>
              <option value="Manager">Manager</option>
              <option value="Senior Associate">Senior Associate</option>
              <option value="Article Trainee">Article Trainee</option>
              <option value="Staff">Staff</option>
            </select>
            <ChevronDown className="size-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Search & CTA */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={onAddNewUser}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Users
          </button>
        </div>
      </div>

      {/* 11-Column Users Table matching team-1.png */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredMembers.length > 0 &&
                      selectedIds.length === filteredMembers.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                  />
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Designation
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Clients
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Tasks
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Recurring
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Phone No
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Last Punch-In
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="py-2.5 px-3 w-10 text-center text-slate-400">
                  <MoreVertical className="size-3.5 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <UserX className="size-8 text-slate-300" />
                      <div className="font-semibold text-slate-700">No users found</div>
                      <div className="text-xs text-slate-400">Try adjusting your filters or search query</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(member.id)}
                        onChange={() => handleToggleSelect(member.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {member.initials}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {member.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {member.designation || "-"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {member.department || "All Department"}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {member.clients_count > 0 ? member.clients_count : "—"}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {member.tasks_count > 0 ? member.tasks_count : "—"}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-medium">
                      {member.recurring_count > 0 ? member.recurring_count : "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {member.phone || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {member.email}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {member.last_punch_in}
                    </td>
                    <td className="py-3 px-3">
                      {member.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                          Active
                        </span>
                      ) : member.status === "resigned" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Resigned
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <TeamRowActionCell
                      member={member}
                      isOpen={activeMenuId === member.id}
                      onToggle={() =>
                        setActiveMenuId(
                          activeMenuId === member.id ? null : member.id
                        )
                      }
                      onClose={() => setActiveMenuId(null)}
                      onViewUser={onViewUser}
                      onDeactivateUser={onDeactivateUser}
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="bg-white px-4 py-2.5 border-t border-[#E2E8F0] flex items-center justify-end gap-6 text-xs text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <span className="font-semibold text-slate-700">50</span>
          </div>
          <div>
            1–{filteredMembers.length} of {filteredMembers.length}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamRowActionCellProps {
  member: TeamMember;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewUser?: (member: TeamMember) => void;
  onDeactivateUser: (id: string) => void;
}

function TeamRowActionCell({
  member,
  isOpen,
  onToggle,
  onClose,
  onViewUser,
  onDeactivateUser,
}: TeamRowActionCellProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <td className="py-3 px-3 text-center">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={`Actions for ${member.full_name}`}
        className={`size-7 rounded transition-colors cursor-pointer inline-flex items-center justify-center ${
          isOpen
            ? "text-slate-900 bg-slate-100"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <MoreVertical className="size-3.5" />
      </button>

      <RowActionDropdown
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        width={176}
      >
        {onViewUser && (
          <button
            onClick={() => {
              onViewUser(member);
              onClose();
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="size-3.5 text-slate-400" />
            <span>View Details</span>
          </button>
        )}
        <button
          onClick={() => {
            onDeactivateUser(member.id);
            onClose();
          }}
          className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
        >
          <Trash2 className="size-3.5 text-rose-500" />
          <span>Deactivate</span>
        </button>
      </RowActionDropdown>
    </td>
  );
}
