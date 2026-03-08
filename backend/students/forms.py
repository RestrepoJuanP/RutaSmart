from django import forms
from .models import Student


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = [
            "full_name",
            "address",
            "guardian_name",
            "guardian_phone",
            "guardian_email",
        ]
        widgets = {
            "full_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Ingrese el nombre completo del estudiante"
            }),
            "address": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Ingrese la dirección del estudiante"
            }),
            "guardian_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Ingrese el nombre del tutor"
            }),
            "guardian_phone": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Ingrese el número de teléfono del tutor"
            }),
            "guardian_email": forms.EmailInput(attrs={
                "class": "form-control",
                "placeholder": "Ingrese el correo electrónico del tutor (opcional)"
            }),
        }