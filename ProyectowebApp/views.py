from django.shortcuts import render, redirect
from ProyectowebApp.models import (
    Personal_Academico, Documento,Indicador20)
from ProyectowebApp.models import (Produccion_Cientifica, Produccion_Artistica,
    Libros_Capitulos, Propiedad_Intelectual_Aplicada,IPA_Denomindaor, IPA, IPA_Anual, IPA_Carrera, 
    IPA_Anual_por_carrera_y_rango, IPA_Anual_por_rango
)

from ProyectowebApp.models import graficar_documentos, graficar_ipa
import json 
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm

def Indicador3(request):
    return render(request, 'ProyectowebApp/Indicador3.html')

def Contribucion_Investigacion(request):
    resultado = None
    alfa1 = alfa2 = alfa3 = alfa4 = None

    if request.method == 'POST':
        # Obtener los valores de los campos
        anio_evaluacion = request.POST.get('anio_evaluacion')

        # Intentar convertir los valores alfa
        try:
            alfa1 = float(request.POST.get('alfa1', 0.25))  # Valor por defecto de 0.25 si no está presente
            alfa2 = float(request.POST.get('alfa2', 0.25))
            alfa3 = float(request.POST.get('alfa3', 0.25))
            alfa4 = float(request.POST.get('alfa4', 0.25))

            # Comprobar que la suma de los alfas no sea mayor que 1
            if alfa1 + alfa2 + alfa3 + alfa4 > 1:
                resultado = {'error': 'La suma de los valores de alfa no puede superar 1. Por favor, ingrese valores válidos.'}
                return render(request, 'ProyectowebApp\Contribucion_Investigacion.html', resultado)
            
            # Validar el año de evaluación
            anio_evaluacion = int(anio_evaluacion)  # Esto puede generar un error si no se proporciona un año válido
            anio_inicio = anio_evaluacion - 3
            anio_fin = anio_evaluacion - 1

            # Calcular los resultados
            resultado_PC = Produccion_Cientifica(anio_inicio, anio_fin)
            resultado_PA = Produccion_Artistica(anio_inicio, anio_fin)
            resultado_LyCL = Libros_Capitulos(anio_inicio, anio_fin)
            resultado_PIA = Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin)

            resultado_IPA = IPA(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)
            resultado_IPA_Anual = IPA_Anual(alfa1, alfa2, alfa3, alfa4)
            resultado_IPA_Carrera = IPA_Carrera(alfa1, alfa2, alfa3, alfa4)
            resultado_IPA_Carrera_Rango = IPA_Anual_por_carrera_y_rango(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)
            resultado_IPA_Anual_Rango = IPA_Anual_por_rango(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)

        except ValueError:
            resultado = {'error': 'Por favor ingrese un año válido o valores correctos para alfa.'}
            return render(request, 'ProyectowebApp\Contribucion_Investigacion.html', resultado)

    else:
        # Valores predeterminados cuando no se recibe un POST
        anio_evaluacion = 2024
        anio_inicio = anio_evaluacion - 3
        anio_fin = anio_evaluacion - 1
        
        alfa1 = alfa2 = alfa3 = alfa4 = 0.25
        resultado_PC = Produccion_Cientifica(anio_inicio, anio_fin)
        resultado_PA = Produccion_Artistica(anio_inicio, anio_fin)
        resultado_LyCL = Libros_Capitulos(anio_inicio, anio_fin)
        resultado_PIA = Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin)
        resultado_IPA = IPA(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)
        resultado_IPA_Anual = IPA_Anual(alfa1, alfa2, alfa3, alfa4)
        resultado_IPA_Carrera = IPA_Carrera(alfa1, alfa2, alfa3, alfa4)
        resultado_IPA_Carrera_Rango = IPA_Anual_por_rango(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)
        resultado_IPA_Anual_Rango = IPA_Anual_por_rango(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4)

    # Datos adicionales de la base de datos
    total_registros = Personal_Academico.objects.count()
    registros = Personal_Academico.objects.all()
    documentos = Documento.objects.all()
    Documentos_Indicador20 = Indicador20.objects.all()
    resultado_IPA_Denominador = IPA_Denomindaor()

    # Obtener datos del gráfico desde la función graficar_documentos
    try:
        datos_grafico = graficar_documentos()  # Llama a la función de models.py
        datos_grafico_json = json.dumps(datos_grafico)  # Convierte a JSON
    except Exception as e:
        datos_grafico_json = json.dumps({'error': f'Error al obtener los datos del gráfico: {str(e)}'})

    # Obtener datos del gráfico IPA
    try:
        datos_grafico_IPA = graficar_ipa(alfa1, alfa2, alfa3, alfa4)  # Llama a la función de models.py
        datos_grafico_json_IPA = json.dumps(datos_grafico_IPA)  
    except Exception as e:
        datos_grafico_json_IPA = json.dumps({'error': f'Error al obtener los datos de IPA: {str(e)}'})

    # Retornar la respuesta con todos los datos
    return render(request, "ProyectowebApp/Contribucion_Investigacion.html", {
        'total_registros': total_registros,
        'registros': registros,
        'documentos': documentos,
        'documentos_adicionales': documentos,
        'Documentos_Indicadorp20': Documentos_Indicador20,
        'cuartiles': resultado_PC.get('cuartiles') if resultado_PC and 'cuartiles' in resultado_PC else None,
        'Numero_Publicaciones': resultado_PC.get('NP') if resultado_PC and 'NP' in resultado_PC else None,
        'tabla': resultado_PC.get('tabla') if resultado_PC and 'tabla' in resultado_PC else None,
        'Produccion_Cientifica': resultado_PC.get('Produccion') if resultado_PC and 'Produccion' in resultado_PC else None,
        'error': resultado.get('error') if resultado and 'error' in resultado else None,
        'PA': resultado_PA.get('PA') if resultado_PA and 'PA' in resultado_PA else None,
        'LyCL': resultado_LyCL.get('LyCL') if resultado_LyCL and 'LyCL' in resultado_LyCL else None,
        'PIA': resultado_PIA.get('PIA') if resultado_PIA and 'PIA' in resultado_PIA else None,
        'PTC': resultado_IPA_Denominador.get('PTC'),
        'PMT': resultado_IPA_Denominador.get('PMT'),
        'IPA': resultado_IPA if isinstance(resultado_IPA, (int, float)) else None,
        'alfa1': alfa1, 'alfa2': alfa2, 'alfa3': alfa3, 'alfa4': alfa4, 'anio_evaluacion': anio_evaluacion,
        'anio_inicio':anio_inicio, 'anio_fin':anio_fin,
        'datos_grafico_json': datos_grafico_json,  # Incluye los datos del gráfico en el contexto
        'datos_grafico_json_IPA': datos_grafico_json_IPA,
        'IPA_Anual': resultado_IPA_Anual,
        'IPA_Carrera_rango': resultado_IPA_Carrera_Rango,
        'IPA_Anual_Carrera': resultado_IPA_Carrera.get('Tabla_anual_carrera') if resultado_IPA_Carrera and 'Tabla_anual_carrera' 
        in resultado_IPA_Carrera else None,
        'cuartiles_total': resultado_IPA_Carrera.get('cuartiles_total') if resultado_IPA_Carrera and 'cuartiles_total' in resultado_IPA_Carrera else None,
        'IPA_Anual_rango': resultado_IPA_Anual_Rango,
    })

