from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from accounts.models import User
from finanzas.models import ComprobantePago
from students.models import Student

from .forms import ComprobantePagoForm


def _build_pdf(name="comprobante.pdf"):
    return SimpleUploadedFile(name, b"%PDF-1.4 contenido", content_type="application/pdf")


class ComprobantePagoFormTests(TestCase):
    def setUp(self):
        self.driver = User.objects.create_user(
            email="driver@example.com",
            full_name="Conductor Uno",
            phone_number="3001112233",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.parent_a = User.objects.create_user(
            email="papa_a@example.com",
            full_name="Padre A",
            phone_number="3004445566",
            role=User.Role.PARENT_STUDENT,
            password="RutaSmart123*",
        )
        self.parent_b = User.objects.create_user(
            email="papa_b@example.com",
            full_name="Padre B",
            phone_number="3007778899",
            role=User.Role.PARENT_STUDENT,
            password="RutaSmart123*",
        )
        self.student_a = Student.objects.create(
            owner=self.parent_a,
            full_name="Hijo A",
            address="Calle 1 # 2-3, Medellin, Antioquia",
            guardian_name="Padre A",
            guardian_phone="3004445566",
        )
        self.student_b = Student.objects.create(
            owner=self.parent_b,
            full_name="Hijo B",
            address="Calle 1 # 2-3, Medellin, Antioquia",
            guardian_name="Padre B",
            guardian_phone="3007778899",
        )

    def _form_data(self, estudiante_nombre):
        return {
            "mes_pago": "2026-03",
            "estudiante_nombre": estudiante_nombre,
            "conductor": self.driver.pk,
            "monto": "250000",
            "referencia_factura": "FACT-1",
        }

    def test_form_only_lists_owner_students_in_dropdown(self):
        form = ComprobantePagoForm(user=self.parent_a)
        choices = [c[0] for c in form.fields["estudiante_nombre"].choices]
        self.assertIn("Hijo A", choices)
        self.assertNotIn("Hijo B", choices)

    def test_form_rejects_student_not_owned_by_user(self):
        form = ComprobantePagoForm(
            data=self._form_data("Hijo B"),
            files={"archivo": _build_pdf()},
            user=self.parent_a,
        )
        self.assertFalse(form.is_valid())
        self.assertIn("estudiante_nombre", form.errors)

    def test_form_accepts_owned_student_with_conductor(self):
        form = ComprobantePagoForm(
            data=self._form_data("Hijo A"),
            files={"archivo": _build_pdf()},
            user=self.parent_a,
        )
        self.assertTrue(form.is_valid(), form.errors.as_json())
        comprobante = form.save()
        self.assertEqual(comprobante.conductor, self.driver)


class FinanzasConductorIsolationTests(TestCase):
    def setUp(self):
        self.driver_1 = User.objects.create_user(
            email="d1@example.com",
            full_name="Driver 1",
            phone_number="3001000001",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.driver_2 = User.objects.create_user(
            email="d2@example.com",
            full_name="Driver 2",
            phone_number="3001000002",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.comp_d1 = ComprobantePago.objects.create(
            acudiente_nombre="Padre A",
            estudiante_nombre="Hijo A",
            mes_pago="2026-03",
            monto=100000,
            archivo=SimpleUploadedFile("a.pdf", b"x", content_type="application/pdf"),
            conductor=self.driver_1,
        )
        self.comp_d2 = ComprobantePago.objects.create(
            acudiente_nombre="Padre B",
            estudiante_nombre="Hijo B",
            mes_pago="2026-03",
            monto=200000,
            archivo=SimpleUploadedFile("b.pdf", b"x", content_type="application/pdf"),
            conductor=self.driver_2,
        )

    def test_driver_only_sees_own_comprobantes_in_historial(self):
        from django.urls import reverse

        self.client.login(email=self.driver_1.email, password="RutaSmart123*")
        response = self.client.get(reverse("finanzas:historial"))
        self.assertEqual(response.status_code, 200)
        comprobantes = list(response.context["comprobantes"])
        self.assertIn(self.comp_d1, comprobantes)
        self.assertNotIn(self.comp_d2, comprobantes)

    def test_driver_cannot_approve_other_drivers_comprobante(self):
        from django.urls import reverse

        self.client.login(email=self.driver_1.email, password="RutaSmart123*")
        response = self.client.post(
            reverse("finanzas:aprobar_comprobante", kwargs={"pk": self.comp_d2.pk})
        )
        self.assertEqual(response.status_code, 404)