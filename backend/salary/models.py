from django.db import models


class SalaryRuleInfo(models.Model):
    rule_id = models.BigAutoField(primary_key=True)
    rule_name = models.CharField(max_length=64)
    rule_basic = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_house_rent = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_medical = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_transport = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_food = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_attd_bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_dearness_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    attdance_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    ot_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    night_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    washing_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    driver_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    export_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    deduct_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    rule_status = models.BooleanField(default=True)
    rule_remarks = models.CharField(max_length=128, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)

    class Meta:
        db_table = "SALARY_RULE_INFO"
        verbose_name = "Salary Rule Info"
        verbose_name_plural = "Salary Rule Info"
        managed = True

    def __str__(self):
        return self.rule_name
