from django.test import TestCase
from django.urls import reverse

from accounts.models import User
from students.models import Student

from .forms import RutaForm
from .models import Ruta, RutaParada


class RutaFormTests(TestCase):
    def test_accepts_school_address_with_neighborhood(self):
        form = RutaForm(
            data={
                "nombre": "Ruta Centro",
                "direccion_colegio": "Carrera 82 # 35-40, Calasanz, Medellin, Antioquia",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())


class AssignStudentsViewTests(TestCase):
    def setUp(self):
        self.driver = User.objects.create_user(
            email="driver@example.com",
            full_name="Conductor Uno",
            phone_number="3001112233",
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
        self.s1 = Student.objects.create(
            owner=self.parent,
            full_name="Hijo 1",
            address="Calle 1 # 2-3, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.s2 = Student.objects.create(
            owner=self.parent,
            full_name="Hijo 2",
            address="Calle 4 # 5-6, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.ruta = Ruta.objects.create(
            conductor=self.driver,
            nombre="Ruta Mañana",
            direccion_colegio="Carrera 82 # 35-40, Medellin, Antioquia",
        )
        RutaParada.objects.create(ruta=self.ruta, estudiante=self.s1, orden=1)
        RutaParada.objects.create(ruta=self.ruta, estudiante=self.s2, orden=2)

    def test_assign_students_empty_post_does_not_delete_existing_paradas(self):
        self.client.login(email=self.driver.email, password="RutaSmart123*")
        url = reverse("ruta:assign_students", kwargs={"pk": self.ruta.pk})
        response = self.client.post(url, data={})

        self.assertRedirects(response, url)
        self.assertEqual(self.ruta.paradas.count(), 2)
        self.assertTrue(
            self.ruta.paradas.filter(estudiante=self.s1).exists()
        )
        self.assertTrue(
            self.ruta.paradas.filter(estudiante=self.s2).exists()
        )
