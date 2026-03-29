from django.conf import settings
from django.db import models

from students.models import Student


class Ruta(models.Model):
	conductor = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="rutas",
	)
	nombre = models.CharField(max_length=120)
	direccion_colegio = models.CharField(max_length=255)
	activa = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["nombre"]
		unique_together = ("conductor", "nombre")

	def __str__(self):
		return f"{self.nombre} - {self.conductor.full_name}"


class RutaParada(models.Model):
	ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name="paradas")
	estudiante = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="rutas_asignadas")
	orden = models.PositiveIntegerField(default=1)

	class Meta:
		ordering = ["orden", "estudiante__full_name"]
		unique_together = (
			("ruta", "estudiante"),
			("ruta", "orden"),
		)

	def __str__(self):
		return f"{self.ruta.nombre}: {self.orden}. {self.estudiante.full_name}"
