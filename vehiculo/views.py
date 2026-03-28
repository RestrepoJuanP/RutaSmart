from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView

from accounts.models import User
from conductor.models import Conductor
from .models import Vehiculo


def _get_or_create_conductor(user):
    nombres = (user.full_name or "Conductor").strip().split()
    nombre = nombres[0]
    apellido = " ".join(nombres[1:]) if len(nombres) > 1 else "RutaSmart"

    conductor, creado = Conductor.objects.get_or_create(
        user=user,
        defaults={
            "nombre": nombre,
            "apellido": apellido,
            "documento": f"TEMP-{user.pk}",
            "correo": user.email,
        },
    )

    actualizado = False
    if conductor.correo != user.email:
        conductor.correo = user.email
        actualizado = True
    if not conductor.nombre:
        conductor.nombre = nombre
        actualizado = True
    if not conductor.apellido:
        conductor.apellido = apellido
        actualizado = True
    if actualizado:
        conductor.save()

    return conductor


class DriverRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    def test_func(self):
        return self.request.user.role == User.Role.DRIVER

    def handle_no_permission(self):
        messages.error(self.request, "Solo los conductores pueden acceder a esta funcionalidad.")
        return super().handle_no_permission()


class RegisterVehicleView(DriverRequiredMixin, CreateView):
    model = Vehiculo
    fields = [
        "placa",
        "marca",
        "linea",
        "modelo",
        "color",
        "num_asientos",
        "combustible",
        "transmision",
        "cilindraje",
    ]
    template_name = "register_vehicle.html"
    success_url = reverse_lazy("vehiculo:list")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["conductor_actual"] = _get_or_create_conductor(self.request.user)
        return context

    def form_valid(self, form):
        form.instance.conductor = _get_or_create_conductor(self.request.user)
        messages.success(self.request, "Vehículo registrado correctamente.")
        return super().form_valid(form)


class ListVehicleView(DriverRequiredMixin, ListView):
    model = Vehiculo
    template_name = "list_vehicle.html"
    context_object_name = "vehiculos"

    def get_queryset(self):
        conductor = _get_or_create_conductor(self.request.user)
        return Vehiculo.objects.filter(conductor=conductor)