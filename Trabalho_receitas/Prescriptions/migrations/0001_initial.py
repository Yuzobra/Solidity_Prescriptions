# Generated by Django 2.2.5 on 2019-09-29 04:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medicCPF', models.CharField(max_length=11)),
                ('medicCRM', models.CharField(max_length=10)),
                ('patientCPF', models.CharField(max_length=11)),
                ('medicine', models.CharField(max_length=50)),
                ('message', models.CharField(max_length=200)),
                ('quantity', models.IntegerField()),
                ('prescribedAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
