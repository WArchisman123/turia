import { ServiceItem, ServiceFormData, ServiceKpiData } from "@/components/services/types";

export async function fetchServices(): Promise<{ services: ServiceItem[]; kpi: ServiceKpiData }> {
  const res = await fetch("/api/services", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.statusText}`);
  }

  return res.json();
}

export async function createService(formData: ServiceFormData): Promise<ServiceItem> {
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create service");
  }

  const data = await res.json();
  return data.service;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
  const res = await fetch(`/api/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update service");
  }

  const data = await res.json();
  return data.service;
}

export async function deleteService(id: string): Promise<boolean> {
  const res = await fetch(`/api/services/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete service");
  }

  return true;
}

export async function importServicesFile(file: File): Promise<{
  insertedCount: number;
  skippedCount: number;
  services: ServiceItem[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/services/import", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to import services file");
  }

  return res.json();
}
