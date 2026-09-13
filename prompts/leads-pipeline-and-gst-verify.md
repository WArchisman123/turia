# Implementation Prompt: Leads Management & Client Acquisition Engine

## 1. Goal
Implement the complete, production-grade **Leads Management & Client Acquisition Engine** (`/leads`) with 6 KPI Metric Cards, 13-Column customizable data table, dynamic slide-down/expandable filter bar with dual range sliders (Deal Value `₹0–₹100L` & Lead Score `0–100`), 5-section Add Lead modal with **Live GSTIN Verification**, 1-click **Convert to Client** workflow, CSV/XLSX batch import/export, and 3-dots actions menu matching `public/context/contextDoc/doc.md` (Section 4), `public/context/contextDoc/role.md`, and screenshot references `Leads-1.png`, `leads-new.png`, `leads-filter clicked.png`, and `leads-3 dots clicked.png`.

---

## 2. Skills Read
- `.agents/skills/clerk/SKILL.md` (Clerk org session & role context)
- `.agents/skills/shadcn/SKILL.md` (Data tables, multi-section modal forms, dropdown menus, range sliders)
- `public/context/contextDoc/doc.md` (Section 4 Leads specifications, Section 12 Database schema)
- `public/context/contextDoc/role.md` (Leads module RBAC permissions for Admin, Partner, Manager, Associate)
- `AGENTS.md` (Strict architecture, GST verification rules, zero assumptions)

---

## 3. Existing Code Inspected
- `app/layout.tsx`: Root layout with `<ClerkProvider>` and `<RBACProvider>`.
- `components/layout/app-shell.tsx`: Master Application Shell with Sidenav highlighting active `/leads` route.
- `components/layout/sidebar.tsx`: Sidebar navigation with Leads item.
- `lib/rbac/matrix.ts` & `lib/rbac/server-guard.ts`: Role permissions for `leads` module.
- `proxy.ts`: Modern Next.js 16 route proxy protecting `/leads(.*)`.

---

## 4. Architectural & Visual Design Specifications

### 4.1 Leads KPI Strip & Metric Cards (`Leads-1.png`)
6 Top Metric Cards with distinct iconography and colored badge containers:
1. `Open`: Count of open prospective inquiries (Purple list icon in light-purple container).
2. `Converted`: Count of successfully onboarded clients (Emerald check icon in light-green container).
3. `Lost`: Count of lost/unqualified deals (Rose x-circle icon in light-red container).
4. `Total leads`: Aggregate lead count (Indigo users icon in light-blue container).
5. `Not Yet Converted Deal Value`: Total sum of open pipeline deals e.g. `₹42,50,000` (Amber rupee icon in light-amber container).
6. `Conversion Rate`: Calculated conversion percentage e.g. `33.33%` (Cyan percent icon in light-cyan container).

### 4.2 13-Column Leads Data Table (`Leads-1.png`)
- **Columns**:
  1. `Checkbox` (for batch operations)
  2. `Lead Name & Code` (Primary title + subtext company code)
  3. `Business Entity` (Private Limited, LLP, Public Limited, Sole Prop, Partnership)
  4. `Deal Value` (Formatted in INR `₹XX,XX,XXX` with font-bold)
  5. `Stage` (New, Contacted, Proposal Sent, Negotiation, Closed Won)
  6. `Status` (Open, Converted, Lost) with status pill badges
  7. `Score` (Lead health score 0–100 with color-coded score meter: green >70, amber 40-70, red <40)
  8. `Assigned To` (Associate / Partner avatar + name)
  9. `Source` (Referral, Website, LinkedIn, Direct Walk-in, MCA Lead Gen)
  10. `Created Date` (Formatted DD-MMM-YYYY)
  11. `Phone` (With country dial code `+91`)
  12. `Email`
  13. `Actions` (Edit, 1-Click Convert to Client, Mark as Lost, Delete)

### 4.3 Dynamic Filter Bar & Dual Range Sliders (`leads-filter clicked.png`)
- Expandable / collapsible filter panel beneath top toolbar:
  - **Dropdown Filters**: Stage (`All Stages`, `New`, `Proposal Sent`, `Negotiation`), Status (`All`, `Open`, `Converted`, `Lost`), Assigned To (`All Assignees`), Source (`All Sources`), Entity Type (`All Entity Types`), Date Range (`All Time`, `This Month`, `Last 30 Days`).
  - **Dual Range Sliders**:
    - `Deal Value Slider`: Range from `₹0` to `₹100,00,000` (₹100 Lakhs) with live minimum and maximum value indicators.
    - `Lead Score Slider`: Range from `0` to `100` with live score boundary indicators.
  - **Action Buttons**: `Apply Filters` (Purple primary button) & `Clear All Filters` (Ghost reset button).

