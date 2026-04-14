from django.contrib import admin

from .models import EstudianteEmbedding, RutaIA


@admin.register(RutaIA)
class RutaIAAdmin(admin.ModelAdmin):
    list_display = ("ruta", "tiene_descripcion", "tiene_imagen", "tiene_embedding", "generado_en")
    readonly_fields = ("generado_en",)

    @admin.display(boolean=True, description="Descripción")
    def tiene_descripcion(self, obj):
        return obj.tiene_descripcion

    @admin.display(boolean=True, description="Imagen")
    def tiene_imagen(self, obj):
        return obj.tiene_imagen

    @admin.display(boolean=True, description="Embedding")
    def tiene_embedding(self, obj):
        return obj.tiene_embedding


@admin.register(EstudianteEmbedding)
class EstudianteEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("estudiante", "tiene_embedding", "generado_en")
    readonly_fields = ("generado_en",)

    @admin.display(boolean=True, description="Embedding")
    def tiene_embedding(self, obj):
        return bool(obj.embedding_json)
