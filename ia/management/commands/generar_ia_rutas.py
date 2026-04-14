"""
Comando de gestión para generar contenido IA en lote para todas las rutas.

Uso:
    python manage.py generar_ia_rutas
    python manage.py generar_ia_rutas --solo-descripcion
    python manage.py generar_ia_rutas --solo-embedding
    python manage.py generar_ia_rutas --conductor-email conductor@ejemplo.com
"""

from django.core.management.base import BaseCommand

from ia import services
from ia.models import RutaIA
from ruta.models import Ruta


class Command(BaseCommand):
    help = "Genera descripciones, imágenes y embeddings IA para todas las rutas activas."

    def add_arguments(self, parser):
        parser.add_argument(
            "--solo-descripcion",
            action="store_true",
            help="Genera solo las descripciones (sin imagen ni embedding).",
        )
        parser.add_argument(
            "--solo-embedding",
            action="store_true",
            help="Genera solo embeddings (requiere que ya existan descripciones).",
        )
        parser.add_argument(
            "--conductor-email",
            type=str,
            help="Limita la generación a las rutas de un conductor específico.",
        )

    def handle(self, *args, **options):
        rutas_qs = Ruta.objects.filter(activa=True).prefetch_related("paradas__estudiante")

        if options["conductor_email"]:
            rutas_qs = rutas_qs.filter(conductor__email=options["conductor_email"])

        total = rutas_qs.count()
        self.stdout.write(f"Procesando {total} ruta(s)...\n")

        for i, ruta in enumerate(rutas_qs, start=1):
            ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)
            self.stdout.write(f"[{i}/{total}] {ruta.nombre}")

            # --- Descripción ---
            if not options["solo_embedding"]:
                try:
                    ia_obj.descripcion = services.generar_descripcion_ruta(ruta)
                    self.stdout.write(self.style.SUCCESS("  ✓ Descripción generada"))
                except Exception as exc:
                    self.stdout.write(self.style.ERROR(f"  ✗ Descripción: {exc}"))

            # --- Imagen (solo si no se pidió solo descripción ni solo embedding) ---
            if not options["solo_descripcion"] and not options["solo_embedding"]:
                try:
                    ia_obj.imagen_url = services.generar_imagen_ruta(ruta)
                    self.stdout.write(self.style.SUCCESS("  ✓ Imagen generada"))
                except Exception as exc:
                    self.stdout.write(self.style.ERROR(f"  ✗ Imagen: {exc}"))

            # --- Embedding (requiere descripción) ---
            if not options["solo_descripcion"]:
                if ia_obj.descripcion:
                    try:
                        vector = services.generar_embedding(ia_obj.descripcion)
                        ia_obj.set_embedding(vector)
                        self.stdout.write(self.style.SUCCESS("  ✓ Embedding generado"))
                    except Exception as exc:
                        self.stdout.write(self.style.ERROR(f"  ✗ Embedding: {exc}"))
                else:
                    self.stdout.write(
                        self.style.WARNING("  ⚠ Sin descripción, embedding omitido.")
                    )

            ia_obj.save()

        self.stdout.write(self.style.SUCCESS(f"\nProceso completado: {total} ruta(s) procesadas."))
