from django.conf import settings
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from accounts.decorators import role_required
from accounts.models import User
from students.models import Student

from .forms import RutaForm
from .models import Ruta, RutaParada


def _normalize_address(value):
    return " ".join((value or "").lower().split())


def _build_route_points(ruta, paradas):
    points = []

    if ruta.direccion_origen:
        points.append(
            {
                "tipo": "origen",
                "nombre": "Origen del conductor",
                "direccion": ruta.direccion_origen,
            }
        )

    if ruta.posicion_colegio == Ruta.PosicionColegio.INICIO:
        points.append(
            {
                "tipo": "colegio",
                "nombre": "Colegio",
                "direccion": ruta.direccion_colegio,
            }
        )

    points.extend(
        {
            "tipo": "estudiante",
            "nombre": p.estudiante.full_name,
            "direccion": p.estudiante.address,
            "orden": p.orden,
            "colegio": p.estudiante.school_name,
        }
        for p in paradas
    )

    if ruta.posicion_colegio == Ruta.PosicionColegio.FINAL:
        points.append(
            {
                "tipo": "colegio",
                "nombre": "Colegio",
                "direccion": ruta.direccion_colegio,
            }
        )

    return points


def _build_route_warnings(points):
    warnings = []
    seen_by_address = {}

    for point in points:
        normalized = _normalize_address(point.get("direccion"))
        if not normalized:
            continue
        seen_by_address.setdefault(normalized, []).append(point["nombre"])

    duplicates = [
        names for names in seen_by_address.values()
        if len(names) > 1
    ]
    if duplicates:
        joined = "; ".join(", ".join(names) for names in duplicates)
        warnings.append(
            "Hay puntos con la misma dirección registrada en la ruta. "
            f"Revisa estos grupos: {joined}."
        )

    return warnings


@role_required(User.Role.DRIVER)
def ruta_list(request):
    rutas = Ruta.objects.filter(conductor=request.user).prefetch_related("paradas__estudiante")
    return render(request, "ruta/ruta_list.html", {"rutas": rutas})


@role_required(User.Role.DRIVER)
def ruta_create(request):
    if request.method == "POST":
        form = RutaForm(request.POST)
        if form.is_valid():
            ruta = form.save(commit=False)
            ruta.conductor = request.user
            if Ruta.objects.filter(conductor=request.user, nombre=ruta.nombre).exists():
                form.add_error("nombre", "Ya existe una ruta con ese nombre para este conductor.")
            else:
                ruta.save()
                messages.success(request, "Ruta creada correctamente.")
                return redirect("ruta:assign_students", pk=ruta.pk)
    else:
        form = RutaForm()

    return render(request, "ruta/ruta_form.html", {"form": form})


@role_required(User.Role.DRIVER)
def assign_students(request, pk):
    ruta = get_object_or_404(Ruta, pk=pk, conductor=request.user)
    students = list(Student.objects.filter(is_active=True).select_related("owner"))

    if request.method == "POST":
        selected_ids = request.POST.getlist("student_ids")

        if not selected_ids and ruta.paradas.exists():
            messages.warning(
                request,
                "No seleccionaste ningún estudiante. Si quieres dejar la ruta sin "
                "paradas, primero deselecciona los estudiantes existentes manualmente "
                "(la operación de vaciado total no se aplica desde este formulario).",
            )
            return redirect("ruta:assign_students", pk=ruta.pk)

        existing_orders = {parada.estudiante_id: parada.orden for parada in ruta.paradas.all()}

        nuevas_paradas = []
        seen_orders = set()

        for index, student_id in enumerate(selected_ids, start=1):
            try:
                sid = int(student_id)
            except ValueError:
                continue

            raw_order = request.POST.get(f"orden_{sid}", "").strip()
            if raw_order.isdigit() and int(raw_order) > 0:
                order_value = int(raw_order)
            else:
                order_value = existing_orders.get(sid, index)

            while order_value in seen_orders:
                order_value += 1
            seen_orders.add(order_value)
            nuevas_paradas.append(RutaParada(ruta=ruta, estudiante_id=sid, orden=order_value))

        ruta.paradas.all().delete()
        RutaParada.objects.bulk_create(nuevas_paradas)
        messages.success(request, "Estudiantes asignados a la ruta correctamente.")
        return redirect("ruta:assign_students", pk=ruta.pk)

    assigned = {parada.estudiante_id: parada.orden for parada in ruta.paradas.all()}
    student_rows = [
        {
            "student": student,
            "is_assigned": student.pk in assigned,
            "assigned_order": assigned.get(student.pk, ""),
        }
        for student in students
    ]

    return render(
        request,
        "ruta/ruta_assign_students.html",
        {
            "ruta": ruta,
            "student_rows": student_rows,
        },
    )


@role_required(User.Role.DRIVER)
def route_map(request, pk):
    ruta = get_object_or_404(
        Ruta.objects.prefetch_related("paradas__estudiante"),
        pk=pk,
        conductor=request.user,
    )
    paradas = list(
        ruta.paradas.select_related("estudiante").order_by("orden", "estudiante__full_name")
    )
    ordered_points = _build_route_points(ruta, paradas)
    warnings = _build_route_warnings(ordered_points)

    context = {
        "ruta": ruta,
        "paradas": paradas,
        "ordered_points": ordered_points,
        "route_warnings": warnings,
        "google_maps_api_key": settings.GOOGLE_MAPS_API_KEY,
    }
    return render(request, "ruta/ruta_map.html", context)
