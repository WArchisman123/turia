# Implementation Prompt: 7. Task & Statutory Compliance Management Engine

## 1. Goal
Implement the complete **Task & Statutory Compliance Management Engine** for TURIA (`/tasks`), fulfilling Section 7 of `doc.md` and Section 12 of `AGENTS.md`. The module consists of a 5-tab operational workspace:
1. **Tab 1: Task Summary Matrix & Logarithmic Heatmap** (`task-1.png`, `task-heatmap guide.png`) with 8 grouping dimensions and logarithmic severity coloring.
2. **Tab 2: Task List & Comprehensive Filter Drawer** (`task-2.png`, `task-2 filter clicked.png`) with 10 status KPI cards, 14-column data table adhering to `ui_doc.md`, and slide-over filter panel.
3. **Tab 3: Sub-Tasks Execution & Verification Pipeline** (`task-3.png`) with 10-status KPI strip and 10-column verification checklist table.
4. **Tab 4: Recurring Compliance Schedule & FY Calendar** (`task-4.png`) with 5 recurrence KPI cards and Apr–Mar FY calendar view.
5. **Tab 5: Analytics & 12 Management MIS Reports** (`task-5.png`, `task-6.png`) featuring a 12-report sidebar, Timesheet Report with charts, and Pending Aging with 6 bucket cards.
6. **Add Task Modal & Proforma Invoice Linking** (`task-add task.png`) with 1-click Proforma Invoice creation.
7. **Slide-Over Task Activity & Audit Trail Drawer** (`task-activity click.png`) with 30-day immutable event logs.

---

## 2. Skills Read
- `.agents/skills/supabase/SKILL.md`: Verified Supabase multi-tenant isolation with `firm_id`, RLS policies, proper service role queries in Next.js Server Actions / Route Handlers, avoiding client-side key exposure.
- `.agents/skills/clerk/SKILL.md`: Verified Clerk multi-tenant organization session handling via `auth()` and `getTenantContext()`.
- `public/context/contextDoc/ui_doc.md`: Verified global tokens, TableHeaderCell portal dropdowns, TableActiveModifiers, TablePagination, TableEmptyState, badge styles, and AppShell layout.
- `public/context/contextDoc/role.md`: Verified 30-module RBAC permissions for Module 4 (`Task & Statutory Compliance`), field masking rules, and role-based action capabilities (`V, A, D, I, E`).

---

## 3. Existing Code Inspected
- `public/context/contextDoc/doc.md` (Lines 508–602 & 995–1013): Specifications for all 5 sub-tabs, Add Task Modal, Activity Drawer, and schema definition.
- `public/context/contextImg/task-1.png` through `task-6.png`, `task-heatmap guide.png`, `task-add task.png`, `task-activity click.png`: UI references for visual layout, colors, typography, tables, and filters.
- `supabase/schema.sql` (Lines 307–366): `compliance_tasks`, `task_subtasks`, and `task_activities` table definitions and indexes.
- `lib/supabase/types.ts`: TypeScript definitions for `compliance_tasks`, `services_master`, `clients`, `firm_users`.
- `components/ui/data-table/`: Reusable table primitives (`TableHeaderCell`, `TableActiveModifiers`, `TablePagination`, `TableEmptyState`, `types.ts`).
- `components/layout/sidebar.tsx`: Already configured with `{ label: "Task", href: "/tasks", icon: CheckSquare }`.

---

## 4. Decisions & Architectural Assumptions
1. **App Route**: The main page lives at `app/tasks/page.tsx`, wrapped in `<AppShell>`.
2. **Sub-Tab Navigation**: Clean horizontal tabs in the page header with active indicator (`Task Summary`, `Task List`, `Sub Tasks`, `Recurring Schedule`, `Analytics`).
3. **Data Fetching & Fallbacks**: Server Route Handlers at `/api/tasks`, `/api/tasks/[id]`, `/api/tasks/activities`, and `/api/tasks/subtasks`. If the connected firm has 0 tasks in Supabase, realistic statutory compliance seeding data for Indian CA practices (GST, TDS, MCA, Audit, ITR) is provided so all views and heatmaps render meaningfully.
4. **Logarithmic Heatmap Calculation**: For cell severity, use $I = \min\left(1, \frac{\ln(\text{count} + 1)}{\ln(20)}\right)$ mapped to color intensities:
   - Overdue / Due Today: Amber to Deep Red (`bg-amber-500/20` to `bg-rose-600 text-white`)
   - WIP (Pending, In Progress, Review, Changes): Blue intensity scale (`bg-blue-50` to `bg-blue-600 text-white`)
   - Completed / Ready to Bill: Emerald green (`bg-emerald-50` to `bg-emerald-600 text-white`)
   - On Hold: Slate grey (`bg-slate-100` to `bg-slate-500 text-white`)
