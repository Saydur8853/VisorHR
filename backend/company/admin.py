from django import forms
from django.contrib import admin
from django.db import models
from django.utils import timezone

from .models import Company, Department, Designation, Floor, Section, Unit


class DepartmentAdminForm(forms.ModelForm):
    class Meta:
        model = Department
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        existing = set(
            Department.objects.exclude(priority__isnull=True).values_list("priority", flat=True)
        )
        current = self.instance.priority if self.instance and self.instance.pk else None
        if current in existing:
            existing.remove(current)

        max_priority = max(existing, default=0)
        available = [p for p in range(1, max_priority + 1) if p not in existing]
        if available:
            help_text = f"Available priority slots: {', '.join(str(p) for p in available)}."
        else:
            next_priority = max_priority + 1
            help_text = f"No available slots. Next priority will be {next_priority}."

        self.fields["priority"].help_text = help_text


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    form = DepartmentAdminForm
    list_display = ("department_id", "priority", "department_name", "short_name", "bang_dept_name")
    search_fields = ("department_name", "short_name", "bang_dept_name")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    list_filter = ("is_active",)
    fields = (
        "priority",
        "department_name",
        "short_name",
        "bang_dept_name",
        "is_active",
        "remarks",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if obj.priority is None:
            max_priority = (
                Department.objects.exclude(priority__isnull=True)
                .aggregate(models.Max("priority"))
                .get("priority__max")
                or 0
            )
            obj.priority = max_priority + 1
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = (
        "unit_id",
        "unit_name",
        "short_name",
        "bang_unit_name",
        "bang_address",
        "remarks",
        "company",
    )
    list_filter = ("is_active",)
    search_fields = ("unit_name", "short_name", "bang_unit_name", "bang_address")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    fields = (
        "company",
        "unit_name",
        "short_name",
        "bang_unit_name",
        "bang_address",
        "address",
        "address_bang",
        "unit_email",
        "unit_phone",
        "is_active",
        "remarks",
        "unit_logo",
        "authorized_signature",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("section_id", "section_name", "bang_sec_name", "remarks")
    search_fields = ("section_name", "bang_sec_name")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    fields = (
        "section_name",
        "bang_sec_name",
        "remarks",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Floor)
class FloorAdmin(admin.ModelAdmin):
    list_display = ("floor_id", "floor_name", "bang_floor_name", "remarks")
    search_fields = ("floor_name", "bang_floor_name")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    fields = (
        "floor_name",
        "bang_floor_name",
        "remarks",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ("designation_id", "designation_name", "bang_designation_name", "grade", "priority")
    search_fields = ("designation_name", "bang_designation_name")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    list_filter = ("is_active",)
    fields = (
        "designation_name",
        "bang_designation_name",
        "grade",
        "priority",
        "is_active",
        "remarks",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("company_id", "company_name", "short_name", "company_email")
    search_fields = ("company_name", "short_name", "company_email", "company_phone")
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")
    fields = (
        "company_name",
        "short_name",
        "company_name_bang",
        "address",
        "address_bang",
        "company_email",
        "company_phone",
        "company_logo",
        "remarks",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
    )

    def save_model(self, request, obj, form, change):
        if not obj.created_by:
            obj.created_by = request.user.username
        obj.updated_by = request.user.username
        obj.updated_at = timezone.now()
        super().save_model(request, obj, form, change)
