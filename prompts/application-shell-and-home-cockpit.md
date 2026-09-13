# Implementation Prompt: Application Shell (Sidebar, Topbar, Profile Drawer) & Home Cockpit Layout

## 1. Goal
Implement the master **Application Shell & Global Layout** (Compact Left Sidenav, Top Navigation Bar with Quick Tools, Slide-over User Profile & Utility Drawer, Global Footer) and the full **Home Cockpit Workspace** with its 4 tabs and expandable 5-step Onboarding Profile banner, matching the screenshot specifications in `public/contextImg/` (`home-1.png`, `home-topnav profile icon clicked.png`, `home-complete profile.png`, `home-02.png`, `home-03.png`, `home-04.png`) and `public/doc.md` (Sections 1 & 2), while moving the Design System showcase cleanly to `http://localhost:3000/design-system`.

---

## 2. Skills Read
- `.agents/skills/shadcn/SKILL.md` (Radix UI Sheet/Drawer overlay accessibility, semantic tokens, no manual `z-index` hacks, Button/Badge composition, Tabs primitives)
- `public/doc.md` (Sections 1.1 Sidenav, 1.2 Top Navigation Shortcuts, 2.1 5-Step Onboarding Stepper, 2.2 Attendance Hub, 2.3 Timesheet Matrix, 2.4 Sales Dashboard, 2.5 Quick Notes, 2.6 Slide-Over Utility Drawer)
- `AGENTS.md` (Strict architecture, tenant isolation, zero-assumptions rule)

---

## 3. Existing Code Inspected
- `app/layout.tsx`: Root HTML and body layout with Inter font.
- `app/globals.css`: Tailwind v4 theme and styles.
- `components/ui/tabs.tsx`: Radix-powered accessible Tabs components.
- `app/design-system/page.tsx`: Companion route for the Design System.

---

## 4. Visual & Architectural Design Interpretation

### 4.1 Global Layout Shell (`components/layout/`)
1. **Left Sidenav (`components/layout/sidebar.tsx`)**:
   - Compact vertical navigation strip (`w-[72px] bg-white border-r border-[#E2E8F0] min-h-screen flex flex-col items-center py-3 gap-1 z-30`).
   - 9 Core Modules:
     - `Home` (`Home` icon, active indigo background `#6366F1`, text white, rounded-lg)
     - `Leads` (`Users` icon)
     - `Client` (`User` icon)
     - `Services` (`Briefcase`/`ShoppingBag` icon)
     - `Task` (`CheckSquare` icon)
     - `Invoice` (`FileText` icon)
     - `Team` (`Users2` icon)
     - `Reports` (`BarChart2` icon)
     - `Registry` (`Shield` icon)
   - Hover and active transition effects.

2. **Top Navigation Bar (`components/layout/topbar.tsx`)**:
   - Height `h-14` (56px) border-b `border-[#E2E8F0] bg-white px-4 flex items-center justify-between sticky top-0 z-20`.
   - **Left**: Indigo rounded squircle Logo mark with bold white `T` + Firm Name: **`Saha And Sons`** (font-semibold text-slate-800 text-sm).
   - **Center Tools Strip**:
     - `Notices` (with blue `ADD ON` badge)
     - `Compliance` (Check icon)
     - `WhatsApp` (MessageCircle icon)
     - `Email` (Mail icon)
     - `Agents` (with green `NEW` badge)
     - `Chat` (MessageSquare icon)
     - `Sprints` (Flame icon)
     - `Action-Center` (Crosshair/Compass icon)
     - `Calendar` (Calendar icon)
     - `To-Do` (ListTodo icon)
   - **Right Actions**:
     - Search bar input: `Search Ctrl K` (rounded-full bg-slate-50 border border-slate-200 text-xs px-3 py-1.5).
     - Theme toggle icon (Moon / Sun).
     - User Avatar trigger: `AR` circular badge (`bg-indigo-600 text-white font-bold text-xs size-8 rounded-full flex items-center justify-center relative cursor-pointer`) with green active online status badge.

3. **Slide-Over User Profile & Firm Utility Drawer (`components/layout/profile-drawer.tsx`)**:
   - Opens smoothly when clicking the `AR` avatar in Topbar.
   - Header: Vibrant Indigo hero card with Close `X` button, large centered `AR` avatar with online indicator, user name **`archi`**, and email **`arch.sas.123@gmail.com`**.
   - Navigation links:
     - `👤 My Profile` (links to `/profile`)
     - `⚙️ Settings` (links to `/settings`)
   - `Mobile Apps` Card:
     - Android download card (`Android` icon)
     - iOS download card (`Apple` icon)
   - Utility Drawer Links:
     - `▶ Turia Demo Videos`
     - `🎁 Refer & Earn`
     - `🎨 App Customizer`
     - `🤖 Enroll Utility`
   - Footer: `🚪 Logout` action button.

4. **Global Footer (`components/layout/footer.tsx`)**:
   - Subtle bottom bar: `© 2026, Powered by TURIA` with customizer gear button.

---

### 4.2 Home Cockpit Page (`app/page.tsx`)
1. **Onboarding Banner (5 Steps)**:
   - Header with `0%` progress circular gauge, title *"Welcome archi"*, description *"Complete your profile setup - 5 steps remaining"*, and `Complete Profile` button.
   - Expandable 5-step wizard (`1. Organization profile` ➔ `2. Bank Account` ➔ `3. Invoice` ➔ `4. Business Hours` ➔ `5. Integration`).
   - Organization Profile form capturing Business Name, Entity, Brand, Email, Phone, Currency, Address, GSTIN with live Verify button, PAN, TAN, CIN, Udyam, PT, PF, ESIC, LUT details.

