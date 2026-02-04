# Backlog - RutaSmart
Aplicación para optimización de rutas y gestión integral para conductores de transporte escolar.

## Método de Priorización: MoSCoW

## Historias de Usuario

### MUST HAVE (Sprint 1 - MVP Crítico)

**HU-001 - Registro de usuarios y vehículos**
**Como:** conductor de transporte escolar
**Quiero:** crear mi perfil con datos básicos y registrar mi vehículo
**Para:** poder acceder a todas las funcionalidades de la app con mi información configurada.
**Criterios de Aceptación:**
- [ ] Formulario con campos: nombre, teléfono, email, contraseña
- [ ] Formulario para registrar vehículo: placa, modelo, capacidad de pasajeros
- [ ] Los datos se guardan y pueden editarse después

**HU-002 - Gestión básica de estudiantes**
**Como:** conductor
**Quiero:** agregar, editar y eliminar estudiantes de mi ruta
**Para:** tener un listado actualizado de todos los niños que debo recoger.
**Criterios de Aceptación:**
- [ ] Formulario por estudiante: nombre, dirección, teléfono del acudiente
- [ ] Lista visible de todos los estudiantes
- [ ] Opciones para editar o marcar como inactivo

**HU-003 - Sistema de confirmación diaria de asistencia**
**Como:** conductor o guía
**Quiero:** que los padres puedan confirmar cada día si su hijo usará el servicio
**Para:** saber exactamente a quién debo recoger y optimizar mi ruta.
**Criterios de Aceptación:**
- [ ] Los padres reciben notificación diaria (app o SMS)
- [ ] Estado claro: confirmado / no asistirá
- [ ] Vista al conductor con lista filtrada por confirmados

**HU-004 - Visualización de ruta optimizada en mapa**
**Como:** conductor
**Quiero:** ver en un mapa la ruta optimizada con las paradas de los estudiantes confirmados
**Para:** seguir la ruta más eficiente sin tener que planificarla manualmente.
**Criterios de Aceptación:**
- [ ] Integración con mapa (Google Maps/Mapbox)
- [ ] Las paradas se ordenan automáticamente para menor distancia/tiempo
- [ ] Puedo iniciar navegación desde la app

### SHOULD HAVE (Sprint 2 o posterior)

**HU-005 - Registro básico de pagos**
**Como:** conductor
**Quiero:** registrar cuando un estudiante ha pagado el servicio mensual
**Para:** llevar control digital de quién está al día en los pagos.
**Criterios de Aceptación:**
- [ ] Marcar estudiante como "pagado" con fecha y monto
- [ ] Indicador visual (✓) en la lista de estudiantes
- [ ] Filtro por estado de pago

**HU-006 - Recordatorios de mantenimiento básico**
**Como:** conductor
**Quiero:** registrar cuándo hago mantenimiento al vehículo
**Para:** tener un historial y saber cuándo toca el próximo cambio de aceite.
**Criterios de Aceptación:**
- [ ] Formulario para registrar tipo de mantenimiento, fecha y kilometraje
- [ ] Recordatorio configurable para próximo cambio de aceite (ej. cada 5,000 km)
- [ ] Lista histórica de mantenimientos

### COULD HAVE (Mejoras posteriores)

**HU-007 - Registro de gastos de operación**
**Como:** conductor
**Quiero:** anotar mis gastos de gasolina, peajes y otros
**Para:** tener un control mensual de mis egresos.
**Criterios de Aceptación:**
- [ ] Formulario simple: fecha, concepto, monto
- [ ] Sumatoria mensual de gastos
- [ ] Gráfico básico de categorías

**HU-008 - Notificaciones para padres**
**Como:** padre/madre de familia
**Quiero:** recibir notificaciones cuando el transporte esté cerca
**Para:** preparar a mi hijo para la salida.
**Criterios de Aceptación:**
- [ ] Padres pueden optar por notificaciones
- [ ] Notificación automática cuando conductor está a 10-15 minutos

### WON'T HAVE (Por ahora - futuras versiones)

**HU-009 - Pago electrónico integrado**
**Como:** conductor
**Quiero:** que los padres puedan pagar directamente por la app
**Para:** automatizar completamente el proceso de cobro.
*(Complejidad regulatoria y de integración financiera - para versión 2.0)*

**HU-010 - Sistema de calificación de conductores**
**Como:** padre/madre
**Quiero:** calificar el servicio del conductor
**Para:** generar confianza en la comunidad.
*(Requiere módulo completo de reseñas - para versión futura)*

## Tablero Kanban
Enlace al [Projects de GitHub](https://github.com/tu-usuario/tu-repositorio/projects/1) donde se gestiona el progreso de estas historias.

---

**Nota:** Este backlog es vivo y se priorizará/revisará al final de cada sprint.
