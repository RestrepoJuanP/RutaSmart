from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ruta", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="ruta",
            name="direccion_origen",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="ruta",
            name="posicion_colegio",
            field=models.CharField(
                choices=[("inicio", "Inicio de la ruta"), ("final", "Final de la ruta")],
                default="final",
                max_length=10,
            ),
        ),
    ]
