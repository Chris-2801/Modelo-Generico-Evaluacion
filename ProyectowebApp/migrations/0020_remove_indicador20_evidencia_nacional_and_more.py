# Generated by Django 5.1.3 on 2024-12-22 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ProyectowebApp', '0019_indicador20_carrera'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='indicador20',
            name='Evidencia_Nacional',
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Ejecucion_Proyectos_Programas',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación que evidencie la ejecución de programas/proyectos interdisciplinares'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Evidencia_Articulacion',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación que evidencie el análisis de la articulación de las funciones sustantivas'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Evidencia_Difusion',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación o medios que evidencie la difusión de los resultados de los programas o proyectos interdisciplinares'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Mejora_Gestion',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación que evidencie las acciones de mejora en la gestión de los programas o proyectos interdisciplinares'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Planificación_Proyectos_Programas',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación que evidencie la planificación de programas/proyectos interdisciplinares'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Politicas_Procedimientos',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Políticas o procedimientos definidos para la planificación, ejecución y evaluación de los programas o proyectos interdisciplinares.'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Productos_Resultados',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Documentación que evidencien los productos o resultados obtenidos en los proyectos'),
        ),
        migrations.AddField(
            model_name='indicador20',
            name='Syllabus_Asignaturas',
            field=models.FileField(blank=True, null=True, upload_to='pdfs/', verbose_name='Syllabus de las asignaturas consideradas en los programas o proyectos interdisciplinares '),
        ),
        migrations.AlterField(
            model_name='indicador20',
            name='Funciones_Sustantivas',
            field=models.CharField(choices=[('Docencia', 'Docencia'), ('Investigación e Innovación', 'Investigación e Innovación'), ('Vinculación con la Sociedad', 'Vinculación con la Sociedad')], max_length=50, verbose_name='Funciones Sustantivas'),
        ),
    ]