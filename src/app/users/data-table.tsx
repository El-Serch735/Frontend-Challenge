"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

// El componente `DataTable` es un componente genérico que recibe columnas, datos, una clave de búsqueda y funciones para manejar acciones de eliminación y cambio de rol.
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// La interfaz `DataTableProps` define las propiedades que el componente `DataTable` espera recibir, incluyendo las columnas, los datos, la clave de búsqueda y las funciones para manejar las acciones de Bulk Action (eliminar y cambiar rol).
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onDeleteSelected?: (rows: TData[]) => void;
  onChangeRoleSelected?: (rows: TData[]) => void;
}

// El componente `DataTable` utiliza React Table para manejar la lógica de la tabla, incluyendo la filtración y selección de filas.
// El estado local `columnFilters` se utiliza para manejar los filtros de las columnas, mientras que `rowSelection` maneja la selección de filas. 
// El componente también incluye un buscador que filtra los datos según la clave de búsqueda proporcionada, y muestra botones de Bulk Action cuando hay filas seleccionadas.
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onDeleteSelected,
  onChangeRoleSelected,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // 🔥 Filas seleccionadas reales
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="space-y-4">

      {/* 🔍 Buscador + Bulk Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">

        {/* Búsqueda */}
        <Input
          placeholder={`Buscar por ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteSelected?.(selectedRows)}
            >
              Eliminar ({selectedRows.length})
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onChangeRoleSelected?.(selectedRows)}
            >
              Cambiar rol
            </Button>
          </div>
        )}
      </div>

      {/* 🧱 Tabla */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}