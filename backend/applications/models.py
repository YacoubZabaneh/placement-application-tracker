from django.db import models


class Application(models.Model):
    class Status(models.TextChoices):
        APPLIED = "Applied", "Applied"
        INTERVIEW = "Interview", "Interview"
        OFFER = "Offer", "Offer"
        REJECTED = "Rejected", "Rejected"

    company = models.CharField(max_length=150)
    role = models.CharField(max_length=200)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.APPLIED,
    )
    applied_date = models.DateField()
    job_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-applied_date", "-created_at"]

    def __str__(self):
        return f"{self.company} — {self.role}"