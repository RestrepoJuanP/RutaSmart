import re
from pathlib import Path

from django import forms
from finanzas.models import ComprobantePago


class ComprobantePagoForm(forms.ModelForm):
    mes_pago = forms.CharField(
        required=True,
        label='Mes del pago',
        widget=forms.DateInput(
            attrs={
                'type': 'month',
                'class': 'form-control',
            }
        ),
    )

    class Meta:
        model = ComprobantePago
        fields = [
            'mes_pago',
            'acudiente_nombre',
            'estudiante_nombre',
            'monto',
            'referencia_factura',
            'archivo',
        ]
        labels = {
            'acudiente_nombre': 'Nombre del acudiente',
            'estudiante_nombre': 'Nombre del estudiante',
            'monto': 'Monto depositado (en pesos)',
            'referencia_factura': 'Referencia de factura (opcional)',
            'archivo': 'Comprobante',
        }
        widgets = {
            'acudiente_nombre': forms.TextInput(attrs={
                'placeholder': 'Ej: María García',
                'class': 'form-control',
            }),
            'estudiante_nombre': forms.TextInput(attrs={
                'placeholder': 'Ej: Carlos García',
                'class': 'form-control',
            }),
            'monto': forms.NumberInput(attrs={
                'placeholder': 'Ej: 250000',
                'class': 'form-control',
                'step': '0.01',
                'min': '0',
            }),
            'referencia_factura': forms.TextInput(attrs={
                'placeholder': 'Ej: FACT-2026-03',
                'class': 'form-control',
            }),
        }

    def clean_mes_pago(self):
        mes = self.cleaned_data.get('mes_pago', '').strip()
        if mes and not re.match(r'^\d{4}-\d{2}$', mes):
            raise forms.ValidationError('El formato debe ser YYYY-MM (ej: 2026-03).')
        return mes

    def clean_monto(self):
        monto = self.cleaned_data.get('monto')
        if monto is not None:
            if monto <= 0:
                raise forms.ValidationError('El monto debe ser mayor a 0.')
            if monto > 99999999.99:
                raise forms.ValidationError('El monto es demasiado alto.')
        return monto

    def clean_archivo(self):
        archivo = self.cleaned_data['archivo']
        extension = Path(archivo.name).suffix.lower()
        permitidas = {'.pdf', '.png', '.jpg', '.jpeg'}

        if extension not in permitidas:
            raise forms.ValidationError('Solo se permiten archivos PDF o imagen (PNG/JPG/JPEG).')

        if archivo.size > 5 * 1024 * 1024:
            raise forms.ValidationError('El archivo no puede superar 5 MB.')

        return archivo

    def save(self, commit=True):
        instance = super().save(commit=False)
        if instance.monto is None:
            instance.monto = 0
        if commit:
            instance.save()
        return instance