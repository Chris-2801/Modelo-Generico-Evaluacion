from django.conf import settings
from django.shortcuts import redirect
from django.conf.urls.static import static
from django.urls import path
from ProyectowebApp import views

urlpatterns = [
    path('', lambda request: redirect('VistaPrincipal', permanent=False)),
    path('Indicador3/', views.Indicador3, name='Indicador3'),
    path('VistaPrincipal/', views.VistaPrincipal, name='VistaPrincipal'),
    path('Contribucion_Investigacion/', views.Contribucion_Investigacion, name='Contribucion_Investigacion'),
    path('InicioSesion/', views.InicioSesion, name='InicioSesion'),
    path('Curriculo/', views.Curriculo, name='Curriculo'),
    path('PersonalAcedmico/', views.PersonalAcademico, name='PersonalAcademico'),
    path('Estudiantes/', views.Estudiantes, name='Estudiantes'),
    path('GestionInvestigacionInnovacion/', views.GestionInvestigacionInnovacion, name='GestionInvestigacionInnovacion'),
    path('Docencia/', views.Docencia, name='Docencia'),
    path('VinculacionSociedad/', views.VinculacionSociedad, name='VinculacionSociedad'),
    path('OrganizacionVinculacionSociedad/', views.OrganizacionVinculacionSociedad, name='OrganizacionVinculacionSociedad'),
    path('TransferenciaTecnologiaConocimiento/', views.TransferenciaTecnologiaConocimiento, name='TransferenciaTecnologiaConocimiento'),
    path('Estrategicas_Soporte/', views.Estrategicas_Soporte, name='Estrategicas_Soporte'),
    path('FuncionesEstrategicas/', views.FuncionesEstrategicas, name='FuncionesEstrategicas'), 
    path('FuncionesSoporte/', views.FuncionesSoporte, name='FuncionesSoporte'),
]

# Esto permitirá que Django sirva archivos de medios durante el desarrollo (cuando DEBUG=True)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)