def VistaPrincipal(request):
    return render(request, 'ProyectowebApp/VistaPrincipal.html')

def InicioSesion(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('/admin/')  # Redirige al administrador de Django
            else:
                form.add_error(None, 'Credenciales inválidas')
    else:
        form = AuthenticationForm()
    
    return render(request, "ProyectowebApp/InicioSesion.html", {'form': form})

def Curriculo(request):
    return render(request, 'ProyectowebApp/Curriculo.html')

def PersonalAcademico(request): #Subcriterio
    return render(request, 'ProyectowebApp/PersonalAcademico.html')

def Estudiantes(request): #Subcriterio
    return render(request, 'ProyectowebApp/Estudiantes.html')

def GestionInvestigacionInnovacion(request): #Subcriterio
    return render(request, 'ProyectowebApp/GestionInvestigacionInnovacion.html')

def Docencia(request): #Subcriterio
    return render(request, 'ProyectowebApp/Docencia.html')

def VinculacionSociedad(request): #Subcriterio
    return render(request, 'ProyectowebApp/VinculacionSociedad.html')

def OrganizacionVinculacionSociedad(request): #Subcriterio
    return render(request, 'ProyectowebApp/OrganizacionVinculacionSociedad.html')

def TransferenciaTecnologiaConocimiento(request): #Subcriterio
    return render(request, 'ProyectowebApp/TransferenciaTecnologiaConocimiento.html')

def Estrategicas_Soporte(request): #Subcriterio
    return render(request, 'ProyectowebApp/Estrategicas_Soporte.html')

def FuncionesEstrategicas(request): #Subcriterio
    return render(request, 'ProyectowebApp/FuncionesEstrategicas.html')

def FuncionesSoporte(request): #Subcriterio
    return render(request, 'ProyectowebApp/FuncionesSoporte.html')