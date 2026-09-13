# Implementation Prompt: Table Styling and Column 3-Dot Functionality Unification

## 1. Goal
Standardize and unify the data table UI styling, column header 3-dot dropdown functionality, active modifiers bar, column visibility picker, search/sorting mechanics, and pagination across all application tables (specifically bringing `ClientsTable` and `LeadsTable` to the exact visual perfection, feature parity, and design standards established in `ServicesTable`). Address the component architecture by introducing reusable data table primitives/components.

---

## 2. Skills Read
- `.agents/skills/shadcn/SKILL.md` (Design tokens, component composition, semantic Tailwind styling, accessible interactive patterns, no `space-y-*`/`space-x-*` with flex/grid, proper badge usage)
- `AGENTS.md` (Product specifications, coding standards, verification rules)
- `public/context/contextDoc/doc.md` (Single source of truth for Leads, Clients, and Services specifications)

---

## 3. Existing Code Inspected
- `components/services/services-table.tsx` (Reference standard: column 3-dot menu, active controls banner, columns picker popover, sort/filter logic, sparkles empty state, pagination footer)
- `components/clients/clients-table.tsx` (Current clients table needing styling alignment, status column integration, and parity with services)
- `components/leads/leads-table.tsx` (Current leads table needing column 3-dot dropdown fixes, smart edge alignment, unified pagination, and active controls synchronization)
- `app/services/page.tsx` (Standard toolbar: Search input, Sort dropdown, Add button, 3-dots action menu)
- `app/clients/page.tsx` (Clients page toolbar missing sort dropdown and uniform spacing)
- `app/leads/page.tsx` (Leads page toolbar and filter bar synchronization)
- `components/clients/types.ts` & `components/leads/types.ts` (Types and column definitions)

---

## 4. Architectural Analysis: Why Tables Were Inconsistent
Previously, each table (`ServicesTable`, `ClientsTable`, `LeadsTable`) was developed as an isolated component without a shared core table foundation. This caused several issues:
1. **Divergent Pagination**: `LeadsTable` defaulted to 10 rows per page (`10, 25, 50`) while `ServicesTable` and `ClientsTable` used 50 rows (`20, 50, 100`).
2. **Column 3-Dot Popover Placement & Clipping**: `LeadsTable` dropdown menus positioned with `left-0` clipped off the right edge on columns like `phone` and `email`.
3. **Missing Columns and Features**: `ClientsTable` omitted the interactive `Status` badge/toggle from `ALL_COLUMNS`, had divergent column naming (`Employee ...` instead of clean assignments), and lacked client status toggling.
4. **Active Controls Pill Bar Drift**: Differing badge color tokens, icon sizes, and clear button alignments across tables.
5. **Page Toolbar Inconsistencies**: `app/clients/page.tsx` lacked the `Sort By` dropdown present in `app/services/page.tsx`.

---

## 5. Decisions & Assumptions
1. **Reference Standard**: `components/services/services-table.tsx` is the gold standard for visual treatment, active controls bar, column 3-dot dropdowns, empty states, and pagination.
2. **Shared Component Architecture**: We will create reusable data table primitives in `components/ui/data-table/` to avoid duplicate logic while preserving type safety for domain-specific cell renderers:
   - `TableHeaderCell`: Renders column title with sort indicator, 3-dot action button, and popover menu (Sort Asc/Desc, Clear Sort, Value Filter with instant search & clear, Hide Column) with smart edge alignment (`align="start" | "end"`).
   - `TableActiveModifiersBar`: Renders active sorting chip, filter chips, hidden columns badge, column visibility picker popover (with checkboxes), and `Reset All` button.
   - `TablePagination`: Renders "Showing X–Y of Z items", `Rows per page:` dropdown (`20, 50, 100`), page number indicator, and `ChevronLeft`/`ChevronRight` buttons.
   - `TableEmptyState`: Renders the standardized sparkle icon badge, title, subtitle, and reset button.
3. **Clients Table Refactoring**:
   - Align all 13 columns with doc.md & official specs: `Client Name & Code`, `Legal Name`, `Contact Person`, `Mobile No`, `Business Entity`, `Services`, `Assigned Manager/Partner`, `Groups`, `Auditor`, `Labels`, `Status`, `Created On`.
   - Add interactive `Status` badge (`active`, `inactive`, `dormant`, `new`) with status toggle support (`onToggleStatus`).
   - Add Sort dropdown to `app/clients/page.tsx` toolbar (`Most Popular`, `Name (A-Z)`, `Recent`, `Code`).
