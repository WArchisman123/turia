import { get, post } from "@/lib/api";
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
    return await post<SeedResult>("/api/seed");
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
    return await post<{ success: boolean; timestamp?: string }>("/api/attendance/punch", {
      action,
      workLocation,
      inGeoCoords: "19.0760° N, 72.8777° E",
      distanceMeters: 18,
    });
  } catch (error) {
    console.error("Error punching attendance:", error);
    return { success: false };
  }
}

export async function fetchTimesheet(): Promise<TimeEntryItem[]> {
  try {
    const data = await get<{ entries: TimeEntryItem[] }>("/api/timesheet", { cache: "no-store" });
    return data.entries || [];
  } catch (error) {
    console.error("Error fetching timesheet:", error);
    return [];
  }
}

export async function saveTimesheetEntry(entry: Partial<TimeEntryItem>): Promise<TimeEntryItem | null> {
  try {
    const data = await post<{ entry: TimeEntryItem }>("/api/timesheet", entry);
    return data.entry || null;
  } catch (error) {
    console.error("Error saving timesheet entry:", error);
    return null;
  }
}

export async function fetchSalesSummary(): Promise<SalesSummaryResponse | null> {
  try {
    const data = await get<{ summary: SalesSummaryResponse }>("/api/sales/summary", {
      cache: "no-store",
    });
    return data.summary || null;
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    return null;
  }
}

export async function fetchNotes(): Promise<
  Array<{ id: string; title: string; content: string; tags: string[]; is_pinned: boolean }>
> {
  try {
    const data = await get<{
      notes: Array<{ id: string; title: string; content: string; tags: string[]; is_pinned: boolean }>;
    }>("/api/notes", { cache: "no-store" });
    return data.notes || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function saveQuickNote(note: {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
}): Promise<boolean> {
  try {
    await post("/api/notes", note);
    return true;
  } catch (error) {
    console.error("Error saving note:", error);
    return false;
  }
}
