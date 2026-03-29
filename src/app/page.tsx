'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, BookOpen, ArrowRight, Zap, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Usuarios Activos', value: '1,200', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Posts Hoy', value: '85', icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Libros Disponibles', value: '24k', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="mx-auto max-w-7xl p-8 space-y-10">
      {/* SECCIÓN BIENVENIDA */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">¡Hola de nuevo, {user?.email.split('@')[0]}! 👋</h1>
        <p className="text-slate-500 font-medium">Aquí tienes un resumen de lo que está pasando en la plataforma hoy.</p>
      </section>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: ACCESOS DIRECTOS */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Accesos Directos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Link href="/posts">
                <Card className="group hover:bg-slate-900 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold group-hover:text-white transition-colors">Crear Nueva Publicación</p>
                      <p className="text-sm text-slate-500 group-hover:text-slate-400">Comparte tus ideas con la comunidad</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </CardContent>
                </Card>
             </Link>
             <Link href="/books">
                <Card className="group hover:bg-blue-600 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold group-hover:text-white transition-colors">Explorar Biblioteca</p>
                      <p className="text-sm text-slate-500 group-hover:text-blue-200">Busca entre millones de títulos</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </CardContent>
                </Card>
             </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA: ESTADO DEL SISTEMA */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" /> Seguridad
          </h2>
          <Card className="bg-slate-50 border-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                <p className="text-sm font-semibold">Sistemas Operativos</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tu sesión como <span className="font-bold">{user?.role}</span> te permite {user?.role === 'admin' ? 'gestionar todo el contenido' : 'ver usuarios y libros'}.
              </p>
              <div className="pt-2">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 w-[85%]" />
                </div>
                <p className="text-[10px] mt-1 text-slate-400 text-right">Integridad de datos: 85%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
