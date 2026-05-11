import re
from pathlib import Path

from django import forms

from accounts.models import User
from finanzas.models import ComprobantePago
from students.models import Student


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

    estudiante_nombre = forms.ChoiceField(
        required=True,
        label='Nombre del estudiante',
        widget=forms.Select(attrs={'class': 'form-control'}),
    )

    conductor = forms.ModelChoiceField(
        queryset=User.objects.none(),
        required=True,
        label='Conductor a aprobar',
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label='— Selecciona un conductor —',
    )

    class Meta:
        model = ComprobantePago
        fields = [
            'mes_pago',
            'estudiante_nombre',
            'conductor',
            'monto',
            'referencia_factura',
            'archivo',
        ]
        labels = {
            'estudiante_nombre': 'Nombre del estudiante',
            'monto': 'Monto depositado (en pesos)',
            'referencia_factura': 'Referencia de factura (opcional)',
            'archivo': 'Comprobante',
        }
        widgets = {
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

    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user

        # Conductores activos disponibles para asignar
        self.fields['conductor'].queryset = User.objects.filter(
            role=User.Role.DRIVER, is_active=True
        )

        # Lista de estudiantes propios del acudiente
        opciones_estudiantes = []
        if user is not None:
            opciones_estudiantes = list(
                Student.objects.filter(owner=user, is_active=True).values_list(
                    'full_name', 'full_name'
                )
            )

        if opciones_estudiantes:
            self.fields['estudiante_nombre'].choices = (
                [('', '— Selecciona un estudiante —')] + opciones_estudiantes
            )
        else:
            # Sin estudiantes registrados: deshabilitar y dar pista
            self.fields['estudiante_nombre'].choices = [
                ('', '— No tienes estudiantes registrados —')
            ]
            self.fields['estudiante_nombre'].widget.attrs['disabled'] = 'disabled'
            self.fields['estudiante_nombre'].help_text = (
                'Primero registra un estudiante en la sección Estudiantes.'
            )

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

    def clean_estudiante_nombre(self):
        nombre = (self.cleaned_data.get('estudiante_nombre') or '').strip()
        if not nombre:
            raise forms.ValidationError('Debes seleccionar un estudiante.')

        # Blindaje contra manipulación del POST: el nombre debe pertenecer
        # a un estudiante activo del acudiente autenticado.
        if self.user is not None and not Student.objects.filter(
            owner=self.user, is_active=True, full_name=nombre
        ).exists():
            raise forms.ValidationError(
                'El estudiante seleccionado no pertenece a tus estudiantes registrados.'
            )

        return nombre

    def save(self, commit=True):
        instance = super().save(commit=False)
        if instance.monto is None:
            instance.monto = 0
        if commit:
            instance.save()
        return instance