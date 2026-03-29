import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Se utiliza Middleware para validación de sesión en el Edge, 
// garantizando que las rutas privadas no se rendericen sin un token válido.
export function middleware(request: NextRequest) { // Middleware para proteger rutas y redirigir según el estado de autenticación
  const token = request.cookies.get('accessToken')?.value; // Verificamos si el token de autenticación existe en las cookies
  const isAuthPage = request.nextUrl.pathname === '/login'; // Verificamos si el usuario está intentando acceder a la página de login

  // 1. Si no hay token y quiere entrar a una ruta protegida -> Al Login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Si ya hay token e intenta ir al login -> Al Dashboard (/users)
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. ver los posts sin estar logueado -> Al Login
  if (!token && request.nextUrl.pathname.startsWith('/posts')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configura qué rutas debe vigilar el middleware
export const config = {
  matcher: ['/users/:path*', '/posts/:path*', '/books/:path*', '/login'],
};