5. **Table Primitive Uniformity**: The 14-column Task table and 10-column Sub-Tasks table strictly use the shared `@/components/ui/data-table` primitives (`TableHeaderCell`, `TableActiveModifiers`, `TablePagination`, `TableEmptyState`) with zero column divider lines and portal-based 3-dot dropdowns, matching the gold-standard Services table.
6. **1-Click Proforma Invoice**: When `createProformaInvoice` is toggled in `Add Task Modal`, the API creates an entry in `invoices` (type: `proforma`, status: `draft`) linked via `proforma_invoice_id` in `compliance_tasks`.

---

## 5. Files Likely to Change / Be Created

### New Files to Create:
- `app/tasks/page.tsx`: Main page orchestrating the 5 sub-tabs, topbar actions (`Activity` drawer, `+ Add Task` modal), and URL tab state.
- `app/api/tasks/route.ts`: GET (fetch tasks, subtasks, activities, kpi counts) and POST (create task, auto-create proforma, log activity).
- `app/api/tasks/[id]/route.ts`: PATCH (update task stage, status, assignee) and DELETE (delete task).
- `app/api/tasks/activities/route.ts`: GET (fetch 30-day activity logs).
- `app/api/tasks/subtasks/route.ts`: GET and PATCH (toggle subtask completion).
- `lib/api/tasks.ts`: Client API functions (`fetchTasks`, `createTask`, `updateTask`, `deleteTask`, `fetchActivities`, `toggleSubtask`).
- `components/tasks/types.ts`: Comprehensive TypeScript interfaces for Tasks, Sub-Tasks, Activities, KPIs, Filters, Group Dimensions, and MIS reports.
- `components/tasks/task-summary-tab.tsx`: Tab 1 component with 8 group-by pills, matrix table with WIP Subtotal & Grand Total, and Logarithmic Heatmap popover.
- `components/tasks/task-list-tab.tsx`: Tab 2 component with 10 status KPI cards, 14-column table, search, category pills, and filter drawer trigger.
- `components/tasks/task-filter-drawer.tsx`: Slide-over panel with colored status dots, priority, assignee, billing, task type, and category filters.
- `components/tasks/sub-tasks-tab.tsx`: Tab 3 component with 10 status KPI strip and 10-column verification checklist pipeline table.
- `components/tasks/recurring-schedule-tab.tsx`: Tab 4 component with 5 recurrence KPI cards, Grid/List toggle, and Apr–Mar FY calendar matrix.
- `components/tasks/analytics-mis-tab.tsx`: Tab 5 component with 12 MIS reports sidebar, Timesheet Report dashboard, and Pending Aging with 6 bucket cards.
- `components/tasks/add-task-modal.tsx`: Modal dialog for creating compliance tasks with client/service pickers, dates, assignees, and 1-click Proforma Invoice checkbox.
- `components/tasks/task-activity-drawer.tsx`: Slide-over drawer with 30-day event logs and category filtering (`All Events`, `Status Changes`, `Comments`, `File Uploads`).

---

## 6. Implementation Requirements

### 6.1 Data Models & Types (`components/tasks/types.ts`)
Define strict types with zero `any`:
- `TaskItem`: `id`, `taskCode`, `taskTitle`, `clientId`, `clientName`, `serviceId`, `serviceName`, `financialYear`, `period`, `startDate`, `targetDate`, `dueDate`, `assignedToId`, `assignedToName`, `assignedToInitials`, `reviewerId`, `reviewerName`, `priority`, `stage`, `status`, `isBillable`, `billingStatus`, `completionPercentage`, `taskType`, `category`, `difficultyLevel`, `department`, `panNumber`, `legalName`, `recurrenceFrequency`, `proformaInvoiceId`, `createdAt`.
- `SubTaskItem`: `id`, `taskId`, `parentTaskTitle`, `clientName`, `serviceName`, `title`, `assignedToName`, `reviewerName`, `weightagePercentage`, `dueDate`, `status`, `priority`, `category`.
- `TaskActivityItem`: `id`, `taskId`, `taskTitle`, `actionType`, `description`, `userName`, `userInitials`, `createdAt`, `eventCategory`.
- `TaskKpiData`: `wip`, `pending`, `inProgress`, `sentForReview`, `requestChanges`, `overdue`, `completed`, `readyToBill`, `cancelled`, `allTasks`.
- `RecurringKpiData`: `total`, `monthly`, `quarterly`, `halfYear`, `yearly`.
- `TaskFilterState`: scope, statusList, priorityList, dueTodayOnly, assigneeId, billingFilter, taskTypeFilter, categoryFilter, searchQuery.

