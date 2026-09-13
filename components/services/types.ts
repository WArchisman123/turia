export interface ServiceItem {
  id: string;
  serviceCode: string;
  serviceName: string;
  category: string;
  sacCode: string;
  billingType: string;
  baseFee: number;
  gstRate: number;
  estimatedHours: number;
  tatDays: number;
  tatHours: string;
  isRecurring: boolean;
  recurrenceFrequency: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  description: string;
  dueTiming: string;
  startDay: string;
  targetDueDay: string;
  endDay: string;
  exemptionReason: string;
  outOfPocketBudget: number;
  sopCount: number;
  subtasksCount: number;
  notes?: string;
  isDefault: boolean;
  subtaskTemplates: ServiceSubtaskTemplate[];
  checklistTemplates: string[];
  isActive: boolean;
  createdOn: string;
  updatedOn: string;
}

export interface ServiceSubtaskTemplate {
  title: string;
  estimatedHours?: number;
  order: number;
}

export interface ServiceKpiData {
  activeCount: number;
  recurringCount: number;
  nonRecurringCount: number;
  defaultServicesCount: number;
  inactiveCount: number;
  totalServicesCount: number;
}

export interface ServiceFormData {
  serviceName: string;
  category: string;
  frequency: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  description: string;
  isRecurring: boolean;
  professionalFee: number;
  taxRate: number;
  sacCode: string;
  exemptionReason?: string;
  maxOopBudget: number;
  tatDays: number;
  tatHours: string;
  note?: string;
  isDefault?: boolean;
}

/**
 * 18-Column structure matching Service_SampleData.xlsx ('Service Data' sheet)
 */
export interface OfficialServiceXlsxRow {
  "Service Name *": string;
  "Category": string;
  "Difficulty Level": string;
  "Description": string;
  "Frequency": string;
  "Recurring": string;
  "Due Timing": string;
  "Start Day": string;
  "Target Due Day": string;
  "End Day": string;
  "Professional Fee": number | string;
  "Tax Rate": string;
  "SAC Code": string;
  "Exemption Reason": string;
  "Out of Pocket Expenses": string;
  "Maximum Budget": number | string;
  "TAT - in Days": number | string;
  "TAT - in Hrs (00:00)": string;
}

export const OFFICIAL_SERVICE_COLUMNS = [
  "Service Name *",
  "Category",
  "Difficulty Level",
  "Description",
  "Frequency",
  "Recurring",
  "Due Timing",
  "Start Day",
  "Target Due Day",
  "End Day",
  "Professional Fee",
  "Tax Rate",
  "SAC Code",
  "Exemption Reason",
  "Out of Pocket Expenses",
  "Maximum Budget",
  "TAT - in Days",
  "TAT - in Hrs (00:00)",
] as const;

export const SERVICE_CATEGORIES = [
  "Direct Tax",
  "Indirect Tax / GST",
  "Statutory Audit",
  "Tax Audit 44AB",
  "Corporate Law / ROC",
  "Transfer Pricing",
  "Accounting & Bookkeeping",
  "Payroll & Labor Laws",
  "Advisory & Virtual CFO",
  "International Taxation",
  "FEMA & RBI Compliance",
] as const;

export const SERVICE_FREQUENCIES = [
  "Monthly",
  "Quarterly",
  "Half Yearly",
  "Yearly",
  "One Time / Ad-hoc",
  "Event Based",
] as const;

export const SERVICE_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;
