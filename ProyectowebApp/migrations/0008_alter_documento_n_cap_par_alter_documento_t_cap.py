# Generated by Django 5.1.3 on 2024-12-14 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProyectowebApp', '0007_alter_documento_base_datos_alter_documento_editorial_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='N_Cap_Par',
            field=models.IntegerField(blank=True, default='0', null=True, verbose_name='Capítulos Desarrollados por el Autor'),
        ),
        migrations.AlterField(
            model_name='documento',
            name='T_Cap',
            field=models.IntegerField(blank=True, default='0', null=True, verbose_name='Capítulos Totales desarrollados por el Autor'),
        ),
    ]