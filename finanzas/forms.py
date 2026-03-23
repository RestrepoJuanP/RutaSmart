from django import forms
from .models import ComprobantePago, Gasto


class ComprobantePagoForm(forms.ModelForm):
    class Meta:
        model = ComprobantePago
        fields = [
            'acudiente_nombre',
            'estudiante_nombre',
            'mes_pago',
            'referencia_factura',
            'monto',
            'archivo',
        ]
        widgets = {
            'acudiente_nombre': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre completo del acudiente',
            }),
            'estudiante_nombre': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre completo del estudiante',
            }),
            'mes_pago': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'YYYY-MM  (ej. 2026-03)',
            }),
            'referencia_factura': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Número de factura o referencia (opcional)',
            }),
            'monto': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0',
                'min': '0',
                'step': '100',
            }),
            'archivo': forms.ClearableFileInput(attrs={
                'class': 'form-control',
            }),
        }
        labels = {
            'acudiente_nombre': 'Nombre del acudiente',
            'estudiante_nombre': 'Nombre del estudiante',
            'mes_pago': 'Mes de pago',
            'referencia_factura': 'Referencia de factura',
            'monto': 'Valor del pago ($)',
            'archivo': 'Comprobante (imagen o PDF)',
        }
        help_texts = {
            'mes_pago': 'Ingrese el mes en formato YYYY-MM, por ejemplo 2026-03.',
        }


class GastoForm(forms.ModelForm):
    class Meta:
        model = Gasto
        fields = ['fecha', 'categoria', 'descripcion', 'monto', 'notas', 'factura']
        widgets = {
            'fecha': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date',
            }),
            'categoria': forms.Select(attrs={'class': 'form-select'}),
            'descripcion': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Descripción breve del gasto',
            }),
            'monto': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0',
                'min': '0',
                'step': '100',
            }),
            'notas': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 2,
                'placeholder': 'Notas opcionales',
            }),
            'factura': forms.ClearableFileInput(attrs={
                'class': 'form-control',
            }),
        }
        labels = {
            'fecha': 'Fecha',
            'categoria': 'Categoría',
            'descripcion': 'Descripción',
            'monto': 'Valor ($)',
            'notas': 'Notas',
            'factura': 'Factura o soporte (opcional)',
        }
