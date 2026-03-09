"""
Modelos de usuario para RutaSmart.

Requisitos cubiertos:
  - FR01: Creación de cuenta de usuario (conductor y padre/acudiente)
  - FR03: Asignación de rol a cada cuenta de usuario
  - DR01: Almacenamiento de información de usuario (id, nombre, contacto,
          credenciales, rol)
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Manager personalizado para el modelo User de RutaSmart."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El correo electrónico es obligatorio.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de usuario personalizado.
    Usa email como identificador principal en lugar de username.
    """

    class Role(models.TextChoices):
        DRIVER = 'driver', 'Conductor'
        PARENT = 'parent', 'Padre / Acudiente'
        ADMIN = 'admin', 'Administrador'

    # ── Información personal ──────────────────
    email = models.EmailField(
        'correo electrónico',
        unique=True,
        error_messages={'unique': 'Ya existe una cuenta con este correo.'},
    )
    first_name = models.CharField('nombres', max_length=100)
    last_name = models.CharField('apellidos', max_length=100)
    phone = models.CharField('teléfono', max_length=20, blank=True)

    # ── Rol (FR03) ────────────────────────────
    role = models.CharField(
        'rol',
        max_length=10,
        choices=Role.choices,
        default=Role.PARENT,
    )

    # ── Campos adicionales conductor ──────────
    license_plate = models.CharField(
        'placa del vehículo', max_length=10, blank=True,
        help_text='Solo para conductores.',
    )
    vehicle_capacity = models.PositiveSmallIntegerField(
        'capacidad del vehículo', null=True, blank=True,
        help_text='Número de estudiantes que caben en el vehículo.',
    )

    # ── Estado y permisos ─────────────────────
    is_active = models.BooleanField('activo', default=True)
    is_staff = models.BooleanField('staff', default=False)
    date_joined = models.DateTimeField('fecha de registro', default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.get_full_name()} ({self.get_role_display()})'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    def get_short_name(self):
        return self.first_name

    # ── Helpers de rol ────────────────────────
    @property
    def is_driver(self):
        return self.role == self.Role.DRIVER

    @property
    def is_parent(self):
        return self.role == self.Role.PARENT

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN
