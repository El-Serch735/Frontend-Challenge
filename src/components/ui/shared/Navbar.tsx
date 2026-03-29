'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { deleteCookie } from 'cookies-next';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

// El componente `Navbar` es una barra de navegación que se muestra en la parte superior de la aplicación. 
// Utiliza el estado de autenticación para mostrar u ocultar la barra y redirigir a los usuarios según su estado de login. 
// La barra incluye enlaces a diferentes secciones de la aplicación (Inicio, Usuarios, Posts, Libros) y un área de usuario con su email, rol y un botón para cerrar sesión.
export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  //  La función `handleLogout` se encarga de cerrar la sesión del usuario.
  const handleLogout = () => {
    logout();
    deleteCookie('accessToken');
    router.push('/login');
  };

  if (!isAuthenticated || pathname === '/login') return null;

  // Definimos los elementos de navegación con sus respectivos nombres, rutas e iconos.
  const navItems = [
    { name: 'Inicio', href: '/', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Posts', href: '/posts', icon: FileText },
    { name: 'Libros', href: '/books', icon: BookOpen },
  ];

  // Renderizamos la barra de navegación con los enlaces y el área de usuario.
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-blue-600">XDEVELOP</Link>
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" /> {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border">
            <UserIcon className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">{user?.email}</span>
            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full uppercase">{user?.role}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
