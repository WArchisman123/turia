"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  CheckCircle2,
  RotateCw,
  X,
  Save,
} from "lucide-react";
import { ApplyLeaveModal, LeaveApplicationItem } from "./apply-leave-modal";
import {
  fetchProfileDetails,
  updateProfileDetails,
  createLeave,
  PractitionerProfile,
} from "@/lib/api/profile";

const HOLIDAYS = [
  { date: "02-Oct-2026", name: "Mahatma Gandhi Jayanti", day: "Friday", type: "Gazetted Statutory Holiday" },
  { date: "20-Oct-2026", name: "Maha Navami / Durga Puja", day: "Tuesday", type: "Festival Holiday" },
  { date: "24-Oct-2026", name: "Diwali (Laxmi Puja)", day: "Saturday", type: "Statutory Practice Holiday" },
  { date: "25-Dec-2026", name: "Christmas Day", day: "Friday", type: "Gazetted Holiday" },
  { date: "01-Jul-2027", name: "ICAI CA Day", day: "Thursday", type: "Profession Day" },
];

export function ProfileDetailsTab() {
  const [profile, setProfile] = useState<PractitionerProfile | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<
    Array<{ attendance_date: string; status: string }>
  >([]);
  const [leaveBalance, setLeaveBalance] = useState<{
    casual_leave_quota: number;
    casual_leave_taken: number;
    sick_leave_quota: number;
    sick_leave_taken: number;
    exam_leave_quota: number;
    exam_leave_taken: number;
  } | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("September 2026");

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    designation: "",
    department: "",
    addressLine1: "",
    city: "",
    state: "",
    pinCode: "",
    salary: 85000,
    costPerHour: 350,
    billingRate: 1500,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchProfileDetails();
        if (isMounted && data) {
          if (data.user) {
            setProfile(data.user);
            setEditForm({
              firstName: data.user.first_name || "",
              lastName: data.user.last_name || "",
              phone: data.user.phone || "+91 87774 31358",
              email: data.user.email || "",
              designation: data.user.designation || "Senior Partner & Tax Lead",
              department: data.user.department || "Direct Tax & Corporate Audit",
              addressLine1: data.user.address_line_1 || "44 Park Street, Flat 3B",
              city: data.user.city || "Kolkata",
              state: data.user.state || "West Bengal",
              pinCode: data.user.pin_code || "700016",
              salary: data.user.salary || 85000,
              costPerHour: data.user.cost_per_hour || 350,
              billingRate: data.user.billing_rate || 1500,
            });
          }
          if (data.attendanceLogs) {
            setAttendanceLogs(data.attendanceLogs);
          }
          if (data.leaveBalance) {
            setLeaveBalance(data.leaveBalance);
          }
          if (data.leaveApplications) {
            setLeaveHistory(data.leaveApplications);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddLeave = async (newLeave: LeaveApplicationItem) => {
    setLeaveHistory((prev) => [newLeave, ...prev]);
    await createLeave({
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: newLeave.days,
      reason: newLeave.reason,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileDetails(editForm);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            first_name: editForm.firstName,
            last_name: editForm.lastName,
            full_name: `${editForm.firstName} ${editForm.lastName}`.trim(),
            phone: editForm.phone,
            email: editForm.email,
            designation: editForm.designation,
            department: editForm.department,
            address_line_1: editForm.addressLine1,
            city: editForm.city,
            state: editForm.state,
            pin_code: editForm.pinCode,
            salary: editForm.salary,
            cost_per_hour: editForm.costPerHour,
            billing_rate: editForm.billingRate,
          }
        : null
    );
    setIsEditModalOpen(false);
  };

  // Generate 30 days for September 2026
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const getAttendanceStatus = (day: number) => {
    const dayStr = `2026-09-${day.toString().padStart(2, "0")}`;
    const log = attendanceLogs.find((l) => l.attendance_date === dayStr);

    if (day === 8) return { label: "Today", color: "bg-indigo-600 text-white font-bold ring-2 ring-indigo-300" };
    if ([6, 13, 20, 27].includes(day)) return { label: "Sunday", color: "bg-amber-100 text-amber-800 font-semibold" };
    if ([5, 12, 19, 26].includes(day)) return { label: "Saturday", color: "bg-slate-100 text-slate-700" };
    if (day === 2) return { label: "Holiday", color: "bg-purple-100 text-purple-800 font-semibold" };
    if (day > 8) return { label: "Upcoming", color: "bg-white text-slate-400 border border-slate-100" };
    
    if (log?.status === "absent" || day === 4) {
      return { label: "Absent", color: "bg-rose-100 text-rose-800 font-semibold" };
    }
    return { label: "Present", color: "bg-emerald-100 text-emerald-800 font-semibold" };
  };

  const displayName = profile?.full_name || profile?.first_name || "archi";
  const displayEmpId = profile?.employee_id || "TURIA-EMP-001";
  const displayRole = profile?.role === "admin" ? "Admin / Partner" : profile?.designation || "Senior Partner";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Profile Card (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Bio Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="h-24 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 p-4 relative">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 className="size-3.5" />
            </button>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar */}
            <div className="relative -mt-12 mb-3 inline-block">
              <div className="size-20 rounded-2xl bg-[#3730A3] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md ring-1 ring-slate-200">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-1 right-1 size-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {displayName}
                  {isLoading && <RotateCw className="size-3 text-slate-400 animate-spin" />}
                </h2>
                <p className="text-xs text-slate-500 font-medium">Emp ID: #{displayEmpId}</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-200">
                {displayRole}
              </span>
            </div>

            {/* About Section */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Contact & About
              </span>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="size-3.5 text-slate-400" />
                <span>{profile?.phone || "+91 87774 31358"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="size-3.5 text-slate-400" />
                <span>{profile?.email || "arch.sas.123@gmail.com"}</span>
              </div>
            </div>

            {/* Employment Details */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Employment Detail
              </span>
              <div className="grid grid-cols-2 gap-y-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Designation</span>
                  <span className="font-semibold">{profile?.designation || "Senior Partner & Tax Lead"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Department</span>
                  <span className="font-semibold">{profile?.department || "Direct Tax & Corporate Audit"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Reporting To</span>
                  <span className="font-semibold">Managing Partner</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Shift</span>
                  <span className="font-semibold">{profile?.shift || "General (10 AM - 7 PM)"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Joining Date</span>
                  <span className="font-semibold">{profile?.joining_date || "01-Apr-2024"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3" /> Confirmed
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Personal Details
              </span>
              <div className="grid grid-cols-2 gap-y-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                  <span className="font-semibold">{profile?.dob || "14-Aug-1996"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gender</span>
                  <span className="font-semibold">{profile?.gender || "Male"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ID Proof (PAN)</span>
                  <span className="font-semibold font-mono">{profile?.pan_number || "ABCDE1234F"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ICAI Membership</span>
                  <span className="font-semibold font-mono">{profile?.icai_member_number || "FCA-445588"}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Registered Address
              </span>
              <p className="text-slate-700 leading-relaxed">
                {profile?.address_line_1 || "44 Park Street, Flat 3B"}, {profile?.city || "Kolkata"},{" "}
                {profile?.state || "West Bengal"}, {profile?.pin_code || "700016"}, India
              </p>
            </div>

            {/* Payroll & Costing Details */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Practice Labor Costing
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Salary / mo</span>
                  <span className="font-bold text-slate-800">
                    ₹{(profile?.salary || 85000).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Cost / Hour</span>
                  <span className="font-bold text-indigo-600">₹{profile?.cost_per_hour || 350}/hr</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block">Billing Rate</span>
                  <span className="font-bold text-emerald-600">₹{profile?.billing_rate || 1500}/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Calendar, Leave & Holidays (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Monthly Attendance Calendar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Monthly Attendance Matrix</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                onClick={() => setCurrentMonth("August 2026")}
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs font-bold text-slate-800 min-w-[110px] text-center">
                {currentMonth}
              </span>
              <button
                type="button"
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                onClick={() => setCurrentMonth("September 2026")}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Attendance Stats Strip */}
          <div className="grid grid-cols-4 gap-2 my-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Present
              </span>
              <span className="text-base font-extrabold text-emerald-800">5 Days</span>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200/70 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Absent
              </span>
              <span className="text-base font-extrabold text-rose-800">1 Day</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200/70 text-center">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Holiday
              </span>
              <span className="text-base font-extrabold text-purple-800">1 Day</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/70 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Week Off
              </span>
              <span className="text-base font-extrabold text-amber-800">2 Days</span>
            </div>
          </div>

          {/* Days Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase py-1">
                {day}
              </span>
            ))}

            {/* Empty slots before Sep 1 (Tue) */}
            <div />
            <div />

            {/* 30 Days */}
            {daysInMonth.map((day) => {
              const status = getAttendanceStatus(day);
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-center transition-all ${status.color}`}
                >
                  <span className="font-bold">{day}</span>
                  <span className="text-[9px] font-medium leading-none mt-0.5">{status.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Summary & Applications Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Balance &amp; History</h3>
              <p className="text-xs text-slate-500">Statutory leave entitlements under ICAI regulations</p>
            </div>
            <button
              type="button"
              onClick={() => setIsApplyLeaveOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" /> Apply Leave
            </button>
          </div>

          {/* Balances Grid */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Casual Leave</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-slate-800">
                  {leaveBalance ? leaveBalance.casual_leave_quota - leaveBalance.casual_leave_taken : 10}
                </span>
                <span className="text-[10px] text-slate-400">/ {leaveBalance?.casual_leave_quota || 12} Left</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Sick Leave</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-slate-800">
                  {leaveBalance ? leaveBalance.sick_leave_quota - leaveBalance.sick_leave_taken : 10}
                </span>
                <span className="text-[10px] text-slate-400">/ {leaveBalance?.sick_leave_quota || 10} Left</span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200/80">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">CA Exam Study</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-indigo-900">
                  {leaveBalance ? leaveBalance.exam_leave_quota - leaveBalance.exam_leave_taken : 82}
                </span>
                <span className="text-[10px] text-indigo-600">/ {leaveBalance?.exam_leave_quota || 90} Left</span>
              </div>
            </div>
          </div>

          {/* Recent Applications List */}
          <div className="space-y-2 mt-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Recent Applications
            </span>
            {leaveHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No leave applications recorded yet.</p>
            ) : (
              leaveHistory.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{leave.leaveType}</span>
                      <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                        {leave.days} {leave.days === 1 ? "day" : "days"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{leave.reason}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {leave.startDate} to {leave.endDate}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      leave.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : leave.status === "Rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Firm Holiday List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Firm Gazetted Holidays (FY 2026-27)</h3>
          <div className="space-y-2 text-xs">
            {HOLIDAYS.map((h) => (
              <div
                key={h.name}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-lg">
                    {h.date}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800 block">{h.name}</span>
                    <span className="text-[10px] text-slate-400">{h.day}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{h.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSubmit={handleAddLeave}
      />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Practitioner Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Registered Address</label>
                <input
                  type="text"
                  value={editForm.addressLine1}
                  onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Salary (₹/mo)</label>
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Cost Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={editForm.costPerHour}
                    onChange={(e) => setEditForm({ ...editForm, costPerHour: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Billing Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={editForm.billingRate}
                    onChange={(e) => setEditForm({ ...editForm, billingRate: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="size-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
