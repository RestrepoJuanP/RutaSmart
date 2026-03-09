from django.contrib import admin

from .models import ComprobantePago


@admin.register(ComprobantePago)
class ComprobantePagoAdmin(admin.ModelAdmin):
	list_display = (
		'id',
		'acudiente_nombre',
		'estudiante_nombre',
		'estado',
		'fecha_subida',
		'fecha_validacion',
	)
	list_filter = ('estado', 'fecha_subida')
	search_fields = ('acudiente_nombre', 'estudiante_nombre', 'referencia_factura')

# Register your models here.
