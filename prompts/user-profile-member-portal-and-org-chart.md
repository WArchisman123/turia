# Implementation Prompt: User Profile, Member Portal & Org Chart Module

## 1. Goal
Implement the complete, production-grade **User Profile, Member Portal & Interactive Org Chart Workspace** (`/profile`) across all 7 tabs matching `public/context/contextDoc/doc.md` (Section 3), `public/context/contextDoc/role.md`, and screenshot references `profile-1.png` to `profile-7.png`.

---

## 2. Skills Read
- `.agents/skills/clerk/SKILL.md` (User profile details, roles, session state)
- `.agents/skills/shadcn/SKILL.md` (Tab navigation, modal dialogs, data tables, badge tokens)
- `public/context/contextDoc/doc.md` (Section 3 specifications & exact field layouts)
- `public/context/contextDoc/role.md` (7 CA practice roles, 30-module matrix, permission actions)
- `AGENTS.md` (Architecture, strict TypeScript, Indian CA practice domain rules)

---

## 3. Existing Code Inspected
- `app/layout.tsx`: Root layout with `<ClerkProvider>` and `<RBACProvider>`.
- `components/layout/app-shell.tsx`: Master layout wrapper with Sidenav and Topbar.
- `components/layout/sidebar.tsx`: Nav link to Profile / Users.
- `components/layout/profile-drawer.tsx`: Slide-over profile drawer with link to `/profile`.
- `lib/rbac/matrix.ts` & `lib/rbac/types.ts`: 30-module matrix and role mapping definitions.
- `components/ui/tabs.tsx`: Accessible Radix tabs component.

---

## 4. Architectural & Visual Design Specifications

### 4.1 Tab 1: Profile Details & Monthly Attendance Calendar (`profile-1.png`)
- **Left Profile Summary Card**:
  - Avatar uploader with circular gradient badge & active green status dot.
  - Name: `archi`, Employee ID: `#-`, Edit icon (✏️).
  - **About Section**: Mobile (`+91 8777431358`), Email (`arch.sas.123@gmail.com`).
  - **Employment Detail Section**: Designation (`Senior Partner / Associate`), Role (`Admin`), Department (`Direct Tax & Audit`), Reporting To (`Managing Partner`), Shift (`General Shift 10 AM - 7 PM`), Joining Date (`01-Apr-2024`), Status (`Confirmed`), Confirmation Date, Experience (`5.4 Yrs`).
  - **Personal Details Section**: DOB (`14-Aug-1996`), Gender (`Male`), ID Proof & Number (PAN / Aadhaar), Marital Status (`Single`), Blood Group (`O+`), Education (`FCA, B.Com (Hons)`), Parents' Names, Emergency Contact & Phone (`+91 9830123456`).
  - **Address Section**: Present & Permanent Address (City: `Kolkata`, State: `West Bengal`, Pincode: `700001`, Country: `India`).
  - **Payroll Section**: Salary (`₹85,000 / mo`), Cost Per Hour (`₹350/hr`), Billing Rate (`₹1,500/hr`).
- **Right Widgets**:
  1. **Monthly Attendance Calendar**: Month navigator (`< September 2026 >`), 31-day visual calendar matrix with colored status dots: Current Day (Indigo), Present (Emerald), Absent (Rose), Holiday (Purple), Week-off (Amber).
  2. **Leave Summary Widget**: `Apply for Leave` trigger button, Entitlement & Taken balance ledger (Casual Leave: 8/12, Sick Leave: 5/10, Study Leave: 20/30, Earned Leave: 15/18).
  3. **Leave History Widget**: Searchable historical leave applications with status badges (Approved, Pending, Rejected).
  4. **Holiday List Widget**: Searchable statutory firm holiday calendar (Republic Day, Independence Day, Gandhi Jayanti, Diwali, CA Day).

### 4.2 Tab 2: Personal Reimbursement Claims (`profile-2.png`)
- **7-Column Table**: `Date`, `Reason / Expense Title`, `Amount (₹)`, `Paid By` (Self / Firm Card), `Attachments` (View receipt PDF/PNG), `Status` (Approved / Pending / Settle), `Actions`.
- **`+ Apply` Claim Modal**: Expense Title, Category (Conveyance, ROC Stamp, Client Lunch, Office Supplies), Date, Amount (₹), Receipt upload, Notes.

### 4.3 Tab 3: Assigned Tasks Workbench (`profile-3.png`)
- **9-Column Table**: Checkbox, `Task ID`, `Task Name`, `Client Name`, `Service Master`, `Target End Date`, `Assignee`, `Reviewer`, `Status Badge`.
- **`Re-Assign` Modal**: Re-allocate selected compliance tasks to another team member with handoff notes.

