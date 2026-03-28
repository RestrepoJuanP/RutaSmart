# RutaSmart

RutaSmart es una aplicación web desarrollada con **Django** para apoyar la gestión del transporte escolar. En el estado actual del proyecto se integraron en una sola base de código los módulos desarrollados a partir de las historias de usuario del equipo, con una estructura unificada de proyecto para facilitar su ejecución, mantenimiento y posterior despliegue.

## Estado actual del proyecto

En esta versión se consolidó un único proyecto Django con los siguientes módulos principales:

- **accounts**: registro, inicio de sesión, cierre de sesión y dashboards por rol.
- **students**: registro, edición, visualización y desactivación lógica de estudiantes.
- **vehiculo**: registro y listado de vehículos.
- **conductor**: entidades de apoyo relacionadas con el conductor.
- **finanzas**: dashboard financiero, historial de comprobantes, registro e historial de gastos.
- **pagos**: carga y consulta de comprobantes de pago por parte del acudiente.

## Tecnologías utilizadas

- Python 3.11 o superior
- Django 5.1+
- SQLite3
- HTML5
- Bootstrap 5 (vía CDN en plantillas)

## Estructura general del proyecto

```text
RutaSmart/
├── accounts/
├── conductor/
├── finanzas/
├── media/
├── pagos/
├── rutasmart_backend/
├── students/
├── templates/
├── vehiculo/
├── .gitignore
├── manage.py
├── README.md
└── requirements.txt
```

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Python 3.11 o superior**
- **pip**
- Un entorno virtual recomendado (`venv`)

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd RutaSmart
```

### 2. Crear y activar entorno virtual

#### En Windows (PowerShell)

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### En Windows (cmd)

```bat
python -m venv venv
venv\Scripts\activate
```

#### En Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

### 6. Ejecutar el servidor

```bash
python manage.py runserver
```

Luego abre en el navegador:

```text
http://127.0.0.1:8000/
```

## Rutas principales

Dependiendo de la configuración actual de `rutasmart_backend/urls.py`, la aplicación integra las siguientes rutas base:

- `/` → página principal / autenticación
- `/admin/` → panel de administración de Django
- `/students/` → gestión de estudiantes
- `/vehiculos/` → gestión de vehículos
- `/finanzas/` → dashboard e historial financiero
- `/pagos/` → carga y consulta de comprobantes de pago

## Archivos importantes

- `manage.py`: punto de entrada principal del proyecto.
- `rutasmart_backend/settings.py`: configuración general del proyecto.
- `rutasmart_backend/urls.py`: enrutamiento principal.
- `templates/`: plantillas compartidas del proyecto.
- `media/`: archivos cargados por usuarios, como comprobantes o facturas.

## Buenas prácticas adoptadas en esta integración

- Se dejó **un solo proyecto Django principal**.
- Se eliminaron bases de datos locales duplicadas del repositorio.
- Se ignoraron archivos generados automáticamente mediante `.gitignore`.
- Se unificó la estructura de plantillas por aplicación.
- Se organizó el proyecto para que los módulos queden accesibles desde una sola aplicación funcional.

## Notas importantes

- La base de datos `db.sqlite3` **no debe subirse al repositorio**.
- Las carpetas `__pycache__` y archivos `.pyc` tampoco deben versionarse.
- Si se modifica la estructura de modelos, se deben volver a generar migraciones.
- En futuras iteraciones se recomienda fortalecer la integración entre roles, navegación entre módulos y validaciones de negocio.

## Equipo y contexto

Este proyecto hace parte del desarrollo académico de **RutaSmart**, una solución enfocada en la digitalización y organización de procesos de transporte escolar.

---

Si el proyecto presenta errores al iniciar, verifica primero:

1. que el entorno virtual esté activo,
2. que las dependencias estén instaladas,
3. que las migraciones se hayan aplicado correctamente,
4. y que la configuración en `settings.py` y `urls.py` corresponda a la estructura final integrada.