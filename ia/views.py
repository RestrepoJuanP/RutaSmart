from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from accounts.decorators import role_required
from accounts.models import User
from ruta.models import Ruta
from students.models import Student

from . import services
from .models import EstudianteEmbedding, RutaIA


# ---------------------------------------------------------------------------
# Dashboard de IA (vista principal del módulo)
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def ia_dashboard(request):
    """
    Muestra todas las rutas del conductor con el estado de su contenido IA:
    descripción, ilustración y embedding.
    """
    rutas = (
        Ruta.objects.filter(conductor=request.user, activa=True)
        .prefetch_related("paradas__estudiante")
        .order_by("nombre")
    )

    rutas_data = []
    for ruta in rutas:
        ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)
        rutas_data.append({"ruta": ruta, "ia": ia_obj})

    estudiantes_disponibles = (
        Student.objects.filter(
            rutas_asignadas__ruta__conductor=request.user,
            is_active=True,
        )
        .distinct()
        .order_by("full_name")
    )

    return render(
        request,
        "ia/dashboard.html",
        {
            "rutas_data": rutas_data,
            "estudiantes_disponibles": estudiantes_disponibles,
        },
    )


# ---------------------------------------------------------------------------
# Paso 4 – Generar descripción
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def generar_descripcion(request, ruta_id):
    """Genera o regenera la descripción IA para una ruta."""
    ruta = get_object_or_404(Ruta, pk=ruta_id, conductor=request.user)
    ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)

    try:
        ia_obj.descripcion = services.generar_descripcion_ruta(ruta)
        ia_obj.save()
        messages.success(request, f'✅ Descripción generada para "{ruta.nombre}".')
    except Exception as exc:
        messages.error(request, f"Error al generar descripción: {exc}")

    return redirect("ia:dashboard")


# ---------------------------------------------------------------------------
# Paso 5 – Generar ilustración
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def generar_imagen(request, ruta_id):
    """Genera una ilustración DALL-E 3 para una ruta."""
    ruta = get_object_or_404(Ruta, pk=ruta_id, conductor=request.user)
    ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)

    try:
        ia_obj.imagen_url = services.generar_imagen_ruta(ruta)
        ia_obj.save()
        messages.success(request, f'🎨 Ilustración generada para "{ruta.nombre}".')
    except Exception as exc:
        messages.error(request, f"Error al generar ilustración: {exc}")

    return redirect("ia:dashboard")


# ---------------------------------------------------------------------------
# Paso 6 – Generar embedding
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def generar_embedding(request, ruta_id):
    """
    Genera el embedding de la descripción de una ruta.
    Requiere que la descripción ya haya sido generada.
    """
    ruta = get_object_or_404(Ruta, pk=ruta_id, conductor=request.user)
    ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)

    if not ia_obj.descripcion:
        messages.warning(
            request,
            "⚠️ Primero debes generar la descripción de la ruta antes de crear su embedding.",
        )
        return redirect("ia:dashboard")

    try:
        vector = services.generar_embedding(ia_obj.descripcion)
        ia_obj.set_embedding(vector)
        ia_obj.save()
        messages.success(request, f'🔢 Embedding generado para "{ruta.nombre}".')
    except Exception as exc:
        messages.error(request, f"Error al generar embedding: {exc}")

    return redirect("ia:dashboard")


# ---------------------------------------------------------------------------
# Vista detalle de una ruta con contenido IA
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def detalle_ruta_ia(request, ruta_id):
    """Muestra la descripción e ilustración IA de una ruta."""
    ruta = get_object_or_404(Ruta, pk=ruta_id, conductor=request.user)
    ia_obj, _ = RutaIA.objects.get_or_create(ruta=ruta)
    paradas = ruta.paradas.select_related("estudiante").order_by("orden")

    return render(
        request,
        "ia/ruta_detail.html",
        {"ruta": ruta, "ia": ia_obj, "paradas": paradas},
    )


# ---------------------------------------------------------------------------
# Paso 7 – Sistema de recomendación de rutas para un estudiante
# ---------------------------------------------------------------------------

@role_required(User.Role.DRIVER)
def recomendar_ruta(request, student_id):
    """
    Recomienda las rutas más adecuadas para un estudiante según la
    similitud coseno entre el embedding de su dirección y las
    descripciones vectorizadas de las rutas activas del conductor.
    """
    estudiante = get_object_or_404(
        Student.objects.filter(
            rutas_asignadas__ruta__conductor=request.user,
            is_active=True,
        ).distinct(),
        pk=student_id,
    )

    # Solo rutas con embedding generado
    rutas_ia = RutaIA.objects.filter(
        ruta__conductor=request.user,
        ruta__activa=True,
    ).exclude(embedding_json=None).select_related("ruta")

    recomendaciones = []
    error_msg = None

    if rutas_ia.exists():
        try:
            recomendaciones = services.recomendar_rutas_para_estudiante(
                estudiante, rutas_ia, top_n=3
            )
        except Exception as exc:
            error_msg = str(exc)
    else:
        error_msg = (
            "No hay rutas con embeddings generados. "
            "Ve al Panel IA, genera descripciones y luego genera los embeddings."
        )

    return render(
        request,
        "ia/recomendaciones.html",
        {
            "estudiante": estudiante,
            "recomendaciones": recomendaciones,
            "error_msg": error_msg,
            "rutas_sin_embedding": not rutas_ia.exists(),
        },
    )
