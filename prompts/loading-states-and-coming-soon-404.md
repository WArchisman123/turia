# Implementation Prompt: Standardized Loading States (Leads, Clients, Services) & Coming Soon 404 Page

## 1. Goal
1. **Standardize Loading States**: Implement polished, consistent loading states across pages that currently lack them (`app/leads/page.tsx`, `app/clients/page.tsx`, and `app/services/page.tsx`), matching the established visual standards in `app/invoices/page.tsx` and `app/team/page.tsx`.
2. **Create Reusable `PageLoadingState` Component**: Build a clean, modular `components/ui/loading-state.tsx` featuring an animated dual-ring indigo spinner, contextual status typography, and optional skeleton shimmer placeholders.
3. **Build Branded Coming Soon 404 Page (`app/not-found.tsx`)**: Implement a Next.js `not-found.tsx` route that serves an elegant, practice-tailored "Coming Soon / Feature In Development" screen for any non-existent or upcoming routes, equipped with quick-return navigation back to the Dashboard, Tasks, Clients, and Invoices.

---

## 2. Skills Read
- `AGENTS.md` (Product specifications, UI styling standards, zero assumptions rule)
- `public/context/contextDoc/doc.md` (Product feature specifications)
- `public/context/contextDoc/ui_doc.md` (UI component design system, global palette, AppShell layout)
- `public/context/contextDoc/role.md` (Role specifications & practitioner personas)

---

## 3. Existing Code Inspected
1. **`app/invoices/page.tsx`**:
   - Lines 434–440: Uses an elevated card with animated spinner and contextual message:
     ```tsx
     <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
       <div className="size-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
       <p className="text-xs font-semibold text-slate-600">Loading Practice Invoicing & Statutory Tax Engine...</p>
     </div>
     ```
2. **`app/tasks/page.tsx`**:
   - Lines 236–241: Uses matching elevated loading card with indigo spinner.
3. **`app/leads/page.tsx`**:
   - Only has a small text snippet in the header (`Syncing...`), but renders an empty table and 0-count KPI strip immediately while data is loading.
4. **`app/clients/page.tsx`**:
   - Defines `const [isLoading, setIsLoading] = useState(true);` but never uses it in JSX, displaying an empty table before API data returns.
5. **`app/services/page.tsx`**:
   - Renders empty table and 0-count KPI strip while loading with only a tiny header badge.
6. **`app/not-found.tsx`**:
   - File does not exist; Next.js serves a plain unbranded default 404 screen.

---

## 4. Decisions & Architectural Assumptions
1. **Unified `PageLoadingState` Component (`components/ui/loading-state.tsx`)**:
   - Reusable across all pages and sub-tabs.
   - Props:
     - `title`: string (e.g. "Loading Leads & Pipeline Intelligence...")
     - `subtitle`?: string (e.g. "Syncing prospect inquiries, live GST verification status, and conversion funnel")
     - `kpiCount`?: number (optional skeleton KPI strip)
     - `skeletonRows`?: number (optional skeleton table rows)
   - Follows TURIA design tokens: `rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs`.
2. **Page Integration**:
   - In `app/leads/page.tsx`, replace the immediate empty table render with `PageLoadingState` while `isLoading` is true.
   - In `app/clients/page.tsx`, replace the immediate empty table render with `PageLoadingState` while `isLoading` is true.
   - In `app/services/page.tsx`, replace the immediate empty table render with `PageLoadingState` while `isLoading` is true.
3. **Coming Soon / 404 Route (`app/not-found.tsx`)**:
   - Wrapped inside `<AppShell>` for seamless topbar and sidebar persistence.
   - Renders a modern, CA-focused "Module Coming Soon / Page Under Development" canvas:
     - Status pill: `404 • Feature Under Development`
     - Hero illustration / icon with soft indigo gradient backdrop.
     - Headline: `Module Coming Soon`
     - Description: `This practice management module is currently under development for CA practitioners and tax firms.`
     - Action CTAs: `Back to Dashboard` (primary indigo button), `View Compliance Tasks`, `Client Master`.

---

## 5. Files Likely to Change
1. `components/ui/loading-state.tsx` (NEW - Reusable loading state component)
2. `app/leads/page.tsx` (Add proper loading state)
3. `app/clients/page.tsx` (Add proper loading state)
4. `app/services/page.tsx` (Add proper loading state)
5. `app/not-found.tsx` (NEW - Branded Coming Soon / 404 page)

---

## 6. Visual Interpretation & UI Expectations
- **Loading Card**:
  - Background: Pure white (`bg-white dark:bg-slate-900`)
  - Border: Soft slate (`border border-slate-200 dark:border-slate-800 rounded-2xl`)
  - Spinner: Indigo dual-ring (`size-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin`)
  - Shimmer pulse: Soft slate pulse bars representing rows and columns.
- **Coming Soon Page**:
  - Layout: Centered hero card within AppShell.
  - Icon: Sparkles or Rocket / Compass in indigo circle (`size-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center`).
  - Buttons: Primary `bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold px-4 py-2.5`.

---

## 7. Acceptance Criteria
- [ ] `components/ui/loading-state.tsx` exists and compiles without errors.
- [ ] In `/leads`, `/clients`, and `/services`, a proper elevated loading card displays while data is being fetched, preventing jarring empty table flashes.
- [ ] Navigating to non-existent URLs (e.g. `http://localhost:3000/arbitrary-unknown-route` or `/reports/misc`) renders the branded Coming Soon 404 page within AppShell.
- [ ] Coming Soon page includes working navigation buttons to Dashboard (`/`), Tasks (`/tasks`), Clients (`/clients`), and Leads (`/leads`).
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npx eslint` passes with 0 errors.
- [ ] `npm run build` passes with 0 errors.

---

## 8. Checks to Run
1. `npm run typecheck`
2. `npx eslint`
3. `npm run build`

---

## 9. Manual Test Steps Expected After Implementation
1. Visit `http://localhost:3000/leads`, `http://localhost:3000/clients`, and `http://localhost:3000/services` (throttled in DevTools Network if needed).
2. Verify the clean, elevated loading card with animated spinner and contextual description appears before content renders.
3. Visit an unknown route like `http://localhost:3000/coming-soon-test` or `http://localhost:3000/unknown-module`.
4. Verify the branded Coming Soon 404 page renders inside AppShell with clear typography and quick navigation links.
5. Click **Return to Dashboard** and verify navigation back to `http://localhost:3000/`.
