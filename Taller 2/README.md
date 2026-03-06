# RutaSmart - Modulo de Registro de Usuarios

Este entregable implementa las historias de usuario de registro y acceso inicial para dos tipos de usuarios:

- `Conductor`
- `Padre/Estudiante`

## Requisitos funcionales cubiertos del SRS

- `FR01`: registro de usuario (nombre, telefono, correo, contrasena)
- `FR02`: autenticacion de usuarios registrados
- `FR03`: asignacion de rol por cuenta
- `FR04`: restriccion de acceso segun rol

## Requisitos de base de datos cubiertos

- `DR01`: almacenamiento de usuarios con identificador, contacto, credenciales y rol
- `DR08`: restriccion de acceso por rol
- `DR10` (parcial, enfocado en base de cuentas): listo para extender relaciones conductor-estudiante en siguientes iteraciones

## Estructura creada

- Proyecto Django: `rutasmart_project`
- App principal para autenticacion: `accounts`
- Base de datos: SQLite (`db.sqlite3` al migrar)
- Templates con Bootstrap en `templates/`

## Puesta en marcha

1. Instalar Python 3.12+.
2. Crear y activar entorno virtual:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

4. Aplicar migraciones:

```powershell
python manage.py migrate
```

5. Crear superusuario (opcional):

```powershell
python manage.py createsuperuser
```

6. Levantar servidor:

```powershell
python manage.py runserver
```

## Rutas principales

- Inicio: `/`
- Registro: `/registro/`
- Login: `/iniciar-sesion/`
- Dashboard conductor: `/dashboard/conductor/`
- Dashboard padre/estudiante: `/dashboard/padres-estudiantes/`

## Notas

- Este entorno de trabajo no tiene Python instalado, por eso no se ejecutaron migraciones ni tests aqui.
- Se incluye `accounts/migrations/0001_initial.py` creada manualmente para facilitar el arranque.
- Para validar tests localmente:

```powershell
python manage.py test
```
