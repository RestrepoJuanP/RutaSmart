from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import ComprobantePagoForm
from finanzas.models import ComprobantePago


def finanzas_acudiente(request):
    form_has_errors = False
    mes = request.GET.get('mes', '')

    if request.method == 'POST':
        form = ComprobantePagoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(
                request,
                'Comprobante cargado exitosamente. Queda pendiente de validación por el conductor.',
            )
            return redirect('pagos:finanzas_acudiente')
        form_has_errors = True
    else:
        form = ComprobantePagoForm()

    qs = ComprobantePago.objects.all()
    if mes:
        qs = qs.filter(mes_pago=mes)

    stats = {
        'total': qs.count(),
        'aprobados': qs.filter(estado=ComprobantePago.Estado.APROBADO).count(),
        'pendientes': qs.filter(estado=ComprobantePago.Estado.PENDIENTE).count(),
        'rechazados': qs.filter(estado=ComprobantePago.Estado.RECHAZADO).count(),
    }

    return render(
        request,
        'pagos/finanzas_acudiente.html',
        {
            'form': form,
            'comprobantes': qs,
            'stats': stats,
            'mes_filtro': mes,
            'form_has_errors': form_has_errors,
        },
    )