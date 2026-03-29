from django import forms

from .models import Ruta


ADDRESS_FORMAT_HELP = "Formato obligatorio: Via y numero, Ciudad, Departamento, Colombia"
ADDRESS_FORMAT_EXAMPLE = "Ejemplo: Carrera 82 # 35-40, Medellin, Antioquia, Colombia"


def _is_valid_colombia_address(value):
    parts = [part.strip() for part in value.split(",") if part.strip()]
    if len(parts) != 4:
        return False
    if parts[-1].lower() != "colombia":
        return False
    return all(len(part) >= 3 for part in parts[:-1])


class RutaForm(forms.ModelForm):
    class Meta:
        model = Ruta
        fields = ["nombre", "direccion_colegio"]
        widgets = {
            "nombre": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Ejemplo: Ruta Manana Colegio",
                }
            ),
            "direccion_colegio": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Carrera 82 # 35-40, Medellin, Antioquia, Colombia",
                }
            ),
        }
        help_texts = {
            "direccion_colegio": f"{ADDRESS_FORMAT_HELP}. {ADDRESS_FORMAT_EXAMPLE}.",
        }

    def clean_direccion_colegio(self):
        direccion = self.cleaned_data["direccion_colegio"].strip()
        if not _is_valid_colombia_address(direccion):
            raise forms.ValidationError(
                f"Direccion invalida. {ADDRESS_FORMAT_HELP}. {ADDRESS_FORMAT_EXAMPLE}."
            )
        return direccion
