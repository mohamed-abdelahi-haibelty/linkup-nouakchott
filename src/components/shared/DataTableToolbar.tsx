"use client";

import { Table } from "@tanstack/react-table";
import { Loader2, Trash2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { deleteManyEvents } from "@/app/[locale]/actions/events/admin/deleteManyEvents";
import {
  getTableSearchValue,
  handleDeleteSelected,
  handleTableSearch,
} from "@/lib/tableUtils";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /** which columns should receive the search string (e.g. ["name","email","phone"]) */
  searchColumns?: string[];
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Faceted filters (status, role, ...) */
  filters?: {
    columnId: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  /**
   * deleteAction must accept an array of ids and return Promise<{message: string}>
   * e.g. async (ids) => api.deleteMany(ids)
   */
  deleteAction?: (ids: string[]) => Promise<{ message: string }>;
  /** Optional labels for the confirmation dialog */
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: string;
  deleteConfirmLabel?: string;
  deleteCancelLabel?: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  searchColumns = ["title"],
  searchPlaceholder = "Search...",
  deleteAction,
  deleteConfirmTitle = "Delete Selected Items",
  deleteConfirmDescription,
  deleteConfirmLabel = "Delete",
  deleteCancelLabel = "Cancel",
}: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const currentSearchValue = getTableSearchValue(table, searchColumns);

  const onSearchChange = (value: string) => {
    handleTableSearch(table, searchColumns, value);
  };

  const onConfirmDelete = async () => {
    if (!deleteAction) {
      console.warn("No deleteAction provided to DataTableToolbar");
      setOpen(false);
      return;
    }
    setLoading(true);
    await handleDeleteSelected(table, deleteAction);
    setLoading(false);
    setOpen(false);
  };

  const deleteTrigger = (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2 bg-destructive/70 hover:bg-destructive/75"
      disabled={selectedRows.length === 0}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Delete ({selectedRows.length})
    </Button>
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={currentSearchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters?.map(
          (filter) =>
            table.getColumn(filter.columnId) && (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div>
        {selectedCount > 0 && (
          <ConfirmDeleteDialog
            trigger={deleteTrigger}
            open={open}
            onOpenChange={setOpen}
            title={deleteConfirmTitle}
            description={
              deleteConfirmDescription ??
              `Are you sure you want to delete ${selectedCount} selected ${
                selectedCount === 1 ? "item" : "items"
              }?`
            }
            confirmLabel={deleteConfirmLabel}
            cancelLabel={deleteCancelLabel}
            loading={loading}
            onConfirm={onConfirmDelete}
          />
        )}
      </div>
    </div>
  );
}
