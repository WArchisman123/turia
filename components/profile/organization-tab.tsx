"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { fetchOrgTree, OrgTreeNode } from "@/lib/api/profile";

export function OrganizationTab() {
  const [orgTree, setOrgTree] = useState<OrgTreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadTree() {
      try {
        const tree = await fetchOrgTree();
        if (isMounted && tree) {
          setOrgTree(tree);
          // Expand all nodes by default
          const exp: Record<string, boolean> = {};
          const traverse = (node: OrgTreeNode) => {
            exp[node.id] = true;
            node.children?.forEach(traverse);
          };
          traverse(tree);
          setExpandedNodes(exp);
        }
      } catch (err) {
        console.error("Failed to load org tree:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadTree();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const renderNode = (node: OrgTreeNode) => {
    const isExpanded = expandedNodes[node.id] ?? true;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div className="relative group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all w-64 text-left">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar */}
            <div
              className={`size-10 rounded-xl ${node.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
            >
              {node.initials}
            </div>

            {/* Level Pill */}
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
              {node.level}
            </span>
          </div>

          <div className="mt-3">
            <h4 className="font-bold text-xs text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              {node.name}
            </h4>
            <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{node.designation}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{node.department}</p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-mono text-slate-400 truncate max-w-[140px]">{node.email}</span>
            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
          </div>

          {/* Expand/Collapse Handle Button */}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 size-6 rounded-full bg-white border border-slate-300 hover:border-indigo-600 shadow-xs flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all cursor-pointer z-10"
            >
              {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
          )}
        </div>

        {/* Children Branches */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center pt-6">
            {/* Vertical Connector Line */}
            <div className="w-0.5 h-6 bg-slate-300 -mt-6" />

            {/* Horizontal Branch Bar */}
            {node.children!.length > 1 && (
              <div
                className="h-0.5 bg-slate-300 relative"
                style={{
                  width: `${(node.children!.length - 1) * 290}px`,
                }}
              />
            )}

            {/* Child Node Columns */}
            <div className="flex items-start gap-8 pt-4">
              {node.children!.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center">
                  {/* Vertical branch line from horizontal bar to child */}
                  <div className="w-0.5 h-4 bg-slate-300 -mt-4 mb-0" />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Organization Hierarchy Tree
            </h3>
            {isLoading && <RotateCw className="size-3.5 text-slate-400 animate-spin" />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time reporting structures across practice leadership, managers, and trainees
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 min-w-[45px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-8 overflow-auto min-h-[500px] flex justify-center items-start">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <RotateCw className="size-6 text-indigo-600 animate-spin mx-auto mb-2" />
            Generating organization hierarchy tree from Supabase...
          </div>
        ) : !orgTree ? (
          <div className="py-20 text-center text-xs text-slate-400">
            No active firm members found in practice directory.
          </div>
        ) : (
          <div
            className="transition-transform duration-150 origin-top flex justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {renderNode(orgTree)}
          </div>
        )}
      </div>
    </div>
  );
}
