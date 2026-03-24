from django.db import models


class ComprobantePago(models.Model):
	class Estado(models.TextChoices):
		PENDIENTE = 'pendiente', 'Pendiente'
		APROBADO = 'aprobado', 'Aprobado'
		RECHAZADO = 'rechazado', 'Rechazado'

	acudiente_nombre = models.CharField(max_length=120)
	estudiante_nombre = models.CharField(max_length=120)
	mes_pago = models.CharField(
		max_length=7,
		blank=True,
		help_text='Mes del pago en formato YYYY-MM',
	)
	referencia_factura = models.CharField(max_length=80, blank=True)
	archivo = models.FileField(upload_to='comprobantes/')
	estado = models.CharField(
		max_length=20,
		choices=Estado.choices,
		default=Estado.PENDIENTE,
	)
	comentario_validacion = models.TextField(blank=True)
	fecha_subida = models.DateTimeField(auto_now_add=True)
	fecha_validacion = models.DateTimeField(null=True, blank=True)

	class Meta:
		ordering = ['-fecha_subida']

	@property
	def mes_pago_display(self):
		if not self.mes_pago:
			return self.referencia_factura or '—'
		try:
			year, month = self.mes_pago.split('-')
			meses = [
				'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
				'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
			]
			return f'{meses[int(month) - 1]} {year}'
		except (ValueError, IndexError):
			return self.mes_pago

	def __str__(self):
		return f'{self.estudiante_nombre} – {self.mes_pago_display} – {self.get_estado_display()}'
