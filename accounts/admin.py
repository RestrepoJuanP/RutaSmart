from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "phone_number", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active", "is_superuser")
    search_fields = ("email", "full_name", "phone_number")
    ordering = ("email",)
