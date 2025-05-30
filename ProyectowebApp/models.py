from django.db import models 
from datetime import date
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from collections import defaultdict
import numpy as np

class Personal_Academico(models.Model):
    OPCIONES_FACULTAD = [('Geología', 'Geología'), ('Minas', 'Minas'), ('Petróleos', 'Petróleos'), ('Ambiental', 'Ambiental')]
    ci = models.CharField(max_length=10,unique=True, primary_key=True, default="",  validators=[
            RegexValidator(
                regex='^\d{10}$',  # Exactamente 10 dígitos numéricos
                message="El campo debe contener exactamente 10 dígitos numéricos.",
                code='invalid_ci'
            )
        ])
    Primer_nombre = models.CharField(max_length=100, default="")
    Segundo_nombre = models.CharField(max_length=100, default="")
    primer_apellido = models.CharField(max_length=100, default="")
    segundo_apellido = models.CharField(max_length=100, default="")
    carrera_personal = models.CharField(max_length=20, choices=OPCIONES_FACULTAD, default='No Aplica')
    fecha_nacimiento = models.DateField(default=date(2000, 1, 1))
    genero = models.CharField(max_length=100, choices=[('Masculino', 'Masculino'), ('Femenino', 'Femenino'), ('Otro', 'Otro')],
        default="")
    estado_civil = models.CharField(
        max_length=50,
        choices=[('Soltero/a', 'Soltero/a'), ('Casado/a', 'Casado/a'), ('Viudo/a', 'Viudo/a'), 
                 ('Divorciado/a', 'Divorciado/a'), ('Unión de Hecho', 'Unión de Hecho')],
        default='Soltero/a'
    )
    correo_institucional = models.EmailField(unique=True, default="default@uce.edu.com")
    telefono_contacto = models.CharField(max_length=10, default="")
    asignaturas_impartidas = models.TextField(default="")
    programa_educativo = models.CharField(
        max_length=20,
        choices=[('Pregrado', 'Pregrado'), ('Maestría', 'Maestría'), ('Doctorado', 'Doctorado')],
        default='Pregrado'
    )
    nombramiento = models.CharField(
        max_length=50,
        choices=[('Nombramiento definitivo', 'Nombramiento definitivo'), ('Nombramiento provisional', 'Nombramiento provisional'),
                  ('Contrato', 'Contrato')],
        default='Pregrado'
    )
    tipo_contrato = models.CharField(
        max_length=20,
        choices=[('Tiempo Completo', 'Tiempo Completo'), ('Tiempo Parcial', 'Tiempo Parcial')],
        default='Tiempo total'
    )

    class Meta:
        verbose_name_plural = "Lista Personal Academico"

