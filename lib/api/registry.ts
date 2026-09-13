import {
  DSCItem,
  DSCKpiData,
  DSCFormData,
  CustodyTransferData,
  DSCMovementLog,
  ClientLicenseItem,
} from "@/components/registry/types";

export interface FetchRegistryResponse {
  dscs: DSCItem[];
  kpi: DSCKpiData;
}

export async function fetchRegistryData(filters?: {
  search?: string;
  location?: string;
  status?: string;
  vendor?: string;
  filterType?: string;
}): Promise<FetchRegistryResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.location) params.set("location", filters.location);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.vendor) params.set("vendor", filters.vendor);
  if (filters?.filterType) params.set("filterType", filters.filterType);

  const res = await fetch(`/api/registry?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch DSC registry: ${res.statusText}`);
  }

  return res.json();
}

export async function createDSC(data: DSCFormData): Promise<DSCItem> {
  const res = await fetch("/api/registry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create DSC record");
  }

  return res.json();
}

export async function updateDSC(
  id: string,
  data: Partial<DSCFormData>
): Promise<DSCItem> {
  const res = await fetch(`/api/registry/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update DSC record");
  }

  return res.json();
}

export async function transferCustody(
  data: CustodyTransferData
): Promise<{ success: boolean; dsc: DSCItem }> {
  const res = await fetch(`/api/registry/${data.dscId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "transfer_custody",
      location: data.toLocation,
      bin_number: data.toBin,
      handed_to: data.handedTo,
      reason: data.reason,
      logged_by: data.loggedBy,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to transfer custody");
  }

  return res.json();
}

export async function deleteDSC(id: string): Promise<boolean> {
  const res = await fetch(`/api/registry/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete DSC record");
  }

  return true;
}

export async function fetchDSCActivityLogs(): Promise<DSCMovementLog[]> {
  const res = await fetch("/api/registry/activity", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.logs || [];
}

export async function fetchClientLicenses(): Promise<ClientLicenseItem[]> {
  const res = await fetch("/api/registry/licenses", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.licenses || [];
}

export async function createClientLicense(
  data: Partial<ClientLicenseItem>
): Promise<ClientLicenseItem> {
  const res = await fetch("/api/registry/licenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create client statutory license");
  }

  return res.json();
}
