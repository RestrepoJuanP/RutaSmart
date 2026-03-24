from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("", views.home, name="home"),
    path("registro/", views.register_view, name="register"),
    path("iniciar-sesion/", views.login_view, name="login"),
    path("cerrar-sesion/", views.logout_view, name="logout"),
    path("dashboard/conductor/", views.driver_dashboard, name="driver_dashboard"),
    path("dashboard/padres-estudiantes/", views.parent_dashboard, name="parent_dashboard"),
]