class Documento(models.Model):
    OPCIONES_TIPO = [
        ('Artculos Scopus o Web of Science', 'Artículos publicados en revistas de bases de datos Scopus o Web of Science'),
        ('Artículos bases de datos regionales', 'Artículos publicados en revistas de bases de datos regionales'),
        ('Proceedings', 'Actas de congresos indexados (Proceedings)'),
        ('Libros y capítulos', 'Libros y capítulos'),
        ('Proyectos de Investigación', 'Proyectos de Investigación'),
        ('Proyectos de Vinculación con la sociedad', 'Proyectos de Vinculación con la sociedad'),
    ]
    OPCIONES_ESTADO = [('Libro Total', 'Libro Total'), ('Libro Parcial', 'Libro Parcial'), ('No Aplica', 'No Aplica')]
    OPCIONES_FACULTAD = [('Geología', 'Geología'), ('Minas', 'Minas'), ('Petróleos', 'Petróleos'), ('Ambiental', 'Ambiental')]
    ci1 = models.CharField(max_length=10,verbose_name="CI", default="",  validators=[
            RegexValidator(
                regex='^\d{10}$',  # Exactamente 10 dígitos numéricos
                message="El campo debe contener exactamente 10 dígitos numéricos.",
                code='invalid_ci'
            )
        ])
    nombre = models.CharField(max_length=50, choices=OPCIONES_TIPO, verbose_name="Tipo de Documento")
    filiacion_UEP = models.CharField(max_length=100, default="") 
    carrera = models.CharField(max_length=20, choices=OPCIONES_FACULTAD, default='No Aplica')
    titulo = models.CharField(max_length=400,unique=True, primary_key=True, default="")
    nombre_revista = models.CharField(max_length=200, default="No Aplica", null=True, blank=True) #Solo en Artículos Científicos
    Base_datos = models.CharField(max_length=200, default="No Aplica")   #Solo en Artículos científicos
    Año_Base_datos = models.CharField(max_length=200, default="",validators=[
            RegexValidator(
                regex='^\d{4}$',  # Exactamente 4 dígitos numéricos
                message="El campo debe contener exactamente 4 dígitos numéricos.",
                code='invalid_date'
            )])  
    nombre_evento_o_compendio = models.CharField(max_length=200, default="No Aplica", null=True, blank=True) #Solo en Procendings
    Editorial = models.CharField(max_length=100, default="No Aplica") 
    Filiacion_Autor_es = models.CharField(max_length=100, default="")
    Codigo_ISSN = models.CharField(max_length=100, default="") 
    Codigo_ISBN = models.CharField(max_length=100, default="")
    Año_Publiacion = models.CharField(max_length=4, default="", validators=[
            RegexValidator(
                regex='^\d{4}$',  # Exactamente 4 dígitos numéricos
                message="El campo debe contener exactamente 4 dígitos numéricos.",
                code='invalid_date'
            )
        ])
    Estado = models.CharField(max_length=20, choices=OPCIONES_ESTADO, default='No Aplica')
    
    N_Cap_Par = models.IntegerField(default="0", verbose_name="Capítulos Desarrollados por el Autor", blank=True)
    T_Cap = models.IntegerField(default="0", verbose_name="Capítulos Totales desarrollados por el Autor", blank=True) 
    Areas_Niveles = models.CharField(
        max_length=100,
        choices=[('Obtenciones Vegetales y Conocimientos Tradicionales', 'Obtenciones Vegetales y Conocimientos Tradicionales'), 
                 ('Derechos de Autor y Conexos', 'Derechos de Autor y Conexos'), 
                 ('Propiedad Industrial', 'Propiedad Industrial'), 
                 ('No Aplica', 'No Aplica')], 
        default='No Aplica')
    link_acceso = models.CharField(max_length=300, default="")
    N_Registro_Senadi = models.CharField(max_length=100, default="")

    Exposicion_Procendings = models.CharField(
        max_length=20,
        choices=[('Nacional', 'Nacional'), ('Internacional', 'Internacional'), ('No Aplica', 'No Aplica')],
        default='NA', null=True, blank=True 
    )  #Opcional
    Revision_pares = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie los procesos de revisión por pares",
        null=True,
        blank=True
    )  
    Revision_externos = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie los procesos de revisión por Externos",
        null=True,
        blank=True
    )
    Evidencia_Nacional = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentos que evidencien que la obra fue expuesta eventos, exposiciones nacionales ",
        null=True,
        blank=True
    )
    Evidencia_Internacional = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentos que evidencien que la obra fue expuesta eventos, exposiciones Internacionales",
        null=True,
        blank=True
    ) #Solo en Procendings

    Registro_SENADI = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Certificado de registro de propiedad intelectual en el SENADI",
        null=True,
        blank=True
    ) #Opcional
    Certificados_Exposiciones = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Certificados/permisos de exposiciones en eventos nacionales e internacionales",
        null=True,
        blank=True
    ) #Opcional

    def clean(self):
        super().clean()
        if self.nombre in ['Artculos Scopus o Web of Science', 'Artículos bases de datos regionales'] and not self.nombre_revista:
            raise ValidationError({
                'nombre_revista': 'Este campo es obligatorio para la opción seleccionada.'
            })
        if self.nombre == 'Proceedings' and not self.nombre_evento_o_compendio:
            raise ValidationError({
                'nombre_evento_o_compendio': 'Este campo es obligatorio para la opción seleccionada.'
            })


    class Meta:
        verbose_name_plural = "Fuentes de Información: Contribución de la investigación a la carrera"

    def __str__(self):
        return f"{self.titulo} {self.ci1} - {self.Año_Base_datos}"

class Indicador20(models.Model):
    OPCIONES_FuncSustantivas = [('Docencia', 'Docencia'), ('Investigación e Innovación', 'Investigación e Innovación'), ('Vinculación con la Sociedad', 'Vinculación con la Sociedad')]
    OPCIONES_FACULTAD = [('Geología', 'Geología'), ('Minas', 'Minas'), ('Petróleos', 'Petróleos'), ('Ambiental', 'Ambiental')]
    Funciones_Sustantivas = models.CharField(max_length=50, choices=OPCIONES_FuncSustantivas, verbose_name="Funciones Sustantivas")
    carrera_Indicador20 = models.CharField(max_length=20, choices=OPCIONES_FACULTAD, default='No Aplica')
    nombre = models.CharField(max_length=300, default="", verbose_name='Nombre del Proyecto o Programa')
    autores = models.CharField(max_length=300, default="", verbose_name='Autores del Proyecto o Programa')
    Planificaciopn_Proyectos_Programas = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie la planificación de programas/proyectos interdisciplinares",
        null=True,
        blank=True
    )
    Ejecucion_Proyectos_Programas = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie la ejecución de programas/proyectos interdisciplinares",
        null=True,
        blank=True
    )
    Politicas_Procedimientos = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Políticas o procedimientos definidos para la planificación, ejecución y evaluación de los programas o proyectos interdisciplinares.",
        null=True,
        blank=True
    )
    Syllabus_Asignaturas = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Syllabus de las asignaturas consideradas en los programas o proyectos interdisciplinares ",
        null=True,
        blank=True
    )
    Productos_Resultados = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencien los productos o resultados obtenidos en los proyectos",
        null=True,
        blank=True
    )
    Evidencia_Articulacion = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie el análisis de la articulación de las funciones sustantivas",
        null=True,
        blank=True
    )
    Evidencia_Difusion = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación o medios que evidencie la difusión de los resultados de los programas o proyectos interdisciplinares",
        null=True,
        blank=True
    )
    Mejora_Gestion = models.FileField(
        upload_to='pdfs/',  
        verbose_name="Documentación que evidencie las acciones de mejora en la gestión de los programas o proyectos interdisciplinares",
        null=True,
        blank=True
    )
    class Meta:
        verbose_name_plural = "Fuentes de Información: Indicador 20"

