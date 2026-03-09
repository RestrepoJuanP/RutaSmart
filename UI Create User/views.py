"""
Vistas de registro, autenticación y dashboard de RutaSmart.

Requisitos cubiertos:
  - FR01: Creación de cuenta de usuario (conductor / padre)
  - FR02: Autenticación de usuarios registrados
  - FR04: Restricción de acceso basada en rol
"""
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods

from .forms import (
    DriverRegistrationForm,
    ParentRegistrationForm,
    LoginForm,
    ProfileUpdateForm,
    DriverProfileUpdateForm,
)
from .models import User


# ═════════════════════════════════════════════════════════
# REGISTRO
# ═════════════════════════════════════════════════════════

def register_select(request):
    """
    Paso 1 del registro: el usuario elige su tipo de cuenta.
    Redirige al formulario correspondiente.
    """
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')
    return render(request, 'accounts/register_select.html')


@require_http_methods(['GET', 'POST'])
def register_driver(request):
    """
    Registro de conductor (FR01).
    Incluye datos personales + información del vehículo.
    """
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    if request.method == 'POST':
        form = DriverRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request,
                f'¡Bienvenido/a, {user.first_name}! Tu cuenta de conductor '
                f'ha sido creada exitosamente.',
            )
            return redirect('accounts:dashboard')
    else:
        form = DriverRegistrationForm()

    return render(request, 'accounts/register_driver.html', {'form': form})


@require_http_methods(['GET', 'POST'])
def register_parent(request):
    """
    Registro de padre / acudiente (FR01).
    Solo datos personales básicos.
    """
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    if request.method == 'POST':
        form = ParentRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(
                request,
                f'¡Bienvenido/a, {user.first_name}! Tu cuenta de padre/acudiente '
                f'ha sido creada exitosamente.',
            )
            return redirect('accounts:dashboard')
    else:
        form = ParentRegistrationForm()

    return render(request, 'accounts/register_parent.html', {'form': form})


# ═════════════════════════════════════════════════════════
# AUTENTICACIÓN
# ═════════════════════════════════════════════════════════

@require_http_methods(['GET', 'POST'])
def login_view(request):
    """
    Inicio de sesión (FR02).
    Utiliza email como identificador.
    """
    if request.user.is_authenticated:
        return redirect('accounts:dashboard')

    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Hola, {user.first_name}.')
            # Redirigir a la página solicitada o al dashboard
            next_url = request.GET.get('next', 'accounts:dashboard')
            return redirect(next_url)
    else:
        form = LoginForm()

    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    """Cerrar sesión."""
    logout(request)
    messages.info(request, 'Has cerrado sesión correctamente.')
    return redirect('accounts:login')


# ═════════════════════════════════════════════════════════
# DASHBOARD (FR04 — vistas diferenciadas por rol)
# ═════════════════════════════════════════════════════════

@login_required
def dashboard(request):
    """
    Punto de entrada principal tras el login.
    Redirige al dashboard correcto según el rol del usuario.
    """
    user = request.user

    if user.is_driver:
        return render(request, 'dashboard/driver_dashboard.html', {
            'user': user,
        })
    elif user.is_parent:
        return render(request, 'dashboard/parent_dashboard.html', {
            'user': user,
        })
    else:
        # Admin u otro rol → redirigir al admin de Django
        return redirect('/admin/')


# ═════════════════════════════════════════════════════════
# PERFIL
# ═════════════════════════════════════════════════════════

@login_required
@require_http_methods(['GET', 'POST'])
def profile(request):
    """Vista de perfil del usuario con capacidad de edición."""
    user = request.user

    if user.is_driver:
        FormClass = DriverProfileUpdateForm
    else:
        FormClass = ProfileUpdateForm

    if request.method == 'POST':
        form = FormClass(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Tu perfil ha sido actualizado.')
            return redirect('accounts:profile')
    else:
        form = FormClass(instance=user)

    return render(request, 'accounts/profile.html', {'form': form})
