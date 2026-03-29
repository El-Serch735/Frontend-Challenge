import { NextResponse } from 'next/server';

// La ruta API `GET /api/users` se encarga de obtener los usuarios desde la API externa, transformarlos al formato requerido por la aplicación, y devolverlos con la estructura de paginación intacta.
export async function GET(request: Request) {
  const apiKey = process.env.API_Key;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }
  const res = await fetch(
  "https://reqres.in/api/collections/users/records?project_id=7077",
  { headers: { "x-api-key": apiKey } }
);
// 1. OBTENCIÓN: Obtenemos los datos de la API externa utilizando `fetch` y el API key almacenado en las variables de entorno.
const realData = await res.json();
console.log('Respuesta de la API:', realData);
 // 2. TRANSFORMACIÓN: Mapeamos los datos al formato que queremos
    const transformedUsers = realData.data.map((item: any) => ({
      // Si el id viene en el objeto 'data', lo usamos, si no, el del nivel superior
      id: item.data?.id || item.id, 
      email: item.data?.email || "sin@correo.com",
      first_name: item.data?.first_name || "Usuario",
      last_name: item.data?.last_name || "Sin Apellido",
      avatar: item.data?.avatar || "https://reqres.in/img/faces/1-image.jpg",
      // REQUISITO: Inyectamos el rol manualmente para la prueba
      role: Math.random() > 0.5 ? 'admin' : 'user' 
    }));
    console.log('Usuarios transformados:', transformedUsers);

    // 3. Devolvemos la estructura de paginación intacta
    return NextResponse.json({
      page: realData.meta.page,
      per_page: realData.meta.limit,
      total: realData.meta.total,
      total_pages: realData.meta.pages,
      data: transformedUsers,
    });
}
