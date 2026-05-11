from django.contrib import admin
from .models import ComprobantePago, Gasto


@admin.register(ComprobantePago)
class ComprobantePagoAdmin(admin.ModelAdmin):
    list_display = (
        'estudiante_nombre',
        'acudiente_nombre',
        'conductor',
        'mes_pago_display',
        'referencia_factura',
        'monto',
        'estado',
        'fecha_subida',
    )
    list_filter = ('estado', 'conductor')
    search_fields = ('estudiante_nombre', 'acudiente_nombre', 'referencia_factura')
    readonly_fields = ('fecha_subida', 'fecha_validacion')
    fields = (
        'acudiente_nombre',
        'estudiante_nombre',
        'conductor',
        'mes_pago',
        'referencia_factura',
        'monto',
        'archivo',
        'estado',
        'comentario_validacion',
        'fecha_subida',
        'fecha_validacion',
    )


@admin.register(Gasto)
class GastoAdmin(admin.ModelAdmin):
    list_display = ('fecha', 'categoria', 'descripcion', 'monto')
    list_filter = ('categoria', 'fecha')
    search_fields = ('descripcion',)