def Produccion_Cientifica(anio_inicio, anio_fin):
    
    documentos_rango_pasado = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_fin)
    documentos = documentos_rango_pasado 
    
    if not documentos:
        return {'error': 'No hay documentos en el rango de años seleccionado.'}

    # Obtener los años de publicación de los documentos filtrados
    años_publicacion = [int(doc.Año_Publiacion) for doc in documentos]

    # Calcular los cuartiles
    Q1 = np.percentile(años_publicacion, 20) if len(años_publicacion) > 0 else 0
    Q2 = np.percentile(años_publicacion, 40) if len(años_publicacion) > 0 else 0
    Q3 = np.percentile(años_publicacion, 60) if len(años_publicacion) > 0 else 0
    Q4 = np.percentile(años_publicacion, 80) if len(años_publicacion) > 0 else 0

    # Almacenar los cuartiles en un diccionario
    cuartiles = {'Q1': Q1, 'Q2': Q2, 'Q3': Q3, 'Q4': Q4}

    # Contar los diferentes tipos de documentos
    PI = documentos.filter(nombre='Artculos Scopus o Web of Science').count()  # Artículos en Scopus o Web of Science
    BR = documentos.filter(nombre='Artículos bases de datos regionales').count()  # Artículos en bases de datos regionales
    NP = documentos.count()  # Total de documentos

    tabla = [] 
    suma_fi = 0 

    # Recorrer cada documento y determinar su cuartil
    for doc in documentos:
        año = int(doc.Año_Publiacion)  # Convertir a entero
        cuartil_nombre = None
        fi = None

        # Asignar cuartil basado en el año de publicación
        if año <= Q1:
            fi = 1
            cuartil_nombre = 'Q1'
        elif Q1 < año <= Q2:
            fi = 0.8
            cuartil_nombre = 'Q2'
        elif Q2 < año <= Q3:
            fi = 0.5
            cuartil_nombre = 'Q3'
        elif Q3 < año <= Q4:
            fi = 0.35
            cuartil_nombre = 'Q4'
        else:
            fi = 0
            cuartil_nombre = 'Fuera de Q4'

        # Condicional adicional basado en el tipo de documento
        if doc.nombre == 'Artculos Scopus o Web of Science':  # Artículos en Scopus o Web of Science
            fi = 0.3
            cuartil_nombre = 'PI'  # Artículos en Scopus o Web of Science
        elif doc.nombre == 'Artículos bases de datos regionales':  # Artículos en bases de datos regionales
            fi = 0.1
            cuartil_nombre = 'BR'  # Artículos en bases de datos regionales

        # Agregar los resultados a la tabla
        tabla.append({
            'año': año,
            'Tipo_Documento': doc.nombre,
            'Carrera': doc.carrera,
            'cuartil': cuartil_nombre,
            'fi': fi,
            'exposicion': doc.Exposicion_Procendings,
            'Capitulos_Desarrollados': doc.N_Cap_Par,
            'Capitulos_Totales': doc.T_Cap,
            'Areas_Niveles': doc.Areas_Niveles,
        })

        # Sumar los valores de fi
        suma_fi += fi 

    return {'cuartiles': cuartiles, 'tabla': tabla, 'NP': NP, 'Produccion': suma_fi}

def Produccion_Artistica(anio_inicio, anio_fin):

    documentos_rango_pasado = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_fin)
    documentos = documentos_rango_pasado 
    
    if not documentos.exists():
        return {'error': 'No hay documentos en el rango de años seleccionado.'}

    # Inicializar contadores
    OPN = 0  # Contador para exposiciones nacionales
    OPI = 0  # Contador para exposiciones internacionales

    # Recorrer documentos y realizar las sumas
    for doc in documentos:
        if doc.Exposicion_Procendings == 'Nacional':
            OPN += 1
        elif doc.Exposicion_Procendings == 'Internacional':
            OPI += 1
    
    PA = round(OPI + 0.8*OPN,4)

    return {'OPN': OPN, 'OPI': OPI, 'PA':PA}

def Libros_Capitulos(anio_inicio, anio_fin):
    documentos_rango_pasado = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_fin)
    documentos = documentos_rango_pasado 
    
    if not documentos.exists():
        return {'error': 'No hay documentos en el rango de años seleccionado.'}

    L = 0
    CLTCs = []
    suma_CLTC = 0
    for doc in documentos:
        if doc.N_Cap_Par == doc.T_Cap and doc.nombre == 'Libros y capítulos':
            L += 1
        elif doc.N_Cap_Par != doc.T_Cap and doc.nombre == 'Libros y capítulos':
            CLTC = doc.N_Cap_Par / doc.T_Cap
            CLTCs.append(CLTC)
            suma_CLTC += CLTC
    LyCL = round(L+suma_CLTC,4)
    return {'L': L, 'Suma_CLTC': suma_CLTC, 'LyCL': LyCL}

def Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin):
    documentos_rango_pasado = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_fin)
    documentos = documentos_rango_pasado 
    
    if not documentos.exists():
        return {'error': 'No hay documentos en el rango de años seleccionado.'}

    PI = 0
    DA = 0
    OVCT = 0
    for doc in documentos:
        if doc.Areas_Niveles == 'Obtenciones Vegetales y Conocimientos Tradicionales':
            OVCT += 1
        elif doc.Areas_Niveles == 'Derechos de Autor y Conexos':
            DA += 1
        elif doc.Areas_Niveles == 'Propiedad Industrial':
            PI += 1
    PIA = OVCT + DA + PI
    return {'PIA': PIA}
    
