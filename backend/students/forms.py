from django import forms
from .models import Student


class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = [
            "full_name",
            "address",
            "guardian_name",
            "guardian_phone",
            "guardian_email",
        ]
        widgets = {
            "full_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter student's full name"
            }),
            "address": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter student's address"
            }),
            "guardian_name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter guardian's name"
            }),
            "guardian_phone": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Enter guardian's phone number"
            }),
            "guardian_email": forms.EmailInput(attrs={
                "class": "form-control",
                "placeholder": "Enter guardian's email (optional)"
            }),
        }