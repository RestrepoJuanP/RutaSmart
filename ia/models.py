import json

from django.db import models

from ruta.models import Ruta
from students.models import Student


class RutaIA(models.Model):
    """
    Almacena el contenido generado por IA para cada ruta:
    - descripcion: texto generado por GPT-4o-mini
    - imagen_url:  URL de la ilustración generada por DALL-E 3
    - embedding_json: vector de embedding (texto serializado como JSON)
    """

    ruta = models.OneToOneField(
        Ruta,
        on_delete=models.CASCADE,
        related_name="ia_data",
        verbose_name="Ruta",
    )
    descripcion = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descripción generada por IA",
    )
    imagen_url = models.URLField(
        max_length=2000,
        blank=True,
        null=True,
        verbose_name="URL de ilustración (DALL-E)",
    )
    embedding_json = models.TextField(
        blank=True,
        null=True,
        verbose_name="Embedding (JSON)",
        help_text="Vector numérico de la descripción, serializado como JSON.",
    )
    generado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Datos IA de Ruta"
        verbose_name_plural = "Datos IA de Rutas"

    def __str__(self):
        return f"IA → {self.ruta.nombre}"

    # ------------------------------------------------------------------ helpers
    def get_embedding(self):
        """Deserializa y devuelve el embedding como lista de floats, o None."""
        if self.embedding_json:
            return json.loads(self.embedding_json)
        return None

    def set_embedding(self, vector: list):
        """Serializa el vector de floats y lo guarda en embedding_json."""
        self.embedding_json = json.dumps(vector)

    @property
    def tiene_descripcion(self):
        return bool(self.descripcion)

    @property
    def tiene_imagen(self):
        return bool(self.imagen_url)

    @property
    def tiene_embedding(self):
        return bool(self.embedding_json)


class EstudianteEmbedding(models.Model):
    """
    Almacena el embedding de la dirección de un estudiante.
    Se usa en el sistema de recomendación de rutas.
    """

    estudiante = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name="embedding_data",
        verbose_name="Estudiante",
    )
    embedding_json = models.TextField(
        blank=True,
        null=True,
        verbose_name="Embedding de dirección (JSON)",
    )
    generado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Embedding de Estudiante"
        verbose_name_plural = "Embeddings de Estudiantes"

    def __str__(self):
        return f"Embedding → {self.estudiante.full_name}"

    def get_embedding(self):
        if self.embedding_json:
            return json.loads(self.embedding_json)
        return None

    def set_embedding(self, vector: list):
        self.embedding_json = json.dumps(vector)
