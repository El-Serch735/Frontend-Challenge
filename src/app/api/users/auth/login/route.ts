import { NextResponse } from 'next/server';

// Implementación de Refresh Token mediante Cookie HttpOnly para prevenir 
// ataques XSS y asegurar el manejo de persistencia de sesión.
// La ruta API `POST /api/users/auth/login` se encarga de manejar el proceso de autenticación de los usuarios. Verifica las credenciales recibidas en el cuerpo de la solicitud, y si son correctas, devuelve un token de acceso junto con la información del usuario. Además, establece una cookie de refresh token con las características de seguridad adecuadas.
export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === "eve.holt@reqres.in" && password === "cityslicka") {
    const response = NextResponse.json({
      token: "QpwL5tke4Pnpja7X4",
      user: { email, role: 'admin' }
    });

    // REQUISITO: Guardar refreshToken en HttpOnly, Secure, SameSite=Lax
    response.cookies.set('refreshToken', 'fake-refresh-token-123', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    return response;
  }

  return NextResponse.json({ error: 'User not found' }, { status: 400 });
}
