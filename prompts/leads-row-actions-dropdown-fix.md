# Implementation Prompt: Leads Table Row Actions Dropdown Positioning & Pagination Overlap Fix

## 1. Goal
Fix the UI display and stacking context bug in the **Leads Table** (`components/leads/leads-table.tsx`) where clicking the 3-dots row action button (`MoreVertical`) causes the action dropdown menu (`Convert to Client`, `Mark as Lost`, `Delete Lead`) to render under the pagination footer or get clipped when there is only 1 row (or few rows) in the table.

The dropdown must escape all table `overflow-x-auto` and `overflow-hidden` constraints, float with `position: fixed` via React `createPortal` to `document.body` at `z-index: 9999`, and implement collision detection to open upwards when near the bottom of the viewport or table.

---

## 2. Skills Read
- `AGENTS.md`, `public/context/contextDoc/doc.md` (Section 4: Leads Management), `public/context/contextDoc/ui_doc.md`.
- `components/ui/data-table/table-header-cell.tsx` (reference implementation for table portals and escape from overflow).
- Next.js 16 / React 19 client portal & SSR hydration guidelines.

---

## 3. Existing Code Inspected
- `components/leads/leads-table.tsx`:
  - Lines 334-335: Table wrapped in `<div className="overflow-x-auto"><table ...>`.
  - Line 272: Table outer container has `bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden`.
  - Lines 556-614: Row actions dropdown is rendered inline inside `<td className="py-3 px-4 text-right relative row-action-menu-container">` as `<div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">`.
  - Line 624: `<TablePagination>` is rendered as a sibling immediately following the table container.
  - Root Cause: In CSS, any container with `overflow-x: auto` clips or scrolls content vertically. When there is only 1 row, the table height is ~84px while the dropdown is ~130px tall. Because the dropdown is positioned `absolute` inside the `<td>`, it extends past the table boundary. Since `<TablePagination>` follows in DOM order with a solid background (`bg-slate-50/50`), it paints over the overflowing menu, trapping the dropdown underneath the pagination bar.
- `components/ui/data-table/`:
  - `table-header-cell.tsx`: Uses `createPortal(..., document.body)` with dynamic positioning to escape table overflow clipping.
  - Missing: A standardized, reusable `RowActionDropdown` component for row-level actions.

---

## 4. Decisions or Assumptions
1. **Portal-based Architecture**: We will build a reusable, robust `RowActionDropdown` component in `components/ui/data-table/row-action-dropdown.tsx` (and re-export from `components/ui/data-table/index.ts`), or integrate a portaled floating menu directly into `LeadsTable`.
2. **Viewport Collision Detection**:
   - Calculate trigger button's bounding rect: `const rect = triggerRef.current.getBoundingClientRect()`.
   - Compute available height below: `const spaceBelow = window.innerHeight - rect.bottom`.
   - If `spaceBelow < 160` and `rect.top > 160`, open upwards (`bottom: window.innerHeight - rect.top + 4` or `top: rect.top - menuHeight - 4`).
   - Otherwise, open downwards (`top: rect.bottom + 4`).
   - Horizontal alignment: `right: window.innerWidth - rect.right`, clamped so it never overflows off-screen on the right or left.
3. **Escapes All Overflow Clipping**: By mounting directly into `document.body` via `createPortal`, the dropdown is completely detached from the table's `overflow-x-auto` and card's `overflow-hidden`, and will never render beneath `<TablePagination>`.
4. **Hydration Safety**: Check for client mounting (`mounted` flag or `typeof window !== 'undefined'`) to prevent React 19 SSR hydration mismatches.
5. **Dismissal Handling**: Close automatically on click outside, Esc key press, window resize, or scroll.

---

## 5. Files Likely to Change
- `components/ui/data-table/row-action-dropdown.tsx` (New reusable portaled dropdown component)
- `components/ui/data-table/index.ts` (Export `RowActionDropdown`)
- `components/leads/leads-table.tsx` (Use portaled row action menu for lead row actions)

---

## 6. Visual Interpretation & UI Expectations
- **Trigger**: 3-dot vertical ellipsis icon (`MoreVertical className="size-4"`), light slate color (`text-slate-400`), hover effect (`hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1`).
- **Menu Card**:
  - Background: White (`bg-white`).
  - Border: Subtle light border (`border border-slate-200`).
  - Shadow: Deep elevation (`shadow-xl rounded-xl`).
  - Width: `w-44` (176px).
  - Animation: Smooth entry (`animate-in fade-in zoom-in-95 duration-100`).
  - Padding: `py-1.5`.
- **Items**:
  1. `Convert to Client` (if `status === 'Open'`): Emerald text & icon (`text-emerald-700 hover:bg-emerald-50 font-semibold`).
  2. `Mark as Lost` (if `status === 'Open'`): Rose text & icon (`text-rose-700 hover:bg-rose-50 font-medium`).
  3. `Delete Lead`: Slate text & icon (`text-slate-600 hover:bg-slate-50 font-medium`).
- **Elevation**: Sits prominently above the table rows, table headers, and `<TablePagination>` footer without any clipping or overlap glitches.

---

## 7. Security Requirements
- Client-side interactions trigger validated server actions or parent callbacks.
- No direct database mutations without role checks.

---

## 8. Acceptance Criteria
- [ ] Clicking the row actions button (3 dots) on a single-row leads table opens the dropdown menu completely unobstructed.
- [ ] The dropdown is never clipped by `overflow-x-auto` or `overflow-hidden`.
- [ ] The dropdown renders above the `<TablePagination>` footer and is 100% visible and interactive.
- [ ] Clicking `Convert to Client`, `Mark as Lost`, or `Delete Lead` triggers the respective callback and closes the menu.
- [ ] Clicking outside the menu or pressing `Escape` closes the menu.
- [ ] Scrolling or resizing the window cleanly repositions or dismisses the menu.
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
1. Navigate to `http://localhost:3000/leads`.
2. Ensure there is only 1 lead in the table (or filter to show 1 lead).
3. Click the 3-dots `MoreVertical` button on that row in the `Actions` column.
4. Verify the dropdown menu (`Convert to Client`, `Mark as Lost`, `Delete Lead`) opens smoothly and is positioned directly below (or above) the button, floating clearly over the pagination bar without being obscured or cut off.
5. Click anywhere outside the dropdown to verify it closes cleanly.
6. Open the dropdown again and click `Convert to Client` or `Mark as Lost` to verify the action fires correctly.
