# Implementation Prompt: Full Home Page Cockpit & Tabbed Workspace

## 1. Goal
Implement the complete, production-grade **Home Cockpit Workspace** with all 5 Onboarding Stepper Steps, interactive modals (Add Time Entry, Create Notice, Regularize Attendance), rich statutory mock data, live Geofenced GPS Attendance Punch-in, Recharts-powered Sales & Revenue charts, 7-day Weekly Timesheet Matrix with active labor costing calculation, and Auto-Saving Persistent Quick Notes with checklists, matching `public/doc.md` (Section 2) and screenshot references in `public/contextImg/` (`home-1.png`, `home-02.png`, `home-03.png`, `home-04.png`, `home-complete profile.png`).

---

## 2. Skills Read
- `.agents/skills/shadcn/SKILL.md` (Chart component wrapper for Recharts, Dialog modal composition, FieldGroup form layout, semantic tokens)
- `public/doc.md` (Section 2.1 5-Step Onboarding, Section 2.2 Attendance Hub, Section 2.3 Timesheet Matrix & Labor Costing, Section 2.4 Sales Dashboard & FY Charts, Section 2.5 Quick Notes)
- `AGENTS.md` (Strict architecture, domain standards for Indian CA practice management)

---

## 3. Existing Code Inspected
- `app/page.tsx`: Current Home Page wrapper.
- `components/layout/app-shell.tsx`: Master Application Shell with Sidenav and Topbar.
- `components/home/onboarding-banner.tsx`: Base onboarding banner.
- `components/home/attendance-tab.tsx`: Base attendance tab.
- `components/home/timesheet-tab.tsx`: Base timesheet tab.
- `components/home/sales-tab.tsx`: Base sales tab.
- `components/home/notes-tab.tsx`: Base notes tab.

---

## 4. Visual & Architectural Design Interpretation

### 4.1 5-Step Complete Onboarding Stepper (`components/home/onboarding-stepper.tsx`)
- **Step 1: Organization Profile**: Business entity (Partnership, LLP, Pvt Ltd, Sole Prop, Individual CA), brand/legal name, email, phone, GSTIN with live GSTIN format and state validation, PAN, TAN, CIN, Udyam, PT, PF, ESIC, LUT details, and registered address.
- **Step 2: Bank Account**: Bank name, account number, IFSC code, branch, UPI ID, primary account toggle, cancelled cheque upload placeholder.
- **Step 3: Invoice Settings**: Tax invoice prefix (`TURIA/2026/`), Proforma prefix (`PI/2026/`), payment terms (Net 15 / Net 30 / Due on Receipt), UPI QR code toggle, default SAC code (`998222` Legal & Accounting), GST rate (`18%`).
- **Step 4: Business Hours**: Working days (Mon - Sat), shift hours (10:00 AM - 7:00 PM), GPS geofencing radius (150 meters), office latitude/longitude.
- **Step 5: Integrations**: WhatsApp Business API, SMTP email credentials, Tax notice OCR agent toggle.
- **Progress Gauge**: Dynamically calculates completion percentage from 0% to 100% as steps are completed.

### 4.2 Tab 1: Attendance Hub & Punch-In Cockpit (`components/home/attendance-tab.tsx`)
- **Live Clock & GPS Geofence**:
  - Live ticking timer (`00:00:00`) with Punch In / Out state.
  - GPS Coordinate & Geofence Status (`150m Office Radius • Within Geofence`).
  - Total minutes logged wheel gauge.
- **Notice Board & Create Notice Modal**:
  - Notice board list showing active firm notices (e.g. *“Advance Tax Q2 Deadline - Sep 15”*, *“GSTR-3B Reconciliation Drive”*) with `+ Add Notice` modal (Title, Audience: All / Article Trainees / Partners, Priority, Expiry).
- **4 KPI Metric Cards**: `Total Employees (12)`, `Attendance Rate (91.6%)`, `On Time (10)`, `Late Clock In (01)`.
- **Today's Attendance Table**:
  - 10 columns: `Employee`, `Attendance` (Present, Late, On Leave, Week-Off), `Status`, `Clock In & Out`, `Location` (Office / Client Site / Remote), `Client Site Name`, `Geo Location`, `Distance (Radius)`, `Total Hours`, `Actions` (Regularize).
- **Upcoming Statutory Holidays**: Republic Day, Independence Day, Gandhi Jayanti, Diwali, ICAI Chartered Accountants Day.
- **Upcoming Approved Leaves**: Article trainee exam study leaves and manager leaves.

### 4.3 Tab 2: TimeSheet & Weekly Matrix (`components/home/timesheet-tab.tsx`)
- **Weekly Matrix Grid (12 PM - 11 PM)**:
  - 7 daily columns with daily expected billable target (`8.0h`), total logged hours, and positive/negative variance indicator.
  - Live red horizontal indicator line at current time.
- **Add Time Entry Modal**:
  - Client selector (e.g. Acme Global, Reliance Retail, Tata Steel, Infosys).
  - Service selector (Statutory Audit, GST Return, Tax Audit 44AB, ROC Filing).
  - Task selector (linked to compliance task ID).
  - Start Time, End Time, Total Billable Hours calculation.
  - Labor Costing Engine: `Cost Per Hour (₹350/hr)` vs `Billing Rate (₹1,500/hr)` ➔ Profitability Margin.
  - Work Description & Billable toggle.
