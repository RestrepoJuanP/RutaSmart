# 🚐 RutaSmart - Guía de Uso

## 📋 Descripción General

RutaSmart es una aplicación completa de gestión de transporte escolar con dos interfaces principales:
1. **App Conductor**: Para conductores y propietarios de vehículos
2. **App Acudiente**: Para padres y madres de familia

## 🎯 Cuentas de Demostración

La aplicación viene con datos de demostración precargados. Puedes iniciar sesión con estas cuentas:

### 👨‍✈️ Cuenta Conductor
- **Email**: `conductor@demo.com`
- **Contraseña**: `demo123`

### 👨‍👩‍👧 Cuenta Padre/Acudiente
- **Email**: `padre@demo.com`
- **Contraseña**: `demo123`

## 🚀 Funcionalidades Implementadas

### App Conductor (Módulos completos)

#### 1. **Dashboard Principal**
- Resumen de estudiantes activos
- Confirmaciones de asistencia del día
- Estadísticas en tiempo real
- Acceso rápido a todas las secciones

#### 2. **Gestión de Estudiantes** (HU-002)
- ✅ Agregar estudiantes con información completa
- ✅ Editar datos de estudiantes
- ✅ Desactivar/eliminar estudiantes
- ✅ Geocodificación automática de direcciones

#### 3. **Confirmación de Asistencia** (HU-003)
- ✅ Sistema de confirmación diaria
- ✅ Estados: Confirmado / No asistirá / Pendiente
- ✅ Estadísticas en tiempo real
- ✅ Filtrado por estado

#### 4. **Verificación de Abordaje** ⭐ NUEVO
- ✅ Registro de abordaje (mañana/tarde)
- ✅ Marcar: Abordó / Descendió / Ausente
- ✅ Hora de abordaje y descenso
- ✅ Estadísticas de la ruta activa

#### 5. **Ruta Optimizada** (HU-004)
- ✅ Algoritmo de optimización (vecino más cercano)
- ✅ Visualización de paradas ordenadas
- ✅ Cálculo de distancias y tiempos
- ✅ Solo muestra estudiantes confirmados

#### 6. **Finanzas** ⭐ NUEVO
- ✅ Registro de ingresos y gastos
- ✅ Categorización: Combustible, peajes, mantenimiento, etc.
- ✅ Gráficos de resumen mensual
- ✅ Balance: Ingresos vs Gastos
- ✅ Filtros por mes y categoría

#### 7. **Mantenimiento de Vehículos** ⭐ NUEVO
- ✅ Historial de mantenimientos
- ✅ Registro de servicios: Aceite, revisión, llantas, frenos
- ✅ Control de documentos: SOAT, tecnomecánica, seguro
- ✅ Alertas de vencimiento con colores:
  - 🟢 Verde: Más de 30 días
  - 🟡 Amarillo: 15-30 días
  - 🔴 Rojo: Vencido

#### 8. **Sistema de Notificaciones** ⭐ NUEVO
- ✅ Alertas de mantenimiento
- ✅ Notificaciones de pagos
- ✅ Alertas de ruta y retrasos
- ✅ Marcar como leído/no leído
- ✅ Contador de notificaciones sin leer

### App Acudiente (Módulos completos)

#### 1. **Dashboard de Padres** ⭐ NUEVO
- ✅ Vista de todos los hijos registrados
- ✅ Estado del recorrido en tiempo real:
  - 🟡 En ruta
  - 🟢 Abordó
  - 🔵 Llegó a destino
  - ⚪ No asiste
- ✅ Estado de facturas del mes
- ✅ Acceso rápido a seguimiento y pagos

#### 2. **Seguimiento en Tiempo Real** ⭐ NUEVO
- ✅ Mapa con ubicación del transporte (simulado)
- ✅ Línea de tiempo de eventos del día
- ✅ Información del estudiante y conductor
- ✅ Estimación de distancia y tiempo
- ✅ Botón para contactar al conductor

#### 3. **Facturas y Pagos** ⭐ NUEVO
- ✅ Lista de facturas por mes
- ✅ Estados con chips de color:
  - 🟢 Pagado
  - 🟡 Pendiente
  - 🔴 Vencido
- ✅ Detalle de cada factura
- ✅ Botón "Pagar ahora" (UI lista para integración)
- ✅ Descarga de comprobantes (simulado)
- ✅ Filtro por estudiante (si tiene varios hijos)

