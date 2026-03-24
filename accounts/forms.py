from django import forms
from django.contrib.auth import authenticate

from .models import User


class UserRegistrationForm(forms.ModelForm):
    password1 = forms.CharField(label="Contraseña", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirmar contraseña", widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ("full_name", "phone_number", "email", "role")
        labels = {
            "full_name": "Nombre completo",
            "phone_number": "Teléfono",
            "email": "Correo electrónico",
            "role": "Tipo de usuario",
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs["class"] = "form-control"
            if field_name == "role":
                field.widget.attrs["class"] = "form-select"
                field.choices = [
                    (User.Role.DRIVER, "Conductor"),
                    (User.Role.PARENT_STUDENT, "Padre/Estudiante"),
                ]

    def clean_email(self):
        email = self.cleaned_data["email"].lower().strip()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Ya existe un usuario con este correo electrónico.")
        return email

    def clean_role(self):
        role = self.cleaned_data["role"]
        if role == User.Role.ADMIN:
            raise forms.ValidationError("No puedes registrarte como administrador.")
        return role

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = user.email.lower().strip()
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    email = forms.EmailField(label="Correo electrónico")
    password = forms.CharField(label="Contraseña", widget=forms.PasswordInput)

    def __init__(self, *args, request=None, **kwargs):
        self.request = request
        self._user = None
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs["class"] = "form-control"

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        password = cleaned_data.get("password")
        if email and password:
            self._user = authenticate(self.request, email=email.lower().strip(), password=password)
            if self._user is None:
                raise forms.ValidationError("Credenciales inválidas.")
        return cleaned_data

    def get_user(self):
        return self._user
