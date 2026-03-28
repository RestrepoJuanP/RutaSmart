from django.conf import settings
from django.db import models


class Conductor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conductor_profile",
        null=True,
        blank=True,
    )
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    correo = models.EmailField()

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
