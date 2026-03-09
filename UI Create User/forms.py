"""
Formularios de registro y autenticación para RutaSmart.

Requisitos cubiertos:
  - FR01: Registro de cuenta (nombre, teléfono, email, contraseña)
  - FR02: Autenticación de usuarios registrados
"""
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import User


# ─────────────────────────────────────────────────────────
# Clases base con estilos Bootstrap
# ─────────────────────────────────────────────────────────
class BootstrapFormMixin:
    """Añade clases Bootstrap a todos los campos del formulario."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            existing = field.widget.attrs.get('class', '')
            field.widget.attrs['class'] = f'{existing} form-control'.strip()
            if field.required:
                field.widget.attrs['required'] = True


# ─────────────────────────────────────────────────────────
# Formulario de registro — Conductor
# ─────────────────────────────────────────────────────────
class DriverRegistrationForm(BootstrapFormMixin, forms.ModelForm):
    """
    Formulario de registro para conductores.
    Incluye campos específicos del vehículo.
    """
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'placeholder': 'Mínimo 8 caracteres'}),
    )
    password2 = forms.CharField(
        label='Confirmar contraseña',
        widget=forms.PasswordInput(attrs={'placeholder': 'Repita la contraseña'}),
    )

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'license_plate', 'vehicle_capacity',
        ]
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Ej: Juan Carlos'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Ej: Pérez López'}),
            'email': forms.EmailInput(attrs={'placeholder': 'correo@ejemplo.com'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Ej: 300 123 4567'}),
            'license_plate': forms.TextInput(attrs={'placeholder': 'Ej: ABC 123'}),
            'vehicle_capacity': forms.NumberInput(attrs={'placeholder': 'Ej: 12', 'min': 1}),
        }

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError('Las contraseñas no coinciden.')
        return p2

    def clean_email(self):
        email = self.cleaned_data.get('email', '').lower()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Ya existe una cuenta con este correo electrónico.')
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.DRIVER
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


# ─────────────────────────────────────────────────────────
# Formulario de registro — Padre / Acudiente
# ─────────────────────────────────────────────────────────
class ParentRegistrationForm(BootstrapFormMixin, forms.ModelForm):
    """
    Formulario de registro para padres / acudientes.
    No incluye campos de vehículo.
    """
    password1 = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'placeholder': 'Mínimo 8 caracteres'}),
    )
    password2 = forms.CharField(
        label='Confirmar contraseña',
        widget=forms.PasswordInput(attrs={'placeholder': 'Repita la contraseña'}),
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone']
        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'Ej: María'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Ej: González Ríos'}),
            'email': forms.EmailInput(attrs={'placeholder': 'correo@ejemplo.com'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Ej: 310 987 6543'}),
        }

    def clean_password2(self):
        p1 = self.cleaned_data.get('password1')
        p2 = self.cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError('Las contraseñas no coinciden.')
        return p2

    def clean_email(self):
        email = self.cleaned_data.get('email', '').lower()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Ya existe una cuenta con este correo electrónico.')
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.Role.PARENT
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


# ─────────────────────────────────────────────────────────
# Formulario de login personalizado con Bootstrap
# ─────────────────────────────────────────────────────────
class LoginForm(BootstrapFormMixin, AuthenticationForm):
    """Formulario de login con estilos Bootstrap."""
    username = forms.EmailField(
        label='Correo electrónico',
        widget=forms.EmailInput(attrs={'placeholder': 'correo@ejemplo.com', 'autofocus': True}),
    )
    password = forms.CharField(
        label='Contraseña',
        widget=forms.PasswordInput(attrs={'placeholder': 'Su contraseña'}),
    )


# ─────────────────────────────────────────────────────────
# Formulario de edición de perfil
# ─────────────────────────────────────────────────────────
class ProfileUpdateForm(BootstrapFormMixin, forms.ModelForm):
    """Permite al usuario actualizar sus datos personales."""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone']
        widgets = {
            'first_name': forms.TextInput(),
            'last_name': forms.TextInput(),
            'phone': forms.TextInput(),
        }


class DriverProfileUpdateForm(BootstrapFormMixin, forms.ModelForm):
    """Perfil extendido para conductores (incluye datos del vehículo)."""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'license_plate', 'vehicle_capacity']
