from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from accounts.models import User
from ruta.models import Ruta, RutaParada
from students.models import Student


class RecomendarRutaViewTests(TestCase):
    def setUp(self):
        self.driver = User.objects.create_user(
            email="driver@example.com",
            full_name="Conductor Uno",
            phone_number="3001112233",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.other_driver = User.objects.create_user(
            email="otro@example.com",
            full_name="Conductor Dos",
            phone_number="3009998877",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.parent = User.objects.create_user(
            email="papa@example.com",
            full_name="Padre A",
            phone_number="3004445566",
            role=User.Role.PARENT_STUDENT,
            password="RutaSmart123*",
        )

        self.student_in_route = Student.objects.create(
            owner=self.parent,
            full_name="Hijo En Ruta",
            address="Calle 1 # 2-3, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.student_outside = Student.objects.create(
            owner=self.parent,
            full_name="Hijo Sin Ruta",
            address="Calle 4 # 5-6, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.student_inactive = Student.objects.create(
            owner=self.parent,
            full_name="Hijo Inactivo",
            address="Calle 7 # 8-9, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
            is_active=False,
        )

        self.ruta = Ruta.objects.create(
            conductor=self.driver,
            nombre="Ruta Mañana",
            direccion_colegio="Carrera 82 # 35-40, Medellin, Antioquia",
        )
        RutaParada.objects.create(ruta=self.ruta, estudiante=self.student_in_route, orden=1)
        RutaParada.objects.create(ruta=self.ruta, estudiante=self.student_inactive, orden=2)

        # El otro conductor también tiene a este estudiante en SU ruta — no debe
        # otorgar acceso al primer conductor.
        self.ruta_otra = Ruta.objects.create(
            conductor=self.other_driver,
            nombre="Ruta Otra",
            direccion_colegio="Carrera 82 # 35-40, Medellin, Antioquia",
        )
        RutaParada.objects.create(ruta=self.ruta_otra, estudiante=self.student_outside, orden=1)

    @patch("ia.views.services.recomendar_rutas_para_estudiante", return_value=[])
    def test_driver_can_recommend_for_student_in_own_route(self, _mock):
        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(
            reverse("ia:recomendar_ruta", kwargs={"student_id": self.student_in_route.pk})
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["estudiante"], self.student_in_route)

    @patch("ia.views.services.recomendar_rutas_para_estudiante", return_value=[])
    def test_driver_cannot_recommend_for_student_not_in_own_route(self, _mock):
        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(
            reverse("ia:recomendar_ruta", kwargs={"student_id": self.student_outside.pk})
        )
        self.assertEqual(response.status_code, 404)

    @patch("ia.views.services.recomendar_rutas_para_estudiante", return_value=[])
    def test_driver_cannot_recommend_for_inactive_student(self, _mock):
        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(
            reverse("ia:recomendar_ruta", kwargs={"student_id": self.student_inactive.pk})
        )
        self.assertEqual(response.status_code, 404)
