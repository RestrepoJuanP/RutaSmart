from django.db import models

class Conductor(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    correo = models.EmailField()


    def __str__(self):
        return f"{self.nombre} {self.apellido}"
