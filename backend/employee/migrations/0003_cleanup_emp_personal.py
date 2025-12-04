from django.db import migrations, connections


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0002_update_emp_personal_state"),
    ]

    def drop_columns(apps, schema_editor):
        connection = connections[schema_editor.connection.alias]
        db_name = connection.settings_dict.get("NAME")
        columns = ["photo", "attribute", "attribute2", "attribute3", "attribute4", "attribute5", "attribute6"]
        with connection.cursor() as cursor:
            for col in columns:
                cursor.execute(
                    """
                    SELECT COUNT(*) FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = 'EMP_PERSONAL' AND column_name = %s
                    """,
                    [db_name, col],
                )
                exists = cursor.fetchone()[0] > 0
                if exists:
                    cursor.execute(f"ALTER TABLE EMP_PERSONAL DROP COLUMN {col}")

    operations = [
        migrations.RunPython(drop_columns, reverse_code=migrations.RunPython.noop),
    ]
