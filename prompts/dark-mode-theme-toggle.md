# Implementation Prompt: Dark Mode / Light Mode Switch

## Goal
Implement a fully functional, persistent Dark Mode / Light Mode theme system for TURIA, connecting the existing non-functional theme toggle button in the Topbar (`components/layout/topbar.tsx`), persisting the user preference in `localStorage`, eliminating flash-of-unauthenticated-theme (FOUC) with an inline head script, and providing dark styling across the platform.

---

## Skills Read & Inspected
- `ui_doc.md`: Design tokens, colors (`#6366F1` brand indigo, slate-900, slate-50, borders `#E2E8F0`).
- `node_modules/next/dist/docs/`: Next.js App Router client components, layout hydration patterns (`suppressHydrationWarning`).
- `components/layout/topbar.tsx`: Existing button at line 143 with dummy `const [isDark, setIsDark] = useState(false)` that doesn't apply classes or persist.
- `app/layout.tsx`: Root layout with `<html>` and `<body>`.
- `app/globals.css`: Tailwind v4 setup (`@import "tailwindcss";`, `@theme inline`).

---

## Decisions & Architecture
1. **Theme Provider & Hook (`components/theme/theme-provider.tsx`)**:
   - Manages state: `"light" | "dark" | "system"`.
   - On mount, reads stored theme from `localStorage.getItem("turia-theme")`, falling back to `window.matchMedia("(prefers-color-scheme: dark)").matches`.
   - Synchronizes `dark` class on `document.documentElement` (`<html class="dark">`).
   - Exports `useTheme()` hook: `{ theme, resolvedTheme, toggleTheme, setTheme }`.
2. **Anti-FOUC Inline Script (`app/layout.tsx`)**:
   - Injects a script in `<head>` that immediately checks `localStorage.getItem("turia-theme")` or media query and adds `dark` to `document.documentElement.classList` before render.
   - Adds `suppressHydrationWarning` to `<html>`.
3. **Tailwind v4 Dark Mode Integration (`app/globals.css`)**:
   - Registers `@variant dark (&:where(.dark, .dark *));`.
   - Defines CSS variables for `.dark`:
     - Background: `#0B0F19` (rich dark slate)
     - Card / Surface: `#111827` (slate-900)
     - Border: `#1E293B` (slate-800)
     - Foreground / Text: `#F8FAFC` (slate-50)
     - Muted Text: `#94A3B8` (slate-400)
     - Input / Dropdown bg: `#1E293B`
   - Scoped theme rules ensuring existing components styled with `bg-white`, `border-[#E2E8F0]`, `bg-[#F8FAFC]`, `text-slate-900`, `text-slate-700`, `text-slate-600`, inputs, tables, sidebars, and topbar seamlessly transform into polished dark mode with high contrast and zero visual breakage.
4. **Topbar Toggle (`components/layout/topbar.tsx`)**:
   - Consumes `useTheme()`.
   - Renders `Sun` icon when dark, `Moon` icon when light, with smooth transition and accessible tooltip.

---

## Files Likely to Change / Be Created
1. `components/theme/theme-provider.tsx`: New theme context and provider with `useTheme()` hook.
2. `app/layout.tsx`: Wrap application with `ThemeProvider`, add `suppressHydrationWarning`, and add inline anti-FOUC script.
3. `app/globals.css`: Add `@variant dark` and comprehensive `.dark` surface, border, text, table, and input styles.
4. `components/layout/topbar.tsx`: Connect theme toggle button to `toggleTheme()`.

---

## Acceptance Criteria
1. Clicking the theme button in the Topbar immediately toggles the theme between dark and light mode.
2. The toggle icon correctly alternates between `Moon` (in light mode) and `Sun` (in dark mode).
3. The selected theme is stored in `localStorage` under `"turia-theme"`.
4. Refreshing the browser preserves the active theme without any white flash (FOUC).
5. All major screens (`/`, `/team`, `/invoices`, `/tasks`, `/clients`, `/leads`, `/services`) render dark surfaces, dark table backgrounds, crisp light typography, and indigo accents in dark mode.
6. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors.

---

## Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps Expected After Implementation
1. Navigate to `http://localhost:3000`.
2. Locate the theme toggle button in the Topbar (next to Search and Avatar).
3. Click the Moon icon: verify the entire page transitions into Dark Mode with dark navigation, dark tables, dark cards, and legible text.
4. Refresh the page: verify Dark Mode is preserved immediately on page reload without flashing.
5. Click the Sun icon: verify Light Mode is restored immediately.
