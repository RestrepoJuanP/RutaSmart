from django.test import TestCase

from .forms import RutaForm


class RutaFormTests(TestCase):
    def test_accepts_school_address_with_neighborhood(self):
        form = RutaForm(
            data={
                "nombre": "Ruta Centro",
                "direccion_colegio": "Carrera 82 # 35-40, Calasanz, Medellin, Antioquia",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())
