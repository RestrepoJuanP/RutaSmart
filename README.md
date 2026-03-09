# Gestión de Vehículos

Este módulo implementa la **Historia de Usuario HU-003 – Registro y visualización de vehículos** para el sistema RutaSmart. Permite a un conductor registrar sus vehículos y consultar el listado de los mismos para mantener organizada la información operativa del servicio.

## Historia de Usuario

**HU-003 – Registro y visualización de vehículos**

**Connextra:**  
Como conductor, quiero registrar y visualizar mis vehículos, para mantener organizada la información operativa del servicio.

## Descripción

El módulo permite que un conductor autenticado registre vehículos en el sistema y consulte el listado de los vehículos asociados a su cuenta. La información se almacena en la base de datos y se presenta en una interfaz web desarrollada con Django y Bootstrap.

Cada vehículo registra información básica como:

- Placa
- Marca
- Línea
- Modelo
- Color
- Número de asientos
- Tipo de combustible
- Tipo de transmisión
- Cilindraje

## Funcionalidades implementadas

- Registro de vehículos por parte del conductor.
- Almacenamiento de la información en la base de datos.
- Visualización del listado de vehículos registrados por el conductor.
- Validación de datos y manejo de errores en el registro.

## Registro de vehículo

A través de un formulario web, el conductor puede ingresar los datos del vehículo para registrarlo en el sistema.

![Registro de vehículo](imagenes/Captura%20de%20pantalla%202026-03-09%20122119.png)
![Registro de vehículo](imagenes/Captura%20de%20pantalla%202026-03-09%20122129.png)

## Listado de vehículos

El sistema muestra todos los vehículos asociados al conductor autenticado en una vista de listado.

![Listado de vehículos](imagenes/Captura%20de%20pantalla%202026-03-09%20122452.png)

## Criterios de aceptación

### Escenario 1 – Registro de vehículo

**Dado** que el conductor ha iniciado sesión,  
**Cuando** registra un vehículo con placa, modelo y capacidad válidos,  
**Entonces** el sistema debe guardar el vehículo en la base de datos.

### Escenario 2 – Visualización de vehículos

**Dado** que el conductor consulta su módulo de vehículos,  
**Cuando** accede al listado de vehículos,  
**Entonces** el sistema debe mostrar todos los vehículos asociados a su cuenta.

### Escenario 3 – Manejo de errores

**Dado** que un usuario intenta registrar un vehículo,  
**Cuando** el usuario no está asociado a un conductor o deja campos obligatorios sin completar,  
**Entonces** el sistema debe mostrar un mensaje de error y no guardar la información en la base de datos.
