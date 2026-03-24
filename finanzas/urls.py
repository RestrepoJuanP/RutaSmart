from django.urls import path
from . import views

app_name = 'finanzas'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('historial/', views.historial, name='historial'),
    # Gastos
    path('gastos/', views.gastos_historial, name='gastos_historial'),
    path('gastos/registrar/', views.gastos_registrar, name='gastos_registrar'),
    path('gastos/<int:pk>/eliminar/', views.gastos_eliminar, name='gastos_eliminar'),
    # Endpoint de integración: recibe comprobantes del módulo de Acudientes
    path('api/recibir-comprobante/', views.recibir_comprobante, name='recibir_comprobante'),
]
