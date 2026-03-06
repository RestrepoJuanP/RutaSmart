from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, phone_number, role, password=None, **extra_fields):
        if not email:
            raise ValueError("El correo electrónico es obligatorio.")
        if not full_name:
            raise ValueError("El nombre completo es obligatorio.")
        if not phone_number:
            raise ValueError("El número de teléfono es obligatorio.")
        if not role:
            raise ValueError("El rol es obligatorio.")

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            role=role,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        phone_number = extra_fields.pop("phone_number", "0000000000")
        extra_fields.pop("role", None)
        return self.create_user(
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            role=User.Role.ADMIN,
            password=password,
            **extra_fields,
        )


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = "admin", "Administrador"
        DRIVER = "driver", "Conductor"
        PARENT_STUDENT = "parent_student", "Padre/Estudiante"

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "phone_number"]

    class Meta:
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"

    def __str__(self):
        return f"{self.full_name} ({self.get_role_display()})"
