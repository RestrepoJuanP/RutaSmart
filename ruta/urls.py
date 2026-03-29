from django.urls import path

from . import views

app_name = "ruta"

urlpatterns = [
	path("", views.ruta_list, name="ruta_list"),
	path("crear/", views.ruta_create, name="ruta_create"),
	path("<int:pk>/asignar-estudiantes/", views.assign_students, name="assign_students"),
	path("<int:pk>/mapa/", views.route_map, name="route_map"),
]
