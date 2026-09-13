/**
 * GSTIN Validation & Verification Service for Indian CA Practice
 * Standard 15-character GSTIN format:
 * - 2 digits: State Code (e.g. 19 for West Bengal, 27 for Maharashtra)
 * - 10 chars: PAN of the entity
 * - 1 char: Entity number of the same PAN in the state (1-9, A-Z)
 * - 1 char: 'Z' by default
 * - 1 char: Checksum digit
 */

export interface GSTVerificationResult {
  isValid: boolean;
  gstin: string;
  legalName?: string;
  tradeName?: string;
  state?: string;
  stateCode?: string;
  pan?: string;
  entityType?: string;
  address?: string;
  city?: string;
  pincode?: string;
  registrationDate?: string;
  taxpayerType?: string;
  status?: "Active" | "Inactive" | "Suspended" | "Cancelled";
  filingFrequency?: "Monthly" | "Quarterly (QRMP)";
  error?: string;
}

const STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};

export function validateGSTINFormat(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

/**
 * Simulates real-time GST portal verification for given GSTIN.
 */
export async function verifyGSTIN(gstinInput: string): Promise<GSTVerificationResult> {
  const gstin = gstinInput.trim().toUpperCase();

  if (!validateGSTINFormat(gstin)) {
    return {
      isValid: false,
      gstin,
      error: "Invalid GSTIN format. Expected 15 characters (e.g. 19AAACB1234F1Z5).",
    };
  }

  const stateCode = gstin.substring(0, 2);
  const pan = gstin.substring(2, 12);
  const state = STATE_CODES[stateCode] || "Other State / UT";
  const entityLetter = pan.charAt(3);

  let entityType = "Private Limited Company";
  if (entityLetter === "P") entityType = "Individual / Sole Proprietorship";
  else if (entityLetter === "C") entityType = "Private / Public Limited Company";
  else if (entityLetter === "F") entityType = "Partnership Firm / LLP";
  else if (entityLetter === "H") entityType = "HUF (Hindu Undivided Family)";
  else if (entityLetter === "T") entityType = "Trust / Society";

  // Simulate remote network verification delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    isValid: true,
    gstin,
    legalName: `M/S ${pan} ENTERPRISES ${entityLetter === "C" ? "PRIVATE LIMITED" : entityLetter === "F" ? "LLP" : ""}`.trim(),
    tradeName: `GLOBAL TAX & LOGISTICS SOLUTIONS (${state})`,
    state,
    stateCode,
    pan,
    entityType,
    address: `Plot 14, Phase 2, Industrial Growth Centre, ${state}`,
    city: state === "West Bengal" ? "Kolkata" : state === "Maharashtra" ? "Mumbai" : "Capital City",
    pincode: stateCode === "19" ? "700091" : stateCode === "27" ? "400001" : "110001",
    registrationDate: "01-Jul-2017",
    taxpayerType: "Regular Taxpayer",
    status: "Active",
    filingFrequency: "Monthly",
  };
}
