from django.contrib.auth.models import Permission

class UserResource(resources.ModelResource):
    user_permissions = fields.Field(column_name='user_permissions')

    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 'email', 
            'is_staff', 'is_active', 'password', 'user_permissions'
        )
        import_id_fields = ('username',)

    # Exportar permisos como texto (codename separados por comas)
    def dehydrate_user_permissions(self, user):
        return ",".join([perm.codename for perm in user.user_permissions.all()])

    # Convertir contraseñas si están en texto plano
    def before_import_row(self, row, **kwargs):
        raw_password = row.get('password')
        if raw_password:
            if not (raw_password.startswith('pbkdf2_') or raw_password.startswith('argon2$') or raw_password.startswith('bcrypt$')):
                temp_user = User()
                temp_user.set_password(raw_password)
                row['password'] = temp_user.password

    # Asignar permisos al usuario después de importar
    def after_import_instance(self, instance, new, row_number=None, **kwargs):
        perms_str = kwargs.get("row").get("user_permissions")
        if perms_str:
            perm_codenames = [p.strip() for p in perms_str.split(',') if p.strip()]
            perms = Permission.objects.filter(codename__in=perm_codenames)
            instance.user_permissions.set(perms)
