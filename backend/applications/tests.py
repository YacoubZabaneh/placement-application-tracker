from datetime import date

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Application


class ApplicationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="Strong-Test_82!Password",
        )
        self.client.force_authenticate(user=self.user)

        self.application = Application.objects.create(
            owner=self.user,
            company="Bloomberg",
            role="Software Engineering Placement",
            status=Application.Status.APPLIED,
            applied_date=date(2026, 8, 28),
        )

    def test_list_applications(self):
        response = self.client.get(reverse("application-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["company"], "Bloomberg")

    def test_create_application(self):
        application_data = {
            "company": "Microsoft",
            "role": "Software Engineer Intern",
            "status": "Interview",
            "applied_date": "2026-08-29",
            "job_url": "",
            "notes": "Technical interview scheduled.",
            "deadline": None,
        }

        response = self.client.post(
            reverse("application-list"),
            application_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 2)
        self.assertEqual(response.data["company"], "Microsoft")

        created_application = Application.objects.get(
            company="Microsoft",
        )
        self.assertEqual(created_application.owner, self.user)

    def test_update_application(self):
        response = self.client.patch(
            reverse(
                "application-detail",
                args=[self.application.id],
            ),
            {"status": "Offer"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.application.refresh_from_db()

        self.assertEqual(
            self.application.status,
            Application.Status.OFFER,
        )

    def test_delete_application(self):
        response = self.client.delete(
            reverse(
                "application-detail",
                args=[self.application.id],
            ),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )
        self.assertEqual(Application.objects.count(), 0)

    def test_rejects_invalid_status(self):
        application_data = {
            "company": "IBM",
            "role": "Technology Placement",
            "status": "Unknown",
            "applied_date": "2026-08-30",
        }

        response = self.client.post(
            reverse("application-list"),
            application_data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_user_only_sees_own_applications(self):
        another_user = User.objects.create_user(
            username="anotheruser",
            password="Another-Strong_42!Password",
        )

        Application.objects.create(
            owner=another_user,
            company="Private Company",
            role="Private Role",
            status=Application.Status.APPLIED,
            applied_date=date(2026, 8, 30),
        )

        response = self.client.get(reverse("application-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["company"], "Bloomberg")

    def test_unauthenticated_request_is_rejected(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(reverse("application-list"))

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )