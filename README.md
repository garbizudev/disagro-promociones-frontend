# Disagro Promociones — Frontend

Formulario público para que los clientes de Disagro confirmen su asistencia al evento anual de promociones y seleccionen los servicios/productos de su interés, más un panel administrativo para el equipo de ventas.

## Demo desplegada

- **Aplicación:** https://disagro-promociones-frontend.onrender.com
- **Panel administrativo:** https://disagro-promociones-frontend.onrender.com/admin/login

### Credenciales de prueba (admin)

```
usuario:    admin
contraseña: Disagro2026!
```

> El servicio está en el plan free de Render: si nadie lo usa por un rato, "duerme" y la primera petición puede tardar unos segundos en responder mientras despierta.

## Stack

- [Vite](https://vite.dev/) + React + TypeScript
- [React Router](https://reactrouter.com/) para las rutas
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) para formularios y validación
- CSS plano (sin librería de UI), responsive (mobile/tablet/desktop)

## Funcionalidad

**Formulario público (`/`)**
- Paso 1: datos del cliente (nombre, apellidos, email, número de documento, fecha del evento)
- Paso 2: búsqueda y selección de servicios/productos, con preview en vivo del % de descuento
- Envía todo en una sola confirmación; recibe y guarda un token de sesión de invitado

**Panel administrativo (`/admin`, requiere login en `/admin/login`)**
- **Confirmaciones**: listado con filtros (nombre/correo/documento, fecha) y paginación
- **Productos y Servicios**: catálogo con creación, edición, activar/desactivar (slide-over lateral)
- **Eventos**: gestión de las fechas disponibles para que el cliente elija al confirmar

## Requisitos previos

- Node.js `20.19+`
- El backend corriendo (local o desplegado) — ver [disagro-promociones-backend](https://github.com/garbizudev/disagro-promociones-backend)

## Configuración local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz con la URL del backend:

   ```
   VITE_API_URL=http://localhost:3000
   ```

## Scripts disponibles

```bash
npm run dev       # servidor de desarrollo (http://localhost:5173)
npm run build     # build de producción en dist/
```

## Docker

A diferencia del backend, `VITE_API_URL` se usa **al momento del build** (Vite la incrusta en el JS compilado), no en tiempo de ejecución. Por eso se pasa como *build argument*:

```bash
docker build --build-arg VITE_API_URL=https://disagro-promociones-backend.onrender.com -t disagro-frontend .
docker run -d -p 8080:80 disagro-frontend
```

La imagen compila el proyecto y sirve los archivos estáticos resultantes con Nginx (configurado para que las rutas de React Router funcionen al recargar la página).

## Proyecto relacionado

Backend: [disagro-promociones-backend](https://github.com/garbizudev/disagro-promociones-backend)
