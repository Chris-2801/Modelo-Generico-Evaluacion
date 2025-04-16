from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from ProyectowebApp.models import Personal_Academico, Documento, Indicador20
from import_export import resources, fields
from django.contrib.auth.models import User, Permission
from import_export.admin import ImportExportModelAdmin

admin.site.site_header = "Universidad Central del Ecuador"  # Título en la parte superior
admin.site.site_title = "Registro"  # Título en la pestaña del navegador
admin.site.index_title = "Registro"  # Título en la página de inicio del admin

# Recurso personalizado para el modelo User
class UserResource(resources.ModelResource):
    user_permissions = fields.Field(column_name='user_permissions')

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email',
            'is_staff', 'is_active', 'password', 'user_permissions'
        )
        import_id_fields = ('username',)

    # Exportar permisos como app_label.codename
    def dehydrate_user_permissions(self, user):
        return ",".join([
            f"{perm.content_type.app_label}.{perm.codename}" 
            for perm in user.user_permissions.all()
        ])

    # Hashear contraseña solo si no está hasheada
    def before_import_row(self, row, **kwargs):
        raw_password = row.get('password')
        if raw_password:
            if not (raw_password.startswith('pbkdf2_') or raw_password.startswith('argon2$') or raw_password.startswith('bcrypt$')):
                temp_user = User()
                temp_user.set_password(raw_password)
                row['password'] = temp_user.password

    # Asignar permisos tras importar
    def after_import_instance(self, instance, new, row_number=None, **kwargs):
        perms_str = kwargs.get("row").get("user_permissions")
        if perms_str:
            perm_ids = []
            for perm_text in perms_str.split(','):
                if '.' in perm_text:
                    app_label, codename = perm_text.strip().split('.', 1)
                    try:
                        perm = Permission.objects.get(content_type__app_label=app_label, codename=codename)
                        perm_ids.append(perm.id)
                    except Permission.DoesNotExist:
                        pass  # Puedes loguear o manejar el error si quieres
            instance.user_permissions.set(perm_ids)

# Admin personalizado para User
class CustomUserAdmin(ImportExportModelAdmin):
    resource_class = UserResource
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

# Registrar modelo User con el admin personalizado
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Admin para Personal_Academico
@admin.register(Personal_Academico)
class PersonalAcedemicoAdmin(admin.ModelAdmin):
    CAMPOS_COMUNES = (
        'ci', 'Primer_nombre', 'primer_apellido', 'carrera_personal', 'fecha_nacimiento',
        'correo_institucional', 'telefono_contacto', 'asignaturas_impartidas',
        'programa_educativo', 'nombramiento', 'tipo_contrato'
    )
    list_display = CAMPOS_COMUNES  
    search_fields = CAMPOS_COMUNES
    list_filter = ('carrera_personal', 'programa_educativo', 'nombramiento', 'tipo_contrato')

# Admin para Documento
@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ('ci1', 'nombre', 'carrera', 'titulo', 'Año_Publiacion', 'Areas_Niveles')
    search_fields = ('ci1', 'titulo', 'Año_Publiacion', 'Areas_Niveles')
    list_filter = ('carrera', 'Año_Publiacion', 'Areas_Niveles')

# Admin para Indicador20
@admin.register(Indicador20)
class Indicador20Admin(admin.ModelAdmin):
    list_display = ('Funciones_Sustantivas', 'nombre', 'carrera_Indicador20', 'autores', 'Productos_Resultados')
    search_fields = ('Funciones_Sustantivas', 'nombre', 'carrera_Indicador20', 'autores', 'Productos_Resultados')
    list_filter = ('Funciones_Sustantivas', 'carrera_Indicador20')
