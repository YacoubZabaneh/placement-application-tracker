from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        "company",
        "role",
        "status",
        "applied_date",
        "deadline",
    ]
    list_filter = ["status", "applied_date"]
    search_fields = ["company", "role"]