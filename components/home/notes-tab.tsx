"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, Trash2, FileSpreadsheet, ShieldCheck, FileCheck } from "lucide-react";
import { saveQuickNote, fetchNotes } from "@/lib/api/home";

const TEMPLATES = [
  {
    name: "Tax Audit 44AB (Form 3CD)",
    icon: ShieldCheck,
    content: `[TAX AUDIT 44AB - FORM 3CD CHECKLIST]
1. Verify depreciation schedule as per Income Tax Act vs Companies Act (Clause 18)
2. Quantitative details reconciliation of stock (Clause 35)
3. Check 40A(2)(b) payments to specified persons & fair market value justification
4. Verify MSME payments within 45/15 days under Section 43B(h)
5. TDS deduction and deposit reconciliation with Form 26AS/AIS (Clause 34)
6. Cash transactions exceeding ₹10,000 threshold verification (Section 40A(3))`
  },
  {
    name: "MCA DIR-3 KYC & ROC",
    icon: FileCheck,
    content: `[MCA DIR-3 KYC & ANNUAL ROC COMPLIANCE]
1. Download MCA Master Data for all active company directors
2. Verify Mobile OTP and Email OTP verification on MCA v3 portal
3. Check DSC validity on token bin storage
4. Prepare Board Resolution for approval of Financial Statements
5. File Form AOC-4 (XBRL/Non-XBRL) within 30 days of AGM
6. File Form MGT-7/7A within 60 days of AGM`
  },
  {
    name: "GSTR-9 / 9C Annual Reconciliation",
    icon: FileSpreadsheet,
    content: `[GSTR-9 & 9C ANNUAL RECONCILIATION]
1. Table 4 vs Table 9: Tax payable vs Tax paid in cash/ITC
2. Table 8A vs Table 6B: GSTR-2A auto-populated vs ITC availed in GSTR-3B
3. Reconcile Outward Supplies turnover with Audited Financial Balance Sheet
4. RCM liability verification on advocate fees, security, GTA, director remuneration
5. DRC-03 reconciliation for any voluntary tax payments`
  }
];

const DEFAULT_NOTE = `[TURIA STATUTORY PRACTICE SCRATCHPAD]
- Sep 15: Advance Tax Second Installment (45% cumulative) deadline
- Sep 30: Tax Audit Report filing for corporate & audit assesses (AY 2026-27)
- Oct 07: TDS / TCS deposit for September
- Oct 15: Form 15CA / 15CB foreign remittance certifications pending review

Client Follow-ups:
- Acme Global: Obtain signed bank confirmation letters for statutory audit
- Reliance Retail: Reconcile e-Invoices with GSTR-1 Table 12 HSN summaries`;

export function NotesTab() {
  const [notes, setNotes] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("turia_quick_notes");
        if (saved !== null) return saved;
      } catch {
        // fallback
      }
    }
    return DEFAULT_NOTE;
  });
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving...">("Saved");

  // Load from Supabase on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadNotesFromDb() {
      const dbNotes = await fetchNotes();
      if (isMounted && dbNotes && dbNotes.length > 0) {
        const topNote = dbNotes[0];
        if (topNote.content) {
          setNotes(topNote.content);
        }
      }
    }
    loadNotesFromDb();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage & Supabase with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("turia_quick_notes", notes);
        saveQuickNote({
          title: "CA Practice Scratchpad",
          content: notes,
          tags: ["Practice", "Compliance"],
          isPinned: true,
        });
      } catch (err) {
        console.error("Failed to save to localStorage", err);
      }
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(timer);
  }, [notes]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setSaveStatus("Saving...");
  };

  const insertTemplate = (templateContent: string) => {
    setNotes((prev) => (prev ? `${prev}\n\n${templateContent}` : templateContent));
    setSaveStatus("Saving...");
  };

  const clearNotes = () => {
    if (window.confirm("Are you sure you want to clear your scratchpad notes?")) {
      setNotes("");
      setSaveStatus("Saving...");
    }
  };

  const wordsCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charsCount = notes.length;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs min-h-[560px] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-slate-900">Quick Notes Scratchpad</h3>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {wordsCount} words • {charsCount} characters
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick CA Templates */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="size-3 text-amber-500" /> Insert Template:
            </span>
            {TEMPLATES.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={tmpl.name}
                  onClick={() => insertTemplate(tmpl.content)}
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded border border-slate-200 transition-colors cursor-pointer"
                  title={`Append ${tmpl.name} checklist`}
                >
                  <Icon className="size-3 text-slate-400" />
                  {tmpl.name}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Clear Button */}
          <button
            type="button"
            onClick={clearNotes}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
            title="Clear Scratchpad"
          >
            <Trash2 className="size-4" />
          </button>

          {/* Live Auto-save indicator */}
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 min-w-[70px] justify-end">
            {saveStatus === "Saved" ? (
              <>
                <Check className="size-3.5 text-emerald-500 stroke-[2.5]" />
                <span className="text-emerald-600 text-[11px] font-semibold">Auto-saved</span>
              </>
            ) : (
              <span className="text-amber-600 text-[11px] font-semibold animate-pulse">Saving...</span>
            )}
          </span>
        </div>
      </div>

      {/* Auto-saving Textarea */}
      <textarea
        value={notes}
        onChange={handleTextChange}
        placeholder="Start typing client follow-ups, tax audit observations, MCA filing notes, or compliance reminders..."
        className="w-full flex-1 p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed font-mono bg-slate-50/50 rounded-lg border border-slate-100 focus:border-slate-300 transition-colors"
        rows={18}
      />
    </div>
  );
}