4. **Leads Table Refactoring**:
   - Fix column 3-dot dropdown alignment so rightmost columns (`createdDate`, `phone`, `email`) open with `right-0` to prevent viewport clipping.
   - Standardize pagination to `20, 50, 100` with default `50` rows per page.
   - Standardize row action dropdown to `shadow-xl border border-slate-200 rounded-xl`.
   - Ensure filter/sort state synchronization between the top dynamic `LeadsFilterBar` and the table's internal column filters.

---

## 6. Files Likely to Change
1. `components/ui/data-table/table-header-cell.tsx` (New reusable header cell with 3-dot dropdown)
2. `components/ui/data-table/table-active-modifiers.tsx` (New reusable active controls bar & column picker)
3. `components/ui/data-table/table-pagination.tsx` (New reusable pagination footer)
4. `components/ui/data-table/table-empty-state.tsx` (New reusable empty state)
5. `components/clients/clients-table.tsx` (Refactored to match Services styling & functionality)
6. `components/leads/leads-table.tsx` (Refactored to match Services styling & 3-dot functionality)
7. `components/services/services-table.tsx` (Refactored to use shared data table primitives for total consistency)
8. `app/clients/page.tsx` (Add sort dropdown and match toolbar styling)
9. `components/clients/types.ts` (Ensure `onToggleStatus` and column keys are fully typed)

---

## 7. Implementation Requirements

### 7.1 Visual & Design System Tokens (Services Parity)
- **Container**: `bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`
- **Active Controls Bar**: `bg-indigo-50/90 border-b border-indigo-100 px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150`
- **Active Control Chips**: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs`
- **Table Header**: `bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]`
- **Table Row Hover**: `hover:bg-slate-50/70 transition-colors group` with selected state `bg-indigo-50/30`
- **Pagination Footer**: `p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 select-none`
- **Row & Column Action Popovers**: `bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs`

### 7.2 Column 3-Dot Functionality Specification
Each column header must provide:
1. **Title click**: Toggles column sort (`asc` ➔ `desc` ➔ clear).
2. **Sort Indicators**: Bold `↑` or `↓` arrow and purple dot indicator when filtered.
3. **3-Dot Action Popover Menu**:
   - `Sort Ascending` (with `ArrowUpAZ` icon)
   - `Sort Descending` (with `ArrowDownZA` icon)
   - `Clear Column Sort` (with `RotateCcw` icon, shown if column is sorted)
   - `FILTER BY VALUE` search input with search icon, instant filtering, and clear `X` button
   - `Hide Column` (with `EyeOff` icon)
4. **Smart Edge Positioning**: Columns in the left 60% of the table open dropdowns with `left-0`; rightmost columns open with `right-0` so menus never clip outside the container.

---

## 8. Acceptance Criteria
- [ ] `ClientsTable` visual styling and functionality matches `ServicesTable` 100% (header dots, sort/filter popover, active controls banner, column visibility picker, reset all, status badges, empty state, pagination).
- [ ] `LeadsTable` column 3-dot dropdown operates reliably on all columns without clipping off screen on rightmost columns (`Phone`, `Email`, `Created Date`).
- [ ] `LeadsTable` pagination matches the 20/50/100 standard and default of 50.
- [ ] `ClientsPage` toolbar includes the standard Sort By dropdown matching `ServicesPage`.
- [ ] Reusable data table primitives are established in `components/ui/data-table/` to prevent future styling drift.
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` pass with zero errors.

---

## 9. Checks to Run
- `npm run typecheck` (`tsc --noEmit`)
- `npm run lint` (`next lint`)
- `npm run build` (`next build`)

---

## 10. Manual Test Steps
1. Navigate to `/services`: Verify the standard table, column 3-dot sort/filter/hide popovers, active controls banner, columns picker, and pagination.
2. Navigate to `/clients`: Verify that the clients table now matches `/services` identically in design, column 3-dot menu behavior, active controls banner, status toggles, and pagination.
3. Navigate to `/leads`: Test clicking 3 dots on rightmost columns (`Phone`, `Email`). Verify the popover opens cleanly aligned without clipping. Test sorting, searching within a column, hiding columns, column picker, and pagination.
