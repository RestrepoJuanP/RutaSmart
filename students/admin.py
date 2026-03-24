from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("full_name", "owner", "guardian_name", "guardian_phone", "is_active")
    list_filter = ("is_active", "created_at")
    search_fields = ("full_name", "guardian_name", "guardian_phone", "guardian_email")
