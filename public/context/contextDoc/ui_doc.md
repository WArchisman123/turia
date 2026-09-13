# TURIA UI Design System — Complete Component Reference

> **For agents:** Read this file in full before implementing any frontend change.
> Every class, pattern, and component shown here is extracted verbatim from the production codebase.
> Do not deviate from these patterns. When in doubt, match the existing component exactly.

---

## 1. Design Tokens & Global Palette

| Token | Value | Usage |
|---|---|---|
| Brand primary | `#6366F1` (indigo-500) | CTA buttons, active sidebar, avatar, logo |
| Brand active hover | `#4F46E5` (indigo-700) | Primary button hover |
| Page background | `#F8FAFC` (slate-50) | AppShell outer background |
| Text primary | `#0F172A` (slate-900) | Main body text, titles |
| Border default | `#E2E8F0` (slate-200) | Cards, inputs, dividers |
| Success | `#059669` (emerald-600) | Active badges, converted leads |
| Warning | `#D97706` (amber-600) | Pending, dormant states |
| Danger | `#DC2626` (rose-600) | Lost, error, delete actions |
| Info | `#0284C7` (sky-600) | New clients, non-recurring |
| Neutral muted | `text-slate-500` | Labels, secondary text |
| Indigo tint bg | `bg-indigo-50` | Active filter bar, sorted column |

**Font sizes used in tables and UI:**
- Section heading: `text-base font-bold text-slate-900 tracking-tight`
- Column header: `text-[10px] font-semibold uppercase tracking-wider text-slate-500`
- Cell body: `text-xs text-slate-600`
- Code/mono: `font-mono text-[10px] text-slate-500`
- Badge: `text-[10px] font-bold` or `text-[11px] font-medium`
- KPI label: `text-[11px] font-semibold text-slate-500`
- KPI value: `text-xl font-bold` or `text-2xl font-bold tracking-tight`

---

## 2. Page Layout — AppShell

Every authenticated page must be wrapped in `<AppShell>`. Do not build custom layout shells.

```tsx
// app/[page]/page.tsx
import { AppShell } from "@/components/layout/app-shell";

export default function MyPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        {/* page content */}
      </div>
    </AppShell>
  );
}
```

**AppShell structure:**
```
min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased
  ├── <Topbar />  → h-14 bg-white border-b border-[#E2E8F0] sticky top-0 z-30
  ├── flex flex-1 items-stretch
  │     ├── <Sidebar />  → w-[72px] bg-white border-r border-[#E2E8F0]
  │     └── flex-1 flex flex-col min-w-0
  │           ├── flex-1 p-4 md:p-6 overflow-x-hidden  ← children render here
  │           └── <Footer />
  └── <ProfileDrawer />  (slide-over, z-50)
```

**Page content spacing:** Always use `<div className="space-y-4">` as the immediate child of AppShell.

---

## 3. Topbar (`components/layout/topbar.tsx`)

Fixed 56px header.

```tsx
<header className="h-14 bg-white border-b border-[#E2E8F0] px-4 flex items-center justify-between sticky top-0 z-30 select-none">
  {/* Left: Logo + Org Switcher */}
  {/* Center: Quick Tools nav (hidden below xl) */}
  {/* Right: Search, Theme Toggle, User Avatar */}
</header>
```

**App logo mark:**
```tsx
<div className="size-8 rounded-lg bg-[#6366F1] flex items-center justify-center text-white font-black text-base shadow-xs">
  T
</div>
```

**Topbar quick-tool button (default):**
```tsx
<button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer py-1">
  <Icon className="size-3.5" />
  <span>Label</span>
</button>
```

**Topbar search input:**
```tsx
<input
  type="text"
  placeholder="Search Ctrl K"
  className="h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-full w-44 lg:w-52 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-700 placeholder:text-slate-400"
/>
```

**User avatar (initials):**
```tsx
<button className="relative size-8 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer">
  AR
  {/* Online dot */}
  <span className="absolute bottom-0 right-0 size-2.5 bg-[#10B981] border-2 border-white rounded-full" />
</button>
```

---

## 4. Sidebar (`components/layout/sidebar.tsx`)

72px icon-only vertical navigation.

