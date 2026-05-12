# 🚍 RutaSmart

Sistema web inteligente para la gestión de rutas de transporte escolar desarrollado con Django.

RutaSmart centraliza la administración de estudiantes, conductores, vehículos, rutas escolares, pagos y finanzas en una sola plataforma. Además, incorpora funcionalidades de Inteligencia Artificial con OpenAI para generar descripciones automáticas y recomendaciones inteligentes de rutas.

---

# 📌 Tabla de contenido

- [Características principales](#-características-principales)
- [Arquitectura del proyecto](#-arquitectura-del-proyecto)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Módulos del sistema](#-módulos-del-sistema)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación y configuración](#-instalación-y-configuración)
- [Variables de entorno](#-variables-de-entorno)
- [Ejecución del proyecto](#-ejecución-del-proyecto)
- [Roles del sistema](#-roles-del-sistema)
- [Integración con IA](#-integración-con-ia)
- [Flujo general de uso](#-flujo-general-de-uso)
- [Comandos útiles](#-comandos-útiles)
- [Problemas comunes](#-problemas-comunes)
- [Buenas prácticas implementadas](#-buenas-prácticas-implementadas)
- [Mejoras futuras sugeridas](#-mejoras-futuras-sugeridas)
- [Autores](#-autores)

---

# ✨ Características principales

✅ Sistema de autenticación personalizado por roles.

✅ Gestión de estudiantes y acudientes.

✅ Administración de conductores y vehículos.

✅ Creación y organización de rutas escolares.

✅ Gestión financiera y control de gastos.

✅ Carga y validación de comprobantes de pago.

✅ Generación automática de descripciones de rutas con IA.

✅ Sistema de recomendación inteligente de rutas usando embeddings.

✅ Arquitectura modular basada en aplicaciones Django.

---

# 🏗 Arquitectura del proyecto

El proyecto sigue una arquitectura monolítica modular basada en Django Apps.

Cada módulo encapsula una funcionalidad específica del sistema:

| Aplicación | Responsabilidad |
|---|---|
| `accounts` | Usuarios, autenticación y roles |
| `students` | Gestión de estudiantes |
| `conductor` | Información de conductores |
| `vehiculo` | Administración de vehículos |
| `ruta` | Gestión de rutas escolares |
| `pagos` | Subida de comprobantes |
| `finanzas` | Gestión financiera y validaciones |
| `ia` | Integración con OpenAI y embeddings |

---

# 🧰 Tecnologías utilizadas

## Backend

- Python 3.11+
- Django 5+
- SQLite3
- OpenAI API

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript

## Inteligencia Artificial

- GPT-4o-mini
- DALL·E 3
- text-embedding-3-small

---

# 📦 Módulos del sistema

## 🔐 Accounts

Sistema de autenticación personalizado basado en correo electrónico.

Incluye:

- Login
- Logout
- Gestión de roles
- Dashboard según el tipo de usuario

Roles implementados:

- Administrador
- Conductor
- Padre/Estudiante

---

## 👨‍🎓 Students

Permite administrar estudiantes registrados dentro del sistema.

Funciones:

- Registrar estudiantes
- Editar información
- Desactivación lógica
- Gestión de acudientes
- Asociación con usuarios

---

## 🚐 Vehículo

Administra la flota vehicular.

Funciones:

- Registro de vehículos
- Asociación conductor ↔ vehículo
- Gestión de combustible
- Gestión de transmisión
- Validaciones básicas

---

## 🛣 Ruta

Módulo principal para administración de rutas escolares.

Funciones:

- Crear rutas
- Definir colegio destino
- Organizar paradas
- Asignar estudiantes
- Ordenar recorridos

---

## 💰 Finanzas

Módulo financiero del sistema.

Funciones:

- Registro de gastos
- Gestión de categorías
- Validación de pagos
- Historial financiero
- Gestión de comprobantes

---

## 💳 Pagos

Permite a los acudientes cargar comprobantes de pago.

Funciones:

- Subir archivos
- Consultar estado del pago
- Seguimiento de validaciones

Estados posibles:

- Pendiente
- Aprobado
- Rechazado

---

## 🤖 IA

Módulo de Inteligencia Artificial integrado con OpenAI.

Funciones:

### Generación automática de descripciones

Genera descripciones de rutas usando GPT-4o-mini.

### Generación de imágenes

Genera ilustraciones representativas usando DALL·E 3.

### Sistema de recomendaciones

Utiliza embeddings para recomendar rutas compatibles con estudiantes según dirección y contexto.

---

# 📁 Estructura del proyecto

```text
RutaSmart/
│
├── accounts/
├── conductor/
├── finanzas/
├── ia/
├── pagos/
├── ruta/
├── rutasmart_backend/
├── students/
├── vehiculo/
├── static/
├── templates/
├── media/
│
├── manage.py
├── requirements.txt
└── README.md
```

---

# ⚙ Instalación y configuración

## 1. Clonar el repositorio

```bash
git clone https://github.com/RestrepoJuanP/RutaSmart.git
cd RutaSmart
```

---

## 2. Crear entorno virtual

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

---

## 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
OPENAI_API_KEY=tu_api_key
GOOGLE_MAPS_API_KEY=tu_google_maps_key
SECRET_KEY=django_secret_key
DEBUG=True
```

---

## 5. Aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 6. Crear superusuario

```bash
python manage.py createsuperuser
```

---

## 7. Ejecutar servidor

```bash
python manage.py runserver
```

Abrir en el navegador:

```text
http://127.0.0.1:8000/
```

---

# 🔐 Variables de entorno

| Variable | Descripción |
|---|---|
| `OPENAI_API_KEY` | API Key de OpenAI |
| `GOOGLE_MAPS_API_KEY` | API Key de Google Maps |
| `SECRET_KEY` | Clave secreta de Django |
| `DEBUG` | Modo desarrollo |

---

# 👥 Roles del sistema

## 👑 Administrador

- Gestión global del sistema
- Validación de pagos
- Administración financiera
- Gestión de rutas
- Gestión de estudiantes

## 🚐 Conductor

- Visualización de rutas asignadas
- Gestión de recorridos
- Consulta de estudiantes

## 👨‍👩‍👦 Padre / Estudiante

- Consulta de pagos
- Carga de comprobantes
- Visualización de información relacionada

---

# 🤖 Integración con IA

RutaSmart integra servicios de OpenAI mediante el módulo `ia/services.py`.

## Funcionalidades implementadas

### GPT-4o-mini

- Generación automática de descripciones de rutas.

### DALL·E 3

- Generación de imágenes representativas de rutas escolares.

### Embeddings

- Sistema de recomendación inteligente.
- Comparación semántica entre rutas y estudiantes.

---

# 🔄 Flujo general de uso

```text
Administrador
    ↓
Registra conductores y vehículos
    ↓
Crea rutas escolares
    ↓
Asigna estudiantes
    ↓
Padres suben comprobantes
    ↓
Sistema financiero valida pagos
    ↓
IA recomienda rutas óptimas
```

---

# 🛠 Comandos útiles

## Crear migraciones

```bash
python manage.py makemigrations
```

## Aplicar migraciones

```bash
python manage.py migrate
```

## Ejecutar servidor

```bash
python manage.py runserver
```

## Crear superusuario

```bash
python manage.py createsuperuser
```

## Recolectar archivos estáticos

```bash
python manage.py collectstatic
```

---

# ⚠ Problemas comunes

## Error: OPENAI_API_KEY no encontrada

Solución:

Verificar que exista el archivo `.env` y que la variable esté correctamente definida.

---

## Error al aplicar migraciones

Ejecutar:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Error de dependencias

Actualizar pip e instalar nuevamente:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

# ✅ Buenas prácticas implementadas

- Arquitectura modular.
- Uso de variables de entorno.
- Modelo de usuario personalizado.
- Separación por aplicaciones.
- Uso de relaciones ORM.
- Validaciones en modelos.
- Organización de archivos estáticos y media.
- Manejo de roles y permisos.

---

# 🚀 Mejoras futuras sugeridas

- Integración completa con Google Maps.
- Optimización automática de rutas.
- Panel analítico con métricas.
- Notificaciones en tiempo real.
- API REST con Django REST Framework.
- Despliegue en Docker.
- Migración a PostgreSQL.
- Tests automatizados.
- CI/CD con GitHub Actions.
- Sistema de geolocalización en tiempo real.

---

# 👨‍💻 Autores

Proyecto académico desarrollado como parte de RutaSmart.

Equipo de trabajo:

- Juan Pablo Restrepo Restrepo (Scrum Master)
- Tomas Sepulveda Franco (Desarrollador Full-stack)
- Julian Jimenez Garcia (Desarrollador Front-end)
- Miguel Angel Ortiz Puerta (Desarrollador Back-end)
- Miguel Angel Garcia Osorio (Diseñador UI/UX)
- Samuel Herrera Galvis (QA Engineer y Desarrollador Full-stack)

Desarrollado con Django y OpenAI.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.