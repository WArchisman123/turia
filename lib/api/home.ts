import { TimeEntryItem } from "@/components/home/add-time-entry-modal";

export interface SalesSummaryResponse {
  totalBilled: number;
  totalCollected: number;
  totalTds: number;
  totalPending: number;
  proformaCount: number;
  taxInvoiceCount: number;
  monthlyTrends: Array<{
    month: string;
    proforma: number;
    taxInvoice: number;
    collected: number;
    pending: number;
  }>;
  topServices: Array<{
    name: string;
    amount: number;
    percent: number;
  }>;
  topClients: Array<{
    code: string;
    name: string;
    billed: string;
    collected: string;
    outstanding: string;
    status: string;
  }>;
}

export interface SeedResult {
  success: boolean;
  message: string;
  counts?: Record<string, number>;
}

export async function triggerSeedDatabase(): Promise<SeedResult> {
  try {
    const res = await fetch("/api/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error) {
    console.error("Error triggering database seed:", error);
    return { success: false, message: "Network error during seeding" };
  }
}

export async function punchAttendance(
  action: "punch_in" | "punch_out",
  workLocation = "At Office"
): Promise<{ success: boolean; timestamp?: string }> {
  try {
    const res = await fetch("/api/attendance/punch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        workLocation,
        inGeoCoords: "19.0760° N, 72.8777° E",
        distanceMeters: 18,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error punching attendance:", error);
    return { success: false };
  }
}

export async function fetchTimesheet(): Promise<TimeEntryItem[]> {
  try {
    const res = await fetch("/api/timesheet", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.entries || [];
  } catch (error) {
    console.error("Error fetching timesheet:", error);
    return [];
  }
}

export async function saveTimesheetEntry(entry: Partial<TimeEntryItem>): Promise<TimeEntryItem | null> {
  try {
    const res = await fetch("/api/timesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.entry || null;
  } catch (error) {
    console.error("Error saving timesheet entry:", error);
    return null;
  }
}

export async function fetchSalesSummary(): Promise<SalesSummaryResponse | null> {
  try {
    const res = await fetch("/api/sales/summary", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.summary || null;
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    return null;
  }
}

export async function fetchNotes(): Promise<Array<{ id: string; title: string; content: string; tags: string[]; is_pinned: boolean }>> {
  try {
    const res = await fetch("/api/notes", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.notes || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function saveQuickNote(note: { title: string; content: string; tags?: string[]; isPinned?: boolean }) {
  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    return res.ok;
  } catch (error) {
    console.error("Error saving note:", error);
    return false;
  }
}
