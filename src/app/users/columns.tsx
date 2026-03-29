"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/services/users.service"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// El archivo `columns.tsx` define las columnas que se mostrarán en la tabla de usuarios.
// Cada columna tiene un `accessorKey` que corresponde a una propiedad del objeto `User`, y un `header` que es el título que se mostrará en la tabla. 
// La primera columna es una columna de selección múltiple para las acciones de Bulk Action, y la segunda columna muestra la foto del usuario utilizando el componente `Avatar`.
export const columns: ColumnDef<User>[] = [
  // Columna para Selección Múltiple (Bulk Actions)
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Foto",
    cell: ({ row }) => (
      <Avatar className="h-9 w-9">
        <AvatarImage src={row.getValue("avatar")} referrerPolicy="no-referrer" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "first_name",
    header: "Nombre",
  },
  {
    accessorKey: "last_name",
    header: "Apellido",
  },
  {
    accessorKey: "email",
    header: "Correo Electrónico",
  },
    {
    accessorKey: "role",
    header: "Rol",
  },
]
