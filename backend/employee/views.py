import json
from datetime import date, datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import EmpPersonal


def _parse_json(request):
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@csrf_exempt
@require_POST
def save_employee(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "Authentication required."}, status=401)

    data = None
    files = request.FILES
    if request.content_type and request.content_type.startswith("application/json"):
        data = _parse_json(request)
        if data is None:
            return JsonResponse({"success": False, "message": "Invalid JSON body."}, status=400)
    else:
        data = request.POST

    def val(name):
        raw = data.get(name)
        if raw is None:
            return None
        if isinstance(raw, str):
            stripped = raw.strip()
            return stripped or None
        return raw

    def to_int(name):
        v = val(name)
        if v in (None, ""):
            return None
        try:
            return int(v)
        except (ValueError, TypeError):
            return None

    def to_date(name):
        v = val(name)
        if not v:
            return None
        try:
            return date.fromisoformat(v)
        except ValueError:
            try:
                parsed = datetime.strptime(v, "%d-%b-%Y")
                return parsed.date()
            except ValueError:
                return None

    emp = EmpPersonal()
    simple_fields = [
        "emp_code",
        "emp_name",
        "bang_emp_name",
        "card_no",
        "father_name",
        "bang_father_name",
        "mother_name",
        "bang_mother_name",
        "husband_name",
        "bang_husband_name",
        "sex",
        "religion",
        "blood_group",
        "marital_status",
        "nationality",
        "town_of_birth",
        "education",
        "employement",
        "passed_year",
        "last_exp",
        "curr_activity",
        "sob",
        "e_mail",
        "contact_no",
        "emergency_cell",
        "emrg_cell_no",
        "emrg_address",
        "national_id",
        "birth_certificate_no",
        "smart_id",
        "pasport_no",
        "tin_no",
        "nominee_cell_no",
        "ref_contact_name",
        "ref_relation",
        "ref_address",
        "present_vill",
        "bang_present_vill",
        "present_house",
        "present_ps",
        "bang_present_ps",
        "present_dist",
        "bang_present_dist",
        "present_address",
        "bang_present_post",
        "present_postal_code",
        "parmanent_house",
        "parmanent_vill",
        "bang_permanent_vill",
        "parmanent_ps",
        "bang_permanent_ps",
        "parmanent_dist",
        "bang_permanent_dist",
        "permanent_address",
        "parmenent_address",
        "bang_permanent_post",
        "permanent_postal_code",
        "pre_house_owner",
        "pre_house_owner_bang",
        "remarks",
    ]

    for field_name in simple_fields:
        setattr(emp, field_name, val(field_name))

    emp.child_male = to_int("child_male")
    emp.child_female = to_int("child_female")
    emp.contractual = (val("contractual") or "N").upper()
    emp.date_of_birth = to_date("date_of_birth")

    photo = files.get("emp_photo")
    signature = files.get("emp_signature")
    if photo:
        emp.emp_photo = photo
    if signature:
        emp.emp_signature = signature

    if not emp.photo_added_by:
        emp.photo_added_by = request.user.id
    emp.updated_by = request.user.id

    emp.save()

    return JsonResponse(
        {
          "success": True,
          "message": "Employee saved.",
          "emp_id": emp.emp_id,
        },
        status=201,
    )
