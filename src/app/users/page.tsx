"use client"

import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/services/users.service"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useState, useEffect } from "react";
import { exportToCsv } from "@/lib/exportCsv";
import { Download } from "lucide-react"; // Importa el icono

// La página `UsersPage` es la vista principal para la gestión de usuarios.
// Utiliza React Query para obtener los datos de los usuarios desde la API, y mantiene un estado local para manejar las acciones de Bulk Action (eliminar y cambiar rol) sin afectar la fuente de datos original. 
// La página también incluye un botón para exportar los usuarios a un archivo CSV, y un botón para cerrar sesión que limpia el token de autenticación y redirige al login.
export default function UsersPage() {
  const [page, setPage] = useState(1)
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
  })

      // Sincroniza los datos de la API con el estado local cuando cambie la página
  useEffect(() => {
    if (data?.data) setLocalUsers(data.data);
  }, [data]);

  const handleLogout = () => {
    logout()
    deleteCookie("accessToken")
    router.push("/login")
  }

  // Simulación de Bulk Action
  // Las funciones `handleDeleteSelected` y `handleChangeRoleSelected` simulan las acciones de eliminar usuarios seleccionados y cambiar su rol, respectivamente. 
// Estas funciones actualizan el estado local `localUsers` para reflejar los cambios sin modificar la fuente de datos original, y muestran una alerta indicando cuántos usuarios han sido afectados por la acción.
  const handleDeleteSelected = (rows: any[]) => {
    const idsToDelete = rows.map(r => r.id);
    setLocalUsers(prev => prev.filter(user => !idsToDelete.includes(user.id)));
    alert(`Se han eliminado ${rows.length} usuarios de la vista local.`);
  };

  const handleChangeRoleSelected = (rows: any[]) => {
    const idsToChange = rows.map(r => r.id);
    setLocalUsers(prev => prev.map(user => 
      idsToChange.includes(user.id) 
        ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' } 
        : user
    ));
    alert(`Se ha cambiado el rol de ${rows.length} usuarios.`);
  };

  if (isLoading) return <div className="p-10 text-center">Cargando tabla...</div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground text-sm">
            Administra los usuarios y sus permisos aquí.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
      </div>
      <div className="flex gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
        onClick={() => exportToCsv(data?.data || [], "reporte-usuarios")}
      >
        <Download className="h-4 w-4" /> Exportar CSV
      </Button>
    </div>

      {/* La Tabla con Búsqueda por nombre y Bulk Actions */}
      <DataTable 
        columns={columns} 
        data={localUsers} // <-- Usamos el estado local que sí se puede modificar
        searchKey="first_name" 
        onDeleteSelected={handleDeleteSelected}
        onChangeRoleSelected={handleChangeRoleSelected}
      />

      {/* REQUISITO: Paginación Real */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <div className="text-sm font-medium">
          Página {page} de {data?.total_pages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (data?.total_pages || 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
