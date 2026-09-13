# Implementation Prompt: TURIA Design System Showcase

## 1. Goal
Implement a pixel-perfect, high-fidelity, interactive **Design System Showcase Page** in Next.js App Router matching the visual specification and component layout in `public/contextImg/design-system.png` and `public/doc.md` (Section 13 UI/UX Design System & Layout Tokens).

---

## 2. Skills Read
- `.agents/skills/shadcn/SKILL.md` (Component composition, semantic color tokens, Radix/Base primitives, lucide-react integration, zero-assumption rules)
- `public/doc.md` (Product specifications, design system tokens, color definitions, typography scale, icon conventions)
- `AGENTS.md` (Workflow rules, multi-tenant CA practice domain standards, strict verification procedures)

---

## 3. Existing Code Inspected
- `app/layout.tsx`: Root layout with font configuration. Needs `Inter` font setup.
- `app/globals.css`: Tailwind v4 configuration. Needs theme variables, color tokens, typography scales, custom shadow tokens, and base styles.
- `app/page.tsx`: Default Next.js boilerplate. Will be updated to render the Design System page.
- `package.json`: Need dependencies for `lucide-react`, `clsx`, `tailwind-merge`, and `@radix-ui/react-slot` / shadcn utilities.

---

## 4. Visual & Architectural Design Interpretation

### 4.1 Page Layout & Hierarchy (3-Column Responsive Grid + Footer Banner)
- **Background**: Soft neutral slate canvas (`#F8FAFC` / `bg-slate-50`).
- **Container**: Max width `1440px` with `20px` to `24px` gutter and margins, responsive down to tablet/mobile.
- **Card Styling**: Clean white surfaces (`#FFFFFF`), `1px solid #E2E8F0` border, `rounded-xl` (`12px`), soft shadows (`0px 1px 3px rgba(0,0,0,0.06)`).
- **Section Headers**: Uppercase bold caption style (`text-xs font-bold tracking-wider text-slate-900 mb-4`).

### 4.2 Left Column (Brand, Color Palette, Spacing)
1. **Brand Card**:
   - Logo: Indigo squircle (`#6366F1`) with bold white `T` inside.
   - Brand Wordmark: Bold `turia` with lowercase styling + `CA SUITE` lavender pill badge (`bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold text-xs px-2 py-0.5 rounded-full`).
   - Description: *"Chartered Accountancy Practice Management & Statutory Compliance Operating System."* (slate-500, 13px).
2. **Colors Card**:
   - **Primary**:
     - `TEXT PRIMARY`: `#0F172A` (Dark slate navy swatch + label + hex)
     - `TEXT SEC.`: `#64748B` (Muted slate swatch + label + hex)
     - `SURFACE`: `#F8FAFC` (Light gray surface swatch with border + label + hex)
   - **Semantic**:
     - `BRAND INDIGO`: `#6366F1`
     - `PRESENT`: `#10B981` (Emerald green)
     - `OVERDUE`: `#EF4444` (Crimson red)
     - `ALERT`: `#F59E0B` (Amber gold)
   - **Neutrals**:
     - `BG PRIM.`: `#FFFFFF`
     - `BG SEC.`: `#F1F5F9`
     - `BORDER`: `#E2E8F0`
     - `DIVIDER`: `#E2E8F0`
