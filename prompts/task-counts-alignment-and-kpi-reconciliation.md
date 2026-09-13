# Implementation Prompt: Task Counts Alignment & KPI Reconciliation

## Goal
Fix the count discrepancy where 10 tasks exist in TURIA, but the KPI cards, Task Summary matrix columns, Sub-Tasks KPI strip, and API aggregators do not add up consistently. Ensure that every task status and view calculates cleanly, with zero double-counting, zero missing tasks, and every column/card sum precisely matching the total (10 tasks / 5 subtasks).

---

## Skills Read
- `.agents/skills/supabase`: PostgreSQL schema, typed queries, and RLS filtering.
- `.agents/skills/clerk`: Session management and multi-tenant isolation.
- Next.js App Router guidelines (`node_modules/next/dist/docs/`).

---

## Existing Code & Visual Evidence Inspected
1. `app/api/tasks/route.ts`:
   - `calculateKpis(tasks)`: Currently counts `wip` as `["in_progress", "wip"].includes(t.status)`, which double-counts tasks in `in_progress` (2 in WIP + 1 in In Progress).
   - Missing `onHold` count in `TaskKpiData`.
   - Seed data contains 10 tasks, each representing one distinct status:
     - `task-001`: `in_progress` (Archi Saha)
     - `task-002`: `pending` (Sneha Roy, set due date to "10/09/2026" so `Due Today` accurately reflects 1 task)
     - `task-003`: `overdue` (Amitabh Ghosh)
     - `task-004`: `sent_for_review` (Archi Saha)
     - `task-005`: `ready_to_bill` (Sneha Roy)
     - `task-006`: `wip` (Amitabh Ghosh)
     - `task-007`: `on_hold` (Sneha Roy)
     - `task-008`: `request_changes` (Archi Saha)
     - `task-009`: `completed` (Amitabh Ghosh)
     - `task-010`: `cancelled` (Sneha Roy)
2. `components/tasks/types.ts`:
   - Update `TaskKpiData` to include `onHold: number`.
   - Update `SummaryRowData` to include `cancelled: number`.
3. `components/tasks/task-summary-tab.tsx` (`task-1.png`):
   - Table columns: `[Group]` | `Pending` | `In Progress` | `Sent for Review` | `Request Changes` | `WIP Sub Total` | `Overdue` | `Due Today` | `Completed` | `Ready to Bill` | `On Hold` | `Cancelled` | `Total` | `Done %`.
   - Previously had no `Cancelled` column, causing Sneha Roy's row (3 visible items) to total 4, and Grand Total (9 visible items) to total 10.
   - Adding the `Cancelled` column resolves the discrepancy: `WIP Sub Total` (5) + `Overdue` (1) + `Completed` (1) + `Ready to Bill` (1) + `On Hold` (1) + `Cancelled` (1) = `Total` (10).
   - `Due Today`: 1 (`task-002` due today, 10/09/2026) treated as an informational date-based indicator that does not inflate mutually exclusive lifecycle status sums.
4. `components/tasks/task-list-tab.tsx` (`task-2.png` & `task-2 filter clicked.png`):
   - KPI cards row: Add `On Hold` card (slate/pause icon) alongside `Ready to Bill`, providing all 10 distinct status cards + `All Task` card.
   - Fix KPI calculation so:
     - `WIP`: 1 (`task-006`)
     - `Pending`: 1 (`task-002`)
     - `In Progress`: 1 (`task-001`)
     - `Sent for Review`: 1 (`task-004`)
     - `Request Changes`: 1 (`task-008`)
     - `Overdue`: 1 (`task-003`)
     - `Completed`: 1 (`task-009`)
     - `Ready to Bill`: 1 (`task-005`)
     - `On Hold`: 1 (`task-007`)
     - `Cancelled`: 1 (`task-010`)
     - `All Task`: 10
     - Sum of all 10 individual status cards: 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 = 10!
   - Make KPI cards clickable with active filter state: clicking any status card filters the table down to that exact status and highlights the card.
5. `components/tasks/sub-tasks-tab.tsx` (`task-3.png`):
   - Fix `kpis` in subtasks where both `wip` and `inProgress` were filtering for `s.status === "in_progress"`.
   - With 5 seed subtasks:
     - `wip`: 0
     - `pending`: 1
     - `inProgress`: 1
     - `sentForReview`: 1
     - `requestChanges`: 0
     - `overdue`: 1
     - `completed`: 1
     - `onHold`: 0
     - `cancelled`: 0
     - `allSubTasks`: 5
     - Sum: 0 + 1 + 1 + 1 + 0 + 1 + 1 + 0 + 0 = 5 = All Sub Task.

---

