from django.urls import path
from . import views

urlpatterns = [
    path("", views.student_list, name="student_list"),
    path("create/", views.student_create, name="student_create"),
    path("<int:pk>/edit/", views.student_update, name="student_update"),
    path("<int:pk>/deactivate/", views.student_deactivate, name="student_deactivate"),
]