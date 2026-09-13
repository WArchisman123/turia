"use client";

import React, { useState, useEffect, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  TaskItem,
  SubTaskItem,
  TaskActivityItem,
  TaskKpiData,
  RecurringKpiData,
  TaskFormData,
} from "@/components/tasks/types";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleSubtask,
} from "@/lib/api/tasks";
import { TaskSummaryTab } from "@/components/tasks/task-summary-tab";
import { TaskListTab } from "@/components/tasks/task-list-tab";
import { SubTasksTab } from "@/components/tasks/sub-tasks-tab";
import { RecurringScheduleTab } from "@/components/tasks/recurring-schedule-tab";
import { AnalyticsMisTab } from "@/components/tasks/analytics-mis-tab";
import { AddTaskModal } from "@/components/tasks/add-task-modal";
import { TaskActivityDrawer } from "@/components/tasks/task-activity-drawer";
import {
  LayoutGrid,
  CheckSquare,
  ListChecks,
  Repeat,
  BarChart2,
  Clock,
  Plus,
} from "lucide-react";

type ActiveTab = "summary" | "list" | "subtasks" | "recurring" | "analytics";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [subtasks, setSubtasks] = useState<SubTaskItem[]>([]);
  const [activities, setActivities] = useState<TaskActivityItem[]>([]);
  const [recurringKpi, setRecurringKpi] = useState<RecurringKpiData>({
    total: 0,
    monthly: 0,
    quarterly: 0,
    halfYear: 0,
    yearly: 0,
  });

  // Dynamically compute KPIs from tasks to ensure 100% real-time consistency
  const derivedKpi = React.useMemo<TaskKpiData>(() => {
    return {
      wip: tasks.filter((t) => t.status === "wip").length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      sentForReview: tasks.filter((t) => t.status === "sent_for_review").length,
      requestChanges: tasks.filter((t) => t.status === "request_changes").length,
      overdue: tasks.filter((t) => t.status === "overdue").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      readyToBill: tasks.filter((t) => t.status === "ready_to_bill").length,
      onHold: tasks.filter((t) => t.status === "on_hold").length,
      cancelled: tasks.filter((t) => t.status === "cancelled").length,
      allTasks: tasks.length,
    };
  }, [tasks]);

  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchTasks();
        if (isMounted) {
          setTasks(data.tasks || []);
          setSubtasks(data.subtasks || []);
          setActivities(data.activities || []);
          if (data.recurringKpi) setRecurringKpi(data.recurringKpi);
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleCreateTask = async (formData: TaskFormData) => {
    const newTask = await createTask(formData);
    setTasks((prev) => [newTask, ...prev]);

    // Record activity
    const newActivity: TaskActivityItem = {
      id: `act-${Date.now()}`,
      taskId: newTask.id,
      taskTitle: newTask.taskTitle,
      actionType: "Task Created",
      description: `Task "${newTask.taskTitle}" created for ${newTask.clientName}`,
      userName: "Archi Saha",
      userInitials: "AS",
      createdAt: "Just now",
      eventCategory: "status_changes",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: TaskItem["status"]) => {
    startTransition(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    });

    try {
      await updateTask(id, { status: newStatus });
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const newAct: TaskActivityItem = {
          id: `act-${Date.now()}`,
          taskId: id,
          taskTitle: task.taskTitle,
          actionType: "Status Updated",
          description: `Status changed to ${newStatus.replace(/_/g, " ")}`,
          userName: "Archi Saha",
          userInitials: "AS",
          createdAt: "Just now",
          eventCategory: "status_changes",
        };
        setActivities((prev) => [newAct, ...prev]);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    startTransition(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
    try {
      await deleteTask(id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleToggleSubtask = async (id: string, isCompleted: boolean) => {
    startTransition(() => {
      setSubtasks((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: isCompleted ? "completed" : "pending" }
            : s
        )
      );
    });
    try {
      await toggleSubtask(id, isCompleted);
    } catch (err) {
      console.error("Failed to update subtask:", err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Top Operational Navigation & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
          {/* 5 Sub-Tabs Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "summary", label: "Task Summary", icon: LayoutGrid },
              { id: "list", label: "Task List", icon: CheckSquare },
              { id: "subtasks", label: "Sub Tasks", icon: ListChecks },
              { id: "recurring", label: "Recurring Schedule", icon: Repeat },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-indigo-50/90 text-indigo-700 shadow-2xs border border-indigo-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Master Actions: Activity & + Add Task */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* 30-Day Activity Drawer Button */}
            <button
              type="button"
              onClick={() => setIsActivityDrawerOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
            >
              <Clock className="size-3.5 text-slate-500" />
              <span>Activity</span>
            </button>

            {/* + Add Task Primary Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
            <div className="size-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-600">Loading statutory compliance engine...</p>
          </div>
        ) : (
          <>
            {activeTab === "summary" && <TaskSummaryTab tasks={tasks} />}
            {activeTab === "list" && (
              <TaskListTab
                tasks={tasks}
                kpi={derivedKpi}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {activeTab === "subtasks" && (
              <SubTasksTab
                subtasks={subtasks}
                onToggleSubtask={handleToggleSubtask}
              />
            )}
            {activeTab === "recurring" && (
              <RecurringScheduleTab
                tasks={tasks}
                recurringKpi={recurringKpi}
              />
            )}
            {activeTab === "analytics" && <AnalyticsMisTab tasks={tasks} />}
          </>
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Slide-Over Task Activity Drawer */}
      <TaskActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        activities={activities}
      />
    </AppShell>
  );
}
