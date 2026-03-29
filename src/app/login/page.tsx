'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/auth.service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { setCookie } from 'cookies-next';

// La página `LoginPage` es la vista de inicio de sesión de la aplicación.
export default function LoginPage() {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Utilizamos el hook `useRouter` para redirigir a los usuarios después de un login exitoso, y el hook `useAuthStore` para actualizar el estado de autenticación en Zustand.
  const router = useRouter();
  const setLogin = useAuthStore((state) => state.setLogin);

  // La función `handleSubmit` se encarga de manejar el evento de envío del formulario de login.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      // Guardamos en Zustand
      setLogin(data.user, data.token);
      setCookie('accessToken', data.token, { maxAge: 60 * 60 * 24 });  // 1 día de duración cookie
      // Redirigimos al dashboard (lo crearemos después)
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  // Renderizamos el formulario de login con campos para email y contraseña, un botón para enviar el formulario, y un mensaje de error si las credenciales son inválidas.
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">XDEVELOP Login</CardTitle>
          <CardDescription className="text-center">Prueba técnica Frontend</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
