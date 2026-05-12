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
                "direccion_origen": "Parqueadero Los Colores, Medellin, Antioquia",
                "direccion_colegio": "Carrera 82 # 35-40, Calasanz, Medellin, Antioquia",
                "posicion_colegio": "final",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())

    def test_accepts_school_as_initial_stop_without_origin(self):
        form = RutaForm(
            data={
                "nombre": "Ruta Manana",
                "direccion_origen": "",
                "direccion_colegio": "Calle 50 # 70-20, Laureles, Medellin, Antioquia",
                "posicion_colegio": "inicio",
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
            school_name="Colegio Alfa",
            address="Calle 1 # 2-3, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.s2 = Student.objects.create(
            owner=self.parent,
            full_name="Hijo 2",
            school_name="Colegio Beta",
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

    def test_route_map_exposes_ordered_points_with_school_names(self):
        self.ruta.direccion_origen = "Calle 10 # 10-10, Medellin, Antioquia"
        self.ruta.posicion_colegio = Ruta.PosicionColegio.FINAL
        self.ruta.save()

        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(
            reverse("ruta:route_map", kwargs={"pk": self.ruta.pk})
        )

        self.assertEqual(response.status_code, 200)
        ordered_points = response.context["ordered_points"]
        self.assertEqual(ordered_points[0]["tipo"], "origen")
        self.assertEqual(ordered_points[1]["nombre"], "Hijo 1")
        self.assertEqual(ordered_points[1]["colegio"], "Colegio Alfa")
        self.assertEqual(ordered_points[2]["colegio"], "Colegio Beta")
        self.assertEqual(ordered_points[-1]["tipo"], "colegio")

    def test_route_map_warns_when_same_address_is_repeated(self):
        self.s2.address = self.s1.address
        self.s2.save(update_fields=["address"])

        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(
            reverse("ruta:route_map", kwargs={"pk": self.ruta.pk})
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.context["route_warnings"])
