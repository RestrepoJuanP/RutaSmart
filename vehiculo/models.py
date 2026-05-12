from django.core.validators import MinValueValidator
from django.db import models
from conductor.models import Conductor

class Vehiculo(models.Model):
        
    COMBUSTIBLE_CHOICES = [
        ("gasolina", "Gasolina"),
        ("diesel", "Diésel"),
        ("electrico", "Eléctrico"),
        ("hibrido", "Híbrido"),
        ("gas", "Gas (GNV/GLP)")
    ]

    TRANSMISION_CHOICES = [
        ("manual", "Manual"),
        ("automatica", "Automática"),
        ("cvt", "CVT"),
        ("dct", "Doble embrague (DCT)")
    ]

    placa = models.CharField(max_length = 6, primary_key=True)
    marca = models.CharField(max_length = 200)
    linea = models.CharField(max_length=200)
    modelo = models.PositiveIntegerField() 
    color = models.CharField(max_length=50)
    num_asientos = models.PositiveIntegerField(validators=[MinValueValidator(4)]) 

    combustible = models.CharField(
        max_length=20,
        choices=COMBUSTIBLE_CHOICES
    )

    transmision = models.CharField(
        max_length=20,
        choices=TRANSMISION_CHOICES
    )

    cilindraje = models.PositiveIntegerField(null=True, blank=True)

    conductor = models.ForeignKey(
        Conductor,
        on_delete=models.CASCADE,
        related_name="vehiculos"
    )


