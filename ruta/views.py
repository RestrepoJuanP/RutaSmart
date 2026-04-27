from django.conf import settings
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from accounts.decorators import role_required
from accounts.models import User
from students.models import Student

from .forms import RutaForm
from .models import Ruta, RutaParada


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
	ruta = get_object_or_404(Ruta.objects.prefetch_related("paradas__estudiante"), pk=pk, conductor=request.user)
	paradas = list(ruta.paradas.select_related("estudiante").order_by("orden", "estudiante__full_name"))
	addresses = [
		{
			"orden": p.orden,
			"estudiante": p.estudiante.full_name,
			"direccion": p.estudiante.address,
			"acudiente": p.estudiante.guardian_name,
		}
		for p in paradas
	]

	recorrido = []
	if ruta.posicion_colegio == Ruta.PosicionColegio.INICIO:
		recorrido.append(
			{
				"tipo": "colegio",
				"nombre": "Colegio",
				"direccion": ruta.direccion_colegio,
			}
		)

	recorrido.extend(
		{
			"tipo": "estudiante",
			"nombre": p.estudiante.full_name,
			"direccion": p.estudiante.address,
			"orden": p.orden,
		}
		for p in paradas
	)

	if ruta.posicion_colegio == Ruta.PosicionColegio.FINAL:
		recorrido.append(
			{
				"tipo": "colegio",
				"nombre": "Colegio",
				"direccion": ruta.direccion_colegio,
			}
		)

	context = {
		"ruta": ruta,
		"paradas": paradas,
		"addresses": addresses,
		"recorrido": recorrido,
		"google_maps_api_key": settings.GOOGLE_MAPS_API_KEY,
	}
	return render(request, "ruta/ruta_map.html", context)