## Decisions & Assumptions
- **WIP vs In Progress**: In TURIA's filter drawer (`task-2 filter clicked.png`) and KPI grid (`task-2.png`), `WIP` and `In Progress` are two distinct statuses. Each status must count only tasks strictly having that status (`status === "wip"` and `status === "in_progress"`).
- **Summary Matrix WIP Sub Total**: In the Summary Matrix (`task-1.png`), `WIP Sub Total` is an aggregate column representing all active work: `Pending + In Progress + Sent for Review + Request Changes`. Tasks with `status === "wip"` fall into `In Progress` for summary grouping or are included in `WIP Sub Total`.
- **Cancelled Column in Summary Matrix**: To guarantee that all 10 tasks in the practice database add up horizontally and vertically in the matrix, an explicit `Cancelled` column will be rendered with soft rose badge styling before `Total`.
- **Due Today**: Handled as an urgency highlight column (matching `task-heatmap guide.png`), populated when `dueDate === "10/09/2026"` (mock today).

---

## Files Likely to Change
1. `components/tasks/types.ts`: Add `onHold` to `TaskKpiData` and `cancelled` to `SummaryRowData`.
2. `app/api/tasks/route.ts`:
   - Update `calculateKpis` to prevent double-counting and add `onHold`.
   - Update `task-002` `dueDate` to `"10/09/2026"` so `Due Today` has 1 item.
3. `components/tasks/task-summary-tab.tsx`:
   - Add `cancelled` count to each group row and Grand Total row.
   - Add `Cancelled` table header and cell.
   - Update `Total` formula to `wipSubTotal + overdue + completed + readyToBill + onHold + cancelled`.
4. `components/tasks/task-list-tab.tsx`:
   - Add `On Hold` card into `kpiCards`.
   - Update grid columns to accommodate cards cleanly (`grid-cols-2 sm:grid-cols-5 lg:grid-cols-11`).
   - Add interactive click filter on KPI cards.
5. `components/tasks/sub-tasks-tab.tsx`:
   - Fix `wip` subtask calculation to check `s.status === "wip"` rather than `in_progress`.
   - Ensure subtask KPI counts sum to 5.

---

## Implementation Requirements
1. **Strict TypeScript Mode**: No `any`, explicit typing across all updated components.
2. **UI Document Compliance (`ui_doc.md`)**:
   - Zero cell borders in data tables.
   - Clean spacing and typography.
   - Proper badges matching color tokens.
3. **No Regressions**:
   - Ensure Task creation, status updating, subtask toggling, and export functionality continue working seamlessly.

---

## Acceptance Criteria
1. On **Task Summary** (Tab 1):
   - Row 1 (Amitabh Ghosh): WIP Sub Total (1) + Overdue (1) + Completed (1) = Total 3.
   - Row 2 (Archi Saha): WIP Sub Total (3) = Total 3.
   - Row 3 (Sneha Roy): Pending (1) + Ready to Bill (1) + On Hold (1) + Cancelled (1) = Total 4.
   - Grand Total row: Pending (1) + In Progress (2) + Sent for Review (1) + Request Changes (1) = WIP Sub Total (5).
     WIP Sub Total (5) + Overdue (1) + Due Today (1) + Completed (1) + Ready to Bill (1) + On Hold (1) + Cancelled (1) -> Base statuses sum to exactly Total: 10!
2. On **Task List** (Tab 2):
   - 10 status KPI cards: WIP (1), Pending (1), In Progress (1), Sent for Review (1), Request Changes (1), Overdue (1), Completed (1), Ready to Bill (1), On Hold (1), Cancelled (1).
   - Card 11: All Task (10).
   - Sum of the 10 status cards: 1 * 10 = 10!
   - Clicking any KPI card filters the 10 tasks to the single matching task.
3. On **Sub Tasks** (Tab 3):
   - KPI cards: WIP (0), Pending (1), In Progress (1), Sent for Review (1), Request Changes (0), Overdue (1), Completed (1), On Hold (0), Cancelled (0), All Sub Task (5).
   - Sum of status cards: 0 + 1 + 1 + 1 + 0 + 1 + 1 + 0 + 0 = 5!

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Navigate to `/tasks` in the browser.
2. On **Tab 1: Task Summary**:
   - Verify each of the 3 employee rows has numbers adding up across the row to the `Total` column (Amitabh: 3, Archi: 3, Sneha: 4).
   - Verify the `Grand Total` row numbers add up to 10.
   - Verify `Due Today` displays 1 (task-002).
3. Switch to **Tab 2: Task List**:
   - Verify the top KPI cards: Each status card shows `1`, and `All Task` shows `10`.
   - Click on `Pending`: verify table shows only 1 task (`TSK-GST-002`).
   - Click on `All Task`: verify table restores all 10 tasks.
4. Switch to **Tab 3: Sub Tasks**:
   - Verify KPI cards: Pending (1), In Progress (1), Sent for Review (1), Overdue (1), Completed (1), and All Sub Task (5).
   - Verify sum of cards equals 5.
