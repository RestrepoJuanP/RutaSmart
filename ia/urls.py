from django.urls import path

from . import views

app_name = "ia"

urlpatterns = [
    # Panel principal IA
    path("", views.ia_dashboard, name="dashboard"),

    # Acciones por ruta
    path("ruta/<int:ruta_id>/", views.detalle_ruta_ia, name="ruta_detail"),
    path("ruta/<int:ruta_id>/descripcion/", views.generar_descripcion, name="generar_descripcion"),
    path("ruta/<int:ruta_id>/imagen/", views.generar_imagen, name="generar_imagen"),
    path("ruta/<int:ruta_id>/embedding/", views.generar_embedding, name="generar_embedding"),

    # Recomendación de ruta para un estudiante
    path("recomendar/<int:student_id>/", views.recomendar_ruta, name="recomendar_ruta"),
]
