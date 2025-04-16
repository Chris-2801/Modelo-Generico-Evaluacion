from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from ProyectowebApp.models import Personal_Academico, Documento, Indicador20
from import_export import resources
from django.contrib.auth.models import User
from import_export.admin import ImportExportModelAdmin

admin.site.site_header = ("Universidad Central del Ecuador")  # Título en la parte superior
admin.site.site_title = ("Registro")  # Título en la pestaña del navegador
admin.site.index_title = ("Registro")  # Título en la página de inicio del admin

# Definir el recurso
class UserResource(resources.ModelResource):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'password')
        import_id_fields = ('username',)

    # Convertir contraseñas en texto plano a formato hasheado
    def before_import_row(self, row, **kwargs):
        raw_password = row.get('password')
        if raw_password:
            temp_user = User()
            temp_user.set_password(raw_password)
            row['password'] = temp_user.password

# Reemplazar el admin por defecto del modelo User
class CustomUserAdmin(ImportExportModelAdmin):
    resource_class = UserResource
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

# Desregistrar y registrar de nuevo el modelo User
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Personal_Academico)
class PersonalAcedemicoAdmin(admin.ModelAdmin):
    CAMPOS_COMUNES = ('ci','Primer_nombre', 'primer_apellido','carrera_personal','fecha_nacimiento','correo_institucional',
                    'telefono_contacto', 'asignaturas_impartidas','programa_educativo','nombramiento','tipo_contrato')
    list_display = CAMPOS_COMUNES  
    search_fields = CAMPOS_COMUNES
    list_filter = ('carrera_personal','programa_educativo','nombramiento','tipo_contrato')

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('ci1','nombre', 'carrera','titulo','Año_Publiacion','Areas_Niveles')
    search_fields = ('ci1','titulo','Año_Publiacion','Areas_Niveles')
    list_filter = ('carrera','Año_Publiacion','Areas_Niveles')

@admin.register(Indicador20)
class Indicador20Admin(admin.ModelAdmin):
    list_display = ('Funciones_Sustantivas','nombre', 'carrera_Indicador20','autores','Productos_Resultados')
    search_fields = ('Funciones_Sustantivas','nombre', 'carrera_Indicador20','autores','Productos_Resultados')
    list_filter = ('Funciones_Sustantivas', 'carrera_Indicador20')
