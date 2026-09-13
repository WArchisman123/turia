import { get, post, patch, del } from "@/lib/api";
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
  return get<FetchRegistryResponse>("/api/registry", {
    params: filters,
    cache: "no-store",
  });
}

export async function createDSC(data: DSCFormData): Promise<DSCItem> {
  return post<DSCItem>("/api/registry", data);
}

export async function updateDSC(
  id: string,
  data: Partial<DSCFormData>
): Promise<DSCItem> {
  return patch<DSCItem>(`/api/registry/${id}`, data);
}

export async function transferCustody(
  data: CustodyTransferData
): Promise<{ success: boolean; dsc: DSCItem }> {
  return patch<{ success: boolean; dsc: DSCItem }>(`/api/registry/${data.dscId}`, {
    action: "transfer_custody",
    location: data.toLocation,
    bin_number: data.toBin,
    handed_to: data.handedTo,
    reason: data.reason,
    logged_by: data.loggedBy,
  });
}

export async function deleteDSC(id: string): Promise<boolean> {
  await del(`/api/registry/${id}`);
  return true;
}

export async function fetchDSCActivityLogs(): Promise<DSCMovementLog[]> {
  try {
    const data = await get<{ logs: DSCMovementLog[] }>("/api/registry/activity", {
      cache: "no-store",
    });
    return data.logs || [];
  } catch (error) {
    console.error("Error fetching DSC activity logs:", error);
    return [];
  }
}

export async function fetchClientLicenses(): Promise<ClientLicenseItem[]> {
  try {
    const data = await get<{ licenses: ClientLicenseItem[] }>("/api/registry/licenses", {
      cache: "no-store",
    });
    return data.licenses || [];
  } catch (error) {
    console.error("Error fetching client licenses:", error);
    return [];
  }
}

export async function createClientLicense(
  data: Partial<ClientLicenseItem>
): Promise<ClientLicenseItem> {
  return post<ClientLicenseItem>("/api/registry/licenses", data);
}
