# Generated by Django 5.1.3 on 2024-12-14 01:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProyectowebApp', '0010_documento_areas_niveles'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documento',
            name='Areas_Niveles',
            field=models.CharField(choices=[('Obtenciones Vegetales y Conocimientos Tradicionales', 'Obtenciones Vegetales y Conocimientos Tradicionales'), ('Derechos de Autor y Conexos', 'Derechos de Autor y Conexos'), ('Propiedad Industrial', 'Propiedad Industrial')], default='No Aplica', max_length=100),
        ),
    ]
