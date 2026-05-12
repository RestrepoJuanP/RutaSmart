from django.test import TestCase

from .forms import StudentForm


class StudentFormTests(TestCase):
    def test_accepts_address_with_neighborhood(self):
        form = StudentForm(
            data={
                "full_name": "Juan Perez",
                "school_name": "Colegio Calasanz",
                "address": "Cl. 49 #81c-71 a 81c-1, Calasanz, Medellin, Antioquia",
                "guardian_name": "Maria Perez",
                "guardian_phone": "3001234567",
                "guardian_email": "maria@example.com",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())

    def test_accepts_address_with_optional_country(self):
        form = StudentForm(
            data={
                "full_name": "Juan Perez",
                "school_name": "Colegio Demo",
                "address": "Calle 38A # 107-78, Medellin, Antioquia, Colombia",
                "guardian_name": "Maria Perez",
                "guardian_phone": "3001234567",
                "guardian_email": "maria@example.com",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())

    def test_rejects_address_without_city_and_department(self):
        form = StudentForm(
            data={
                "full_name": "Juan Perez",
                "school_name": "Colegio Demo",
                "address": "Calle 50 #20-30",
                "guardian_name": "Maria Perez",
                "guardian_phone": "3001234567",
                "guardian_email": "maria@example.com",
            }
        )

        self.assertFalse(form.is_valid())
        self.assertIn("address", form.errors)
        mensaje = " ".join(form.errors["address"])
        self.assertIn("Vía y número", mensaje)
        self.assertIn("Ciudad", mensaje)
        self.assertIn("Departamento", mensaje)

    def test_keeps_school_name_when_present(self):
        form = StudentForm(
            data={
                "full_name": "Juan Perez",
                "school_name": "Colegio San Jose",
                "address": "Calle 38A # 107-78, Medellin, Antioquia",
                "guardian_name": "Maria Perez",
                "guardian_phone": "3001234567",
                "guardian_email": "maria@example.com",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())
        self.assertEqual(form.cleaned_data["school_name"], "Colegio San Jose")