### 6.2 Tab 1: Task Summary Matrix & Logarithmic Heatmap
- Render 8 group-by pills: `Assigned To` (default), `Category`, `Client`, `Service`, `Priority`, `Task Type`, `Month`, `Financial Year`.
- Dynamic grouping computing 11 metric columns:
  `Pending`, `In Progress`, `Sent for Review`, `Request Changes`, `WIP Sub Total` (`bg-indigo-50/40`), `Overdue` (`text-rose-600`), `Due Today`, `Completed` (`text-emerald-600`), `Ready to Bill` (`text-emerald-600`), `On Hold`, `Total`, `Done %`.
- Logarithmic Heatmap toggle:
  - When enabled, cell backgrounds reflect volume intensity using a logarithmic scale.
  - "Heat Map" button displays the popover legend (`task-heatmap guide.png`): Red/Amber (Overdue/Urgent), Blue (WIP), Green (Done/Billed), Grey (On Hold).
- Export button to download the summary matrix as CSV.

### 6.3 Tab 2: Task List Table & Filter Drawer
- Render 10 status KPI cards at top:
  `WIP` (purple Zap), `Pending` (amber Hourglass), `In Progress` (cyan Clock), `Sent for Review` (indigo Eye), `Request Changes` (orange Edit), `Overdue` (rose Flame), `Completed` (emerald CheckCircle), `Ready to Bill` (green Dollar), `Cancelled` (red XCircle), `All Task` (purple Layers).
- Filters toolbar:
  - Scope pills: `All Tasks`, `My Tasks`, `Due Today`, `Live Task`.
  - Dropdowns: `All Dept ⌄`, `All Assignees ⌄`, `Group ⌄`, `Sort: Created Date ⌄`, `Period ⌄`.
  - `Filter` button triggering slide-over drawer (`task-2 filter clicked.png`).
  - Search bar + 3-dots menu.
- 14-Column Table:
  - Checkbox, `ID`, `Task Name`, `Business Name`, `PAN Number`, `Legal Name`, `Category`, `Service`, `Difficulty Level`, `Task Type`, `Billing Status`, `Status`, `Done %`, `Frequency`, Actions 3-dot.
  - Uses `TableHeaderCell`, `TableActiveModifiers`, `TablePagination`, and `TableEmptyState`.

### 6.4 Tab 3: Sub-Tasks Checklist Pipeline
- Status KPI strip for sub-tasks (`WIP`, `Pending`, `In Progress`, `Sent for Review`, `Request Changes`, `Overdue`, `Completed`, `On Hold`, `Cancelled`, `All Sub Task`).
- 10-Column verification table: `Task ID`, `Task Name`, `Client`, `Service`, `Sub-Task`, `Status`, `Assignee`, `Due Date`, `Priority`, `Category`.
- 1-click status completion update that dynamically updates parent task progress.

### 6.5 Tab 4: Recurring Compliance Schedule & FY Calendar
- 5 Recurrence KPI Cards: `Total`, `Monthly`, `Quarterly`, `Half-Year`, `Yearly`.
- View mode toggle (`Grid` / `List`).
- Frequency pills: `All`, `Monthly`, `Quarterly`, `Half-Yearly`, `Yearly`.
- FY Navigator: `< FY 2026-27 >`.
- Financial year calendar breakdown showing upcoming monthly statutory deadlines (GSTR-3B on 20th, TDS Challan 281 on 7th, AOC-4 on Oct 30th).