def IPA_Denomindaor():
    Personal = Personal_Academico.objects.all()
    PTC = 0  # Contador de Personal a Tiempo Completo
    PMT = 0  # Contador de Personal a Tiempo Parcial

    for doc in Personal:
        if doc.tipo_contrato == 'Tiempo Completo':
            PTC += 1
        elif doc.tipo_contrato == 'Tiempo Parcial':
            PMT += 1

    Denominador = PTC + 0.5 * PMT

    return {'PTC':PTC,'PMT':PMT,'IPA_Den': Denominador}

def IPA(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4):
    # Obtener los resultados de las funciones correspondientes
    # Producción Científica
    produccion_cientifica = Produccion_Cientifica(anio_inicio, anio_fin)
    
    if 'error' in produccion_cientifica:
        return produccion_cientifica  # Retorna el error si es que hay alguno
    
    Suma_fi = produccion_cientifica['Produccion']
    
    # Producción Artística
    produccion_artistica = Produccion_Artistica(anio_inicio, anio_fin)
    
    if 'error' in produccion_artistica:
        return produccion_artistica  # Retorna el error si es que hay alguno
    
    PA = produccion_artistica['PA']
    
    # Libros y Capitulos
    libros_capitulos = Libros_Capitulos(anio_inicio, anio_fin)
    
    if 'error' in libros_capitulos:
        return libros_capitulos  # Retorna el error si es que hay alguno
    
    LyLC = libros_capitulos['LyCL']
    
    # Propiedad Intelectual Aplicada
    propiedad_intelectual = Propiedad_Intelectual_Aplicada(anio_inicio, anio_fin)
    
    if 'error' in propiedad_intelectual:
        return propiedad_intelectual  # Retorna el error si es que hay alguno
    
    PIA = propiedad_intelectual['PIA']
    
    # Calcular el denominador usando la función IPA_Denomindaor
    denominador_info = IPA_Denomindaor()
    Denominador = denominador_info['IPA_Den']
    
    if Denominador == 0:
        return {'error': 'El denominador no puede ser cero.'}
    
    # Calcular el IPA utilizando los valores de alfa
    IPA = round((alfa1 * Suma_fi + alfa2 * PA + alfa3 * LyLC + alfa4 * PIA) / Denominador, 4)
    
    return IPA

def graficar_documentos():
    documentos = Documento.objects.all()

    # Datos para el gráfico
    anios = [doc.Año_Publiacion for doc in documentos]
    estados = [doc.Estado for doc in documentos]
    areas_niveles = [doc.Areas_Niveles for doc in documentos]
    exposiciones = [doc.Exposicion_Procendings for doc in documentos]
    carrera = [doc.carrera for doc in documentos]

    # Contar la frecuencia de cada categoría
    data = {
        "anios": {anio: anios.count(anio) for anio in set(anios)},
        "estados": {estado: estados.count(estado) for estado in set(estados)},
        "areas_niveles": {area: areas_niveles.count(area) for area in set(areas_niveles)},
        "exposiciones": {expo: exposiciones.count(expo) for expo in set(exposiciones)},
        "carrera": {carrera: carrera.count(carrera) for carrera in set(carrera)},
        "tipos_documentos": {}
    }

    # Frecuencia de documentos por año y tipo de documento
    anios_por_tipo = {}
    for doc in documentos:
        anio = doc.Año_Publiacion
        tipo_documento = doc.nombre
        if anio not in anios_por_tipo:
            anios_por_tipo[anio] = {}  # Inicializamos como diccionario vacío si no existe
        if tipo_documento not in anios_por_tipo[anio]:
            anios_por_tipo[anio][tipo_documento] = 0  # Inicializamos el contador si no existe
        anios_por_tipo[anio][tipo_documento] += 1  # Incrementamos el contador

    # Aseguramos que data["tipos_documentos"] sea un diccionario de diccionarios
    for anio, tipos in anios_por_tipo.items():
        for tipo, count in tipos.items():
            if tipo not in data["tipos_documentos"]:
                data["tipos_documentos"][tipo] = {}
            data["tipos_documentos"][tipo][anio] = count

    # Frecuencia de documentos por año y estado
    anios_por_estado = {}
    for doc in documentos:
        anio = doc.Año_Publiacion
        estado = doc.Estado

        if anio not in anios_por_estado:
            anios_por_estado[anio] = {}

        if estado not in anios_por_estado[anio]:
            anios_por_estado[anio][estado] = 0  # Inicializamos el contador

        anios_por_estado[anio][estado] += 1  # Incrementamos el contador

    # Asegurarnos de que data["estados"] sea un diccionario de diccionarios
    for anio, estados in anios_por_estado.items():
        for estado, count in estados.items():
            if estado not in data["estados"]:
                data["estados"][estado] = {}  # Inicializamos un diccionario vacío si no existe
            # Aquí agregamos la validación
            if isinstance(data["estados"][estado], dict):
                data["estados"][estado][anio] = count  # Asignamos el conteo si es un diccionario
            else:
                # Si no es un diccionario, inicializamos uno y luego asignamos el conteo
                data["estados"][estado] = {anio: count}


    # Frecuencia de documentos por año y área de niveles
    anios_por_area = {}
    for doc in documentos:
        anio = doc.Año_Publiacion
        area = doc.Areas_Niveles

        if anio not in anios_por_area:
            anios_por_area[anio] = {}

        if area not in anios_por_area[anio]:
            anios_por_area[anio][area] = 0  # Inicializamos el contador

        anios_por_area[anio][area] += 1  # Incrementamos el contador

    # Asegurarnos de que data["areas_niveles"] sea un diccionario de diccionarios
    for anio, areas in anios_por_area.items():
        for area, count in areas.items():
            if area not in data["areas_niveles"]:
                data["areas_niveles"][area] = {}  # Inicializamos un diccionario vacío si no existe
            # Aquí agregamos la validación
            if isinstance(data["areas_niveles"][area], dict):
                data["areas_niveles"][area][anio] = count  # Asignamos el conteo si es un diccionario
            else:
                # Si no es un diccionario, inicializamos uno y luego asignamos el conteo
                data["areas_niveles"][area] = {anio: count}

    # Frecuencia de documentos por año y exposición
    anios_por_exposicion = {}
    for doc in documentos:
        anio = doc.Año_Publiacion
        exposicion = doc.Exposicion_Procendings

        if anio not in anios_por_exposicion:
            anios_por_exposicion[anio] = {}

        if exposicion not in anios_por_exposicion[anio]:
            anios_por_exposicion[anio][exposicion] = 0  # Inicializamos el contador

        anios_por_exposicion[anio][exposicion] += 1  # Incrementamos el contador

    # Asegurarnos de que data["exposiciones"] sea un diccionario de diccionarios
    for anio, exposiciones_data in anios_por_exposicion.items():
        for exposicion, count in exposiciones_data.items():
            if exposicion not in data["exposiciones"]:
                data["exposiciones"][exposicion] = {}  # Inicializamos un diccionario vacío si no existe
            # Aquí agregamos la validación
            if isinstance(data["exposiciones"][exposicion], dict):
                data["exposiciones"][exposicion][anio] = count  # Asignamos el conteo si es un diccionario
            else:
                # Si no es un diccionario, inicializamos uno y luego asignamos el conteo
                data["exposiciones"][exposicion] = {anio: count}
    
    # Frecuencia de documentos por año y carrera
    anios_por_carrera = {}
    for doc in documentos:
        anio = doc.Año_Publiacion
        carrera = doc.carrera  # Suponiendo que existe un atributo "Carrera" en los documentos

        if anio not in anios_por_carrera:
            anios_por_carrera[anio] = {}

        if carrera not in anios_por_carrera[anio]:
            anios_por_carrera[anio][carrera] = 0  # Inicializamos el contador

        anios_por_carrera[anio][carrera] += 1  # Incrementamos el contador

    # Asegurarnos de que data["carrera_niveles"] sea un diccionario de diccionarios
    for anio, carreras in anios_por_carrera.items():
        for carrera, count in carreras.items():
            if carrera not in data["carrera"]:
                data["carrera"][carrera] = {}  # Inicializamos un diccionario vacío si no existe
            if isinstance(data["carrera"][carrera], dict):
                data["carrera"][carrera][anio] = count  # Asignamos el conteo si es un diccionario
            else:
                data["carrera"][carrera] = {anio: count}

    
    return data

