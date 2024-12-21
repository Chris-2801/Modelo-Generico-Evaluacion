from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from ProyectowebApp import views

urlpatterns = [
    path('IPA_Total/', views.IPA_Total, name='IPA_Total'),
    path('VistaPrincipal/', views.VistaPrincipal, name='VistaPrincipal'),
]

# Esto permitirá que Django sirva archivos de medios durante el desarrollo (cuando DEBUG=True)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)