2. **Home 4 Tabs Workspace**:
   - Master Line Tabs: `📅 Attendance` | `⏱️ TimeSheet` | `📊 Sales` | `📝 Notes`.
   - **Tab 1: Attendance Hub**:
     - Live punch-in timer widget (`00:00:00`), Punch In/Out button, "Punch in to record your attendance", daily circular minutes gauge.
     - Notice Board with empty/notice cards and `+` add button.
     - 4 KPI Metric Cards: `Total Employees (01)`, `Attendance Rate (00%)`, `On Time (00)`, `Late Clock In (00)`.
     - Today's Attendance Table with date selector, search filter, and column headers.
     - Upcoming Holidays & Upcoming Employee Leave cards.
   - **Tab 2: TimeSheet Matrix**:
     - Date navigator (`< Aug 31 - Sep 06, 2026 >`), view switcher (`Weekly`, `My View`, `+ Add` time entry).
     - 7-day hourly calendar matrix (12 PM - 11 PM) with real-time red horizontal indicator line.
     - Summary metrics: Expected Hours (`00:00`), Total (`00:00`), Difference (`+00:00`).
   - **Tab 3: Sales & Financial Dashboard**:
     - Revenue Growth line chart with `Consolidated View` toggle.
     - 3 Primary Stat Cards: `Total Sales (₹0)`, `Total Collection (₹0)`, `Total Outstanding (₹0)`.
     - Monthly Charts: Proforma Invoices, Tax Invoices, Payment Collections, Pending Payments.
     - Client rankings and Top 10 Services horizontal bar chart.
     - Pass-through client reimbursements vs Employee expense claims.
     - Revenue Overview circular donut gauge.
   - **Tab 4: Quick Notes Scratchpad**:
     - Auto-saving rich textarea with "All changes saved" indicator and instant reactivity.

3. **Design System Dedicated Route (`app/design-system/page.tsx`)**:
   - Retains the full 10-card Design System showcase built in the previous step accessible at `/design-system`.

---

## 5. Files Likely to Change / Be Created
1. `components/layout/sidebar.tsx`: Master left compact sidebar with 9 navigation icons.
2. `components/layout/topbar.tsx`: Master topbar with tools shortcuts, search bar, and avatar.
3. `components/layout/profile-drawer.tsx`: Slide-over profile & utility drawer.
4. `components/layout/app-shell.tsx`: Master layout wrapper component.
5. `components/home/onboarding-banner.tsx`: 5-step expandable profile wizard.
6. `components/home/attendance-tab.tsx`: Tab 1 Attendance cockpit & punch-in hub.
7. `components/home/timesheet-tab.tsx`: Tab 2 Weekly matrix (12 PM - 11 PM).
8. `components/home/sales-tab.tsx`: Tab 3 Sales dashboard & charts.
9. `components/home/notes-tab.tsx`: Tab 4 Quick notes auto-saving scratchpad.
10. `app/page.tsx`: Home Cockpit workspace integrating the 4 tabs and onboarding banner.
11. `app/design-system/page.tsx`: Standalone Design System showcase page.

---

## 6. Implementation Requirements
- **Pixel-Perfect Alignment**: Faithfully replicate layout, colors, typography, icon strokes, and cards matching `home-1.png` through `home-04.png`.
- **Interactive State Handling**: Working punch-in timer toggle, active tab switching, collapsible/expandable onboarding banner, interactive slide-over profile drawer, notes typing with live save status.
- **Strict TypeScript**: Clean type declarations, zero `any`.
- **Radix UI & Shadcn Compliance**: Use accessible overlay primitives for the drawer and Tabs primitives for tab switching.

---

## 7. Acceptance Criteria
- [ ] Left sidebar renders with 9 navigation items and correct active state for Home.
- [ ] Topbar displays Logo, Firm Name ("Saha And Sons"), all 10 shortcut tools with "ADD ON" and "NEW" badges, search input, and `AR` avatar with online indicator.
- [ ] Clicking `AR` avatar opens the slide-over profile drawer with user details, mobile apps links, utility actions, and logout.
- [ ] Onboarding banner shows 0% gauge and expands into the 5-step profile setup wizard.
- [ ] Home tabs (`Attendance`, `TimeSheet`, `Sales`, `Notes`) switch content seamlessly.
- [ ] Attendance tab shows punch-in timer, KPI cards, today's attendance table, holidays, and leaves.
- [ ] Timesheet tab shows 7-day hourly grid from 12 PM to 11 PM with real-time red line.
- [ ] Sales tab shows revenue growth, stat cards, monthly charts, and revenue overview.
- [ ] Notes tab allows live typing with auto-save confirmation.
- [ ] Design System is accessible at `/design-system`.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass with zero errors.

---

## 8. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## 9. Manual Test Steps
1. Run `npm run dev`.
2. Navigate to `http://localhost:3000` to verify the Home cockpit, sidebar, topbar, and 4 tabs.
3. Click the `AR` avatar in the top right to verify the slide-over profile drawer.
4. Click "Complete Profile" to verify the 5-step onboarding wizard.
5. Click across all 4 Home tabs (`Attendance`, `TimeSheet`, `Sales`, `Notes`).
6. Navigate to `http://localhost:3000/design-system` to verify the Design System showcase.