```tsx
<aside className="w-[72px] bg-white border-r border-[#E2E8F0] min-h-[calc(100vh-56px)] flex flex-col justify-between py-3 select-none shrink-0 z-20">
  <nav className="flex flex-col gap-1.5 items-center">
    {/* Each nav item */}
  </nav>
</aside>
```

**Sidebar nav item — active:**
```tsx
<Link className="w-[60px] h-[52px] rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer bg-[#6366F1] text-white shadow-xs font-semibold">
  <Icon className="size-4" strokeWidth={2.5} />
  <span className="text-[10px] leading-none tracking-tight">Label</span>
</Link>
```

**Sidebar nav item — inactive:**
```tsx
<Link className="w-[60px] h-[52px] rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium">
  <Icon className="size-4" strokeWidth={2} />
  <span className="text-[10px] leading-none tracking-tight">Label</span>
</Link>
```

---

## 5. Page Section Header & Toolbar

Every list page (Clients, Services, Leads, etc.) has a toolbar row above the table.

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
  {/* Left: Title + Loading indicator */}
  <div className="flex items-center gap-2">
    <h1 className="text-base font-bold text-slate-900 tracking-tight">
      Client (42)
    </h1>
    {isLoading && (
      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
        <RotateCw className="size-3 animate-spin text-indigo-600" /> Syncing...
      </span>
    )}
  </div>

  {/* Right: Controls */}
  <div className="flex items-center gap-2">
    {/* Search */}
    <div className="relative">
      <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
      <input
        type="text"
        placeholder="Search"
        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-60 shadow-2xs"
      />
    </div>

    {/* Sort Dropdown */}
    <select className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer">
      <option>Most Popular</option>
      <option>Name (A-Z)</option>
    </select>

    {/* Primary Add Button */}
    <button
      type="button"
      className="px-4 py-1.5 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
    >
      Add
    </button>

    {/* 3-Dot overflow menu */}
    <div className="relative">
      <button
        type="button"
        className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-2xs"
      >
        <MoreVertical className="size-4" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
          <button className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left">
            <Upload className="size-4 text-indigo-600" />
            <span>Import</span>
          </button>
          <button className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left">
            <Download className="size-4 text-emerald-600" />
            <span>Export</span>
          </button>
        </div>
      )}
    </div>
  </div>
</div>
```

---

## 6. KPI Metric Cards (Strip)

Two variants — choose based on card count:

### 6a. 4-Card KPI Strip (Clients style)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
  <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300">
    <div className="space-y-0.5">
      <span className="text-2xl font-bold tracking-tight text-[#6366F1]">42</span>
      <p className="text-[11px] font-medium text-slate-500">Total Clients</p>
    </div>
    <div className="size-9 rounded-lg bg-purple-50/80 border border-purple-100 flex items-center justify-center text-[#6366F1]">
      <Users className="size-4.5" />
    </div>
  </div>
  {/* repeat for each card */}
</div>
```

### 6b. 6-Card KPI Strip (Leads / Services style)

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
    <div className="size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
      <ListTodo className="size-5" />
    </div>
    <div>
      <span className="text-[11px] font-semibold text-slate-500 block leading-none">Open</span>
      <span className="text-lg font-bold text-slate-900 block mt-1">12</span>
    </div>
  </div>
  {/* repeat for each card */}
