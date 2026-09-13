# Implementation Prompt: Tabs Component & Tabs Styling System

## 1. Goal
Implement reusable, accessible **Tabs UI components** (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`) and integrate comprehensive **Tabs Styling & Navigation Variants** into the TURIA Design System Showcase page and component directory according to the design standards in `public/doc.md` and `.agents/skills/shadcn/SKILL.md`.

---

## 2. Skills Read
- `.agents/skills/shadcn/SKILL.md` (Tabs component rules: `TabsTrigger` inside `TabsList`, semantic styling, Radix UI composition, `cn()` usage, no manual color overrides)
- `public/doc.md` (Tabbed workspace specifications for Home cockpit 4 tabs, Profile 7 tabs, Task compliance 5 tabs, Invoices 6 tabs, and Team 4 tabs)
- `AGENTS.md` (Workflow requirements, verification standards, zero-assumptions rule)

---

## 3. Existing Code Inspected
- `app/page.tsx`: TURIA Design System showcase page.
- `lib/utils.ts`: `cn` class utility.
- `app/globals.css`: Theme variables and color tokens.

---

## 4. Visual & Architectural Design Interpretation

### 4.1 Tab Component Variants to Support
1. **Underline / Line Tabs (Default Master Navigation Style)**:
   - Container with bottom border `border-b border-slate-200`.
   - Active Tab: `border-b-2 border-[#6366F1] text-[#6366F1] font-semibold`.
   - Inactive Tab: `border-b-2 border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium`.
   - Count Badge: Pill badge next to label (e.g., `12` or `New`) with `bg-indigo-50 text-indigo-700` when active or `bg-slate-100 text-slate-600` when inactive.

2. **Pill / Segmented Tabs (Sub-tab & Control Bar Style)**:
   - Background pill container `bg-slate-100 p-1 rounded-lg flex items-center gap-1`.
   - Active Tab: `bg-white text-slate-900 font-semibold shadow-xs rounded-md`.
   - Inactive Tab: `text-slate-600 hover:text-slate-900 font-medium rounded-md`.

3. **Icon + Label Tabs (Cockpit & Mobile Adaptive Style)**:
   - Combines 16px Lucide icon (`data-icon="inline-start"`) with label and active indicator.

### 4.2 Design System Showcase Integration
- In `app/page.tsx`, add an interactive **TABS & NAVIGATION STYLING** section showcasing:
  - **Variant 1: Line / Underline Tabs** with live active states and badge counts (e.g. `Task Summary`, `Task List (14)`, `Sub-Tasks (6)`, `Recurring (4)`, `Analytics`).
  - **Variant 2: Segmented / Pill Tabs** with interactive switching (e.g. `Today's Attendance`, `Weekly Matrix`, `Monthly View`, `Regularization`).
  - **Variant 3: Icon + Count Badges** with interactive tab contents previewing rich statutory content.

---

## 5. Files Likely to Change / Be Created
1. `components/ui/tabs.tsx`: Accessible, composable Tabs component built with `@radix-ui/react-tabs` (or headless accessible primitive) and styled with Tailwind CSS tokens.
2. `app/page.tsx`: Updated with the Tabs showcase section and interactive tab demos.
3. `package.json`: Add `@radix-ui/react-tabs` if needed for primitive tab mechanics.

---

## 6. Implementation Requirements
- `TabsList`, `TabsTrigger`, `TabsContent` comply with shadcn composition rules (`TabsTrigger` must always be inside `TabsList`).
- Interactive keyboard navigation (Arrow keys, Tab, Enter) and full ARIA accessibility (`role="tablist"`, `role="tab"`, `aria-selected`).
- Smooth visual feedback for active, hover, focused, and disabled states.
- Pixel-perfect alignment with the Indigo `#6366F1` brand palette and slate neutral tokens.

---

## 7. Security Requirements
- Client-side tab state with zero unvalidated DOM injections or exposed credentials.

---

## 8. Acceptance Criteria
- [ ] `components/ui/tabs.tsx` created with clean TypeScript types and variant styles (line, pill, cards).
- [ ] Tabs section rendered on the Design System page (`/` and `/design-system`) demonstrating line tabs, pill tabs, and icon tabs with counts.
- [ ] Clicking different tabs updates active tab indicator seamlessly and renders corresponding sample tab content.
- [ ] `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass with zero errors.

---

## 9. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## 10. Manual Test Steps
1. Open `http://localhost:3000` in the browser.
2. Scroll to the new **Tabs & Navigation Styling** section.
3. Click across line tabs, pill tabs, and icon tabs to verify active highlights, border transitions, and badge styling.
4. Verify responsive behavior across viewport sizes.
