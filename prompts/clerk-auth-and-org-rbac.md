# Implementation Prompt: Clerk Multi-Tenant Authentication & RBAC Integration

## 1. Goal
Implement production-grade **Clerk Multi-Tenant Organization Authentication and Role-Based Access Control (RBAC)** for TURIA, providing seamless user sign-in/sign-up, multi-tenant firm workspace management, organization switching, role resolution across all 7 standard CA practice roles, and client/server permission guards matching `public/context/contextDoc/role.md` and `public/context/contextDoc/doc.md`.

---

## 2. Skills Read
- `.agents/skills/clerk/SKILL.md` (Version detection, router structure, Core 3 patterns)
- `.agents/skills/clerk-setup/SKILL.md` (Next.js App Router quickstart, env vars, proxy/middleware setup)
- `.agents/skills/clerk-nextjs-patterns/SKILL.md` (Server vs Client auth, `await auth()`, `useAuth()`, `<Show>`, Server Action guards)
- `.agents/skills/clerk-orgs/SKILL.md` (Multi-tenant B2B SaaS, `<OrganizationSwitcher>`, roles & permissions, orgId-scoped session data)
- `.agents/skills/clerk-custom-ui/SKILL.md` (Custom appearance, shadcn theme synchronization)
- `public/context/contextDoc/role.md` (7 CA practice roles, 30-module matrix, 5 action flags: View, Add/Edit, Delete, Import, Export)
- `AGENTS.md` (Mandatory zero-assumptions rule, tenant isolation by `firm_id`)

---

## 3. Existing Code Inspected
- `package.json`: Need to install `@clerk/nextjs` (targeting current SDK).
- `.env.local`: Contains `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and auth route URLs (`/sign-in`, `/sign-up`).
- `app/layout.tsx`: Root HTML layout that will host `<ClerkProvider>` with TURIA brand theme.
- `components/layout/topbar.tsx`: Firm header currently with mock `AR` avatar; will be wired to `<OrganizationSwitcher />` and `<UserButton />`.
- `components/layout/profile-drawer.tsx`: User profile slide-over drawer; will be wired to real Clerk user profile data and `SignOutButton`.
- `public/context/contextDoc/role.md`: The 30-module matrix and role specifications.

---

## 4. Architectural & Visual Design Decisions

### 4.1 Clerk Multi-Tenant Organization Architecture
- **Tenant Context**: Every CA firm is a Clerk `Organization` (`firm_id` / `orgId`).
- **Standard Roles**:
  - `org:admin` ➔ Super Admin / Managing Partner
  - `org:partner` ➔ Partner
  - `org:manager` ➔ Senior Manager / Manager
  - `org:associate` ➔ Paid Assistant / Senior Associate
  - `org:trainee` ➔ Article Trainee / CA Intern
  - `org:accountant` ➔ Accountant / Billing Specialist
  - `org:client_guest` ➔ Client Portal User
- **Session Resolution**: Session tokens carry `orgId`, `userId`, and `orgRole`. Default role fallbacks are handled gracefully.

### 4.2 Middleware Strategy (`middleware.ts`)
- Configured with `clerkMiddleware()` using Next.js matcher.
- **Public Routes**:
  - `/sign-in(.*)`
  - `/sign-up(.*)`
  - `/design-system(.*)`
  - Static assets (`/_next`, `/favicon.ico`, image assets)
- **Protected Routes**:
  - All application routes (`/`, `/leads(.*)`, `/clients(.*)`, `/services(.*)`, `/tasks(.*)`, `/invoices(.*)`, `/team(.*)`, `/reports(.*)`, `/registry(.*)`, `/profile(.*)`). Unauthenticated users will be redirected to `/sign-in`.

### 4.3 Branded Auth Screens (`/sign-in` and `/sign-up`)
- Styled with TURIA branding:
  - Squircle gradient logo badge.
  - Indian CA practice management tagline: *"TURIA — CA Practice Management & Statutory Compliance SaaS"*.
  - Primary button color: Indigo `#6366F1` / `#4F46E5`.
  - Clean card surface with subtle border `#E2E8F0` and shadow.

