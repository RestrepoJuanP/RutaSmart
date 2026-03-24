from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from accounts.decorators import role_required
from accounts.models import User
from .forms import StudentForm
from .models import Student


@role_required(User.Role.PARENT_STUDENT)
def student_list(request):
    students = Student.objects.filter(owner=request.user, is_active=True)
    return render(request, "students/student_list.html", {"students": students})


@role_required(User.Role.PARENT_STUDENT)
def student_create(request):
    if request.method == "POST":
        form = StudentForm(request.POST)
        if form.is_valid():
            student = form.save(commit=False)
            student.owner = request.user
            student.save()
            messages.success(request, "Estudiante registrado exitosamente.")
            return redirect("students:student_list")
    else:
        form = StudentForm()

    return render(
        request,
        "students/student_form.html",
        {
            "form": form,
            "title": "Registrar Estudiante",
            "button_text": "Guardar Estudiante",
        },
    )


@role_required(User.Role.PARENT_STUDENT)
def student_update(request, pk):
    student = get_object_or_404(Student, pk=pk, owner=request.user)

    if request.method == "POST":
        form = StudentForm(request.POST, instance=student)
        if form.is_valid():
            form.save()
            messages.success(request, "Estudiante actualizado exitosamente.")
            return redirect("students:student_list")
    else:
        form = StudentForm(instance=student)

    return render(
        request,
        "students/student_form.html",
        {
            "form": form,
            "title": "Editar Estudiante",
            "button_text": "Actualizar Estudiante",
        },
    )


@role_required(User.Role.PARENT_STUDENT)
def student_deactivate(request, pk):
    student = get_object_or_404(Student, pk=pk, owner=request.user)

    if request.method == "POST":
        student.is_active = False
        student.save()
        messages.warning(request, "Estudiante marcado como inactivo.")
        return redirect("students:student_list")

    return render(request, "students/student_confirm_deactivate.html", {"student": student})