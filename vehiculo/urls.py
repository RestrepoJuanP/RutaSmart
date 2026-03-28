from django.urls import path
from .views import RegisterVehicleView, ListVehicleView

app_name = "vehiculo"

urlpatterns = [
    path("", ListVehicleView.as_view(), name="list"),
    path("registrar/", RegisterVehicleView.as_view(), name="register"),
]