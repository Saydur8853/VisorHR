from django.db import connections, migrations


def add_columns(apps, schema_editor):
    connection = connections[schema_editor.connection.alias]
    db_name = connection.settings_dict.get("NAME")
    columns = [
        ("emp_name", "VARCHAR(64)"),
        ("bang_emp_name", "VARCHAR(64)"),
    ]
    with connection.cursor() as cursor:
        for name, col_type in columns:
            cursor.execute(
                """
                SELECT COUNT(*) FROM information_schema.columns
                WHERE table_schema = %s AND table_name = 'EMP_PERSONAL' AND column_name = %s
                """,
                [db_name, name],
            )
            exists = cursor.fetchone()[0] > 0
            if not exists:
                cursor.execute(f"ALTER TABLE EMP_PERSONAL ADD COLUMN {name} {col_type} NULL")


class Migration(migrations.Migration):
    dependencies = [
        ("employee", "0005_add_bang_emp_name"),
    ]

    operations = [
        migrations.RunPython(add_columns, reverse_code=migrations.RunPython.noop),
    ]
