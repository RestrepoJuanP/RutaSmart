from django.test import TestCase

from .forms import RutaForm


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
