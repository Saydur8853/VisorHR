from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("validate-admin/", views.validate_admin, name="validate_admin"),
    path("check-user-exists/", views.check_user_exists, name="check_user_exists"),
]
