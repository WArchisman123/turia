"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import {
  Briefcase,
  User,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Check,
} from "lucide-react";
import { AddEmployeeFormData, TeamMember, TeamUserRole, EmploymentStatus } from "./types";

interface AddEmployeeWizardProps {
  onCancel: () => void;
  onSubmit: (formData: AddEmployeeFormData) => Promise<void> | void;
  existingMembers: TeamMember[];
}

const MODULES = [
  { id: "clients", name: "Client Master & Directory" },
  { id: "services", name: "Services Catalog & Master" },
  { id: "tasks", name: "Task & Compliance Engine" },
  { id: "invoices", name: "Invoice, Billing & Receipts" },
  { id: "team", name: "Team & Staff Management" },
  { id: "reports", name: "Reports Executive MIS Hub" },
  { id: "registry", name: "Statutory DSC Physical Vault" },
];

export function AddEmployeeWizard({
  onCancel,
  onSubmit,
  existingMembers,
}: AddEmployeeWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<AddEmployeeFormData>({
    // Step 1
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    designation: "Senior Associate",
    role: "senior_associate",
    department: "Audit",
    reporting_to_id: existingMembers[0]?.id || "",
    shift: "General Shift (10:00 AM - 07:00 PM)",
    employee_id: "EMP-005",
    joining_date: "11/09/2026",
    resignation_date: "",
    salary: 50000,
    cost_per_hour: 400,
    billing_rate: 1200,
    work_experience: "3 Years",
    status: "confirmed",
    confirmation_date: "11/09/2026",

    // Step 2
    dob: "15/08/1997",
    gender: "Male",
    blood_group: "B+",
    pan_number: "",
    aadhaar_number: "",
    emergency_contact: "",
    icai_member_number: "",
    icai_student_number: "",

    // Step 3
    current_address_1: "",
    current_address_2: "",
    permanent_address_1: "",
    permanent_address_2: "",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    pin_code: "700016",

    // Step 4
    permissions: {
      clients: { view: true, add_edit: true, delete: false, import: true, export: true },
      services: { view: true, add_edit: false, delete: false, import: false, export: true },
      tasks: { view: true, add_edit: true, delete: false, import: true, export: true },
      invoices: { view: true, add_edit: true, delete: false, import: false, export: true },
      team: { view: true, add_edit: false, delete: false, import: false, export: false },
      reports: { view: true, add_edit: false, delete: false, import: false, export: true },
      registry: { view: true, add_edit: true, delete: false, import: false, export: false },
    },
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.first_name.trim() || !formData.email.trim()) {
        alert("Please enter First Name and Email ID");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      posthog.capture("employee_created", {
        role: formData.role,
        department: formData.department,
        employment_status: formData.status,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (
    module: string,
    action: "view" | "add_edit" | "delete" | "import" | "export"
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module]?.[action],
        },
      },
    }));
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden min-h-[750px] flex flex-col">
      {/* Top Breadcrumb Navigation */}
      <div className="px-6 py-3.5 border-b border-[#E2E8F0] flex items-center gap-2 text-xs select-none">
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
        >
          &lt;
        </button>
        <span className="text-slate-400">&gt;</span>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          Teams
        </button>
        <span className="text-slate-400">&gt;</span>
        <span className="font-bold text-slate-900">Add Employee</span>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Vertical Stepper matching team-add user.png */}
        <div className="w-full md:w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] p-6 shrink-0 select-none">
          <div className="space-y-6">
            {/* Step 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 1
                    ? "border-2 border-[#6366F1] text-[#6366F1] bg-white"
                    : currentStep > 1
                    ? "bg-[#6366F1] text-white"
                    : "border-2 border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {currentStep > 1 ? <Check className="size-3.5" /> : "1"}
              </div>
              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    currentStep === 1 ? "text-[#6366F1]" : "text-slate-700"
                  }`}
                >
                  Employment Details
                </div>
                <div className="text-[11px] text-rose-500 font-medium mt-0.5">
                  {currentStep > 1 ? "Completed" : "Incomplete"}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setCurrentStep(2)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 2
                    ? "border-2 border-[#6366F1] text-[#6366F1] bg-white"
                    : currentStep > 2
                    ? "bg-[#6366F1] text-white"
                    : "border-2 border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {currentStep > 2 ? <Check className="size-3.5" /> : "2"}
              </div>
              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    currentStep === 2 ? "text-[#6366F1]" : "text-slate-500"
                  }`}
                >
                  Personal Details
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setCurrentStep(3)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 3
                    ? "border-2 border-[#6366F1] text-[#6366F1] bg-white"
                    : currentStep > 3
                    ? "bg-[#6366F1] text-white"
                    : "border-2 border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {currentStep > 3 ? <Check className="size-3.5" /> : "3"}
              </div>
              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    currentStep === 3 ? "text-[#6366F1]" : "text-slate-500"
                  }`}
                >
                  Address
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setCurrentStep(4)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 4
                    ? "border-2 border-[#6366F1] text-[#6366F1] bg-white"
                    : "border-2 border-slate-300 text-slate-400 bg-white"
                }`}
              >
                4
              </div>
              <div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    currentStep === 4 ? "text-[#6366F1]" : "text-slate-500"
                  }`}
                >
                  Role Permissions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {/* STEP 1: Employment Details matching team-add user.png */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                  <Briefcase className="size-4" />
                </span>
                Employment Details
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Row 1 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 text-xs bg-slate-100 border border-r-0 border-[#E2E8F0] rounded-l-md text-slate-600 font-medium">
                      IN +91
                    </span>
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-r-md focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Partner">Partner</option>
                    <option value="Senior Audit Manager">Senior Audit Manager</option>
                    <option value="Manager">Manager</option>
                    <option value="Senior Associate">Senior Associate</option>
                    <option value="Direct Tax Associate">Direct Tax Associate</option>
                    <option value="Article Trainee">Article Trainee</option>
                    <option value="Article Assistant (Year 2)">Article Assistant (Year 2)</option>
                    <option value="Paid Assistant">Paid Assistant</option>
                    <option value="Staff Executive">Staff Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as TeamUserRole,
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="partner">Partner</option>
                    <option value="manager">Manager</option>
                    <option value="senior_associate">Senior Associate</option>
                    <option value="article_trainee">Article Trainee</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Audit">Audit</option>
                    <option value="Direct Tax">Direct Tax</option>
                    <option value="GST">GST</option>
                    <option value="ROC">ROC</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting To
                  </label>
                  <select
                    value={formData.reporting_to_id}
                    onChange={(e) =>
                      setFormData({ ...formData, reporting_to_id: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">None (Top Level)</option>
                    {existingMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.designation})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shift <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) =>
                      setFormData({ ...formData, shift: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="General Shift (10:00 AM - 07:00 PM)">
                      General Shift (10:00 AM - 07:00 PM)
                    </option>
                    <option value="Morning Shift (09:00 AM - 06:00 PM)">
                      Morning Shift (09:00 AM - 06:00 PM)
                    </option>
                  </select>
                </div>

                {/* Row 4 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Employee ID"
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.joining_date}
                    onChange={(e) =>
                      setFormData({ ...formData, joining_date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resignation Date
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.resignation_date}
                    onChange={(e) =>
                      setFormData({ ...formData, resignation_date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Row 5 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salary (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Salary"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cost Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.cost_per_hour}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_per_hour: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Billing Rate (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter Billing Rate"
                    value={formData.billing_rate}
                    onChange={(e) =>
                      setFormData({ ...formData, billing_rate: Number(e.target.value) })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Row 6 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Experience
                  </label>
                  <select
                    value={formData.work_experience}
                    onChange={(e) =>
                      setFormData({ ...formData, work_experience: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as EmploymentStatus,
                      })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="probation">Probation</option>
                    <option value="notice_period">Notice Period</option>
                    <option value="intern">Intern / Article</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmation Date
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.confirmation_date}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmation_date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
                  <User className="size-4" />
                </span>
                Personal Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_group: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={formData.pan_number}
                    onChange={(e) =>
                      setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    placeholder="12 Digit Aadhaar"
                    maxLength={12}
                    value={formData.aadhaar_number}
                    onChange={(e) =>
                      setFormData({ ...formData, aadhaar_number: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98300 00000"
                    value={formData.emergency_contact}
                    onChange={(e) =>
                      setFormData({ ...formData, emergency_contact: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ICAI Membership No (Qualified CA)
                  </label>
                  <input
                    type="text"
                    placeholder="FCA-412095 / ACA-..."
                    value={formData.icai_member_number}
                    onChange={(e) =>
                      setFormData({ ...formData, icai_member_number: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ICAI Student Registration No (For Article Trainees)
                  </label>
                  <input
                    type="text"
                    placeholder="ERO0294819 / WRO..."
                    value={formData.icai_student_number}
                    onChange={(e) =>
                      setFormData({ ...formData, icai_student_number: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                  <MapPin className="size-4" />
                </span>
                Address Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Address */}
                <div className="space-y-3 p-4 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                  <div className="font-semibold text-xs text-slate-800">
                    Current Residential Address
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="House/Flat No, Street"
                      value={formData.current_address_1}
                      onChange={(e) =>
                        setFormData({ ...formData, current_address_1: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Landmark, Area"
                      value={formData.current_address_2}
                      onChange={(e) =>
                        setFormData({ ...formData, current_address_2: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                    />
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="space-y-3 p-4 bg-slate-50 border border-[#E2E8F0] rounded-lg">
                  <div className="font-semibold text-xs text-slate-800">
                    Permanent Address
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      placeholder="House/Flat No, Street"
                      value={formData.permanent_address_1}
                      onChange={(e) =>
                        setFormData({ ...formData, permanent_address_1: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Landmark, Area"
                      value={formData.permanent_address_2}
                      onChange={(e) =>
                        setFormData({ ...formData, permanent_address_2: e.target.value })
                      }
                      className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* City, State, Country, Pin Code */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    readOnly
                    className="w-full text-xs px-3 py-2 bg-slate-100 border border-[#E2E8F0] rounded-md text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    placeholder="700001"
                    maxLength={6}
                    value={formData.pin_code}
                    onChange={(e) =>
                      setFormData({ ...formData, pin_code: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Role Permissions */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                  <ShieldCheck className="size-4" />
                </span>
                Role-Based Access Control (RBAC) Permissions
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <th className="py-2.5 px-3 font-semibold text-slate-700">
                        Practice Module
                      </th>
                      <th className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        View
                      </th>
                      <th className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        Add / Edit
                      </th>
                      <th className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        Delete
                      </th>
                      <th className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        Import
                      </th>
                      <th className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        Export
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MODULES.map((mod) => {
                      const perms = formData.permissions[mod.id] || {
                        view: false,
                        add_edit: false,
                        delete: false,
                        import: false,
                        export: false,
                      };
                      return (
                        <tr key={mod.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {mod.name}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perms.view}
                              onChange={() => togglePermission(mod.id, "view")}
                              className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perms.add_edit}
                              onChange={() => togglePermission(mod.id, "add_edit")}
                              className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perms.delete}
                              onChange={() => togglePermission(mod.id, "delete")}
                              className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perms.import}
                              onChange={() => togglePermission(mod.id, "import")}
                              className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={perms.export}
                              onChange={() => togglePermission(mod.id, "export")}
                              className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] mt-8 select-none">
            <button
              type="button"
              onClick={currentStep === 1 ? onCancel : handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors border border-[#E2E8F0] cursor-pointer"
            >
              {currentStep === 1 ? "Cancel" : "Previous"}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                Next
                <ChevronRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? "Creating Employee..." : "Create Employee"}
                <Check className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
