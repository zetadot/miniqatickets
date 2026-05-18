# Mini QA Tickets

Pequeño sitio web con API REST para practicar automatización funcional y API con Playwright.

## Requisitos

- Node.js 18 o superior recomendado
- npm

## Instalación

```bash
npm install
npm start
```

Abre la web en:

```text
http://localhost:3000
```

## Páginas incluidas

- `/index.html`: home con navegación e imágenes.
- `/tickets.html`: listado de tickets con búsqueda y filtros.
- `/ticket-detail.html?id=101`: detalle de un ticket.
- `/new-ticket.html`: formulario para crear tickets.
- `/api-docs.html`: documentación simple de la API.

## Endpoints API

Base URL:

```text
http://localhost:3000/api
```

### Health check

```http
GET /api/health
```

### Users

```http
GET /api/users
```

### Tickets

```http
GET /api/tickets
GET /api/tickets?status=Open
GET /api/tickets?priority=High
GET /api/tickets?q=login
GET /api/tickets/:id
POST /api/tickets
PATCH /api/tickets/:id
DELETE /api/tickets/:id
```

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New defect from API",
    "description": "Created with Playwright request context",
    "priority": "High",
    "project": "Automation Practice",
    "assigneeId": 1
  }'
```

## Ideas de práctica con Playwright

### Funcional UI

1. Verificar que la home carga y el botón `View tickets` navega al listado.
2. Filtrar tickets por estado `Open` y comprobar que todos los resultados tienen ese estado.
3. Buscar `login` y comprobar que aparece el ticket esperado.
4. Abrir el detalle de un ticket y validar título, estado, prioridad y asignado.
5. Crear un ticket desde el formulario y comprobar el mensaje de éxito.

### API

1. Comprobar que `GET /api/health` devuelve status `ok`.
2. Crear un ticket con `POST /api/tickets`.
3. Consultar el ticket creado con `GET /api/tickets/:id`.
4. Actualizar el estado con `PATCH /api/tickets/:id`.
5. Eliminar el ticket con `DELETE /api/tickets/:id`.

### Flujo combinado API + UI

1. Crear un ticket usando API.
2. Ir a `/tickets.html`.
3. Buscar el título del ticket creado.
4. Abrir el detalle desde la UI.
5. Validar que los datos coinciden con la respuesta de la API.
6. Eliminar el ticket por API al final del test.

## Nota sobre persistencia

Los datos se guardan en archivos JSON dentro de la carpeta `data`. Si quieres resetear el estado, puedes editar o restaurar `data/tickets.json`.
