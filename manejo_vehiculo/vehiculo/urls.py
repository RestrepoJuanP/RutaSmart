from django.urls import include, path
from .views import registerVehicleView, listVehicleView

urlpatterns = [
    path('register/', registerVehicleView.as_view(), name='register_vehicle'),
    path('list/', listVehicleView.as_view(), name='list_vehicle'),

]