"use client";

import React, { useState } from "react";
import { X, Bell, Users, Flag } from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  targetAudience: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  description: string;
}

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotice: (notice: NoticeItem) => void;
}

export function CreateNoticeModal({
  isOpen,
  onClose,
  onAddNotice,
}: CreateNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("All Staff");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNotice: NoticeItem = {
      id: Date.now().toString(),
      title,
      targetAudience,
      priority,
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      description,
    };

    onAddNotice(newNotice);
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Create Firm Notice
              </h3>
              <p className="text-[11px] text-slate-500">
                Broadcast statutory announcements to staff and article trainees
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Notice Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advance Tax Q2 Filing Deadline - Sep 15"
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Users className="size-3 text-slate-400" />
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>All Staff</option>
                <option>Article Trainees</option>
                <option>Senior Associates &amp; Managers</option>
                <option>Partners Only</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Flag className="size-3 text-slate-400" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "High" | "Medium" | "Low")
                }
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Description &amp; Action Required
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide statutory guidelines, challan links, or reconciliation instructions..."
              className="w-full p-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Post Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
