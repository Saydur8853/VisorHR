from django.db import migrations, models

import employee.models


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name="emppersonal",
                    name="sex",
                    field=models.CharField(
                        max_length=6,
                        null=True,
                        blank=True,
                        choices=employee.models.SEX_CHOICES,
                    ),
                ),
                migrations.AlterField(
                    model_name="emppersonal",
                    name="religion",
                    field=models.CharField(
                        max_length=10,
                        null=True,
                        blank=True,
                        choices=employee.models.RELIGION_CHOICES,
                    ),
                ),
                migrations.AlterField(
                    model_name="emppersonal",
                    name="blood_group",
                    field=models.CharField(
                        max_length=4,
                        null=True,
                        blank=True,
                        choices=employee.models.BLOOD_GROUP_CHOICES,
                    ),
                ),
                migrations.AlterField(
                    model_name="emppersonal",
                    name="marital_status",
                    field=models.CharField(
                        max_length=8,
                        null=True,
                        blank=True,
                        choices=employee.models.MARITAL_STATUS_CHOICES,
                    ),
                ),
                migrations.AlterField(
                    model_name="emppersonal",
                    name="contractual",
                    field=models.CharField(
                        max_length=1,
                        default="N",
                        choices=employee.models.CONTRACTUAL_CHOICES,
                    ),
                ),
                migrations.AlterField(
                    model_name="emppersonal",
                    name="photo_added_date",
                    field=models.DateField(null=True, blank=True, auto_now_add=True),
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="photo",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute2",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute3",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute4",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute5",
                ),
                migrations.RemoveField(
                    model_name="emppersonal",
                    name="attribute6",
                ),
            ],
        )
    ]
