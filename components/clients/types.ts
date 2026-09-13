export interface ClientItem {
  id: string;
  clientCode: string;
  tradeName: string;
  legalName: string;
  contactName: string;
  email: string;
  mobileNo: string;
  createdOn: string;
  businessPan: string;
  registrationNo: string;
  businessEntity: string;
  currency: string;
  gstin: string;
  placeOfSupply: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: "active" | "inactive" | "dormant" | "new";
  services: string[];
  employeeList: string;
  assignedPartnerId?: string | null;
  assignedManagerId?: string | null;
  groups: string;
  auditor: string;
  labels: string[];
  associatePartners: string;
  referredBy?: string;
  source?: string;
  notes?: string;
}

export interface ClientKpiData {
  totalClients: number;
  newClientsThisMonth: number;
  activeClients90Days: number;
  noActivity90Days: number;
}

export interface ClientFilterState {
  searchQuery: string;
  businessEntity: string;
  status: string;
  state: string;
  assignedPartner: string;
  group: string;
}

export interface ClientFormData {
  businessEntity: string;
  businessName: string;
  legalName: string;
  clientId: string;
  referredBy: string;
  source: string;
  currency: string;
  clientCreationDate: string;
  gstin: string;
  gstinType?: string;
  gstinStatus?: string;
  gstRegistrationDate?: string;
  lastUpdated?: string;
  preference?: string;
  placeOfSupply: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  businessPan?: string;
  registrationNo?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  contactName?: string;
  clientGroup?: string;
  auditor?: string;
  services?: string[];
  labels?: string[];
  associatePartners?: string;
  assignedPartnerId?: string;
  assignedManagerId?: string;
}

export interface ClientGstinItem {
  id?: string;
  gstin: string;
  state: string;
  stateCode: string;
  principalPlace?: string;
  isPrimary: boolean;
}

export interface ClientContactItem {
  id?: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  dinNumber?: string;
  isPrimary: boolean;
}

/**
 * Strict 24-column structure matching Clients_03-09-2026.xlsx
 */
export interface OfficialClientXlsxRow {
  "Client ID": string;
  "Business Name": string;
  "Legal Name": string;
  "Contact Name": string;
  "Email": string;
  "Mobile No": string;
  "Created On": string;
  "Business PAN": string;
  "Registration No": string;
  "Business Entity": string;
  "Currency": string;
  "GSTIN": string;
  "Place Of Supply": string;
  "Address Line 1": string;
  "Address Line 2": string;
  "City": string;
  "State": string;
  "Country": string;
  "Pin code": string;
  "Status": string;
  "Services": string;
  "Employee List": string;
  "Groups": string;
  "Associate Partners": string;
}

export const OFFICIAL_XLSX_COLUMNS = [
  "Client ID",
  "Business Name",
  "Legal Name",
  "Contact Name",
  "Email",
  "Mobile No",
  "Created On",
  "Business PAN",
  "Registration No",
  "Business Entity",
  "Currency",
  "GSTIN",
  "Place Of Supply",
  "Address Line 1",
  "Address Line 2",
  "City",
  "State",
  "Country",
  "Pin code",
  "Status",
  "Services",
  "Employee List",
  "Groups",
  "Associate Partners",
] as const;
