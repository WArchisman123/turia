export type LeadStage =
  | "New"
  | "Contacted"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type LeadStatus = "Open" | "Converted" | "Lost";

export type LeadSource =
  | "Referral"
  | "Website"
  | "LinkedIn"
  | "Direct Walk-in"
  | "MCA Data"
  | "Partner Network";

export interface LeadItem {
  id: string;
  leadCode: string;
  leadName: string;
  contactPerson: string;
  businessEntity: string;
  dealValue: number;
  currency: string;
  stage: LeadStage;
  status: LeadStatus;
  score: number; // 0 - 100
  assignedTo: string;
  source: LeadSource;
  serviceInterest: string;
  createdDate: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  city: string;
  state: string;
  notes: string;
}

export interface LeadFilterState {
  stage: string;
  status: string;
  assignedTo: string;
  source: string;
  entityType: string;
  dateRange: string;
  dealValueRange: [number, number]; // [min, max] in Rupees (0 to 10,000,000)
  scoreRange: [number, number]; // [min, max] (0 to 100)
  searchQuery: string;
}
