from django.contrib import messages
from django.db.models import Sum
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from accounts.decorators import role_required
from accounts.models import User
from .forms import GastoForm
from .models import ComprobantePago, Gasto


@role_required(User.Role.DRIVER)
def dashboard(request):
    comprobantes = ComprobantePago.objects.all()
    ingresos = (
        comprobantes.filter(estado=ComprobantePago.Estado.APROBADO)
        .aggregate(total=Sum("monto"))["total"]
        or 0
    )
    total_gastos = Gasto.objects.aggregate(total=Sum("monto"))["total"] or 0
    balance = ingresos - total_gastos

    context = {
        "total": comprobantes.count(),
        "pendientes": comprobantes.filter(estado=ComprobantePago.Estado.PENDIENTE).count(),
        "aprobados": comprobantes.filter(estado=ComprobantePago.Estado.APROBADO).count(),
        "rechazados": comprobantes.filter(estado=ComprobantePago.Estado.RECHAZADO).count(),
        "ingresos": ingresos,
        "total_gastos": total_gastos,
        "balance": balance,
        "ultimos_gastos": Gasto.objects.all()[:5],
    }
    return render(request, "finanzas/dashboard.html", context)


@role_required(User.Role.DRIVER)
def historial(request):
    comprobantes = ComprobantePago.objects.all()
    return render(request, "finanzas/historial.html", {"comprobantes": comprobantes})


@role_required(User.Role.DRIVER)
def aprobar_comprobante(request, pk):
    comprobante = get_object_or_404(ComprobantePago, pk=pk)
    if request.method == "POST":
        comprobante.estado = ComprobantePago.Estado.APROBADO
        comprobante.comentario_validacion = request.POST.get("comentario", "").strip()
        comprobante.fecha_validacion = timezone.now()
        comprobante.save()
        messages.success(request, "Comprobante aprobado correctamente.")
    return redirect("finanzas:historial")


@role_required(User.Role.DRIVER)
def rechazar_comprobante(request, pk):
    comprobante = get_object_or_404(ComprobantePago, pk=pk)
    if request.method == "POST":
        comentario = request.POST.get("comentario", "").strip() or "Comprobante rechazado por el conductor."
        comprobante.estado = ComprobantePago.Estado.RECHAZADO
        comprobante.comentario_validacion = comentario
        comprobante.fecha_validacion = timezone.now()
        comprobante.save()
        messages.warning(request, "Comprobante rechazado.")
    return redirect("finanzas:historial")


@role_required(User.Role.DRIVER)
def gastos_historial(request):
    gastos = Gasto.objects.all()
    total = gastos.aggregate(total=Sum("monto"))["total"] or 0
    return render(request, "finanzas/gastos_historial.html", {"gastos": gastos, "total": total})


@role_required(User.Role.DRIVER)
def gastos_registrar(request):
    if request.method == "POST":
        form = GastoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Gasto registrado correctamente.")
            return redirect("finanzas:gastos_historial")
        messages.error(request, "Por favor corrija los errores en el formulario.")
    else:
        form = GastoForm()
    return render(request, "finanzas/gastos_registrar.html", {"form": form})


@role_required(User.Role.DRIVER)
def gastos_eliminar(request, pk):
    gasto = get_object_or_404(Gasto, pk=pk)
    if request.method == "POST":
        gasto.delete()
        messages.success(request, "Gasto eliminado.")
        return redirect("finanzas:gastos_historial")
    return render(request, "finanzas/gastos_confirmar_eliminar.html", {"gasto": gasto})


@csrf_exempt
@require_POST
def recibir_comprobante(request):
    try:
        comprobante = ComprobantePago(
            acudiente_nombre=request.POST.get("acudiente_nombre", ""),
            estudiante_nombre=request.POST.get("estudiante_nombre", ""),
            mes_pago=request.POST.get("mes_pago", ""),
            referencia_factura=request.POST.get("referencia_factura", ""),
            monto=request.POST.get("monto", 0),
        )
        if "archivo" in request.FILES:
            comprobante.archivo = request.FILES["archivo"]
        comprobante.full_clean()
        comprobante.save()
        return JsonResponse({"status": "ok", "id": comprobante.pk}, status=201)
    except Exception as e:
        return JsonResponse({"status": "error", "detail": str(e)}, status=400)