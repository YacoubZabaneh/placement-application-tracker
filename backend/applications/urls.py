from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .auth_views import register_user
from .views import ApplicationViewSet

router = DefaultRouter()
router.register("applications", ApplicationViewSet, basename="application")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", register_user, name="register"),
    path("auth/login/", obtain_auth_token, name="login"),
]