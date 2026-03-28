from django.urls import path
from . import views

app_name = "students"

urlpatterns = [
    path("", views.student_list, name="student_list"),
    path("crear/", views.student_create, name="student_create"),
    path("<int:pk>/editar/", views.student_update, name="student_update"),
    path("<int:pk>/desactivar/", views.student_deactivate, name="student_deactivate"),
]