import { LeadItem } from "@/components/leads/types";

export async function fetchLeads(): Promise<LeadItem[]> {
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch leads");
    const data = await res.json();
    return data.leads || [];
  } catch (error) {
    console.error("Error fetching leads via API:", error);
    return [];
  }
}

export async function createLead(leadData: Partial<LeadItem>): Promise<LeadItem | null> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });
    if (!res.ok) throw new Error("Failed to create lead");
    const data = await res.json();
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
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, stage }),
    });
    return res.ok;
  } catch (error) {
    console.error("Error updating lead status via API:", error);
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (error) {
    console.error("Error deleting lead via API:", error);
    return false;
  }
}