def IPA_Anual(alfa1, alfa2, alfa3, alfa4):
    documentosT = Documento.objects.all()
    resultado_denominador = IPA_Denomindaor()
    denominador_anual = resultado_denominador.get('IPA_Den')

    # Inicializar variables
    produccion_por_año = defaultdict(float) 
    PA_por_año = defaultdict(float)
    L_por_año = defaultdict(float)  
    CLTC_por_año = defaultdict(float)  # Acumuladores
    LyCL_por_año = defaultdict(float)
    PI_por_año = defaultdict(int)  
    DA_por_año = defaultdict(int)  
    OVCT_por_año = defaultdict(int) 
    PIA_por_año = defaultdict(float)  
    IPA_por_año = defaultdict(float)

    # Verificar si hay documentos
    if not documentosT.exists():
        return []

    # Extraer los años de publicación
    años_publicacionT = [int(doc.Año_Publiacion) for doc in documentosT]
    Q1T = np.percentile(años_publicacionT, 20) if años_publicacionT else 0
    Q2T = np.percentile(años_publicacionT, 40) if años_publicacionT else 0
    Q3T = np.percentile(años_publicacionT, 60) if años_publicacionT else 0
    Q4T = np.percentile(años_publicacionT, 80) if años_publicacionT else 0

    # Calcular PC por cada documento
    for doc in documentosT:

        # PROPIEDAD CIENTÍFICA
        año = int(doc.Año_Publiacion)
        fi = 0
        if año <= Q1T:
            fi = 1
        elif Q1T < año <= Q2T:
            fi = 0.8
        elif Q2T < año <= Q3T:
            fi = 0.5
        elif Q3T < año <= Q4T:
            fi = 0.35
        if doc.nombre == 'Artculos Scopus o Web of Science':  # Artículos en Scopus o Web of Science
            fi = 0.3
        elif doc.nombre == 'Artículos bases de datos regionales':  # Artículos en bases de datos regionales
            fi = 0.1
    
        produccion_por_año[año] += fi

        # PROPIEDAD ARTÍSTICA

        año = int(doc.Año_Publiacion)
        OPN_T = 0
        OPI_T = 0

        if doc.Exposicion_Procendings == 'Nacional':
            OPN_T += 1
        elif doc.Exposicion_Procendings == 'Internacional':
            OPI_T += 1

        PA = round(OPI_T + 0.8 * OPN_T, 4)
        PA_por_año[año] += PA

        # LIBROS Y CAPÍTULOS
        if doc.nombre == 'Libros y capítulos':
            if doc.N_Cap_Par == doc.T_Cap:
                L_por_año[año] += 1 
            else:
                CLTC = doc.N_Cap_Par / doc.T_Cap
                CLTC_por_año[año] += CLTC  
            LyCL_por_año[año] = round(L_por_año[año]+CLTC_por_año[año],4)

        # PROPIEDAD INTELECTUAL APLICADA

        if doc.Areas_Niveles == 'Obtenciones Vegetales y Conocimientos Tradicionales':
            OVCT_por_año[año] += 1
        elif doc.Areas_Niveles == 'Derechos de Autor y Conexos':
            DA_por_año[año] += 1
        elif doc.Areas_Niveles == 'Propiedad Industrial':
            PI_por_año[año] += 1
        PIA_por_año[año] = PI_por_año[año] + DA_por_año[año] + OVCT_por_año[año]
    
        IPA_por_año[año] = round((alfa1 * produccion_por_año[año] + alfa2 *PA_por_año[año]  + 
                              alfa3 * LyCL_por_año[año] + alfa4 * PIA_por_año[año]) / 
                              denominador_anual, 4)

    tabla_Anual = [
    {
        'año': año,
        'Produccion_Cientifica': produccion_por_año[año],
        'Produccion_Artistica': PA_por_año.get(año, 0), 
        'Libros_Capitulos': LyCL_por_año.get(año, 0),
        'PIA': PIA_por_año.get(año, 0), 
        'IPA_Anual': IPA_por_año.get(año, 0), 
    }
    for año in sorted(set(produccion_por_año.keys()).union(PA_por_año.keys()).union(LyCL_por_año.keys())
                      .union(PIA_por_año.keys()).union(IPA_por_año.keys()))
    ]

    return tabla_Anual

