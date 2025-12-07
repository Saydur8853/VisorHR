from django.db import migrations, models, connections


def add_emp_signature_column(apps, schema_editor):
    connection = connections[schema_editor.connection.alias]
    db_name = connection.settings_dict.get("NAME")
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_schema = %s AND table_name = 'EMP_PERSONAL' AND column_name = 'emp_signature'
            """,
            [db_name],
        )
        exists = cursor.fetchone()[0] > 0
        if not exists:
            cursor.execute("ALTER TABLE EMP_PERSONAL ADD COLUMN emp_signature varchar(255) NULL")


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0006_apply_emp_name_columns"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(add_emp_signature_column, reverse_code=migrations.RunPython.noop)
            ],
            state_operations=[
                migrations.AddField(
                    model_name="emppersonal",
                    name="emp_signature",
                    field=models.ImageField(upload_to="employees/signatures/", null=True, blank=True),
                ),
            ],
        ),
    ]
