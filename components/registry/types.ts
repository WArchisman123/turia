export type DSCLocation =
  | "ca_office"
  | "cs_office"
  | "client_office"
  | "in_transit"
  | "missing";

export type DSCStatus = "active" | "expired" | "revoked";

export type DSCClass = "Class 3" | "Class 2";

export interface DSCItem {
  id: string;
  dscCode: string;
  clientId: string | null;
  businessName: string;
  legalName: string;
  signatoryName: string;
  panNumber: string;
  dinNumber: string;
  issuedDate: string;
  expiryDate: string;
  location: DSCLocation;
  locationLabel: string;
  status: DSCStatus;
  statusLabel: string;
  binNumber: string;
  vendor: string;
  dscClass: string;
  email: string;
  phone: string;
  tokenHardwareModel: string;
  tokenPin?: string;
  notes: string;
  daysUntilExpiry: number;
  isExpiringIn30d: boolean;
  isExpiringIn15d: boolean;
  isExpired: boolean;
  createdOn?: string;
}

export interface DSCKpiData {
  totalDSC: number;
  active: number;
  expIn30d: number;
  expIn15d: number;
  expired: number;
  caOffice: number;
  csOffice: number;
  clientOffice: number;
  missing: number;
}

export interface DSCFormData {
  clientId?: string;
  dscCode?: string;
  businessName: string;
  legalName: string;
  signatoryName: string;
  panNumber?: string;
  dinNumber?: string;
  vendor: string;
  dscClass: string;
  issuedDate: string;
  expiryDate: string;
  location: DSCLocation;
  binNumber: string;
  status: DSCStatus;
  email: string;
  phone: string;
  tokenHardwareModel: string;
  tokenPin?: string;
  notes?: string;
}

export interface CustodyTransferData {
  dscId: string;
  toLocation: DSCLocation;
  toBin: string;
  handedTo: string;
  reason: string;
  loggedBy?: string;
}

export interface DSCMovementLog {
  id: string;
  dscId: string;
  dscCode?: string;
  signatoryName?: string;
  fromLocation: string | null;
  toLocation: string;
  fromBin: string | null;
  toBin: string | null;
  handedTo: string | null;
  reason: string | null;
  loggedBy: string | null;
  createdAt: string;
}

export interface ClientLicenseItem {
  id: string;
  clientId: string;
  clientName: string;
  licenseName: string;
  licenseNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: "active" | "expiring" | "expired";
  daysRemaining: number;
}

export type RegistryTab = "dsc" | "licenses" | "bin_map";
