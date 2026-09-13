export type TaskPriority = "urgent" | "high" | "normal" | "low";

export type TaskStage =
  | "not_started"
  | "in_progress"
  | "under_review"
  | "client_review"
  | "clarification_needed"
  | "waiting_govt_portal"
  | "completed"
  | "billed"
  | "cancelled"
  | "on_hold";

export type TaskStatus =
  | "wip"
  | "pending"
  | "in_progress"
  | "sent_for_review"
  | "request_changes"
  | "overdue"
  | "completed"
  | "ready_to_bill"
  | "cancelled"
  | "on_hold"
  | "all";

export type TaskType = "Recurring" | "One-Time";

export type BillingStatus = "Billable" | "Non-Billable";

export interface TaskItem {
  id: string;
  taskCode: string;
  taskTitle: string;
  clientId: string;
  clientName: string;
  legalName?: string;
  panNumber?: string;
  serviceId?: string;
  serviceName: string;
  financialYear: string;
  period: string;
  startDate: string;
  targetDate: string;
  dueDate: string;
  assignedToId?: string;
  assignedToName: string;
  assignedToInitials: string;
  reviewerId?: string;
  reviewerName: string;
  priority: TaskPriority;
  stage: TaskStage;
  status: TaskStatus;
  isBillable: boolean;
  billingStatus: BillingStatus;
  completionPercentage: number;
  taskType: TaskType;
  category: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  department: string;
  recurrenceFrequency?: string;
  proformaInvoiceId?: string | null;
  createdAt: string;
}

export interface SubTaskItem {
  id: string;
  taskId: string;
  parentTaskTitle: string;
  clientName: string;
  serviceName: string;
  title: string;
  assignedToName: string;
  assignedToId?: string;
  reviewerName: string;
  reviewerId?: string;
  weightagePercentage: number;
  dueDate: string;
  status: "pending" | "in_progress" | "sent_for_review" | "request_changes" | "overdue" | "completed" | "on_hold" | "cancelled";
  priority: TaskPriority;
  category: string;
}

export interface TaskActivityItem {
  id: string;
  taskId: string;
  taskTitle: string;
  actionType: string;
  description: string;
  userName: string;
  userInitials: string;
  createdAt: string;
  eventCategory: "all" | "status_changes" | "comments" | "file_uploads" | "assignments";
}

export interface TaskKpiData {
  wip: number;
  pending: number;
  inProgress: number;
  sentForReview: number;
  requestChanges: number;
  overdue: number;
  completed: number;
  readyToBill: number;
  onHold: number;
  cancelled: number;
  allTasks: number;
}

export interface RecurringKpiData {
  total: number;
  monthly: number;
  quarterly: number;
  halfYear: number;
  yearly: number;
}

export type SummaryDimensionKey =
  | "assigned_to"
  | "category"
  | "client"
  | "service"
  | "priority"
  | "task_type"
  | "month"
  | "financial_year";

export interface SummaryRowData {
  key: string;
  label: string;
  pending: number;
  inProgress: number;
  sentForReview: number;
  requestChanges: number;
  wipSubTotal: number;
  overdue: number;
  dueToday: number;
  completed: number;
  readyToBill: number;
  onHold: number;
  cancelled: number;
  total: number;
  donePercentage: number;
}

export interface TaskFilterState {
  scope: "all" | "my_tasks" | "due_today" | "live_task";
  statusList: string[];
  priorityList: string[];
  dueTodayOnly: boolean;
  assignedTo: string;
  department: string;
  billingStatus: string;
  taskType: string;
  category: string;
  searchQuery: string;
}

export interface TaskFormData {
  clientId: string;
  clientName?: string;
  serviceId: string;
  serviceName?: string;
  financialYear: string;
  frequency: string;
  selectPeriod: string;
  taskName: string;
  department: string;
  assigneeId: string;
  assigneeName?: string;
  reviewerId: string;
  reviewerName?: string;
  priority: TaskPriority;
  startDate: string;
  targetDueDate: string;
  endDate: string;
  billingType: "Billable" | "Non Billable";
  sprintPlanner: boolean;
  description: string;
  createProformaInvoice: boolean;
}