### 6.6 Tab 5: Analytics & 12 Management MIS Reports
- Left sidebar with 12 report links:
  1. `Timesheet Report`
  2. `Task Completed Not Billed`
  3. `Task Billing Report`
  4. `Performance Report`
  5. `Task Feedback Report`
  6. `Workload Balance`
  7. `Pending Aging Tasks`
  8. `Tasks by Client`
  9. `Tasks by User`
  10. `Tasks by Group`
  11. `Tasks by Services`
  12. `Category Performance`
- Rich report canvases:
  - `Timesheet Report` (`task-5.png`): Analytics/Daily/Monthly sub-tabs, date range selector, 5 summary stat cards (`Total Hours`, `Task-linked`, `Non Task-linked`, `Avg Time / Day`, `Utilization`), daily time distribution chart, team time tracking table.
  - `Pending Aging Tasks` (`task-6.png`): 6 aging bucket KPI cards (`All Pending`, `>60d`, `31-60d`, `15-30d`, `7-14d`, `<7d`), search, and pending aging breakdown table.

### 6.7 Add Task Modal (`task-add task.png`)
- Dialog with client selector, service selector, FY, frequency, period, task title, department, assignee, reviewer, priority, start date, target due date, end date, billing type radio, sprint planner checkbox, rich description, and `Create Proforma Invoice for this Task` checkbox.

### 6.8 Slide-Over Task Activity & Audit Trail Drawer (`task-activity click.png`)
- Right slide-over drawer with 30-day activity stream, category filter dropdown, timestamps, and action descriptions.

---

## 7. Security Requirements
- All database operations scoped strictly by `firm_id`.
- Mutating endpoints (`POST`, `PATCH`, `DELETE`) require authenticated Clerk session.
- RBAC permissions enforced via Module 4 rules from `role.md`.
- No sensitive keys (`SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`) leaked to the client.

---

## 8. Acceptance Criteria
- [ ] Navigating to `/tasks` loads the 5-tab workspace wrapped in `AppShell`.
- [ ] Active tab switches smoothly between `Task Summary`, `Task List`, `Sub Tasks`, `Recurring Schedule`, and `Analytics`.
- [ ] **Tab 1**: Displays the 8 group-by pills, matrix table with WIP Subtotal & Grand Total, and functional Logarithmic Heatmap popover.
- [ ] **Tab 2**: Displays 10 status KPI cards, 14-column table adhering to `ui_doc.md` (no cell border lines, portal 3-dot column dropdowns), and functional filter drawer.
- [ ] **Tab 3**: Displays Sub-Tasks pipeline with 10 status cards and 10-column checklist table.
- [ ] **Tab 4**: Displays Recurring Compliance schedule with 5 recurrence cards, FY navigator, and monthly schedule view.
- [ ] **Tab 5**: Displays 12 MIS reports sidebar, functional Timesheet Report view (`task-5.png`), and functional Pending Aging view (`task-6.png`).
- [ ] Clicking `+ Add Task` opens the Add Task modal matching `task-add task.png`. Submitting creates the task and links draft proforma if checked.
- [ ] Clicking `Activity` opens the 30-day activity audit drawer matching `task-activity click.png`.
- [ ] Zero TypeScript errors (`npm run typecheck` passes).
- [ ] Zero ESLint errors (`npm run lint` passes).

---

## 9. Checks to Run
- `npm run typecheck` — TypeScript type validation
- `npm run lint` — ESLint validation

---

## 10. Manual Test Steps After Implementation
1. Navigate to `http://localhost:3000/tasks` in browser.
2. Verify all 5 sub-tabs are visible and clickable.
3. On **Task Summary**: Click different "Group by" pills (Assigned To, Category, Client, etc.) and verify matrix aggregates dynamically. Click "Heat Map" to verify the logarithmic severity legend popover.
4. On **Task List**: Verify the 10 status KPI cards display proper counts. Click "Filter" to test the slide-over filter panel. Open any column header 3-dots menu to verify sort and filter chips appear in `TableActiveModifiers`.
5. On **Sub Tasks**: Check off a sub-task and verify status updates.
6. On **Recurring Schedule**: Toggle between Grid and List, change FY, and verify monthly compliance view.
7. On **Analytics**: Select "Timesheet Report" to verify hours metrics and charts. Select "Pending Aging Tasks" to verify the 6 aging buckets.
8. Click `+ Add Task` button, fill in task details, toggle "Create Proforma Invoice for this Task", and submit. Verify task appears in Task List and Summary.
9. Click `Activity` in the top right to verify the slide-over audit log drawer displays recent events.
