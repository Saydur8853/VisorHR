from django.contrib import admin
from django.utils import timezone

from .models import EmpPersonal


@admin.register(EmpPersonal)
class EmpPersonalAdmin(admin.ModelAdmin):
    required_fields = [
        "emp_code",
        "emp_name",
        "date_of_birth",
        "sex",
        "religion",
        "blood_group",
        "marital_status",
        "nationality",
        "contact_no",
        "national_id",
        "present_vill",
        "present_dist",
        "present_address",
        "parmanent_vill",
        "parmanent_dist",
        "permanent_address",
        "emp_photo",
    ]
    list_display = ("emp_id", "emp_code", "emp_name", "bang_emp_name", "father_name", "mother_name", "national_id")
    search_fields = (
        "emp_code",
        "emp_name",
        "bang_emp_name",
        "card_no",
        "father_name",
        "mother_name",
        "national_id",
        "smart_id",
    )

    readonly_fields = ("photo_added_date", "updated_date")

    fieldsets = (
        (
            "Employee Info",
            {
                "fields": (
                    "emp_code",
                    "emp_name",
                    "bang_emp_name",
                    "card_no",
                    "emp_photo",
                    "emp_signature",
                )
            },
        ),
        (
            "Personal Details",
            {
                "fields": (
                    "father_name",
                    "bang_father_name",
                    "mother_name",
                    "bang_mother_name",
                    "husband_name",
                    "bang_husband_name",
                    "date_of_birth",
                    "sex",
                    "religion",
                    "blood_group",
                    "marital_status",
                    "nationality",
                    "town_of_birth",
                    "child_male",
                    "child_female",
                )
            },
        ),
        (
            "Education & Work",
            {
                "fields": (
                    "education",
                    "employement",
                    "passed_year",
                    "last_exp",
                    "curr_activity",
                    "sob",
                    "contractual",
                )
            },
        ),
        (
            "Contact & IDs",
            {
                "fields": (
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
                )
            },
        ),
        (
            "Present Address",
            {
                "fields": (
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
                )
            },
        ),
        (
            "Permanent Address",
            {
                "fields": (
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
                )
            },
        ),
        (
            "Other",
            {
                "fields": (
                    "pre_house_owner",
                    "remarks",
                    "pre_house_owner_bang",
                )
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        if not obj.photo_added_by:
            obj.photo_added_by = request.user.id
        obj.updated_date = timezone.now().date()
        obj.updated_by = request.user.id
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        for fname in self.required_fields:
            if fname in form.base_fields:
                form.base_fields[fname].required = True
        return form
