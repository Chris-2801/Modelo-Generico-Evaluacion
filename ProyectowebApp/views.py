from django.shortcuts import render
from ProyectowebApp.models import (
    Personal_Academico, Documento,
    Produccion_Cientifica, Produccion_Artistica,
    Libros_Capitulos, Propiedad_Intelectual_Aplicada,
    IPA_Denomindaor, IPA, IPA_Anual
)
from ProyectowebApp.models import graficar_documentos, graficar_ipa
import json 

def IPA_Total(request):
    resultado = None
    alfa1 = alfa2 = alfa3 = alfa4 = None

    if request.method == 'POST':
        anio_evaluacion = request.POST.get('anio_evaluacion')
        alfa1 = float(request.POST.get('alfa1'))
        alfa2 = float(request.POST.get('alfa2'))
        alfa3 = float(request.POST.get('alfa3'))
        alfa4 = float(request.POST.get('alfa4'))

        if alfa1 + alfa2 + alfa3 + alfa4 > 1:
            resultado = {'error': 'La suma de los valores de alfa no puede superar 1. Por favor, ingrese valores válidos.'}
            return render(request, 'ProyectowebApp/IPA_Total.html', resultado)
        
        try:
            anio_evaluacion = int(anio_evaluacion)
            anio_inicio = anio_evaluacion - 3
            anio_fin = anio_evaluacion
            anio_posterior = anio_evaluacion + 1

            resultado_PC = Produccion_Cientifica(anio_inicio, anio_fin, anio_posterior)
            resultado_PA = Produccion_Artistica(anio_inicio, anio_fin, anio_posterior)
            resultado_LyCL = Libros_Capitulos(anio_inicio, anio_fin, anio_posterior)
            resultado_PIA = Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin, anio_posterior)

            resultado_IPA = IPA(anio_inicio, anio_fin, anio_posterior, alfa1, alfa2, alfa3, alfa4)
            resultado_IPA_Anual = IPA_Anual(alfa1, alfa2, alfa3, alfa4)
        except ValueError:
            resultado = {'error': 'Por favor ingrese un año válido.'}
    else:
        anio_evaluacion = 2024
        anio_inicio = anio_evaluacion - 3
        anio_fin = anio_evaluacion
        anio_posterior = anio_evaluacion + 1
        
        alfa1 = alfa2 = alfa3 = alfa4 = 0.25
        resultado_PC = Produccion_Cientifica(anio_inicio, anio_fin, anio_posterior)
        resultado_PA = Produccion_Artistica(anio_inicio, anio_fin, anio_posterior)
        resultado_LyCL = Libros_Capitulos(anio_inicio, anio_fin, anio_posterior)
        resultado_PIA = Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin, anio_posterior)
        resultado_IPA = IPA(anio_inicio, anio_fin, anio_posterior, alfa1, alfa2, alfa3, alfa4)
        resultado_IPA_Anual = IPA_Anual(alfa1, alfa2, alfa3, alfa4)

    total_registros = Personal_Academico.objects.count()
    registros = Personal_Academico.objects.all()
    documentos = Documento.objects.all()
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

    return render(request, "ProyectowebApp/IPA_Total.html", {
        'total_registros': total_registros,
        'registros': registros,
        'documentos': documentos,
        'documentos_adicionales': documentos,
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
        'alfa1': alfa1, 'alfa2': alfa2, 'alfa3': alfa3, 'alfa4': alfa4, 'anio_evaluacion':anio_evaluacion,
        'datos_grafico_json': datos_grafico_json,  # Incluye los datos del gráfico en el contexto
        'datos_grafico_json_IPA': datos_grafico_json_IPA,
        'IPA_Anual': resultado_IPA_Anual
    })


def VistaPrincipal(request):
    return render(request, "ProyectowebApp/VistaPrincipal.html")
    