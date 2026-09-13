import { get, post, patch, del } from "@/lib/api";
import { LeadItem } from "@/components/leads/types";

export async function fetchLeads(): Promise<LeadItem[]> {
  try {
    const data = await get<{ leads: LeadItem[] }>("/api/leads", { cache: "no-store" });
    return data.leads || [];
  } catch (error) {
    console.error("Error fetching leads via API:", error);
    return [];
  }
}

export async function createLead(leadData: Partial<LeadItem>): Promise<LeadItem | null> {
  try {
    const data = await post<{ success: boolean; lead: LeadItem }>("/api/leads", leadData);
    return data.lead || null;
  } catch (error) {
    console.error("Error creating lead via API:", error);
    return null;
  }
}

export async function updateLeadStatus(
  id: string,
  status: LeadItem["status"],
  stage?: LeadItem["stage"]
): Promise<boolean> {
  try {
    await patch(`/api/leads/${id}`, { status, stage });
    return true;
  } catch (error) {
    console.error("Error updating lead status via API:", error);
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    await del(`/api/leads/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting lead via API:", error);
    return false;
  }
}
