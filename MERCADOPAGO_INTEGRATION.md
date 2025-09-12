# Integración de MercadoPago - Configuración

## ⚠️ IMPORTANTE: Configuración requerida

### 1. Variables de entorno en el Frontend

**OBLIGATORIO**: Crea un archivo `.env` en la raíz del proyecto frontend (`FrontendArquitectuaSistemas_ONE/.env`) con:

```env
# Public Key de MercadoPago (obtenido desde tu cuenta de MercadoPago)
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui

# URL del backend
VITE_API_URL=http://localhost:8080
```

**⚠️ Sin este archivo, la aplicación mostrará errores de configuración.**

### 2. Variables de entorno en el Backend

Asegúrate de tener un archivo `.env` en la raíz del proyecto backend con:

```env
# Access Token de MercadoPago (obtenido desde tu cuenta de MercadoPago)
TEST_ACCESS_TOKEN=TEST-tu-access-token-aqui

# URI del frontend para redirecciones
FRONT_URI=http://localhost:5173
FRONT_URI_ALTERNATIVE=http://127.0.0.1:5173
```

### 3. Obtener credenciales de MercadoPago

1. Crear cuenta en [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Ir a "Tus integraciones" > "Crear aplicación"
3. Obtener las credenciales de prueba:
   - **Public Key** (para el frontend)
   - **Access Token** (para el backend)

## Flujo de compra integrado

### Antes (sin MercadoPago)
1. Usuario selecciona evento
2. Usuario ingresa cantidad de tickets
3. Se hace llamada directa a `/tickets/purchase`

### Ahora (con MercadoPago)
1. Usuario selecciona evento
2. Usuario ingresa cantidad de tickets
3. Se muestra componente de MercadoPago
4. El backend crea preferencia de pago
5. MercadoPago maneja el proceso de pago
6. Redirección automática después del pago

## Componentes modificados

### `AvailableEvents.jsx`
- Importa `MercadoPagoPayment`
- Modifica `PurchaseModal` para mostrar dos pasos:
  1. Selección de cantidad
  2. Pago con MercadoPago

### `MercadoPagoPayment.jsx` (nuevo)
- Maneja la integración con el SDK de MercadoPago
- Crea la preferencia de pago llamando al backend
- Renderiza el Wallet de MercadoPago
- Maneja estados de carga, error y éxito

## Endpoints utilizados

### Backend
- `POST /api/mercadopago/create-preference` - Crea preferencia de pago

### Datos enviados al backend
```json
{
  "eventId": 123,
  "userId": 456,
  "quantity": 2,
  "eventName": "Nombre del evento",
  "unitPrice": 5000,
  "totalAmount": 10000
}
```

### Respuesta del backend
```json
{
  "id": "preference-id-from-mercadopago"
}
```

## Errores comunes y soluciones

### 1. `process is not defined`
**Problema**: En Vite, `process.env` no está disponible como en Node.js  
**Solución**: Usar `import.meta.env` en su lugar ✅

### 2. `VITE_MERCADOPAGO_PUBLIC_KEY no está configurado`
**Problema**: Variable de entorno no configurada  
**Solución**: Crear archivo `.env` con tu Public Key de MercadoPago ✅

### 3. `SyntaxError: Unexpected non-whitespace character after JSON`
**Problema**: El backend devuelve texto plano en lugar de JSON  
**Solución**: El componente maneja tanto JSON como texto plano ✅

### 4. `Error creating payment preference`
**Problema**: Credenciales incorrectas en el backend  
**Solución**: Verificar archivo `.env` del backend con ACCESS_TOKEN válido

## Notas importantes

1. **Modo sandbox**: Las credenciales TEST funcionan solo para pruebas
2. **Redirecciones**: Después del pago, MercadoPago redirige a `/available-events`
3. **Validación**: El backend valida que las credenciales estén configuradas
4. **Errores**: Se muestran mensajes de error claros al usuario
5. **Responsivo**: La interfaz se adapta a dispositivos móviles

## Próximos pasos (opcional)

1. Implementar webhook para confirmar pagos
2. Actualizar estado de tickets después del pago
3. Enviar confirmación por email
4. Manejar reembolsos
5. Implementar modo producción con credenciales reales