3. **Spacing System Card**:
   - Header: `SPACING SYSTEM` with right-aligned subtitle `(4px Base Unit)`.
   - Visual scale of 8 progressive indigo-tinted rounded bars: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`.
   - Note: *"Consistent spatial rhythm engineered for dense financial matrices."*

### 4.3 Middle Column (Typography, Icons, Grid System)
1. **Typography Card**:
   - Left side: `FONT FAMILY` label, large bold `Inter` headline, and descriptive paragraph (*"Inter is a precision geometric sans-serif engineered for data-dense tables, statutory filings, and CA practice analytics."*).
   - Right side: Full typographic hierarchy table with headers `STYLE`, `USAGE`, `SIZE`, `WEIGHT`, `LINE HT`:
     - `H1` | Page / Screen Title | 32px | Bold | 1.2
     - `H2` | Section Title | 24px | SemiBold | 1.3
     - `H3` | Card / Table Title | 18px | SemiBold | 1.3
     - `H4` | Subheading | 15px | Medium | 1.4
     - `Body Large` | Important content | 16px | Regular | 1.5
     - `Body Medium` | Table & body text | 13px | Regular | 1.5
     - `Body Small` | Supporting meta | 12px | Regular | 1.4
     - `Caption` | Labels, tags, badges | 11px | Medium | 1.3
2. **Icons Card**:
   - Header: `ICONS`.
   - 16 Core Navigation & Action Icons with clean stroke styling (2px line stroke, rounded caps):
     - Row 1: `Home` (`Home`), `Leads` (`Users`), `Clients` (`UserCheck`), `Services` (`ShoppingBag`), `Tasks` (`CheckSquare`), `Invoice` (`FileText`), `Team` (`UsersRound`), `Registry` (`ShieldCheck`).
     - Row 2: `Search` (`Search`), `Calendar` (`Calendar`), `Clock` (`Clock`), `Filter` (`Filter`), `Notices` (`Bell`), `Verify` (`BadgeCheck`), `Reports` (`BarChart2`), `More` (`MoreHorizontal`).
   - Subtitle: *"Line style • 2px stroke • Rounded corners & caps"*.
3. **Grid System Card**:
   - Header: `GRID SYSTEM`.
   - Visual representation: 12-column vertical striped preview box with light lavender/indigo fill and subtle borders.
   - Metadata metrics on right: `CONTAINER 1440px`, `COLUMNS 12`, `GUTTER 20px`, `MARGIN 24px`.

### 4.4 Right Column (UI Elements, Live Card Example, Shadows & Radii)
1. **UI Elements Card**:
   - **Buttons Matrix**:
     - Columns: `DEFAULT`, `HOVER`, `OUTLINE`, `DISABLED`
     - `Primary`: Solid `#6366F1` `+ Add Task`, hover `#4F46E5`, outline `#6366F1` border, disabled `#E2E8F0` with `#94A3B8` text.
     - `Secondary`: Light gray `#F1F5F9` `Filter`, hover `#E2E8F0`, outline `#E2E8F0` border, disabled light muted.
     - `Text`: Indigo text `View Details`, hover with light background pill, disabled muted.
   - **Status Badges / Chips**:
     - `● Present` (`bg-emerald-50 text-emerald-700 border-emerald-200`)
     - `● Overdue` (`bg-red-50 text-red-700 border-red-200`)
     - `● In Progress` (`bg-indigo-50 text-indigo-700 border-indigo-200`)
     - `● Exp. 15d` (`bg-amber-50 text-amber-700 border-amber-200`)
     - `✓ GSTIN Verified` (`bg-blue-50 text-blue-700 border-blue-200`)
     - `More +` (`bg-slate-100 text-slate-600 border-slate-200`)
   - **Statutory Compliance Status Meter**:
     - Multi-segment horizontal progress bar:
       - `Overdue 18%` (Red `#EF4444`)
       - `WIP 42%` (Indigo `#6366F1`)
       - `Completed 40%` (Emerald `#10B981`)
     - Scale underneath: `0%`, `50% (Active Firm Target)`, `100%`.
2. **Card Example Card**:
   - Real-world statutory compliance task card:
     - Top row: `GSTR-3B Monthly Return Filing (Aug 2026)` (16px bold slate-900), subtitle `Acme Global Logistics Pvt Ltd • GSTIN: 27AABCU9603R1ZM` (12px slate-500), badge `● High Priority` (red pill).
     - Inner box: Light surface (`bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-600`): *"Preparation of inward/outward summaries, ITC verification under Sec 16(2), and GSTR-2B reconciliation."*
     - Tag strip: `Statutory Audit` badge, `Due: 20 Sep 2026` amber badge, `4/6 Sub-Tasks Done` gray badge.
     - Action Footer:
       - Left: `archi (Sr. Associate)` avatar + name, `PI-2026-089` invoice code.
       - Right: `Log Time` (outline/ghost button) + `Verify & File` (primary indigo button).