- **View Switchers**: `Weekly Matrix`, `Daily View`, `My Timesheet`, `Team Timesheet`.
- **1-Click Copy Previous Week**: Auto-populates recurring weekly schedule.

### 4.4 Tab 3: Sales & Financial Dashboard (`components/home/sales-tab.tsx`)
- **Recharts Data Visualizations**:
  - **Weekly Revenue Growth Line Chart** with revenue trend and percentage growth comparison.
  - **Monthly Proforma vs Tax Invoices Bar Chart** across Apr - Mar FY.
  - **Monthly Collections vs Pending Receivables Bar Chart** across Apr - Mar FY.
  - **Revenue Overview Donut Chart** showing Gross Invoiced (`₹12,45,000`) vs Realized Collections (`₹9,80,000`) vs Pending (`₹2,65,000`).
  - **Top 10 Services Horizontal Bar Chart**: Statutory Audit (`₹4.5L`), Tax Audit 44AB (`₹2.8L`), GST Compliance (`₹2.1L`), MCA Annual Filing (`₹1.6L`), Transfer Pricing (`₹1.4L`).
- **3 Primary Stat Cards**:
  - `Total Sales`: `₹12,45,000` (+18.4% MoM)
  - `Total Collection`: `₹9,80,000` (+12.1% MoM)
  - `Total Outstanding`: `₹2,65,000` (Aging: 60d)
- **Top Clients Financial Rankings Table**: Client Code, Trade Name, Invoiced Amount, Collections, Outstanding Balance.
- **Reimbursements Ledger Breakdown**: Pass-Through Non-GST Client Out-of-Pocket Expenses vs Internal Staff Expense Claims.

### 4.5 Tab 4: Quick Notes & Auto-Saving Scratchpad (`components/home/notes-tab.tsx`)
- Rich auto-saving workpad with live debounce saving feedback (`Saving...` ➔ `✓ All changes saved`).
- Local storage persistence so notes are never lost on reload.
- Word count, character count, and last saved timestamp.
- Statutory CA checklist scratchpad (e.g. *“Documents to collect for Tax Audit 44AB Form 3CD”*, *“MCA DIR-3 KYC filing reminders”*).

---

## 5. Files Likely to Change / Be Created
1. `package.json`: Install `recharts` for high-performance responsive charts.
2. `components/home/onboarding-stepper.tsx`: 5-step interactive wizard with progress calculation.
3. `components/home/attendance-tab.tsx`: Interactive attendance hub with geofencing, punch-in clock, create notice modal, and today's attendance table.
4. `components/home/timesheet-tab.tsx`: Weekly calendar matrix with Add Time Entry modal, labor costing, and 12 PM - 11 PM grid.
5. `components/home/sales-tab.tsx`: Sales dashboard with interactive Recharts charts, 3 stat cards, client rankings, and top 10 services.
6. `components/home/notes-tab.tsx`: Auto-saving scratchpad with localStorage persistence and word count.
7. `components/home/add-time-entry-modal.tsx`: Modal for logging billable timesheets.
8. `components/home/create-notice-modal.tsx`: Modal for broadcasting firm notices.
9. `app/page.tsx`: Home Cockpit workspace integrating all updated components.

---

## 6. Implementation Requirements
- **No general assumptions**: Follow Indian CA compliance formats, SAC codes, FY April–March cycle, and exact screenshot styling.
- **Interactive UI**: Working modals, functional punch-in timer with GPS coordinates simulation, full 5-step stepper navigation, responsive Recharts charts, and persistent notes.
- **Strict TypeScript & Clean Code**: Zero `any`, typed state interfaces, standard shadcn tokens.

---

## 7. Acceptance Criteria
- [ ] 5-step onboarding stepper functions across all 5 steps with dynamic progress gauge calculation.
- [ ] Tab 1 Attendance: live punch-in timer toggles, Create Notice modal opens and saves notices, attendance table displays 10 columns with status badges, upcoming holidays & leaves display statutory dates.
- [ ] Tab 2 Timesheet: 12 PM - 11 PM grid renders with live red line, Add Time Entry modal opens with client/service/labor cost fields and adds entries.
- [ ] Tab 3 Sales: Recharts charts render for Weekly Revenue, Monthly Invoicing (Apr-Mar), Monthly Collections, Top 10 Services, and Donut Overview.
- [ ] Tab 4 Notes: Notes persist across refreshes, debounce auto-saves with "All changes saved" indicator, word/character counter works.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass with zero errors.

---

## 8. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## 9. Manual Test Steps
1. Run `npm run dev`.
2. Open `http://localhost:3000`.
3. Test Step 1 through Step 5 in the Onboarding Stepper.
4. Click **Punch In** in Tab 1 to verify the timer and geofence status; click `+` on Notice Board to create a notice.
5. In Tab 2, click `+ Add` to open the Add Time Entry modal and log billable hours.
6. In Tab 3, inspect the Sales analytics charts, stat cards, and Top 10 Services.
7. In Tab 4, type notes in the scratchpad, refresh the page, and verify the notes remain saved.
