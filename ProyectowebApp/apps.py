from django.apps import AppConfig


class ProyectowebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ProyectowebApp'
    verbose_name = "Bases de Datos"

class MiAppConfig(AppConfig):
    name = 'ProyectowebApp'
    def ready(self):
        import ProyectowebApp.signals 