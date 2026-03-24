from django.contrib import messages
from django.contrib.auth import login, logout
from django.shortcuts import redirect, render

from .decorators import role_required
from .forms import LoginForm, UserRegistrationForm
from .models import User


def _dashboard_for(user):
    if user.role == User.Role.ADMIN:
        return "admin:index"
    if user.role == User.Role.DRIVER:
        return "accounts:driver_dashboard"
    return "accounts:parent_dashboard"


def home(request):
    if request.user.is_authenticated:
        return redirect(_dashboard_for(request.user))
    return render(request, "accounts/home.html")


def register_view(request):
    if request.user.is_authenticated:
        return redirect(_dashboard_for(request.user))

    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Tu cuenta fue creada correctamente.")
            return redirect(_dashboard_for(user))
    else:
        form = UserRegistrationForm()

    return render(request, "accounts/register.html", {"form": form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect(_dashboard_for(request.user))

    if request.method == "POST":
        form = LoginForm(request.POST, request=request)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Bienvenido/a, {user.full_name}.")
            return redirect(_dashboard_for(user))
    else:
        form = LoginForm(request=request)

    return render(request, "accounts/login.html", {"form": form})


def logout_view(request):
    if request.method == "POST":
        logout(request)
        messages.info(request, "Sesión cerrada correctamente.")
    return redirect("accounts:login")


@role_required(User.Role.DRIVER)
def driver_dashboard(request):
    return render(request, "accounts/driver_dashboard.html")


@role_required(User.Role.PARENT_STUDENT)
def parent_dashboard(request):
    return render(request, "accounts/parent_dashboard.html")
