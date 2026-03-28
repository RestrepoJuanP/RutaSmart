from django.urls import path
from . import views

app_name = "finanzas"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("historial/", views.historial, name="historial"),
    path("comprobantes/<int:pk>/aprobar/", views.aprobar_comprobante, name="aprobar_comprobante"),
    path("comprobantes/<int:pk>/rechazar/", views.rechazar_comprobante, name="rechazar_comprobante"),
    path("gastos/", views.gastos_historial, name="gastos_historial"),
    path("gastos/registrar/", views.gastos_registrar, name="gastos_registrar"),
    path("gastos/<int:pk>/eliminar/", views.gastos_eliminar, name="gastos_eliminar"),
    path("api/recibir-comprobante/", views.recibir_comprobante, name="recibir_comprobante"),
]