#### 4. **Notificaciones** ⭐ NUEVO
- ✅ Alertas de abordaje y descenso
- ✅ Notificaciones de pagos
- ✅ Comunicados del conductor
- ✅ Marcar como leído
- ✅ Filtro: Todas / No leídas

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Azul (#2A6DF4)**: Acciones principales, navegación
- **Verde (#34C759)**: Estados exitosos, confirmaciones
- **Amarillo (#FFCC00)**: Advertencias, pendientes
- **Rojo (#FF3B30)**: Alertas críticas, vencidos
- **Gris (#F5F7FA)**: Fondos y elementos secundarios

### Componentes Reutilizables
- **StatusChip**: Chips de estado con colores consistentes
- **Tarjetas**: Diseño uniforme con bordes redondeados y sombras
- **Navegación**: Responsive con menú inferior en móvil
- **Formularios**: Inputs consistentes con validación

## 🔄 Flujo de Uso Recomendado

### Para Conductores:
1. **Inicio de sesión** → Dashboard
2. **Registrar vehículo** (si es nuevo)
3. **Agregar estudiantes** con sus direcciones
4. **Confirmar asistencia** cada día
5. **Verificar abordaje** al recoger estudiantes
6. **Ver ruta optimizada** para el día
7. **Registrar gastos** en Finanzas
8. **Programar mantenimientos** en Mantenimiento

### Para Acudientes:
1. **Inicio de sesión** → Dashboard de Padres
2. **Ver estado** del recorrido de sus hijos
3. **Seguir en tiempo real** la ubicación
4. **Revisar facturas** pendientes
5. **Revisar notificaciones** de eventos importantes

## 💡 Características Técnicas

- ✅ **Persistencia Local**: Todos los datos se guardan en localStorage
- ✅ **Optimización de Rutas**: Algoritmo de vecino más cercano
- ✅ **Responsive**: Funciona en móvil, tablet y desktop
- ✅ **TypeScript**: Type-safety en toda la aplicación
- ✅ **Tailwind CSS v4**: Estilos modernos y consistentes
- ✅ **React Router**: Navegación fluida entre páginas
- ✅ **Recharts**: Gráficos interactivos para finanzas

## 🚧 Notas de Implementación

### Funcionalidades Simuladas (Listas para integración):
- 📍 Mapa GPS en tiempo real (muestra placeholder)
- 💳 Pasarela de pagos (botón UI listo)
- 📱 Notificaciones push (sistema lógico implementado)
- 📞 Llamadas telefónicas (botón con número)

### Próximos Pasos Sugeridos:
1. **Integrar Google Maps API** para mapas reales
2. **Conectar con Supabase** para persistencia en la nube
3. **Implementar pasarela de pagos** (Stripe, PayU, etc.)
4. **Agregar notificaciones push** con Firebase
5. **Implementar autenticación con OTP** por SMS

## 📱 Navegación

### Conductor:
- **Inicio**: Dashboard con resumen
- **Estudiantes**: Gestión de lista
- **Asistencia**: Confirmaciones diarias
- **Abordaje**: Verificación en ruta
- **Ruta**: Mapa optimizado
- **Finanzas**: Control de ingresos/gastos
- **Mantenimiento**: Vehículo y documentos
- **Alertas**: Notificaciones

### Acudiente:
- **Inicio**: Dashboard familiar
- **Seguimiento**: GPS en tiempo real
- **Facturas**: Pagos y comprobantes
- **Alertas**: Notificaciones
- **Perfil**: Información personal

## 🎓 Consejos de Uso

1. **Explora con las cuentas demo** para ver datos precargados
2. **Crea tus propias cuentas** para empezar desde cero
3. **Los datos se persisten** en tu navegador (localStorage)
4. **Limpia localStorage** para reiniciar la demo

## 🌟 Destacados de UX

- ✨ **Feedback visual inmediato** en todas las acciones
- ✨ **Colores consistentes** según el tipo de información
- ✨ **Navegación intuitiva** con íconos descriptivos
- ✨ **Estados vacíos informativos** con CTAs claros
- ✨ **Responsive design** para todos los dispositivos

---

**Desarrollado como MVP de RutaSmart** 🚐
_Optimización inteligente para transporte escolar_
