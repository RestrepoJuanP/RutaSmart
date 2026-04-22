from django import forms
from .models import Student


ADDRESS_FORMAT_HELP = "Formato permitido: Via y numero, sector o barrio opcional, Ciudad, Departamento, con Colombia opcional"
ADDRESS_FORMAT_EXAMPLE = "Ejemplo: Calle 38A # 107-78, Calasanz, Medellin, Antioquia"


def _is_valid_colombia_address(value):
    parts = [part.strip() for part in value.split(",") if part.strip()]
    if len(parts) < 3:
        return False

    if parts[-1].lower() == "colombia":
        parts = parts[:-1]

    if len(parts) < 3:
        return False

    return all(len(part) >= 2 for part in parts)


class StudentForm(forms.ModelForm):
    def clean_address(self):
        address = self.cleaned_data["address"].strip()
        if not _is_valid_colombia_address(address):
            raise forms.ValidationError(
                f"Direccion invalida. {ADDRESS_FORMAT_HELP}. {ADDRESS_FORMAT_EXAMPLE}."
            )
        return address

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
                "placeholder": "Calle 38A # 107-78, Calasanz, Medellin, Antioquia"
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
        help_texts = {
            "address": f"{ADDRESS_FORMAT_HELP}. {ADDRESS_FORMAT_EXAMPLE}.",
        }
