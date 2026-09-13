import { get, post, patch, del } from "@/lib/api";
import { ServiceItem, ServiceFormData, ServiceKpiData } from "@/components/services/types";

export async function fetchServices(): Promise<{ services: ServiceItem[]; kpi: ServiceKpiData }> {
  return get<{ services: ServiceItem[]; kpi: ServiceKpiData }>("/api/services", {
    cache: "no-store",
  });
}

export async function createService(formData: ServiceFormData): Promise<ServiceItem> {
  const data = await post<{ service: ServiceItem }>("/api/services", formData);
  return data.service;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
  const data = await patch<{ service: ServiceItem }>(`/api/services/${id}`, updates);
  return data.service;
}

export async function deleteService(id: string): Promise<boolean> {
  await del(`/api/services/${id}`);
  return true;
}

export async function importServicesFile(file: File): Promise<{
  insertedCount: number;
  skippedCount: number;
  services: ServiceItem[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  return post<{
    insertedCount: number;
    skippedCount: number;
    services: ServiceItem[];
  }>("/api/services/import", formData);
}
