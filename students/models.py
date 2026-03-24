from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="students"
    )
    full_name = models.CharField(max_length=120)
    address = models.CharField(max_length=255)
    guardian_name = models.CharField(max_length=120)
    guardian_phone = models.CharField(max_length=20)
    guardian_email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["full_name"]

    def __str__(self):
        return f"{self.full_name} - {self.owner.username}"
