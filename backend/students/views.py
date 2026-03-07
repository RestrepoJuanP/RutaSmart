from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from .forms import StudentForm
from .models import Student


@login_required
def student_list(request):
    students = Student.objects.filter(owner=request.user, is_active=True)
    return render(request, "students/student_list.html", {"students": students})


@login_required
def student_create(request):
    if request.method == "POST":
        form = StudentForm(request.POST)
        if form.is_valid():
            student = form.save(commit=False)
            student.owner = request.user
            student.save()
            messages.success(request, "Student created successfully.")
            return redirect("student_list")
    else:
        form = StudentForm()

    return render(request, "students/student_form.html", {
        "form": form,
        "title": "Register Student",
        "button_text": "Save Student"
    })


@login_required
def student_update(request, pk):
    student = get_object_or_404(Student, pk=pk, owner=request.user)

    if request.method == "POST":
        form = StudentForm(request.POST, instance=student)
        if form.is_valid():
            form.save()
            messages.success(request, "Student updated successfully.")
            return redirect("student_list")
    else:
        form = StudentForm(instance=student)

    return render(request, "students/student_form.html", {
        "form": form,
        "title": "Edit Student",
        "button_text": "Update Student"
    })


@login_required
def student_deactivate(request, pk):
    student = get_object_or_404(Student, pk=pk, owner=request.user)

    if request.method == "POST":
        student.is_active = False
        student.save()
        messages.warning(request, "Student marked as inactive.")
        return redirect("student_list")

    return render(request, "students/student_confirm_deactivate.html", {
        "student": student
    })