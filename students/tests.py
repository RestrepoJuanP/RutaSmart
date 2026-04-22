from django.test import TestCase

from .forms import StudentForm


class StudentFormTests(TestCase):
    def test_accepts_address_with_neighborhood(self):
        form = StudentForm(
            data={
                "full_name": "Juan Perez",
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
                "address": "Calle 38A # 107-78, Medellin, Antioquia, Colombia",
                "guardian_name": "Maria Perez",
                "guardian_phone": "3001234567",
                "guardian_email": "maria@example.com",
            }
        )

        self.assertTrue(form.is_valid(), form.errors.as_json())