3. **Shadows & Border Radius Grid (Side-by-Side)**:
   - **Shadows Card**:
     - `SMALL`: `0px 1px 3px rgba(0,0,0,0.12)` with live shadow preview box.
     - `MEDIUM`: `0px 4px 12px rgba(0,0,0,0.16)` with live shadow preview box.
     - `LARGE`: `0px 12px 24px rgba(0,0,0,0.20)` with live shadow preview box.
   - **Border Radius Card**:
     - `SMALL`: `4px`
     - `MEDIUM`: `8px`
     - `LARGE`: `12px`
     - `FULL`: `9999px`
     - Each with live rendered rounded geometry sample boxes.

### 4.5 Global Bottom Banner
- Dark Navy background (`#0F172A`).
- Left: `TURIA | Chartered Accountancy Practice Management & Statutory Compliance Operating System.`
- Center: `Design System v1.0 • September 2026`
- Right: `Precision Compliance. Seamless Practice Orchestration.`

---

## 5. Files Likely to Change / Be Created
1. `package.json`: Install `lucide-react`, `clsx`, `tailwind-merge`.
2. `app/layout.tsx`: Configure `Inter` font from `next/font/google`.
3. `app/globals.css`: Add custom design system color tokens, font variables, and utility classes.
4. `app/page.tsx`: Implement the full Design System Showcase Component.
5. `app/design-system/page.tsx` (companion route): Dedicated route for direct navigation.
6. `lib/utils.ts`: Standard `cn` helper function for conditional classes.

---

## 6. Implementation Requirements
- **Strict adherence to visual spec**: Colors, radii, typography weights, font sizes, shadows, spacing must match `design-system.png` verbatim.
- **Inter Font**: Explicitly loaded via `next/font/google` and configured across all body/header elements.
- **Responsive Layout**: Fluid 3-column desktop layout that cleanly cascades down to 2 columns on medium screens and 1 column on mobile devices.
- **Interactive UI Samples**: Buttons have interactive hover/focus states, badges have accurate pill radii, copyable hex codes/tokens.
- **Strict TypeScript & Clean Code**: Zero `any`, clean modular components with semantic markup.

---

## 7. Security Requirements
- All assets and components are statically rendered or purely client-rendered without exposing secret credentials or external unauthorized endpoints.

---

## 8. Acceptance Criteria
- [ ] Brand card matches the logo, font, subtitle, and badge in the reference image.
- [ ] Color palette accurately displays Primary (`#0F172A`, `#64748B`, `#F8FAFC`), Semantic (`#6366F1`, `#10B981`, `#EF4444`, `#F59E0B`), and Neutrals (`#FFFFFF`, `#F1F5F9`, `#E2E8F0`, `#E2E8F0`).
- [ ] Spacing system demonstrates 4px base unit with 8 visual bars (`4px` to `64px`).
- [ ] Typography table lists all 8 type scales with exact style names, usages, sizes, weights, and line heights.
- [ ] Icon grid renders 16 Lucide icons with 2px stroke and exact labels.
- [ ] Grid system displays 12-column visual preview with 1440px container, 12 cols, 20px gutter, 24px margin specs.
- [ ] UI Elements showcases button variants (Primary, Secondary, Text in Default/Hover/Outline/Disabled states), 6 status chips, and the 3-segment statutory compliance status meter.
- [ ] Real-world GSTR-3B compliance task card rendered with exact tags, metadata, and buttons.
- [ ] Shadows card demonstrates Small, Medium, Large shadows with exact rgba values.
- [ ] Border radius card displays Small (4px), Medium (8px), Large (12px), Full (9999px) with shape previews.
- [ ] Dark bottom banner displays the exact copyright, version, and precision compliance tagline.
- [ ] `npm run lint` and `npx tsc --noEmit` / `npm run build` pass with zero errors.

---

## 9. Checks to Run
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## 10. Manual Test Steps
1. Run `npm run dev`.
2. Open `http://localhost:3000` or `http://localhost:3000/design-system` in the browser.
3. Verify every card, typography row, color swatch, button state, badge, and meter visually matches `\public\contextImg\design-system.png`.
4. Inspect responsive resizing from desktop (1440px+) down to tablet (768px) and mobile (375px).