def graficar_ipa(alfa1, alfa2, alfa3, alfa4):

    tabla_Anual = IPA_Anual(alfa1, alfa2, alfa3, alfa4)

    # Extraer los datos para el gráfico
    años = [item['año'] for item in tabla_Anual]
    ipa_anual = [item['IPA_Anual'] for item in tabla_Anual]
    produccion_cientifica = [item['Produccion_Cientifica'] for item in tabla_Anual]
    produccion_artistica = [item['Produccion_Artistica'] for item in tabla_Anual]
    libros_capitulos = [item['Libros_Capitulos'] for item in tabla_Anual]
    pia = [item['PIA'] for item in tabla_Anual]

    # Pasar los datos a la plantilla
    return {
        'años': años,
        'ipa_anual': ipa_anual,
        'produccion_cientifica': produccion_cientifica,
        'produccion_artistica': produccion_artistica,
        'libros_capitulos': libros_capitulos,
        'pia': pia,
    }

def IPA_Carrera(alfa1, alfa2, alfa3, alfa4):
    documentosT = Documento.objects.all()
    resultado_denominador = IPA_Denomindaor()
    denominador_anual = resultado_denominador.get('IPA_Den')

    # Inicializar variables para almacenar los resultados agrupados por carrera
    produccion_cientifica_carrera = defaultdict(float)
    produccion_artistica_carrera = defaultdict(float)
    libros_capitulos_carrera = defaultdict(float)
    propiedad_intelectual_aplicada_carrera = defaultdict(float)
    LyCL_carrera = defaultdict(float)
    PIA_carrera = defaultdict(float)
    IPA_carrera = defaultdict(float)

    # Verificar si hay documentos
    if not documentosT.exists():
        return []

    # Extraer los años de publicación (sin necesidad de agrupar por año)
    años_publicacionT = [int(doc.Año_Publiacion) for doc in documentosT]
    Q1T = np.percentile(años_publicacionT, 20) if años_publicacionT else 0
    Q2T = np.percentile(años_publicacionT, 40) if años_publicacionT else 0
    Q3T = np.percentile(años_publicacionT, 60) if años_publicacionT else 0
    Q4T = np.percentile(años_publicacionT, 80) if años_publicacionT else 0
    cuartiles_total = {'Q1': Q1T, 'Q2': Q2T, 'Q3': Q3T, 'Q4': Q4T}

    # Calcular las métricas por carrera, sin agrupar por año
    for doc in documentosT:
        # Asegúrate de que 'carrera' sea un string, si es una lista u otro tipo
        carrera = str(doc.carrera)

        # PROPIEDAD CIENTÍFICA
        fi = 0
        año = int(doc.Año_Publiacion)
        if año <= Q1T:
            fi = 1
        elif Q1T < año <= Q2T:
            fi = 0.8
        elif Q2T < año <= Q3T:
            fi = 0.5
        elif Q3T < año <= Q4T:
            fi = 0.35
        if doc.nombre == 'Artculos Scopus o Web of Science':  # Artículos en Scopus o Web of Science
            fi = 0.3
        elif doc.nombre == 'Artículos bases de datos regionales':  # Artículos en bases de datos regionales
            fi = 0.1
    
        produccion_cientifica_carrera[carrera] += fi

        # PROPIEDAD ARTÍSTICA
        OPN_T = 0
        OPI_T = 0

        if doc.Exposicion_Procendings == 'Nacional':
            OPN_T += 1
        elif doc.Exposicion_Procendings == 'Internacional':
            OPI_T += 1

        PA = round(OPI_T + 0.8 * OPN_T, 4)
        produccion_artistica_carrera[carrera] += PA

        # LIBROS Y CAPÍTULOS
        if doc.nombre == 'Libros y capítulos':
            if doc.N_Cap_Par == doc.T_Cap:
                libros_capitulos_carrera[carrera] += 1 
            else:
                CLTC = doc.N_Cap_Par / doc.T_Cap
                libros_capitulos_carrera[carrera] += CLTC  
            LyCL_carrera[carrera] = round(libros_capitulos_carrera[carrera], 4)

        # PROPIEDAD INTELECTUAL APLICADA
        if doc.Areas_Niveles == 'Obtenciones Vegetales y Conocimientos Tradicionales':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        elif doc.Areas_Niveles == 'Derechos de Autor y Conexos':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        elif doc.Areas_Niveles == 'Propiedad Industrial':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        
        PIA_carrera[carrera] = propiedad_intelectual_aplicada_carrera[carrera]

    # Calcular IPA por carrera
    for carrera in produccion_cientifica_carrera:
        IPA_carrera[carrera] = round((alfa1 * produccion_cientifica_carrera[carrera] + alfa2 * produccion_artistica_carrera[carrera] + 
                                      alfa3 * LyCL_carrera[carrera] + alfa4 * PIA_carrera[carrera]) / denominador_anual, 4)

    # Crear la tabla final con los resultados agrupados por carrera
    tabla_Anual_carrera = [
        {
            'carrera': carrera,
            'Produccion_Cientifica': produccion_cientifica_carrera[carrera],
            'Produccion_Artistica': produccion_artistica_carrera[carrera], 
            'Libros_Capitulos': LyCL_carrera[carrera],
            'PIA': PIA_carrera[carrera], 
            'IPA_Anual': IPA_carrera[carrera], 
        }
        for carrera in produccion_cientifica_carrera
    ]

    return {'Tabla_anual_carrera':tabla_Anual_carrera, 'cuartiles_total':cuartiles_total}

