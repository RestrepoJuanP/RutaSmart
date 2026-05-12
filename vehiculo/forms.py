from django import forms

from .models import Vehiculo


class VehiculoForm(forms.ModelForm):
    class Meta:
        model = Vehiculo
        fields = [
            "placa",
            "marca",
            "linea",
            "modelo",
            "color",
            "num_asientos",
            "combustible",
            "transmision",
            "cilindraje",
        ]
        widgets = {
            "num_asientos": forms.NumberInput(
                attrs={
                    "min": 4,
                    "placeholder": "Mínimo 4 asientos",
                }
            ),
        }

    def clean_num_asientos(self):
        num_asientos = self.cleaned_data["num_asientos"]
        if num_asientos < 4:
            raise forms.ValidationError(
                "El vehículo debe tener al menos 4 asientos para registrarse."
            )
        return num_asientos
