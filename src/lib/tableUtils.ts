import { Table, type Row } from "@tanstack/react-table";
import { toast } from "sonner";

/**
 * Text-based filter: case-insensitive substring match.
 */
export const textIncludesFilter = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
) => {
  if (!filterValue) return true;
  const value = String(row.getValue(columnId) ?? "").toLowerCase();
  return value.includes(String(filterValue).toLowerCase());
};

/**
 * Multi-value filter: allows selecting multiple values (e.g., statuses)
 */
export const multiValueFilter = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string[],
) => {
  if (!filterValue || filterValue.length === 0) return true;
  const value = row.getValue(columnId);
  return filterValue.includes(String(value));
};

/**
 * Reusable handler for multi-column text search.
 */
export const handleTableSearch = <TData>(
  table: Table<TData>,
  searchColumns: string[],
  value: string,
) => {
  searchColumns.forEach((col) => {
    const column = table.getColumn(col);
    if (column) column.setFilterValue(value);
  });
};

/**
 * Get the current search input value from the first search column.
 */
export const getTableSearchValue = <TData>(
  table: Table<TData>,
  searchColumns: string[],
): string => {
  return (table.getColumn(searchColumns[0])?.getFilterValue() as string) ?? "";
};

/**
 * Delete selected rows (generic utility)
 */
export const handleDeleteSelected = async <TData>(
  table: Table<TData>,
  deleteAction: (ids: string[]) => Promise<{ message: string }>,
) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const ids = selectedRows.flatMap(({ original }) =>
    typeof original === "object" &&
    original !== null &&
    "id" in original &&
    typeof original.id === "string"
      ? [original.id]
      : [],
  );

  if (ids.length === 0) return;

  try {
    const res = await deleteAction(ids);
    toast.message(res.message);
    table.resetRowSelection();
  } catch {
    toast.error("Failed to delete selected items");
  }
};
