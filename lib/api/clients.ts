import { get, post, patch, del } from "@/lib/api";
import { ClientItem, ClientFormData, ClientKpiData } from "@/components/clients/types";

export async function fetchClients(): Promise<{ clients: ClientItem[]; kpi: ClientKpiData }> {
  return get<{ clients: ClientItem[]; kpi: ClientKpiData }>("/api/clients", {
    cache: "no-store",
  });
}

export async function createClient(formData: ClientFormData): Promise<ClientItem> {
  const data = await post<{ client: ClientItem }>("/api/clients", formData);
  return data.client;
}

export async function updateClient(id: string, updates: Partial<ClientItem>): Promise<ClientItem> {
  const data = await patch<{ client: ClientItem }>(`/api/clients/${id}`, updates);
  return data.client;
}

export async function deleteClient(id: string): Promise<boolean> {
  await del(`/api/clients/${id}`);
  return true;
}

export async function importClientsFile(file: File): Promise<{
  insertedCount: number;
  skippedCount: number;
  clients: ClientItem[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  return post<{
    insertedCount: number;
    skippedCount: number;
    clients: ClientItem[];
  }>("/api/clients/import", formData);
}
