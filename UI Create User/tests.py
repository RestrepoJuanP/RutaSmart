"""
Tests para el módulo de cuentas de RutaSmart.

Cubre:
  - FR01: Creación de cuentas (conductor y padre)
  - FR02: Autenticación
  - FR03: Asignación de rol
  - FR04: Control de acceso basado en roles
  - DR01: Almacenamiento correcto de datos de usuario
"""
from django.test import TestCase, Client
from django.urls import reverse
from .models import User


class UserModelTests(TestCase):
    """Tests del modelo User personalizado."""

    def test_create_driver(self):
        """FR01/FR03: Un conductor se crea con el rol correcto."""
        user = User.objects.create_user(
            email='conductor@test.com',
            password='TestPass123!',
            first_name='Carlos',
            last_name='López',
            phone='3001234567',
            role=User.Role.DRIVER,
            license_plate='ABC123',
            vehicle_capacity=15,
        )
        self.assertEqual(user.role, User.Role.DRIVER)
        self.assertTrue(user.is_driver)
        self.assertFalse(user.is_parent)
        self.assertEqual(user.license_plate, 'ABC123')
        self.assertEqual(user.vehicle_capacity, 15)

    def test_create_parent(self):
        """FR01/FR03: Un padre se crea con el rol correcto."""
        user = User.objects.create_user(
            email='padre@test.com',
            password='TestPass123!',
            first_name='María',
            last_name='González',
            phone='3109876543',
            role=User.Role.PARENT,
        )
        self.assertEqual(user.role, User.Role.PARENT)
        self.assertTrue(user.is_parent)
        self.assertFalse(user.is_driver)

    def test_email_unique(self):
        """DR01: No se pueden crear dos usuarios con el mismo email."""
        User.objects.create_user(email='unico@test.com', password='Pass123!')
        with self.assertRaises(Exception):
            User.objects.create_user(email='unico@test.com', password='Pass456!')

    def test_email_required(self):
        """El email es obligatorio."""
        with self.assertRaises(ValueError):
            User.objects.create_user(email='', password='Pass123!')

    def test_create_superuser(self):
        """El superusuario se crea con rol admin."""
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='AdminPass123!',
            first_name='Admin',
            last_name='Root',
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertEqual(admin.role, User.Role.ADMIN)

    def test_full_name(self):
        """DR01: El nombre completo se construye correctamente."""
        user = User.objects.create_user(
            email='nombre@test.com',
            password='Pass123!',
            first_name='Juan',
            last_name='Pérez',
        )
        self.assertEqual(user.get_full_name(), 'Juan Pérez')


class DriverRegistrationViewTests(TestCase):
    """Tests de la vista de registro de conductores."""

    def setUp(self):
        self.client = Client()
        self.url = reverse('accounts:register_driver')

    def test_get_registration_page(self):
        """La página de registro de conductor carga correctamente."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Registro de Conductor')

    def test_successful_registration(self):
        """FR01: Un conductor puede registrarse exitosamente."""
        data = {
            'first_name': 'Pedro',
            'last_name': 'Martínez',
            'email': 'pedro@test.com',
            'phone': '3001112233',
            'license_plate': 'XYZ789',
            'vehicle_capacity': 12,
            'password1': 'MiClaveSegura123!',
            'password2': 'MiClaveSegura123!',
        }
        response = self.client.post(self.url, data)
        # Debe redirigir al dashboard tras registro exitoso
        self.assertEqual(response.status_code, 302)

        # Verificar que el usuario existe en la BD
        user = User.objects.get(email='pedro@test.com')
        self.assertEqual(user.role, User.Role.DRIVER)
        self.assertEqual(user.license_plate, 'XYZ789')
        self.assertTrue(user.check_password('MiClaveSegura123!'))

    def test_password_mismatch(self):
        """Las contraseñas que no coinciden generan error."""
        data = {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'mismatch@test.com',
            'phone': '3000000000',
            'password1': 'Password123!',
            'password2': 'OtherPassword!',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)  # Se queda en la misma página
        self.assertFalse(User.objects.filter(email='mismatch@test.com').exists())

    def test_duplicate_email(self):
        """FR01: No se permite registro con email duplicado."""
        User.objects.create_user(email='duplicado@test.com', password='Pass123!')
        data = {
            'first_name': 'Otro',
            'last_name': 'Usuario',
            'email': 'duplicado@test.com',
            'phone': '3000000000',
            'password1': 'Password123!',
            'password2': 'Password123!',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.filter(email='duplicado@test.com').count(), 1)


class ParentRegistrationViewTests(TestCase):
    """Tests de la vista de registro de padres."""

    def setUp(self):
        self.client = Client()
        self.url = reverse('accounts:register_parent')

    def test_get_registration_page(self):
        """La página de registro de padre carga correctamente."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Padre / Acudiente')

    def test_successful_registration(self):
        """FR01: Un padre puede registrarse exitosamente."""
        data = {
            'first_name': 'Ana',
            'last_name': 'Ríos',
            'email': 'ana@test.com',
            'phone': '3109998877',
            'password1': 'ClaveSegura456!',
            'password2': 'ClaveSegura456!',
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 302)

        user = User.objects.get(email='ana@test.com')
        self.assertEqual(user.role, User.Role.PARENT)


class LoginViewTests(TestCase):
    """Tests de autenticación (FR02)."""

    def setUp(self):
        self.client = Client()
        self.url = reverse('accounts:login')
        self.user = User.objects.create_user(
            email='login@test.com',
            password='LoginPass123!',
            first_name='Test',
            last_name='Login',
            role=User.Role.DRIVER,
        )

    def test_get_login_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_successful_login(self):
        """FR02: Un usuario registrado puede autenticarse."""
        response = self.client.post(self.url, {
            'username': 'login@test.com',
            'password': 'LoginPass123!',
        })
        self.assertEqual(response.status_code, 302)  # Redirige al dashboard

    def test_invalid_credentials(self):
        """FR02: Credenciales inválidas no permiten acceso."""
        response = self.client.post(self.url, {
            'username': 'login@test.com',
            'password': 'WrongPassword!',
        })
        self.assertEqual(response.status_code, 200)  # Se queda en login


class DashboardAccessTests(TestCase):
    """Tests de control de acceso por rol (FR04)."""

    def setUp(self):
        self.client = Client()
        self.driver = User.objects.create_user(
            email='driver@test.com',
            password='DriverPass123!',
            first_name='Driver',
            last_name='Test',
            role=User.Role.DRIVER,
        )
        self.parent = User.objects.create_user(
            email='parent@test.com',
            password='ParentPass123!',
            first_name='Parent',
            last_name='Test',
            role=User.Role.PARENT,
        )

    def test_unauthenticated_redirect(self):
        """Un usuario no autenticado es redirigido al login."""
        response = self.client.get(reverse('accounts:dashboard'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('login', response.url)

    def test_driver_sees_driver_dashboard(self):
        """FR04: Un conductor ve el dashboard de conductor."""
        self.client.login(username='driver@test.com', password='DriverPass123!')
        response = self.client.get(reverse('accounts:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Panel de conductor')

    def test_parent_sees_parent_dashboard(self):
        """FR04: Un padre ve el dashboard de padre."""
        self.client.login(username='parent@test.com', password='ParentPass123!')
        response = self.client.get(reverse('accounts:dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Panel de padre')