</div>
```

**KPI icon container color tokens (icon bg / border / text):**

| Color | bg | border | text |
|---|---|---|---|
| Indigo (Total) | `bg-indigo-50/80` | `border-indigo-100` | `text-[#4F46E5]` |
| Purple (Recurring) | `bg-purple-50/80` | `border-purple-100` | `text-[#7C3AED]` |
| Emerald (Active) | `bg-emerald-50/80` | `border-emerald-100` | `text-[#059669]` |
| Sky (New) | `bg-sky-50/80` | `border-sky-100` | `text-[#0284C7]` |
| Amber (Warning) | `bg-amber-50/80` | `border-amber-100` | `text-[#D97706]` |
| Rose (Lost) | `bg-rose-50/80` | `border-rose-100` | `text-rose-600` |
| Cyan (Rate) | `bg-cyan-50` | `border-cyan-100` | `text-cyan-600` |
| Slate (Neutral) | `bg-slate-100/80` | `border-slate-200` | `text-slate-600` |

---

## 7. Data Table — Full Architecture

All tables use 5 shared primitives from `@/components/ui/data-table`. **Never build bespoke table logic.**

```tsx
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";
```

### 7a. Outer Container

```tsx
<div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
  {/* 1. Active Modifiers Bar */}
  <TableActiveModifiers ... />

  {/* 2. Table scroll wrapper */}
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs text-slate-600">
      <thead>...</thead>
      <tbody className="divide-y divide-slate-100">...</tbody>
    </table>
  </div>

  {/* 3. Pagination Footer */}
  <TablePagination ... />
</div>
```

> **Critical:** Do NOT add `border-collapse` to `<table>`. It causes column border artifacts.
> Row separation is provided by `divide-y divide-slate-100` on `<tbody>`.
> The outer div has `overflow-hidden` for rounded corners — column 3-dot menus use `createPortal` to escape it.

---

### 7b. Table Header Row

```tsx
<thead>
  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
    {/* Checkbox column */}
    <th className="py-3 px-4 w-10">
      <input
        type="checkbox"
        checked={allSelected}
        onChange={handleSelectAll}
        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
      />
    </th>

    {/* Data columns — use TableHeaderCell primitive */}
    {visibleColumns.map((col, index) => (
      <TableHeaderCell
        key={col.key}
        column={col}
        isSorted={columnSort?.key === col.key}
        sortDirection={columnSort?.direction}
        isFiltered={Boolean(columnFilters[col.key])}
        filterValue={columnFilters[col.key]}
        isMenuOpen={openColumnMenuKey === col.key}
        onToggleMenu={() => setOpenColumnMenuKey(isMenuOpen ? null : col.key)}
        onCloseMenu={() => setOpenColumnMenuKey(null)}
        onToggleSort={() => handleToggleColumnSort(col.key)}
        onSetSort={(dir) => handleSetSort(col.key, dir)}
        onClearSort={handleClearSort}
        onSetFilter={(val) => handleSetFilter(col.key, val)}
        onHideColumn={() => handleHideColumn(col.key)}
        menuAlign={index >= visibleColumns.length - 3 ? "right" : "left"}
      />
    ))}

    {/* Actions header */}
    <th className="py-3 px-4 w-12 text-right">
      <span>Actions</span>
    </th>
  </tr>
</thead>
```

> **`menuAlign`:** Always pass `"right"` for the last 3 columns so the dropdown does not clip off-screen.

---

### 7c. Table Body Row

```tsx
<tbody className="divide-y divide-slate-100">
  {currentRows.map((item) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <tr
        key={item.id}
        className={`hover:bg-slate-50/70 transition-colors group ${
          isSelected ? "bg-indigo-50/30" : ""
        }`}
      >
        {/* Checkbox */}
        <td className="py-3 px-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleToggleSelect(item.id)}
            className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </td>

        {/* Data columns via switch(col.key) */}
        {visibleColumns.map((col) => {
          switch (col.key) {
            case "name":
              return (
                <td key={col.key} className="py-3 px-3 font-semibold text-slate-900">
                  <button
                    type="button"
                    onClick={() => onSelectItem?.(item)}
                    className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors cursor-pointer text-left truncate max-w-[240px]"
                  >
                    {item.name}
                  </button>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {item.code}
                  </span>
                </td>
              );
            default:
              return <td key={col.key} className="py-3 px-3">{String(item[col.key as keyof typeof item])}</td>;
          }
        })}

        {/* Row Actions 3-dot */}
        <td className="py-3 px-4">
          <div className="row-action-menu-container relative flex justify-end">
            <button
              type="button"
              onClick={() => setActiveRowMenuId(activeRowMenuId === item.id ? null : item.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>

            {activeRowMenuId === item.id && (
              <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer text-left">
                  <Eye className="size-3.5 text-indigo-600" />
                  View
                </button>
                <button className="w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium cursor-pointer text-left">
                  <Trash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
```

> **Row action menus** are `position: absolute` within the row — NOT portaled. Column header 3-dot menus use `createPortal`. The `.row-action-menu-container` class drives the global click-outside listener in each table component.

---

### 7d. `TableHeaderCell` Props

```ts
interface TableHeaderCellProps {
  column: ColumnDef;          // { key: string; label: string }
  isSorted: boolean;
  sortDirection?: "asc" | "desc";
  isFiltered: boolean;
  filterValue?: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleSort: () => void;
  onSetSort: (direction: "asc" | "desc") => void;
  onClearSort: () => void;
  onSetFilter: (val: string) => void;
  onHideColumn: () => void;
  menuAlign?: "left" | "right";  // default: "left"
}
```

The `<th>` renders with `border-0` to prevent column divider artifacts, and the sort button explicitly carries `font-semibold uppercase tracking-wider` because `<button>` resets CSS font inheritance from the parent `<tr>`.

The dropdown is portaled to `document.body` via `createPortal` and uses `position: fixed` coordinates computed from `triggerRef.current.getBoundingClientRect()` — this escapes both the `overflow-hidden` card and the `overflow-x-auto` scroll container.

---

### 7e. `TableActiveModifiers` Props

```tsx
<TableActiveModifiers
  columns={ALL_COLUMNS}
  columnSort={columnSort}
  columnFilters={columnFilters}
  hiddenColumnKeys={hiddenColumnKeys}
  onClearSort={() => setColumnSort(null)}
  onClearFilter={(key) => handleSetFilter(key, "")}
  onToggleColumnVisibility={handleToggleColumnVisibility}
  onResetAll={handleResetAll}
/>
```

Returns `null` when nothing is active. Banner bg: `bg-indigo-50/90 border-b border-indigo-100`.
Active chip: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs`.

---

### 7f. `TablePagination` Props

```tsx
<TablePagination
  totalCount={items.length}
  filteredCount={processedItems.length}
  startIndex={startIndex}
  rowsPerPage={rowsPerPage}
  currentPage={currentPage}
  totalPages={totalPages}
  entityName="clients"
  onRowsPerPageChange={(n) => { setRowsPerPage(n); setCurrentPage(1); }}
  onPageChange={setCurrentPage}
  rowsPerPageOptions={[20, 50, 100]}
/>
```

Footer: `p-4 border-t border-slate-100 flex ... gap-3 text-xs text-slate-500 bg-slate-50/50 select-none`

---

### 7g. `TableEmptyState` Props

```tsx
<TableEmptyState
  colSpan={visibleColumns.length + 2}
  title="No clients found"
  subtitle='Click "Add" or import your spreadsheet'
  hasActiveModifiers={hasActiveModifiers}
  onResetAll={handleResetAll}
/>
```

Renders as a `<tr>` with `py-16 text-center`. Icon: `<Sparkles className="size-5" />` in a `size-12 rounded-full bg-slate-50 border border-slate-200` container.

---

## 8. Column Definition Types

```ts
interface ColumnDef {
  key: string;
  label: string;
}

interface ColumnSort {
  key: string;
  direction: "asc" | "desc";
}
```

```tsx
const ALL_COLUMNS: ColumnDef[] = [
  { key: "createdOn",      label: "Created On" },
  { key: "tradeName",      label: "Client Name & Code" },
  { key: "legalName",      label: "Legal Name" },
  { key: "businessEntity", label: "Business Entity" },
  { key: "status",         label: "Status" },
];
```

---

## 9. Cell Renderer Reference

### Date cell
```tsx
<td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
  {item.createdOn}  {/* DD/MM/YYYY */}
</td>
```

### Primary name + code cell (clickable, opens detail)
```tsx
<td className="py-3 px-3 font-semibold text-slate-900">
  <div>
    <button
      type="button"
      onClick={() => onSelectItem?.(item)}
      className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors cursor-pointer text-left truncate max-w-[240px]"
      title={item.name}
    >
      {item.name}
    </button>
    <div className="flex items-center gap-1.5 mt-0.5">
      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
        {item.code}
      </span>
      <span className="text-[10px] text-slate-400 font-mono">
        SAC: {item.sacCode}
      </span>
    </div>
  </div>
</td>
```

### Identifier code badge (indigo — client code)
```tsx
<span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-bold">
  CL-0042
</span>
```

### Identifier code badge (slate — neutral)
```tsx
<span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
  SVC-0012
</span>
```

### Currency cell
```tsx
<td className="py-3 px-3 font-mono font-bold text-slate-900">
  ₹{item.baseFee.toLocaleString("en-IN")}
</td>
```

### Plain text cell
```tsx
<td className="py-3 px-3 text-slate-600">{item.field || "—"}</td>
```

### Long text with truncation
```tsx
<td className="py-3 px-3 text-slate-600 truncate max-w-[180px]" title={item.legalName}>
  {item.legalName || "—"}
</td>
```

### Person / contact cell
```tsx
<td className="py-3 px-3 text-slate-700">
  <div className="flex items-center gap-1.5">
    <User className="size-3 text-slate-400 shrink-0" />
    <span className="font-medium">{item.contactName}</span>
  </div>
</td>
```

### Phone cell
```tsx
<td className="py-3 px-3 font-mono text-slate-600">
  <div className="flex items-center gap-1">
    <Phone className="size-3 text-slate-400 shrink-0" />
    <span>{item.mobileNo || "—"}</span>
  </div>
</td>
```

### Multi-chip tags cell
```tsx
<td className="py-3 px-3">
  <div className="flex items-center gap-1">
    {item.services.slice(0, 2).map((srv, idx) => (
      <span
        key={idx}
        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium border border-indigo-100 whitespace-nowrap"
      >
        {srv}
      </span>
    ))}
    {item.services.length > 2 && (
      <span className="text-[10px] text-slate-400 font-bold">
        +{item.services.length - 2}
      </span>
    )}
  </div>
</td>
```

### Single category pill
```tsx
<td className="py-3 px-3">
  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
    {item.category}
  </span>
</td>
```

### Business entity badge
```tsx
<span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200 inline-flex items-center gap-1">
  <Building2 className="size-3 text-slate-400 shrink-0" />
  {item.businessEntity}
</span>
```

### Recurring vs Non-recurring
```tsx
{/* Recurring */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
  <Repeat className="size-3" /> Yes
</span>

{/* Non-recurring */}
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px] border border-slate-200">
  <Zap className="size-3 text-slate-400" /> No
</span>
```

---

## 10. Status Badges — Complete Reference

### Status pill with dot (table cells)

```tsx
{/* Active / Open / Approved / Converted */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
  Active
</span>

{/* Pending / Dormant / In Review / Negotiation */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
  <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
  Pending
</span>

{/* Inactive / Closed / Rejected */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium">
  <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
  Inactive
</span>

{/* Lost / Failed / Expired / Overdue */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
  <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
  Lost
</span>

{/* New / In Progress */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
  <span className="size-1.5 rounded-full bg-sky-500 shrink-0" />
  New
</span>

{/* Converted / Completed / Won */}
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
  <span className="size-1.5 rounded-full bg-indigo-500 shrink-0" />
  Converted
</span>
```

### Difficulty / level badge (rounded-md, no dot)

```tsx
<span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">Beginner</span>
<span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">Intermediate</span>
<span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">Advanced</span>
<span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">Expert</span>
```

### Topbar super-badge (floating label on a button)

```tsx
{/* NEW */}
<span className="absolute -top-1.5 left-2 bg-[#ECFDF5] text-[#059669] text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200 uppercase">
  NEW
</span>

{/* ADD ON */}
<span className="absolute -top-1.5 left-2 bg-[#EFF6FF] text-[#2563EB] text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200 uppercase">
  ADD ON
</span>
```

---

## 11. Tabs (`components/ui/tabs.tsx`)

Import from the shared component — never build tab logic manually.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
```

### Variant: `line` — page-level sub-tabs (default choice)

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger variant="line" value="overview">Overview</TabsTrigger>
    <TabsTrigger variant="line" value="tasks">Tasks</TabsTrigger>
    <TabsTrigger variant="line" value="invoices">Invoices</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

- List: `h-10 w-full justify-start border-b border-slate-200 bg-transparent p-0 gap-6`
- Trigger active: `border-b-2 border-[#6366F1] text-[#6366F1] font-semibold`
- Trigger inactive: `border-b-2 border-transparent text-slate-500 hover:text-slate-900`

### Variant: `pill` — secondary groupings

```tsx
<TabsList variant="pill">
  <TabsTrigger variant="pill" value="monthly">Monthly</TabsTrigger>
  <TabsTrigger variant="pill" value="weekly">Weekly</TabsTrigger>
</TabsList>
```

- List: `h-10 rounded-lg bg-slate-100/80 p-1 gap-1`
- Trigger active: `bg-white text-slate-900 font-semibold shadow-xs rounded-md px-3 py-1.5`

### Variant: `default` — compact internal grouping

- List: `h-9 rounded-lg bg-slate-100 p-1`
- Trigger active: `bg-white text-slate-900 font-semibold shadow-xs rounded-md px-3 py-1`

---

## 12. Modals

### Standard modal shell

```tsx
{isOpen && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Modal Title</h2>
          <p className="text-xs text-slate-500 mt-0.5">Subtitle description</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* content */}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
```

### Modal section divider

```tsx
<div className="border-b border-slate-100 pb-1 mb-4">
  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
    Section 1 — Business Information
  </h3>
</div>
```

### Form field in modal

```tsx
<div>
  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
    Field Label <span className="text-rose-500">*</span>
  </label>
  <input
    type="text"
    placeholder="Enter value"
    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition"
  />
</div>
```

---

## 13. Slide-over Drawer

```tsx
<div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
  {/* Overlay */}
  <div
    className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    onClick={onClose}
  />

  {/* Panel */}
  <div
    className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
  >
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 className="text-sm font-bold text-slate-900">Drawer Title</h2>
      <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
        <X className="size-5" />
      </button>
    </div>

    {/* Scrollable body */}
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      {/* content */}
    </div>
  </div>
</div>
```

---

## 14. Advanced Filter Bar

```tsx
{isFilterOpen && (
  <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-5 mb-4 animate-in slide-in-from-top-2 duration-200">
    {/* Header */}
    <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <SlidersHorizontal className="size-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Advanced Filters</h4>
          <span className="text-[10px] text-slate-400">Filter by stage, value & score</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
          <RotateCcw className="size-3" /> Clear All
        </button>
        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
          <X className="size-4" />
        </button>
      </div>
    </div>

    {/* Filter grid — 2/3/6 cols */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stage</label>
        <select className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs">
          <option>All Stages</option>
        </select>
      </div>
    </div>
  </div>
)}
```

---

## 15. Section Card / Detail Info Box

```tsx
<div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
  <h3 className="text-xs font-bold text-slate-800">Section Title</h3>
  <div className="grid grid-cols-2 gap-3 text-xs">
    <div>
      <span className="text-slate-400 font-medium block">Field Label</span>
      <span className="text-slate-800 font-semibold">Field Value</span>
    </div>
  </div>
</div>
```

---

## 16. Buttons

```tsx
{/* Primary CTA — table toolbar */}
<button className="px-4 py-1.5 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1">
  Add
</button>

{/* Primary CTA — modal submit */}
<button className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer">
  Save Changes
</button>

{/* Secondary — outlined/cancel */}
<button className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200">
  Cancel
</button>

{/* Danger — destructive */}
<button className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer">
  Delete
</button>

{/* Ghost icon button */}
<button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
  <MoreVertical className="size-4" />
</button>

{/* Filter chip button (active state) */}
<button className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-indigo-200">
  <SlidersHorizontal className="size-3" /> Filter
</button>

{/* Reset ghost */}
<button className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors">
  <RotateCcw className="size-3" /> Reset All
</button>
```

---

## 17. Inputs

```tsx
{/* Text input */}
<input
  type="text"
  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition"
/>

{/* Search input with icon */}
<div className="relative">
  <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
  <input
    type="text"
    placeholder="Search"
    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-60 shadow-2xs"
  />
</div>

{/* Select */}
<select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
  <option>Option 1</option>
</select>

{/* Textarea */}
<textarea
  rows={3}
  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
/>

{/* Checkbox */}
<input type="checkbox" className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />

{/* Radio */}
<input type="radio" className="border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
```

---

## 18. Dropdown / Context Menu

```tsx
{/* 192px-wide dropdown */}
<div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
  {/* Normal item */}
  <button className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left">
    <Eye className="size-3.5 text-indigo-600" />
    View Details
  </button>

  {/* Divider */}
  <div className="border-t border-slate-100 my-1" />

  {/* Danger item */}
  <button className="w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left">
    <Trash2 className="size-3.5" />
    Delete
  </button>
</div>
```

---

## 19. Icon Usage Rules

| Context | Size | strokeWidth |
|---|---|---|
| Table cell icons | `size-3` or `size-3.5` | 2 |
| KPI card (4-card) | `size-4.5` | 2 |
| KPI card (6-card) | `size-5` | 2 |
| Modal / drawer header | `size-5` | 2 |
| Sidebar nav item (active) | `size-4` | 2.5 |
| Sidebar nav item (inactive) | `size-4` | 2 |
| Topbar quick-tool | `size-3.5` | 2 |
| Button (inline icon) | `size-3.5` | 2 |
| Icon button | `size-4` | 2 |
| Column header 3-dot | `size-3.5` | 2 |

All icons from `lucide-react` only.

---

## 20. z-Index Stack

| Layer | z-index | Usage |
|---|---|---|
| Topbar | `z-30` | Sticky header |
| Sidebar | `z-20` | Left nav |
| Row action dropdown | `z-20` | `position: absolute` within table row |
| Page toolbar dropdown | `z-30` | Top-level overflow menu |
| Column header dropdown | `z-[9999]` (fixed via portal) | Escapes overflow clipping |
| Modal backdrop + panel | `z-50` | Dialogs |
| Slide-over drawer | `z-50` | Profile, detail drawers |

---

## 21. Animation Classes

```tsx
// Subtle fade — banners, modals
animate-in fade-in duration-150

// Dropdown menus, popovers — pop in
animate-in fade-in zoom-in-95 duration-100

// Filter bar slide down
animate-in slide-in-from-top-2 duration-200

// Modal entry
animate-in zoom-in-95 duration-200
```

---

## 22. Spacing Rules

| Context | Class |
|---|---|
| Page root content | `space-y-4` |
| Toolbar to KPI strip | `pt-2` on toolbar wrapper |
| KPI 4-card gap | `gap-3.5` |
| KPI 6-card gap | `gap-3` |
| Toolbar gap between items | `gap-2` |
| Modal body sections | `space-y-5` |
| Form fields inside modal | `space-y-4` |
| Inside a section card | `space-y-3` |
| Checkbox/Actions column padding | `py-3 px-4` |
| Data column padding | `py-3 px-3` |

---

## 23. Table State Management Pattern

Every domain table must manage this state locally:

```ts
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
const [rowsPerPage, setRowsPerPage] = useState(50);
const [currentPage, setCurrentPage] = useState(1);
const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);
```

Click-outside handler for row action menu (required in every table):
```tsx
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest(".row-action-menu-container")) {
      setActiveRowMenuId(null);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

---

## 24. Do's and Don'ts

### DO
- Wrap every page in `<AppShell>`
- Use `@/components/ui/data-table` primitives for all tables
- Pass `menuAlign="right"` for the last 3 table columns
- Use `createPortal` for dropdowns inside `overflow-hidden` / `overflow-x-auto` containers
- Add `.row-action-menu-container` class to row action menu wrappers
- Use `font-mono` for dates, codes, and currency
- Use `truncate max-w-[240px]` with `title` tooltip for long text cells
- Use `space-y-4` as page root
- Use `rounded-xl` for cards, `rounded-2xl` for tables and modals
- Use `shadow-xs` for table cards, `shadow-2xs` for KPI cards and inputs
- Use `text-xs` (12px) as table body base font

### DO NOT
- Add `border-collapse` to `<table>` — causes column border artifacts
- Add `border-r` / `border-l` / `divide-x` to table cells — only `divide-y` on `<tbody>`
- Use TypeScript `any`
- Build custom sort/filter logic — use `TableHeaderCell` + column state pattern
- Use `position: absolute` for dropdowns inside `overflow-hidden` containers — use portal
- Use Supabase Auth — auth is Clerk only
- Use `text-sm` in table cells — use `text-xs`
- Use raw Tailwind colors like `blue-500` when a design token from Section 1 exists
- Add custom layout shells — always use `<AppShell>`
- Place column sort logic outside the established `handleToggleColumnSort / handleSetSort / handleClearSort` pattern
