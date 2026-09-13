# Implementation Prompt: Standardize Row Action Dropdown (⋮) Across All Tables in TURIA

## 1. Goal
Standardize row action menus (`MoreVertical` / `⋮` 3-dots buttons) across all data tables in the TURIA application using the newly established, reusable `RowActionDropdown` component. 

By portaling every row action dropdown to `document.body` with fixed positioning, collision detection (automatic upward-flip near bottom), and `z-index: 9999`, we eliminate table `overflow-x-auto` clipping, container `overflow-hidden` cutoffs, and pagination overlap across the entire platform.

---

## 2. Skills Read
- `AGENTS.md`, `public/context/contextDoc/doc.md`, `public/context/contextDoc/ui_doc.md`.
- `components/ui/data-table/row-action-dropdown.tsx`.
- React 19 / Next.js 16 App Router client boundary and hydration patterns.

---

## 3. Existing Code Inspected
1. **`components/clients/clients-table.tsx`**:
   - Lines 500-560: Inline `absolute right-4 top-10 w-44` dropdown inside `<td>` within `overflow-x-auto`. Obsolete outside click listener in lines 66-75 checking `.row-action-menu-container`.
2. **`components/services/services-table.tsx`**:
   - Lines 480-530: Inline `absolute right-4 top-10 w-44` dropdown inside `<td>`. Obsolete outside click listener in lines 60-70.
3. **`components/registry/dsc-table.tsx`**:
   - Lines 350-405: Inline `absolute right-2 top-8 z-30 w-44` dropdown inside `<td>` with backdrop overlay.
4. **`components/tasks/task-list-tab.tsx`**:
   - Lines 680-725: Inline `absolute right-0 top-8 z-20 w-44` dropdown inside `<td>`.
5. **`components/invoices/proforma-tab.tsx`**:
   - Lines 465-535: Inline `absolute right-0 top-8 z-30 w-48` dropdown inside `<td>`.
6. **`components/invoices/tax-invoices-tab.tsx`**:
   - Lines 480-540: Inline `absolute right-0 top-8 z-30 w-48` dropdown inside `<td>`.
7. **`components/invoices/reimbursements-tab.tsx`**:
   - Lines 400-435: Inline `absolute right-0 top-8 z-30 w-44` dropdown inside `<td>`.
8. **`components/invoices/receipts-tab.tsx`**:
   - Lines 375-415: Inline `absolute right-0 top-8 z-30 w-44` dropdown inside `<td>`.
9. **`components/team/team-directory-tab.tsx`**:
   - Lines 395-435: Inline `absolute right-0 top-8 z-30 w-44` dropdown inside `<td>`.

---

## 4. Decisions or Assumptions
1. **Unified Architecture via `RowActionDropdown`**:
   - Enhance `components/ui/data-table/row-action-dropdown.tsx` to support dark mode classes (`dark:bg-slate-900 dark:border-slate-800`), custom widths (`width` prop, default 176px / 192px), and customizable alignment.
2. **Per-Table Row Action Cell Pattern**:
   - In each table file, wrap the row action trigger button and `RowActionDropdown` in a clean subcomponent (e.g. `ClientRowActionCell`, `ServiceRowActionCell`, `DSCRowActionCell`, etc.) with its own `useRef<HTMLButtonElement>` trigger reference.
   - Clean up obsolete, hardcoded outside click listeners that target DOM classes like `.row-action-menu-container`, allowing `RowActionDropdown`'s portal-aware outside click detection to handle dismissal cleanly.
3. **Smart Collision & Elevation**:
   - When any row is near the bottom of the table or viewport (or when only 1 or 2 rows exist), `RowActionDropdown` automatically opens upwards or stays within bounds.
   - Dropdown renders at `z-index: 9999` directly in `document.body`, floating cleanly over `<TablePagination>`, sidebars, and card borders.

---

## 5. Files Likely to Change
- `components/ui/data-table/row-action-dropdown.tsx` (Add dark mode styling & refine positioning)
- `components/clients/clients-table.tsx`
- `components/services/services-table.tsx`
- `components/registry/dsc-table.tsx`
- `components/tasks/task-list-tab.tsx`
- `components/invoices/proforma-tab.tsx`
- `components/invoices/tax-invoices-tab.tsx`
- `components/invoices/reimbursements-tab.tsx`
- `components/invoices/receipts-tab.tsx`
- `components/team/team-directory-tab.tsx`

---

## 6. Visual Interpretation & UI Expectations
- **Trigger**: 3-dot vertical ellipsis icon (`MoreVertical className="size-4"` or `size-3.5`), centered, with hover highlight (`hover:bg-slate-100 rounded-lg p-1 text-slate-400 hover:text-slate-700`).
- **Menu Card**:
  - Background: White / Dark Slate (`bg-white dark:bg-slate-900`).
  - Border: Slate-200 / Slate-800 (`border border-slate-200 dark:border-slate-800`).
  - Shadow: Deep elevation (`shadow-xl rounded-xl`).
  - Width: `w-44` (176px) or `w-48` (192px).
  - Animation: Smooth entry (`animate-in fade-in zoom-in-95 duration-100`).
  - Font Size: `text-xs`.
- **Options**:
  - Primary / Convert actions: Emerald or Indigo accents with icons.
  - Informational / View actions: Slate accents with icons.
  - Destructive / Delete / Lost actions: Rose accents with icons.
  - Dividers: `border-t border-slate-100 dark:border-slate-800 my-1`.

---

## 7. Security Requirements
- Client callbacks invoke existing validated Server Actions and state handlers.
- No direct database mutations or bypass of tenant isolation.

---

## 8. Acceptance Criteria
- [ ] In all 9 tables (Clients, Services, Registry DSC, Task List, Proforma Invoices, Tax Invoices, Reimbursements, Payment Receipts, Team Directory), clicking the 3-dots action icon opens a portaled dropdown.
- [ ] Dropdowns never get clipped by `overflow-x-auto` or `overflow-hidden`.
- [ ] In single-row or short tables, dropdowns never render under `<TablePagination>`.
- [ ] Near viewport bottom or table bottom, dropdowns flip upward cleanly.
- [ ] All table callbacks (View, Edit, Convert, Record Payment, Delete, Deactivate, Custody Transfer) execute correctly and close the menu.
- [ ] Clicking outside or pressing `Escape` dismisses the active dropdown.
- [ ] Zero TypeScript errors (`npm run typecheck`).
- [ ] Zero ESLint errors (`npx eslint`).
- [ ] Production build succeeds (`npm run build`).

---

## 9. Checks to Run
- `npm run typecheck`
- `npx eslint`
- `npm run build`

---

## 10. Manual Test Steps Expected After Implementation
1. Navigate to `http://localhost:3000/clients`, `http://localhost:3000/services`, `http://localhost:3000/tasks`, `http://localhost:3000/invoices`, `http://localhost:3000/team`, and `http://localhost:3000/registry`.
2. On each page, click the 3-dots action button (`⋮`) on any row (especially the first row or last row).
3. Verify that the dropdown menu renders smoothly, floats cleanly above the table and pagination bar, and is 100% readable and interactive.
4. Verify clicking an action executes that action and dismisses the menu.
5. Verify clicking anywhere outside or pressing `Escape` closes the menu.
