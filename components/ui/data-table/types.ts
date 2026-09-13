export interface ColumnDef {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  menuAlign?: "left" | "right";
}

export interface ColumnSort {
  key: string;
  direction: "asc" | "desc";
}
