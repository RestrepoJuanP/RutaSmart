from django import forms

from .models import Ruta


ADDRESS_FORMAT_HELP = "Formato permitido: Via y numero, sector o barrio opcional, Ciudad, Departamento, con Colombia opcional"
ADDRESS_FORMAT_EXAMPLE = "Ejemplo: Carrera 82 # 35-40, Calasanz, Medellin, Antioquia"


def _is_valid_colombia_address(value):
    parts = [part.strip() for part in value.split(",") if part.strip()]
    if len(parts) < 3:
        return False

    if parts[-1].lower() == "colombia":
        parts = parts[:-1]

    if len(parts) < 3:
        return False

    return all(len(part) >= 2 for part in parts)


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
                    "placeholder": "Carrera 82 # 35-40, Calasanz, Medellin, Antioquia",
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
