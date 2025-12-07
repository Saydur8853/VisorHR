from datetime import date

from django.core.exceptions import ValidationError
from django.db import models

SEX_CHOICES = (
    ("male", "Male"),
    ("female", "Female"),
    ("other", "Other"),
)

RELIGION_CHOICES = (
    ("islam", "Islam"),
    ("hindu", "Hinduism"),
    ("buddhist", "Buddhism"),
    ("christian", "Christianity"),
    ("other", "Other"),
)

BLOOD_GROUP_CHOICES = (
    ("A+", "A+"),
    ("A-", "A-"),
    ("B+", "B+"),
    ("B-", "B-"),
    ("O+", "O+"),
    ("O-", "O-"),
    ("AB+", "AB+"),
    ("AB-", "AB-"),
)

MARITAL_STATUS_CHOICES = (
    ("single", "Single"),
    ("married", "Married"),
    ("divorced", "Divorced"),
    ("widowed", "Widowed"),
    ("other", "Other"),
)

CONTRACTUAL_CHOICES = (
    ("Y", "Yes"),
    ("N", "No"),
)


class EmpPersonal(models.Model):
    emp_id = models.BigAutoField(primary_key=True)

    emp_code = models.CharField(max_length=10, null=True, blank=True)
    emp_name = models.CharField(max_length=64, null=True, blank=True)
    card_no = models.CharField(max_length=10, null=True, blank=True)

    father_name = models.CharField(max_length=36, null=True, blank=True)
    mother_name = models.CharField(max_length=32, null=True, blank=True)
    husband_name = models.CharField(max_length=32, null=True, blank=True)

    def validate_minimum_age(value):
        if not value:
            return
        if value.year < 1900:
            raise ValidationError("Date of birth cannot be earlier than year 1900.")
        today = date.today()
        years = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if years < 18:
            raise ValidationError("Employee must be at least 18 years old.")

    date_of_birth = models.DateField(null=True, blank=True, validators=[validate_minimum_age])
    sex = models.CharField(max_length=6, null=True, blank=True, choices=SEX_CHOICES)
    religion = models.CharField(max_length=10, null=True, blank=True, choices=RELIGION_CHOICES)
    blood_group = models.CharField(max_length=4, null=True, blank=True, choices=BLOOD_GROUP_CHOICES)
    marital_status = models.CharField(max_length=8, null=True, blank=True, choices=MARITAL_STATUS_CHOICES)

    child_male = models.IntegerField(null=True, blank=True)
    child_female = models.IntegerField(null=True, blank=True)

    contact_no = models.CharField(max_length=30, null=True, blank=True)
    emergency_cell = models.CharField(max_length=30, null=True, blank=True)

    town_of_birth = models.CharField(max_length=30, null=True, blank=True)
    national_id = models.CharField(max_length=20, null=True, blank=True)
    birth_certificate_no = models.CharField(max_length=20, null=True, blank=True)

    contractual = models.CharField(max_length=1, default="N", choices=CONTRACTUAL_CHOICES)
    e_mail = models.EmailField(max_length=32, null=True, blank=True)

    education = models.CharField(max_length=32, null=True, blank=True)
    employement = models.CharField(max_length=12, null=True, blank=True)  # typo preserved
    nominee_cell_no = models.CharField(max_length=15, null=True, blank=True)

    pre_house_owner = models.CharField(max_length=32, null=True, blank=True)

    present_vill = models.CharField(max_length=48, null=True, blank=True)
    present_house = models.CharField(max_length=36, null=True, blank=True)
    present_ps = models.CharField(max_length=32, null=True, blank=True)
    present_dist = models.CharField(max_length=32, null=True, blank=True)
    present_address = models.CharField(max_length=96, null=True, blank=True)

    parmanent_house = models.CharField(max_length=48, null=True, blank=True)
    parmanent_vill = models.CharField(max_length=36, null=True, blank=True)
    parmanent_ps = models.CharField(max_length=32, null=True, blank=True)
    parmanent_dist = models.CharField(max_length=32, null=True, blank=True)
    permanent_address = models.CharField(max_length=96, null=True, blank=True)

    parmenent_address = models.CharField(max_length=40, null=True, blank=True)

    bang_emp_name = models.CharField(max_length=64, null=True, blank=True)
    bang_father_name = models.CharField(max_length=32, null=True, blank=True)
    bang_mother_name = models.CharField(max_length=32, null=True, blank=True)
    bang_husband_name = models.CharField(max_length=32, null=True, blank=True)

    pre_house_owner_bang = models.CharField(max_length=48, null=True, blank=True)
    bang_present_vill = models.CharField(max_length=48, null=True, blank=True)
    bang_present_post = models.CharField(max_length=36, null=True, blank=True)
    bang_present_ps = models.CharField(max_length=32, null=True, blank=True)
    bang_present_dist = models.CharField(max_length=32, null=True, blank=True)

    bang_permanent_vill = models.CharField(max_length=48, null=True, blank=True)
    bang_permanent_post = models.CharField(max_length=36, null=True, blank=True)
    bang_permanent_ps = models.CharField(max_length=32, null=True, blank=True)
    bang_permanent_dist = models.CharField(max_length=32, null=True, blank=True)

    photo_added_by = models.BigIntegerField(null=True, blank=True)

    emp_photo = models.ImageField(upload_to="employees/", null=True, blank=True)
    emp_signature = models.ImageField(upload_to="employees/signatures/", null=True, blank=True)

    photo_added_date = models.DateField(null=True, blank=True, auto_now_add=True)

    remarks = models.CharField(max_length=48, null=True, blank=True)

    updated_by = models.BigIntegerField(null=True, blank=True)
    updated_date = models.DateField(null=True, blank=True, auto_now=True)

    present_postal_code = models.CharField(max_length=6, null=True, blank=True)
    permanent_postal_code = models.CharField(max_length=6, null=True, blank=True)

    passed_year = models.CharField(max_length=32, null=True, blank=True)
    last_exp = models.CharField(max_length=32, null=True, blank=True)
    curr_activity = models.CharField(max_length=32, null=True, blank=True)
    sob = models.CharField(max_length=32, null=True, blank=True)

    nationality = models.CharField(max_length=32, null=True, blank=True)
    smart_id = models.CharField(max_length=16, null=True, blank=True)
    pasport_no = models.CharField(max_length=16, null=True, blank=True)
    tin_no = models.CharField(max_length=16, null=True, blank=True)

    emrg_cell_no = models.CharField(max_length=16, null=True, blank=True)
    emrg_address = models.CharField(max_length=64, null=True, blank=True)

    ref_contact_name = models.CharField(max_length=32, null=True, blank=True)
    ref_relation = models.CharField(max_length=16, null=True, blank=True)
    ref_address = models.CharField(max_length=64, null=True, blank=True)

    class Meta:
        db_table = "EMP_PERSONAL"
        verbose_name = "Employee Personal"
        verbose_name_plural = "Employee Personal"
        managed = False  # existing table created by accounts app

    def __str__(self):
        return self.emp_code or f"Emp {self.emp_id}"
