from django.contrib import admin

from .models import SalaryRuleInfo


@admin.register(SalaryRuleInfo)
class SalaryRuleInfoAdmin(admin.ModelAdmin):
    list_display = ("rule_id", "rule_name", "rule_status", "updated_at", "created_at")
    search_fields = ("rule_name",)
