from django.test import TestCase

from conductor.models import Conductor

from .forms import VehiculoForm


class VehiculoFormTests(TestCase):
    def test_rejects_vehicles_with_less_than_four_seats(self):
        conductor = Conductor.objects.create(
            nombre="Carlos",
            apellido="Perez",
            documento="12345",
            correo="carlos@example.com",
        )

        form = VehiculoForm(
            data={
                "placa": "ABC123",
                "marca": "Renault",
                "linea": "Kangoo",
                "modelo": 2020,
                "color": "Blanco",
                "num_asientos": 3,
                "combustible": "gasolina",
                "transmision": "manual",
                "cilindraje": 1600,
                "conductor": conductor.pk,
            }
        )

        self.assertFalse(form.is_valid())
        self.assertIn("num_asientos", form.errors)

    def test_accepts_vehicles_with_four_or_more_seats(self):
        conductor = Conductor.objects.create(
            nombre="Laura",
            apellido="Gomez",
            documento="67890",
            correo="laura@example.com",
        )

        form = VehiculoForm(
            data={
                "placa": "XYZ987",
                "marca": "Chevrolet",
                "linea": "N300",
                "modelo": 2021,
                "color": "Plateado",
                "num_asientos": 4,
                "combustible": "gasolina",
                "transmision": "manual",
                "cilindraje": 1500,
                "conductor": conductor.pk,
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())