### 4.4 Granular RBAC Utilities (`lib/rbac/`)
- `lib/rbac/types.ts`: TypeScript definitions for the 30 modules, 5 action flags, and 7 role definitions.
- `lib/rbac/matrix.ts`: The static 30-module default permission lookup table matching `role.md`.
- `lib/rbac/server-guard.ts`: Server-side authorization helper `requirePermission(module, action)` and `getAuthContext()` for Server Components, Server Actions, and API route handlers.
- `lib/rbac/client-guard.ts` & `components/rbac/can.tsx`: Client-side hook `useRBAC()` and `<Can I="action" a="module">` declarative wrapper.

---

## 5. Files Likely to Change / Be Created

1. `package.json`: Install `@clerk/nextjs`.
2. `middleware.ts`: Clerk route protection middleware.
3. `app/layout.tsx`: Wrap application with `<ClerkProvider>` with custom appearance configuration.
4. `app/sign-in/[[...sign-in]]/page.tsx`: Branded Sign In page.
5. `app/sign-up/[[...sign-up]]/page.tsx`: Branded Sign Up page.
6. `lib/rbac/types.ts`: RBAC types (modules, actions, roles).
7. `lib/rbac/matrix.ts`: 30-module permission matrix lookup table.
8. `lib/rbac/server-guard.ts`: Server-side permission check functions.
9. `lib/rbac/client-guard.tsx`: Client hook `useRBAC()` and context.
10. `components/rbac/can.tsx`: `<Can I="..." a="...">` declarative component.
11. `components/layout/topbar.tsx`: Integrate Clerk `<OrganizationSwitcher />` and dynamic user avatar.
12. `components/layout/profile-drawer.tsx`: Integrate Clerk user profile details, email, and sign out button.

---

## 6. Implementation Requirements
- **Strict TypeScript**: 0 `any`, full typing of Clerk auth claims, module slugs, and permission verbs.
- **Server vs. Client Boundary**: Strictly separate `auth()` from `@clerk/nextjs/server` and hooks from `@clerk/nextjs`.
- **Tenant Isolation**: Every backend guard returns verified `orgId` as `firm_id`.
- **Pixel-Perfect Styling**: Auth pages match TURIA's indigo design system and Inter typography.

---

## 7. Security Requirements
- Reject missing or invalid sessions with `401 Unauthorized`.
- Block unauthorized mutations with `403 Forbidden`.
- Keep Clerk secret keys server-only (never import `CLERK_SECRET_KEY` in client components).
- Ensure public routes only expose non-confidential design system and auth pages.

---

## 8. Acceptance Criteria
1. Unauthenticated navigation to `/` redirects to `/sign-in`.
2. `/sign-in` and `/sign-up` render branded Clerk UI with TURIA logo and styling.
3. `/design-system` remains publicly viewable for style reference.
4. After sign-in, user is routed to the Home cockpit with user profile details loaded.
5. Topbar displays `<OrganizationSwitcher />` and real user status.
6. `<Can>` component and `useRBAC()` hook correctly gate actions based on the 30-module matrix.
7. `npm run typecheck`, `npm run lint`, and `npm run build` pass with 0 errors/warnings.

---

## 9. Checks to Run
- `npm run typecheck`
- `npm run lint`
- `npm run build`

---

## 10. Manual Test Steps
1. Navigate to `http://localhost:3000/` in an incognito window ➔ Verify redirect to `http://localhost:3000/sign-in`.
2. Navigate to `http://localhost:3000/design-system` ➔ Verify design system renders publicly.
3. Sign in or sign up via email/password or Google on `/sign-in`.
4. Verify redirection to Home dashboard `http://localhost:3000/`.
5. Check Topbar for `<OrganizationSwitcher />` and User Avatar.
6. Open Slide-over Profile Drawer and verify email and Sign Out action.
