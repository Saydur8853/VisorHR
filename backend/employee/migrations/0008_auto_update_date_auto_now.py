from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0007_add_emp_signature"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name="emppersonal",
                    name="updated_date",
                    field=models.DateField(auto_now=True, null=True, blank=True),
                ),
            ],
        )
    ]
