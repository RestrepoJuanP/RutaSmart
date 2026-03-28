from django.test import TestCase
from django.urls import reverse

from .models import User


class RegistrationFlowTests(TestCase):
    def test_driver_registration_creates_user_and_redirects_to_driver_dashboard(self):
        response = self.client.post(
            reverse("accounts:register"),
            data={
                "full_name": "Juan Perez",
                "phone_number": "3001234567",
                "email": "juan@example.com",
                "role": User.Role.DRIVER,
                "password1": "RutaSmart123*",
                "password2": "RutaSmart123*",
            },
        )

        self.assertRedirects(response, reverse("accounts:driver_dashboard"))
        self.assertTrue(User.objects.filter(email="juan@example.com", role=User.Role.DRIVER).exists())

    def test_parent_registration_creates_user_and_redirects_to_parent_dashboard(self):
        response = self.client.post(
            reverse("accounts:register"),
            data={
                "full_name": "Maria Gomez",
                "phone_number": "3009876543",
                "email": "maria@example.com",
                "role": User.Role.PARENT_STUDENT,
                "password1": "RutaSmart123*",
                "password2": "RutaSmart123*",
            },
        )

        self.assertRedirects(response, reverse("accounts:parent_dashboard"))
        self.assertTrue(
            User.objects.filter(email="maria@example.com", role=User.Role.PARENT_STUDENT).exists()
        )

    def test_public_registration_cannot_create_admin(self):
        response = self.client.post(
            reverse("accounts:register"),
            data={
                "full_name": "Intento Admin",
                "phone_number": "3000000000",
                "email": "adminhack@example.com",
                "role": User.Role.ADMIN,
                "password1": "RutaSmart123*",
                "password2": "RutaSmart123*",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(email="adminhack@example.com").exists())


class RoleAccessTests(TestCase):
    def setUp(self):
        self.driver = User.objects.create_user(
            email="driver@example.com",
            full_name="Conductor Test",
            phone_number="3001112233",
            role=User.Role.DRIVER,
            password="RutaSmart123*",
        )
        self.parent = User.objects.create_user(
            email="parent@example.com",
            full_name="Padre Test",
            phone_number="3004445566",
            role=User.Role.PARENT_STUDENT,
            password="RutaSmart123*",
        )

    def test_driver_cannot_access_parent_dashboard(self):
        self.client.login(email=self.driver.email, password="RutaSmart123*")
        response = self.client.get(reverse("accounts:parent_dashboard"))
        self.assertEqual(response.status_code, 403)

    def test_parent_cannot_access_driver_dashboard(self):
        self.client.login(email=self.parent.email, password="RutaSmart123*")
        response = self.client.get(reverse("accounts:driver_dashboard"))
        self.assertEqual(response.status_code, 403)

    def test_anonymous_user_redirected_to_login(self):
        response = self.client.get(reverse("accounts:driver_dashboard"))
        login_url = f"{reverse('accounts:login')}?next={reverse('accounts:driver_dashboard')}"
        self.assertRedirects(response, login_url)


class SuperuserTests(TestCase):
    def test_superuser_is_created_with_admin_role(self):
        user = User.objects.create_superuser(
            email="super@example.com",
            full_name="Super Admin",
            phone_number="3009999999",
            password="RutaSmart123*",
        )

        self.assertEqual(user.role, User.Role.ADMIN)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_admin_user_redirects_to_django_admin_index(self):
        user = User.objects.create_superuser(
            email="super2@example.com",
            full_name="Super Admin 2",
            phone_number="3011111111",
            password="RutaSmart123*",
        )
        self.client.login(email=user.email, password="RutaSmart123*")
        response = self.client.get(reverse("accounts:home"))
        self.assertRedirects(response, reverse("admin:index"))
