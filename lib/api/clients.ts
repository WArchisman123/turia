import { ClientItem, ClientFormData, ClientKpiData } from "@/components/clients/types";

export async function fetchClients(): Promise<{ clients: ClientItem[]; kpi: ClientKpiData }> {
  const res = await fetch("/api/clients", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch clients: ${res.statusText}`);
  }

  return res.json();
}

export async function createClient(formData: ClientFormData): Promise<ClientItem> {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create client");
  }

  const data = await res.json();
  return data.client;
}

export async function updateClient(id: string, updates: Partial<ClientItem>): Promise<ClientItem> {
  const res = await fetch(`/api/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update client");
  }

  const data = await res.json();
  return data.client;
}

export async function deleteClient(id: string): Promise<boolean> {
  const res = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete client");
  }

  return true;
}

export async function importClientsFile(file: File): Promise<{
  insertedCount: number;
  skippedCount: number;
  clients: ClientItem[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/clients/import", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to import clients file");
  }

  return res.json();
}
