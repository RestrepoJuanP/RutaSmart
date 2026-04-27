"""
ia/services.py
==============
Capa de servicios para las integraciones con OpenAI.

Funciones disponibles:
    - generar_descripcion_ruta(ruta)  → str
    - generar_imagen_ruta(ruta)       → str (URL)
    - generar_embedding(texto)        → list[float]
    - cosine_similarity(a, b)         → float
    - recomendar_rutas_para_estudiante(estudiante, rutas_ia, top_n) → list
"""

import math

from django.conf import settings
from openai import OpenAI


# ---------------------------------------------------------------------------
# Cliente
# ---------------------------------------------------------------------------

def _get_client() -> OpenAI:
    api_key = (settings.OPENAI_API_KEY or "").strip()
    if not api_key:
        raise RuntimeError(
            "No se encontro OPENAI_API_KEY en las variables de entorno."
        )
    return OpenAI(api_key=api_key)


# ---------------------------------------------------------------------------
# Paso 4 – Generar descripción de ruta con GPT-4o-mini
# ---------------------------------------------------------------------------

def generar_descripcion_ruta(ruta) -> str:
    """
    Genera una descripción en lenguaje natural para una ruta escolar
    usando el modelo GPT-4o-mini.

    Args:
        ruta: instancia de ruta.models.Ruta

    Returns:
        Texto de descripción generado por el modelo.
    """
    client = _get_client()

    paradas = ruta.paradas.select_related("estudiante").order_by("orden")
    num_paradas = paradas.count()
    direcciones_muestra = [p.estudiante.address for p in paradas[:5]]

    prompt = f"""Eres un asistente de la plataforma de transporte escolar RutaSmart.

Genera una descripción informativa y clara para la siguiente ruta escolar:

- Nombre de la ruta: {ruta.nombre}
- Colegio de destino: {ruta.direccion_colegio}
- Número de estudiantes: {num_paradas}
- Direcciones de recogida (primeras {len(direcciones_muestra)}): {", ".join(direcciones_muestra) if direcciones_muestra else "No disponibles aún"}

Escribe una descripción en español de máximo 3 oraciones. Menciona el sector o zona general, \
el número de estudiantes y el colegio al que se dirige la ruta. Sé concreto y útil para el conductor."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=250,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


# ---------------------------------------------------------------------------
# Paso 5 – Generar ilustración con DALL-E 3
# ---------------------------------------------------------------------------

def generar_imagen_ruta(ruta) -> str:
    """
    Genera una ilustración representativa para la ruta usando DALL-E 3.

    Args:
        ruta: instancia de ruta.models.Ruta

    Returns:
        URL de la imagen generada (válida por ~1 hora en OpenAI).
    """
    client = _get_client()

    prompt = (
        "A colorful and friendly digital illustration of a school bus route in a Colombian "
        "urban neighborhood. The yellow school bus drives through residential streets lined "
        "with typical Colombian architecture, green trees, and children safely waiting at "
        "stops. The style is clean, modern, and professional — suitable for a school "
        "transportation management app. Warm colors, daytime scene, no text in the image."
    )

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
        quality="standard",
    )
    return response.data[0].url


# ---------------------------------------------------------------------------
# Paso 6 – Generar embeddings
# ---------------------------------------------------------------------------

def generar_embedding(texto: str) -> list:
    """
    Genera el vector de embedding de un texto usando text-embedding-3-small.

    Args:
        texto: cadena de texto a vectorizar.

    Returns:
        Lista de floats (vector de 1536 dimensiones).
    """
    client = _get_client()
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texto,
    )
    return response.data[0].embedding


# ---------------------------------------------------------------------------
# Paso 7 – Sistema de recomendación
# ---------------------------------------------------------------------------

def cosine_similarity(vec_a: list, vec_b: list) -> float:
    """
    Calcula la similitud coseno entre dos vectores.

    Returns:
        Valor entre -1.0 y 1.0. Más cercano a 1.0 → más similares.
    """
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(x * x for x in vec_a))
    mag_b = math.sqrt(sum(x * x for x in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def recomendar_rutas_para_estudiante(estudiante, rutas_ia_qs, top_n: int = 3) -> list:
    """
    Recomienda las mejores rutas para un estudiante comparando el embedding
    de su dirección con los embeddings de las descripciones de las rutas.

    Args:
        estudiante:   instancia de students.models.Student
        rutas_ia_qs:  QuerySet de ia.models.RutaIA con embeddings generados
        top_n:        número máximo de recomendaciones a devolver

    Returns:
        Lista de dicts con claves 'ruta', 'score' (0-100), 'similitud' (0.0-1.0)
        ordenados de mayor a menor similitud.
    """
    from ia.models import EstudianteEmbedding

    # Obtener o generar el embedding de la dirección del estudiante
    emb_obj, _ = EstudianteEmbedding.objects.get_or_create(estudiante=estudiante)
    if not emb_obj.embedding_json:
        texto = f"Dirección de recogida: {estudiante.address}. Estudiante: {estudiante.full_name}."
        vector = generar_embedding(texto)
        emb_obj.set_embedding(vector)
        emb_obj.save()

    student_vec = emb_obj.get_embedding()

    resultados = []
    for ruta_ia in rutas_ia_qs:
        ruta_vec = ruta_ia.get_embedding()
        if ruta_vec:
            sim = cosine_similarity(student_vec, ruta_vec)
            resultados.append({
                "ruta": ruta_ia.ruta,
                "similitud": sim,
                "score": round(sim * 100, 1),
            })

    resultados.sort(key=lambda x: x["similitud"], reverse=True)
    return resultados[:top_n]
