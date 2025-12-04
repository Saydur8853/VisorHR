import json
from django.contrib.auth import authenticate, get_user_model, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


def _json_error(message, status=400):
    return JsonResponse({"success": False, "message": message}, status=status)


def _parse_body(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@csrf_exempt
@require_POST
def register(request):
    data = _parse_body(request)
    if data is None:
        return _json_error("Invalid JSON body.")

    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return _json_error("Username and password are required.")

    User = get_user_model()
    if User.objects.filter(username=username).exists():
        return _json_error("Username already exists.", status=409)

    first_user = User.objects.count() == 0
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_staff=first_user,
        is_superuser=first_user,
    )

    role_note = " (promoted to superadmin)" if first_user else ""
    return JsonResponse(
        {
            "success": True,
            "message": f"User registered{role_note}.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_superuser": user.is_superuser,
                "is_staff": user.is_staff,
            },
        },
        status=201,
    )


@csrf_exempt
@require_POST
def login(request):
    data = _parse_body(request)
    if data is None:
        return _json_error("Invalid JSON body.")

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return _json_error("Username and password are required.")

    user = authenticate(request, username=username, password=password)
    if user is None:
        return _json_error("Invalid credentials.", status=401)

    auth_login(request, user)
    return JsonResponse(
        {
            "success": True,
            "message": "Logged in.",
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }
    )


@csrf_exempt
@require_POST
def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)
    return JsonResponse({"success": True, "message": "Logged out."})
