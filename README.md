# XDEVELOP Frontend Challenge - Sistema Integral de Gestión

Este proyecto es una solución robusta desarrollada para el reto técnico de **XDEVELOP**, enfocada en la escalabilidad, seguridad y una experiencia de usuario (UX) moderna.

## Stack Tecnológico
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript (Tipado estricto)
- **Estado Global:** Zustand (con persistencia de sesión)
- **Data Fetching:** TanStack Query v5 (Optimistic Updates & Cache Management)
- **Tablas:** TanStack Table v8
- **Estilos:** Tailwind CSS + Shadcn UI (Radix UI)
- **Seguridad:** Middleware de Next.js + Cookies (HttpOnly para Refresh Token)
- **Testing:** Vitest

## Características Principales
1. **Autenticación Avanzada:** Flujo de login con persistencia en Cookies y Zustand. Protección de rutas mediante Middleware.
2. **Gestión de Usuarios (ReqRes API):** Tabla dinámica con paginación real, búsqueda en frontend, filtrado por roles y exportación a **CSV**.
3. **Muro de Posts (JSONPlaceholder):** Relaciones de datos (Post > Comentarios) y **Actualizaciones Optimistas** (el post aparece/se edita al instante antes de la respuesta del servidor).
4. **Biblioteca Digital (Open Library):** Buscador con filtros por autor/año, paginación y detalle de libro mediante **Drawer**.
5. **Sistema de Roles:** Acceso granular. Solo usuarios con rol `admin` pueden crear o editar contenido.

## Archivo .env
Para el caso de la api reqres.in se necesita una API_Key = Api_key, para poder acceder a la lista de usuarios. en este caso la página proporciono una lista corta de usuarios.

## Instalación y Uso
1. Clonar el repositorio: `git clone https://github.com/El-Serch735/Frontend-Challenge.git`
2. Instalar dependencias: `npm install`
3. Ejecutar en desarrollo: `npm run dev`
4. Ejecutar pruebas unitarias: `npm test`

## Justificación Técnica
- **Proxy de Imágenes:** Se implementó un API Route para servir las imágenes de ReqRes y Open Library, evitando bloqueos de **CORS/CORP** y mejorando la seguridad.
- **Optimistic UI:** Se utilizó TanStack Query para simular una respuesta inmediata en el CRUD de posts, mejorando la percepción de velocidad del usuario.
- **Arquitectura Limpia:** Separación estricta de servicios (APIs), stores (Zustand), componentes de UI y lógica de negocio (hooks).
- **Zustand vs Redux:** Se eligió Zustand por su ligereza y facilidad de integración con el middleware de persistencia, ideal para el manejo de sesiones en Next.js.

## Usuario de Prueba (Admin)
- **Email:** `eve.holt@reqres.in`
- **Password:** `cityslicka`
*(Este usuario inicia sesión con rol de Administrador por defecto)*
