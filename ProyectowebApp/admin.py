from django.contrib import admin
from ProyectowebApp.models import Personal_Academico, Documento, Indicador20

@admin.register(Personal_Academico)
class PersonalAcedemicoAdmin(admin.ModelAdmin):
    CAMPOS_COMUNES = ('ci','Primer_nombre', 'primer_apellido','carrera','fecha_nacimiento','correo_institucional',
                    'telefono_contacto', 'asignaturas_impartidas','programa_educativo','nombramiento','tipo_contrato')
    list_display = CAMPOS_COMUNES  
    search_fields = CAMPOS_COMUNES
    list_filter = ('carrera','programa_educativo','nombramiento','tipo_contrato')

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('ci1','nombre', 'carrera','titulo','Año_Publiacion','Areas_Niveles')
    search_fields = ('ci1','titulo','Año_Publiacion','Areas_Niveles')
    list_filter = ('carrera','Año_Publiacion','Areas_Niveles')

@admin.register(Indicador20)
class Indicador20Admin(admin.ModelAdmin):
    list_display = ('Funciones_Sustantivas','nombre', 'carrera','autores','Productos_Resultados')
    search_fields = ('Funciones_Sustantivas','nombre', 'carrera','autores','Productos_Resultados')
    list_filter = ('Funciones_Sustantivas', 'carrera')
