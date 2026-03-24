from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import Conductor

@admin.register(Conductor)
class ConductorAdmin(admin.ModelAdmin):
    pass