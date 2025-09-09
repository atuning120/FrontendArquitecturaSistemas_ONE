# FacTickets - Frontend

## 🎯 Funcionalidades Implementadas

### 👤 Cliente (Usuario Final)
- **Ver Eventos Disponibles** (`/available-events`)
  - Lista todos los eventos disponibles usando `GET /events`
  - Filtros por nombre, descripción y categoría
  - Modal para comprar tickets con cantidad seleccionable
  - Compra de tickets usando `POST /tickets/purchase`

- **Mis Tickets** (`/my-tickets`)
  - Visualiza todos los tickets comprados usando `GET /tickets/user/{userId}`
  - Agrupación por evento para mejor organización
  - Estado del evento (próximo/finalizado)
  - Detalles individuales de cada ticket
  - Total pagado por evento

### 🎭 Organizador de Eventos
- **Crear Evento** (`/create-event`)
  - Formulario completo para crear eventos usando `POST /events`
  - Selección de local disponible
  - Campos: nombre, categoría, fecha/hora, descripción, precio, capacidad, imagen
  - Validaciones y manejo de errores

- **Gestionar Eventos** (`/manage-events`)
  - Lista todos los eventos del organizador usando `GET /events/organizer/{organizerId}`
  - Edición inline con modal
  - Eliminación de eventos usando `DELETE /events/{id}`
  - Actualización usando `PUT /events/{id}`

### 🏢 Propietario de Local
- **Crear Local** (`/create-spot`)
  - Formulario para registrar nuevo local usando `POST /spots`
  - Campos: nombre y ubicación del local

- **Ver Eventos en mi Local** (`/spot-events`)
  - Lista eventos programados en locales del propietario
  - Usa `GET /spots/owner/{ownerId}` y `GET /events/spot/{spotId}`
  - Selector de local si tiene múltiples propiedades

## 🛠️ Configuración de API

Se creó un archivo de configuración centralizada en `src/config/api.js` con:
- URL base del backend
- Endpoints organizados por módulo
- Helper function para construir URLs

## 🚀 Características Técnicas

### Componentes Reutilizables
- `EventCard`: Componente para mostrar información de eventos de forma consistente

### Manejo de Estados
- Loading states con spinners
- Error handling con mensajes informativos
- Validación de formularios

### UX/UI
- Diseño responsive con Tailwind CSS
- Gradientes y efectos hover consistentes
- Modales para acciones importantes
- Navegación intuitiva entre páginas

### Integraciones con Backend
- Todas las llamadas a API del README del backend implementadas
- Manejo correcto de datos JSON
- Formato de precios en CLP
- Formato de fechas localizado a español

## 📋 Endpoints Utilizados

### Cliente:
- `GET /events` - Ver eventos disponibles
- `POST /tickets/purchase` - Comprar tickets
- `GET /tickets/user/{userId}` - Ver mis tickets

### Organizador:
- `POST /events` - Crear evento
- `GET /events/organizer/{organizerId}` - Ver mis eventos
- `PUT /events/{id}` - Actualizar evento
- `DELETE /events/{id}` - Eliminar evento
- `GET /spots` - Ver locales disponibles

### Propietario:
- `POST /spots` - Crear local
- `GET /spots/owner/{ownerId}` - Ver mis locales
- `GET /events/spot/{spotId}` - Ver eventos en mi local

## 🔄 Navegación

### Rutas Principales:
- `/client` - Dashboard del cliente
- `/event-owner` - Dashboard del organizador
- `/spot-owner` - Dashboard del propietario

### Rutas Funcionales:
- `/available-events` - Explorar eventos (cliente)
- `/my-tickets` - Mis tickets (cliente)
- `/create-event` - Crear evento (organizador)
- `/manage-events` - Gestionar eventos (organizador)
- `/create-spot` - Crear local (propietario)
- `/spot-events` - Ver eventos en local (propietario)

## 🎨 Diseño Visual

- **Colores principales**: Naranja (#f97316) y Rosa (#ec4899)
- **Tipografía**: System fonts con diferentes pesos
- **Efectos**: Gradientes, sombras suaves, transiciones smooth
- **Layout**: Responsive grid system, máxima anchura 7xl

## 🔧 Próximas Mejoras

- Implementar autenticación real (actualmente hardcodeado userId=1, organizerId=1, ownerId=1)
- Agregar paginación para listas largas
- Implementar búsqueda avanzada con más filtros
- Añadir funcionalidad de favoritos
- Generar QR codes para tickets
- Exportar tickets a PDF
- Notificaciones en tiempo real
- Upload de imágenes para eventos
