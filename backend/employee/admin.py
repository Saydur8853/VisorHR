from django.contrib import admin

from .models import EmpPersonal


@admin.register(EmpPersonal)
class EmpPersonalAdmin(admin.ModelAdmin):
    list_display = ("emp_id", "emp_code", "father_name", "mother_name", "national_id")
    search_fields = ("emp_code", "card_no", "father_name", "mother_name", "national_id", "smart_id")
