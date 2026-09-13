"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowRightLeft, CheckCircle2, Clock, AlertTriangle, RotateCw } from "lucide-react";
import { ReassignModal } from "./reassign-modal";
import { fetchAssignedTasks, reassignTasks } from "@/lib/api/profile";

export interface AssignedTaskItem {
  id: string;
  taskName: string;
  clientName: string;
  service: string;
  endDate: string;
  assignee: string;
  reviewer: string;
  status: "In Progress" | "Under Review" | "Completed" | "Pending Client Info";
  priority: "High" | "Medium" | "Low";
}

export function TasksTab() {
  const [tasks, setTasks] = useState<AssignedTaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReassignOpen, setIsReassignOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      try {
        const data = await fetchAssignedTasks();
        if (isMounted) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to load assigned tasks:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter((item) => item !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const handleReassignConfirm = async (newAssignee: string) => {
    await reassignTasks(selectedTaskIds, newAssignee);
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    setSelectedTaskIds([]);
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assigned tasks, clients..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {isLoading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RotateCw className="size-3 animate-spin text-indigo-600" /> Loading tasks...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedTaskIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsReassignOpen(true)}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="size-3.5" /> Re-Assign ({selectedTaskIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.length > 0 && selectedTaskIds.length === tasks.length}
                    onChange={toggleSelectAll}
                    className="size-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Task Name</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Client Name</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Service</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Due Date</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Assignee</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Reviewer</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-center">Priority</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                    {isLoading ? "Fetching assigned tasks..." : "No assigned tasks found."}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(task.id)}
                          className="size-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                        {task.taskName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{task.clientName}</td>
                      <td className="py-3 px-4 text-slate-600">{task.service}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {task.endDate}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{task.assignee}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{task.reviewer}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            task.priority === "High"
                              ? "bg-rose-100 text-rose-800"
                              : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : task.status === "Under Review"
                              ? "bg-blue-100 text-blue-800"
                              : task.status === "Pending Client Info"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {task.status === "Completed" && <CheckCircle2 className="size-3" />}
                          {task.status === "Under Review" && <Clock className="size-3" />}
                          {task.status === "Pending Client Info" && (
                            <AlertTriangle className="size-3" />
                          )}
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      <ReassignModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        title="Reassign Statutory Compliance Tasks"
        itemCount={selectedTaskIds.length}
        itemNames={tasks.filter((t) => selectedTaskIds.includes(t.id)).map((t) => t.taskName)}
        onConfirm={handleReassignConfirm}
      />
    </div>
  );
}