### 4.4 Tab 4: Assigned Clients Portfolio (`profile-4.png`)
- **6-Column Table**: Checkbox, `Client Trade Name`, `Contact Person`, `Mobile Number`, `Business Entity Type` (Pvt Ltd, LLP, Partnership, Prop), `Status` (Active / Dormant).
- **`Re-Assign` Modal**: Bulk transfer client management to another partner or manager.

### 4.5 Tab 5: Employee KYC & Document Vault (`profile-5.png`)
- **Repository Table**: `Document Name & Attachment`, `Document Type` (Aadhaar, PAN, Form 102/103 Articleship Deed, Degree Certificate, Appointment Letter), `Upload Date`, `File Size`, `Actions` (View, Download, Delete).
- **`+ Upload Document` Modal**: Document Name, Category selector, File dropzone.

### 4.6 Tab 6: 30-Module Granular RBAC Permissions Matrix (`profile-6.png`)
- Complete interactive 30-module table matching `role.md`.
- Columns: `Module Name`, `View (👁️)`, `Add/Edit (✏️)`, `Delete (🗑️)`, `Import (📥)`, `Export (📤)`.
- Live toggleable permission switches / checkboxes for custom overrides.
- Role Preset Selector (`Super Admin`, `Partner`, `Senior Manager`, `Senior Associate`, `Article Trainee`, `Accountant`, `Client User`) to instantly test and preview permission profiles.

### 4.7 Tab 7: Interactive Organization Hierarchy Tree Canvas (`profile-7.png`)
- Visual interactive reporting hierarchy tree canvas.
- Controls: `Total Users: 6`, `RESET` zoom button, Zoom in (`+`), Zoom out (`-`), Zoom level indicator (`100%`).
- Hierarchical Node Cards with avatars, designations, departments, employee IDs, and direct subordinate count.
- Dynamic expanding / collapsing of branches.

---

## 5. Files Likely to Change / Be Created

1. `app/profile/page.tsx`: Master User Profile Page integrating all 7 sub-tabs.
2. `components/profile/profile-details-tab.tsx`: Tab 1 (Bio, monthly attendance calendar, leave summary, holidays).
3. `components/profile/reimbursement-tab.tsx`: Tab 2 (Personal claims table + Apply Modal).
4. `components/profile/tasks-tab.tsx`: Tab 3 (Assigned tasks table + Re-assign Modal).
5. `components/profile/clients-tab.tsx`: Tab 4 (Assigned clients portfolio + Re-assign Modal).
6. `components/profile/documents-tab.tsx`: Tab 5 (KYC document repository + Upload Modal).
7. `components/profile/permissions-tab.tsx`: Tab 6 (30-Module interactive RBAC matrix with role preset loader).
8. `components/profile/organization-tab.tsx`: Tab 7 (Interactive zoomable Org Tree Canvas).
9. `components/profile/apply-leave-modal.tsx`: Modal to apply for personal/study leave.
10. `components/profile/apply-reimbursement-modal.tsx`: Modal to submit personal expense claims.
11. `components/profile/reassign-modal.tsx`: Modal for task/client re-allocation.

---

## 6. Implementation Requirements
- **Strict TypeScript**: Zero `any`, typed state structures and mock data fixtures.
- **Interactivity**: Fully functional modals, dynamic tab switching, interactive attendance calendar date selection, live permission toggle matrix, and zoomable org chart.
- **Pixel-Perfect Alignment**: Exact colors (`#6366F1` indigo primary, `#10B981` emerald, `#EF4444` rose, `#F59E0B` amber), Inter font, border radius `0.625rem`.

---

## 7. Acceptance Criteria
1. Navigating to `/profile` loads the Master Member Portal inside `AppShell`.
2. All 7 tabs switch seamlessly and render their full layouts.
3. Tab 1 displays monthly attendance calendar with color badges, leave balance cards, and Apply Leave modal.
4. Tab 2 allows adding new reimbursement claims with live calculation.
5. Tab 3 and Tab 4 support selecting items and opening the Re-Assign modal.
6. Tab 5 allows uploading and deleting KYC documents.
7. Tab 6 renders all 30 modules with working permission checkboxes and role preset switcher.
8. Tab 7 renders the visual interactive Organization Tree with zoom in/out and reset controls.
9. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors/warnings.

---

## 8. Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## 9. Manual Test Steps
1. Navigate to `http://localhost:3000/profile` (or click *My Profile* from topbar avatar drawer).
2. Test Tab 1: Toggle calendar months (`< September 2026 >`), click *Apply for Leave* modal.
3. Test Tab 2: Click *+ Apply* to submit a reimbursement claim.
4. Test Tab 3 & Tab 4: Select tasks/clients and test the *Re-Assign* modal.
5. Test Tab 5: Click *+ Upload Document* to add personal KYC.
6. Test Tab 6: Toggle permission checkboxes and switch roles (Admin ➔ Manager ➔ Trainee) to observe permission matrix changes.
7. Test Tab 7: Zoom in (`+`), Zoom out (`-`), and Reset the visual organization tree.