### 4.4 5-Section Add Lead Modal with Live GSTIN Verification (`leads-new.png`)
- **Section 1: Lead Information**:
  - Lead / Trade Name, Primary Contact Person, Email ID, Mobile Number (`+91`).
- **Section 2: Business & Statutory Details (with Live GST Verification)**:
  - Business Entity Type selector.
  - GSTIN Input with **`Verify GSTIN`** button (simulates/executes live GST validation, auto-populates Trade Name, Legal Name, Address, Place of Supply, and filing frequency).
  - PAN Number & CIN/LLPIN.
- **Section 3: Commercials & Engagement**:
  - Estimated Deal Value (₹), Currency (`INR`), Service Interest (Statutory Audit, GST Compliance, Tax Audit 44AB, ROC Annual Filing, Transfer Pricing).
- **Section 4: Acquisition & Pipeline Allocation**:
  - Lead Source, Pipeline Stage, Lead Score (0–100), Assigned Associate/Partner.
- **Section 5: Address & Notes**:
  - Registered Address, City, State, Place of Supply, Practitioner Notes.

### 4.5 Import / Export Menu & Batch Operations (`leads-3 dots clicked.png`)
- Top action menu (`⋮`):
  - `Import Leads (CSV / XLSX)`: Batch drag-and-drop modal with preview.
  - `Export All Leads`: Instant CSV file download generator.
  - `Download Sample CSV`: Pre-formatted CSV template.

### 4.6 1-Click Convert to Client Workflow
- Clicking **Convert to Client** on an open lead:
  - Updates Lead status to `Converted`.
  - Prompts confirmation and seamlessly prepares the data payload for the `clients` directory with assigned partner and GSTIN details.

---

## 5. Files Likely to Change / Be Created

1. `app/leads/page.tsx`: Master Leads Management Page inside `AppShell`.
2. `components/leads/leads-kpi-strip.tsx`: 6 KPI metric cards.
3. `components/leads/leads-filter-bar.tsx`: Dynamic filter bar with dropdowns and dual range sliders.
4. `components/leads/leads-table.tsx`: 13-column interactive data table with batch actions.
5. `components/leads/add-lead-modal.tsx`: 5-section modal with live GSTIN verification.
6. `components/leads/import-leads-modal.tsx`: Drag-and-drop CSV/XLSX import modal.
7. `lib/gst/verifier.ts`: Live GSTIN format, state code, and mock auto-fetch verification service.

---

## 6. Implementation Requirements
- **Strict TypeScript**: 0 `any`, fully typed lead interfaces and filter state models.
- **Dynamic Interactivity**: Working dual sliders, live search filtering, real-time GSTIN verification simulation, working convert-to-client workflow, and CSV export.
- **Pixel-Perfect Styling**: Exact color palette (`#6366F1` indigo primary, `#10B981` emerald, `#F59E0B` amber, `#EF4444` rose, `#06B6D4` cyan), Inter font, and 12-column responsive layout.

---

## 7. Security Requirements
- Requires authenticated Clerk session via `proxy.ts`.
- Evaluates RBAC permissions for `leads` module (`view`, `add_edit`, `delete`, `import`, `export`).

---

## 8. Acceptance Criteria
1. Navigating to `/leads` loads the complete Leads Workspace inside `AppShell`.
2. 6 KPI cards accurately compute counts, deal values, and conversion rate.
3. 13-column table renders with score meters, status badges, and action dropdowns.
4. Clicking **Filter** toggles the dynamic filter bar with working dual sliders.
5. Clicking **+ Add Lead** opens the 5-section modal; clicking **Verify GSTIN** validates the format and auto-fills business details.
6. Clicking **Convert to Client** changes lead status to Converted and updates KPI metrics.
7. Clicking **Export CSV** downloads a structured `.csv` file.
8. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors/warnings.

---

## 9. Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Navigate to `http://localhost:3000/leads`.
2. Verify all 6 KPI cards at the top.
3. Click the **Filters** button to expand the filter panel; adjust the Deal Value slider and Lead Score slider to see table filtering.
4. Click **+ Add Lead**, enter GSTIN `19AAACB1234F1Z5`, and click **Verify GSTIN** to test auto-population.
5. Submit the lead and verify it appears in the table.
6. On any open lead row, click **Convert to Client** and verify the status badge turns emerald `Converted`.
7. Click the `⋮` action menu and test **Export All Leads** and **Import Leads**.
