from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0004_add_emp_name"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name="emppersonal",
                    name="bang_emp_name",
                    field=models.CharField(max_length=64, null=True, blank=True),
                ),
            ],
        ),
    ]
