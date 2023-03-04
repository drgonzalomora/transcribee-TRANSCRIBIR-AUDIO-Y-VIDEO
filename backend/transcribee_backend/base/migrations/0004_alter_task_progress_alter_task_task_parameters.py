# Generated by Django 4.1.7 on 2023-03-04 16:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0003_worker_task"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="progress",
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="task_parameters",
            field=models.JSONField(
                default=dict,
                help_text="Task parameters like language, number of speakers, ...",
            ),
        ),
    ]