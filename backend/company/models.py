from django.db import models


class Department(models.Model):
    department_id = models.BigAutoField(primary_key=True)
    priority = models.IntegerField(null=True, blank=True, unique=True)
    department_name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=10, null=True, blank=True)
    bang_dept_name = models.CharField(max_length=30, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    remarks = models.CharField(max_length=20, null=True, blank=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "DEPARTMENT"
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        managed = True

    def __str__(self):
        return self.department_name


class Section(models.Model):
    section_id = models.BigAutoField(primary_key=True)
    section_name = models.CharField(max_length=40)
    bang_sec_name = models.CharField(max_length=40, null=True, blank=True)
    remarks = models.CharField(max_length=32, null=True, blank=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "SECTION"
        verbose_name = "Section"
        verbose_name_plural = "Sections"
        managed = True

    def __str__(self):
        return self.section_name


class Floor(models.Model):
    floor_id = models.BigAutoField(primary_key=True)
    floor_name = models.CharField(max_length=40)
    bang_floor_name = models.CharField(max_length=40, null=True, blank=True)
    remarks = models.CharField(max_length=32, null=True, blank=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "FLOOR"
        verbose_name = "Floor"
        verbose_name_plural = "Floors"
        managed = True

    def __str__(self):
        return self.floor_name


class Unit(models.Model):
    unit_id = models.BigAutoField(primary_key=True)
    unit_name = models.CharField(max_length=32)
    company = models.ForeignKey(
        "Company",
        db_column="company_id",
        on_delete=models.PROTECT,
        default=1,
        related_name="units",
    )
    address = models.CharField(max_length=64, null=True, blank=True)
    address_bang = models.CharField(max_length=64, null=True, blank=True)
    short_name = models.CharField(max_length=10, null=True, blank=True)
    unit_logo = models.ImageField(upload_to="company/unit-logos/", null=True, blank=True)
    authorized_signature = models.ImageField(upload_to="company/authorized-signatures/", null=True, blank=True)
    bang_unit_name = models.CharField(max_length=50, null=True, blank=True)
    bang_address = models.CharField(max_length=64, null=True, blank=True)
    unit_email = models.EmailField(max_length=254, null=True, blank=True)
    unit_phone = models.CharField(max_length=20, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    remarks = models.CharField(max_length=32, null=True, blank=True)
    created_by = models.CharField(max_length=150)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "UNIT"
        verbose_name = "Unit"
        verbose_name_plural = "Units"
        managed = True

    def __str__(self):
        return self.unit_name


class Designation(models.Model):
    designation_id = models.BigAutoField(primary_key=True)
    designation_name = models.CharField(max_length=40)
    bang_designation_name = models.CharField(max_length=30, null=True, blank=True)
    grade = models.IntegerField(null=True, blank=True)
    priority = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    remarks = models.CharField(max_length=32, null=True, blank=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "DESIGNATION"
        verbose_name = "Designation"
        verbose_name_plural = "Designations"
        managed = True

    def __str__(self):
        return self.designation_name


class Company(models.Model):
    company_id = models.BigAutoField(primary_key=True)
    company_name = models.CharField(max_length=64)
    short_name = models.CharField(max_length=10, null=True, blank=True)
    company_name_bang = models.CharField(max_length=64, null=True, blank=True)
    address = models.CharField(max_length=64, null=True, blank=True)
    address_bang = models.CharField(max_length=64, null=True, blank=True)
    company_email = models.EmailField(max_length=254, null=True, blank=True)
    company_phone = models.CharField(max_length=20, null=True, blank=True)
    company_logo = models.ImageField(upload_to="company/logos/", null=True, blank=True)
    remarks = models.CharField(max_length=32, null=True, blank=True)
    created_by = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    updated_by = models.CharField(max_length=150, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True, auto_now=True)

    class Meta:
        db_table = "COMPANY"
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        managed = True

    def __str__(self):
        return self.company_name
