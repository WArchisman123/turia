import { get, post, patch, del } from "@/lib/api";
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
  return get<TasksApiResponse>("/api/tasks", { cache: "no-store" });
}

export async function createTask(formData: TaskFormData): Promise<TaskItem> {
  const data = await post<{ task: TaskItem }>("/api/tasks", formData);
  return data.task;
}

export async function updateTask(id: string, updates: Partial<TaskItem>): Promise<TaskItem> {
  const data = await patch<{ task: TaskItem }>(`/api/tasks/${id}`, updates);
  return data.task;
}

export async function deleteTask(id: string): Promise<boolean> {
  await del(`/api/tasks/${id}`);
  return true;
}

export async function fetchActivities(): Promise<TaskActivityItem[]> {
  try {
    const data = await get<{ activities: TaskActivityItem[] }>("/api/tasks/activities", {
      cache: "no-store",
    });
    return data.activities || [];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

export async function toggleSubtask(id: string, isCompleted: boolean): Promise<SubTaskItem> {
  const data = await patch<{ subtask: SubTaskItem }>("/api/tasks/subtasks", { id, isCompleted });
  return data.subtask;
}