def IPA_Anual_por_carrera_y_rango(anio_inicio, anio_fin, alfa1, alfa2, alfa3, alfa4):
    # Filtrar los documentos dentro del rango de años seleccionado
    documentos_rango_pasado = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_fin)
    documentosT = documentos_rango_pasado
    
    if not documentosT:
        return {'error': 'No hay documentos en el rango de años seleccionado.'}

    resultado_denominador = IPA_Denomindaor()
    denominador_anual = resultado_denominador.get('IPA_Den')

    # Inicializar variables para almacenar los resultados agrupados por carrera
    produccion_cientifica_carrera = defaultdict(float)
    produccion_artistica_carrera = defaultdict(float)
    libros_capitulos_carrera = defaultdict(float)
    propiedad_intelectual_aplicada_carrera = defaultdict(float)
    LyCL_carrera = defaultdict(float)
    PIA_carrera = defaultdict(float)
    IPA_carrera = defaultdict(float)

    # Verificar si hay documentos
    if not documentosT.exists():
        return []

    # Extraer los años de publicación de los documentos dentro del rango de años seleccionado
    años_publicacionT = [int(doc.Año_Publiacion) for doc in documentosT]
    
    # Calcular los cuartiles de los años de publicación dentro del rango seleccionado
    Q1T = np.percentile(años_publicacionT, 20) if años_publicacionT else 0
    Q2T = np.percentile(años_publicacionT, 40) if años_publicacionT else 0
    Q3T = np.percentile(años_publicacionT, 60) if años_publicacionT else 0
    Q4T = np.percentile(años_publicacionT, 80) if años_publicacionT else 0

    # Calcular las métricas por carrera, considerando el rango de años de cada carrera
    for doc in documentosT:
        carrera = doc.carrera
        año = int(doc.Año_Publiacion)
        
        # Verificar si el año de publicación está dentro del rango de años proporcionado
        if año < anio_inicio or año > anio_fin:
            continue  # Si el año no está en el rango de años proporcionado, se salta este documento

        # PROPIEDAD CIENTÍFICA
        fi = None
        if año <= Q1T:
            fi = 1
        elif Q1T < año <= Q2T:
            fi = 0.8
        elif Q2T < año <= Q3T:
            fi = 0.5
        elif Q3T < año <= Q4T:
            fi = 0.35
        else:
            fi = 0

        if doc.nombre == 'Artculos Scopus o Web of Science':  # Artículos en Scopus o Web of Science
            fi = 0.3
        elif doc.nombre == 'Artículos bases de datos regionales':  # Artículos en bases de datos regionales
            fi = 0.1
    
        produccion_cientifica_carrera[carrera] += fi

        # PROPIEDAD ARTÍSTICA
        OPN_T = 0
        OPI_T = 0

        if doc.Exposicion_Procendings == 'Nacional':
            OPN_T += 1
        elif doc.Exposicion_Procendings == 'Internacional':
            OPI_T += 1

        PA = round(OPI_T + 0.8 * OPN_T, 4)
        produccion_artistica_carrera[carrera] += PA

        # LIBROS Y CAPÍTULOS
        if doc.nombre == 'Libros y capítulos':
            if doc.N_Cap_Par == doc.T_Cap:
                libros_capitulos_carrera[carrera] += 1 
            else:
                CLTC = doc.N_Cap_Par / doc.T_Cap
                libros_capitulos_carrera[carrera] += CLTC  
            LyCL_carrera[carrera] = round(libros_capitulos_carrera[carrera], 4)

        # PROPIEDAD INTELECTUAL APLICADA
        if doc.Areas_Niveles == 'Obtenciones Vegetales y Conocimientos Tradicionales':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        elif doc.Areas_Niveles == 'Derechos de Autor y Conexos':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        elif doc.Areas_Niveles == 'Propiedad Industrial':
            propiedad_intelectual_aplicada_carrera[carrera] += 1
        
        PIA_carrera[carrera] = propiedad_intelectual_aplicada_carrera[carrera]

    # Calcular IPA por carrera
    for carrera in produccion_cientifica_carrera:
        IPA_carrera[carrera] = round((alfa1 * produccion_cientifica_carrera[carrera] + alfa2 * produccion_artistica_carrera[carrera] + 
                                      alfa3 * LyCL_carrera[carrera] + alfa4 * PIA_carrera[carrera]) / denominador_anual, 4)

    # Crear la tabla final con los resultados agrupados por carrera y rango de años
    tabla_Anual_carrera = [
        {
            'carrera': carrera,
            'rango_anos': f"{anio_inicio} - {anio_fin}",
            'Produccion_Cientifica': produccion_cientifica_carrera[carrera],
            'Produccion_Artistica': produccion_artistica_carrera[carrera], 
            'Libros_Capitulos': LyCL_carrera[carrera],
            'PIA': PIA_carrera[carrera], 
            'IPA_Anual': IPA_carrera[carrera], 
        }
        for carrera in produccion_cientifica_carrera
    ]

    # Retornar la tabla con los resultados
    return tabla_Anual_carrera

