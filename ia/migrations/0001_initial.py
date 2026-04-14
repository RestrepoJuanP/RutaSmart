import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("ruta", "0001_initial"),
        ("students", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="RutaIA",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("descripcion", models.TextField(blank=True, null=True, verbose_name="Descripción generada por IA")),
                ("imagen_url", models.URLField(blank=True, max_length=2000, null=True, verbose_name="URL de ilustración (DALL-E)")),
                ("embedding_json", models.TextField(blank=True, help_text="Vector numérico de la descripción, serializado como JSON.", null=True, verbose_name="Embedding (JSON)")),
                ("generado_en", models.DateTimeField(auto_now=True)),
                (
                    "ruta",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ia_data",
                        to="ruta.ruta",
                        verbose_name="Ruta",
                    ),
                ),
            ],
            options={
                "verbose_name": "Datos IA de Ruta",
                "verbose_name_plural": "Datos IA de Rutas",
            },
        ),
        migrations.CreateModel(
            name="EstudianteEmbedding",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("embedding_json", models.TextField(blank=True, null=True, verbose_name="Embedding de dirección (JSON)")),
                ("generado_en", models.DateTimeField(auto_now=True)),
                (
                    "estudiante",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="embedding_data",
                        to="students.student",
                        verbose_name="Estudiante",
                    ),
                ),
            ],
            options={
                "verbose_name": "Embedding de Estudiante",
                "verbose_name_plural": "Embeddings de Estudiantes",
            },
        ),
    ]
