import {
  TaskItem,
  SubTaskItem,
  TaskActivityItem,
  TaskKpiData,
  RecurringKpiData,
  TaskFormData,
} from "@/components/tasks/types";

export interface TasksApiResponse {
  tasks: TaskItem[];
  subtasks: SubTaskItem[];
  activities: TaskActivityItem[];
  kpi: TaskKpiData;
  recurringKpi: RecurringKpiData;
}

export async function fetchTasks(): Promise<TasksApiResponse> {
  const res = await fetch("/api/tasks", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }

  return res.json();
}

export async function createTask(formData: TaskFormData): Promise<TaskItem> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create task");
  }

  const data = await res.json();
  return data.task;
}

export async function updateTask(id: string, updates: Partial<TaskItem>): Promise<TaskItem> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update task");
  }

  const data = await res.json();
  return data.task;
}

export async function deleteTask(id: string): Promise<boolean> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete task");
  }

  return true;
}

export async function fetchActivities(): Promise<TaskActivityItem[]> {
  const res = await fetch("/api/tasks/activities", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch activities: ${res.statusText}`);
  }

  const data = await res.json();
  return data.activities || [];
}

export async function toggleSubtask(id: string, isCompleted: boolean): Promise<SubTaskItem> {
  const res = await fetch("/api/tasks/subtasks", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, isCompleted }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update subtask");
  }

  const data = await res.json();
  return data.subtask;
}