def IPA_Anual_por_rango(anio_inicio, anio_final, alfa1, alfa2, alfa3, alfa4):
    # Filtrar documentos dentro del rango de años
    documentosT = Documento.objects.filter(Año_Publiacion__gte=anio_inicio, Año_Publiacion__lte=anio_final)
    
    # Obtener el denominador anual
    resultado_denominador = IPA_Denomindaor()
    denominador_anual = resultado_denominador.get('IPA_Den')

    # Inicializar variables
    produccion_por_año = defaultdict(float) 
    PA_por_año = defaultdict(float)
    L_por_año = defaultdict(float)  
    CLTC_por_año = defaultdict(float)  # Acumuladores
    LyCL_por_año = defaultdict(float)
    PI_por_año = defaultdict(int)  
    DA_por_año = defaultdict(int)  
    OVCT_por_año = defaultdict(int) 
    PIA_por_año = defaultdict(float)  
    IPA_por_año = defaultdict(float)

    # Verificar si hay documentos
    if not documentosT.exists():
        return []

    # Extraer los años de publicación
    años_publicacionT = [int(doc.Año_Publiacion) for doc in documentosT]
    Q1T = np.percentile(años_publicacionT, 20) if años_publicacionT else 0
    Q2T = np.percentile(años_publicacionT, 40) if años_publicacionT else 0
    Q3T = np.percentile(años_publicacionT, 60) if años_publicacionT else 0
    Q4T = np.percentile(años_publicacionT, 80) if años_publicacionT else 0

    # Calcular PC por cada documento
    for doc in documentosT:

        # PROPIEDAD CIENTÍFICA
        año = int(doc.Año_Publiacion)
        fi = 0
        if año <= Q1T:
            fi = 1
        elif Q1T < año <= Q2T:
            fi = 0.8
        elif Q2T < año <= Q3T:
            fi = 0.5
        elif Q3T < año <= Q4T:
            fi = 0.35
        if doc.nombre == 'Artculos Scopus o Web of Science':  # Artículos en Scopus o Web of Science
            fi = 0.3
        elif doc.nombre == 'Artículos bases de datos regionales':  # Artículos en bases de datos regionales
            fi = 0.1
    
        produccion_por_año[año] += fi

        # PROPIEDAD ARTÍSTICA
        año = int(doc.Año_Publiacion)
        OPN_T = 0
        OPI_T = 0

        if doc.Exposicion_Procendings == 'Nacional':
            OPN_T += 1
        elif doc.Exposicion_Procendings == 'Internacional':
            OPI_T += 1

        PA = round(OPI_T + 0.8 * OPN_T, 4)
        PA_por_año[año] += PA

        # LIBROS Y CAPÍTULOS
        if doc.nombre == 'Libros y capítulos':
            if doc.N_Cap_Par == doc.T_Cap:
                L_por_año[año] += 1 
            else:
                CLTC = doc.N_Cap_Par / doc.T_Cap
                CLTC_por_año[año] += CLTC  
            LyCL_por_año[año] = round(L_por_año[año] + CLTC_por_año[año], 4)

        # PROPIEDAD INTELECTUAL APLICADA
        if doc.Areas_Niveles == 'Obtenciones Vegetales y Conocimientos Tradicionales':
            OVCT_por_año[año] += 1
        elif doc.Areas_Niveles == 'Derechos de Autor y Conexos':
            DA_por_año[año] += 1
        elif doc.Areas_Niveles == 'Propiedad Industrial':
            PI_por_año[año] += 1
        PIA_por_año[año] = PI_por_año[año] + DA_por_año[año] + OVCT_por_año[año]
    
        IPA_por_año[año] = round((alfa1 * produccion_por_año[año] + alfa2 * PA_por_año[año] + 
                                  alfa3 * LyCL_por_año[año] + alfa4 * PIA_por_año[año]) / 
                                  denominador_anual, 4)

    # Crear la tabla de resultados
    tabla_Anual = [
        {
            'año': año,
            'Produccion_Cientifica': produccion_por_año[año],
            'Produccion_Artistica': PA_por_año.get(año, 0), 
            'Libros_Capitulos': LyCL_por_año.get(año, 0),
            'PIA': PIA_por_año.get(año, 0), 
            'IPA_Anual': IPA_por_año.get(año, 0), 
        }
        for año in range(anio_inicio, anio_final + 1)
    ]

    return tabla_Anual
