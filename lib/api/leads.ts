import { get, post, patch, del } from "@/lib/api";
import { LeadItem } from "@/components/leads/types";
import { ClientItem } from "@/components/clients/types";

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

/**
 * 1-Click Conversion from qualified Lead into an active Client record
 */
export async function convertLeadToClient(
  leadId: string,
  leadDetails?: Partial<LeadItem>
): Promise<{ success: boolean; client?: ClientItem; message?: string }> {
  try {
    const data = await post<{
      success: boolean;
      client: ClientItem;
      message: string;
    }>("/api/leads/convert", {
      leadId,
      ...leadDetails,
    });
    return data;
  } catch (error) {
    console.error("Error converting lead to client via API:", error);
    return { success: false };
  }
}

/**
 * Batch Convert multiple leads into clients
 */
export async function batchConvertLeads(
  leadIds: string[]
): Promise<{ success: boolean; count: number; clients?: ClientItem[] }> {
  try {
    const data = await post<{
      success: boolean;
      count: number;
      clients: ClientItem[];
    }>("/api/leads/convert", {
      leadIds,
    });
    return data;
  } catch (error) {
    console.error("Error batch converting leads via API:", error);
    return { success: false, count: 0 };
  }
}

/**
 * Batch Delete multiple leads
 */
export async function batchDeleteLeads(leadIds: string[]): Promise<boolean> {
  try {
    await Promise.all(leadIds.map((id) => del(`/api/leads/${id}`)));
    return true;
  } catch (error) {
    console.error("Error batch deleting leads via API:", error);
    return false;
  }
}
