from django.urls import path

from . import views

app_name = 'pagos'

urlpatterns = [
    path('acudiente/finanzas/', views.finanzas_acudiente, name='finanzas_acudiente'),
]
