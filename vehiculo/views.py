from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView

from conductor.models import Conductor
from .models import Vehiculo
from django.core.exceptions import ObjectDoesNotExist

class registerVehicleView(CreateView):
    model = Vehiculo
    fields = ['placa', 'marca', 'linea', 'modelo', 'color', 'num_asientos', 'combustible', 'transmision', 'cilindraje']
    template_name = 'register_vehicle.html'
    success_url = reverse_lazy('list_vehicle')
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["conductor_prueba"] = Conductor.objects.first()
        return context
    def form_valid(self, form):
        #usuario de prueba
        user = Conductor.objects.first()
        if not isinstance(user, Conductor):
            form.add_error(None, "El usuario no tiene conductor asociado.")
            return self.form_invalid(form)

        form.instance.conductor = user
        return super().form_valid(form)
    
class listVehicleView(ListView):
    model = Vehiculo
    template_name = 'list_vehicle.html'
    context_object_name = 'vehiculos'

    def get_queryset(self):
        return Vehiculo.objects.filter(conductor=Conductor.objects.first())





