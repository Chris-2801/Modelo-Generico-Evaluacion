$(document).ready(function () {

    // Secciones Contribucion Investigación
    $('#showTables').on('click', function () {
        $('#tablasSection').show(); $('#calculosSection').hide(); $('#calculosCarreraSection').hide(); $('#IntroSection').hide(); $('#Indicador20').hide(); });

    $('#showCalculations').on('click', function () {
        $('#calculosSection').show(); $('#tablasSection').hide(); $('#calculosCarreraSection').hide(); $('#IntroSection').hide(); $('#Indicador20').hide(); });

    $('#showCalculationsCarrera').on('click', function () {
        $('#calculosCarreraSection').show(); $('#tablasSection').hide(); $('#calculosSection').hide(); $('#IntroSection').hide(); $('#Indicador20').hide(); });

    $('#Introduccion').on('click', function () {
        $('#IntroSection').show(); $('#tablasSection').hide(); $('#calculosSection').hide(); $('#calculosCarreraSection').hide(); $('#Indicador20').hide();});

    $('#ShowIndicador20').on('click', function () {
        $('#Indicador20').show(); $('#tablasSection').hide(); $('#calculosSection').hide(); $('#calculosCarreraSection').hide(); $('#IntroSection').hide(); });

    // Secciones Curriculo
    $('#IntroduccionCurriculo').on('click', function () {
        $('#IntroSection').show(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#showPerfil').on('click', function () {
        $('#PerilEgresoSection').show(); $('#IntroSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#showProyectoCurricular').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').show(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#showMallaCurricular').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').show(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#ShowSyllabus').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').show();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#showMetodologiaAprendizaje').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').show();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();});

    $('#showEscenarioPracticas').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').show();$('#TACSection').hide();});

    $('#ShowTAC').on('click', function () {
        $('#IntroduccionCurriculo').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').show();});

    // Secciones Subcriterio Personal Academico

    $('#showIndicador8').on('click', function () {
        $('#Indicador8seccion').show(); $('#Indicador9seccion').hide(); $('#Indicador10seccion').hide();});

    $('#showIndicador9').on('click', function () {
        $('#Indicador8seccion').hide(); $('#Indicador9seccion').show(); $('#Indicador10seccion').hide();});

    $('#showIndicador10').on('click', function () {
        $('#Indicador8seccion').hide(); $('#Indicador9seccion').hide(); $('#Indicador10seccion').show();});

    // Secciones Subcriterio Estudiantes

    $('#showIndicador11').on('click', function () {
        $('#Indicador11seccion').show(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').hide();});
    
    $('#showIndicador12').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').show(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').hide();});

    $('#showIndicador13').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').show();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').hide();});
    
    $('#showIndicador14').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').show(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').hide();});

    $('#showIndicador15').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').show(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').hide();});    
        
    $('#showIndicador16').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').show();
        $('#Indicador17seccion').hide();});

    $('#showIndicador17').on('click', function () {
        $('#Indicador11seccion').hide(); $('#Indicador12seccion').hide(); $('#Indicador13seccion').hide();
        $('#Indicador14seccion').hide(); $('#Indicador15seccion').hide(); $('#Indicador16seccion').hide();
        $('#Indicador17seccion').show();});

    // Secciones Subcriterio Transferencia de tecnología y conocimiento

    $('#showIndicador22').on('click', function () {
        $('#Indicador22seccion').show(); $('#Indicador23seccion').hide();});

    $('#showIndicador23').on('click', function () {
        $('#Indicador22seccion').hide(); $('#Indicador23seccion').show();});

    // Secciones Subcriterio Funciones estratégicas

    $('#showIndicador24').on('click', function () {
        $('#Indicador24seccion').show(); $('#Indicador25seccion').hide(); $('#Indicador26seccion').hide();$('#Indicador27seccion').hide();});

    $('#showIndicador25').on('click', function () {
        $('#Indicador24seccion').hide(); $('#Indicador25seccion').show(); $('#Indicador26seccion').hide();$('#Indicador27seccion').hide();});

    $('#showIndicador26').on('click', function () {
        $('#Indicador24seccion').hide(); $('#Indicador25seccion').hide(); $('#Indicador26seccion').show();$('#Indicador27seccion').hide();});

    $('#showIndicador27').on('click', function () {
        $('#Indicador24seccion').hide(); $('#Indicador25seccion').hide(); $('#Indicador26seccion').hide();$('#Indicador27seccion').show();});

    // Secciones Subcriterio Funciones estratégicas

    $('#showIndicador28').on('click', function () {
        $('#Indicador28seccion').show(); $('#Indicador29seccion').hide(); $('#Indicador30seccion').hide();$('#Indicador31seccion').hide();});

    $('#showIndicador29').on('click', function () {
        $('#Indicador28seccion').hide(); $('#Indicador29seccion').show(); $('#Indicador30seccion').hide();$('#Indicador31seccion').hide();});

    $('#showIndicador30').on('click', function () {
        $('#Indicador28seccion').hide(); $('#Indicador29seccion').hide(); $('#Indicador30seccion').show();$('#Indicador31seccion').hide();});

    $('#showIndicador31').on('click', function () {
        $('#Indicador28seccion').hide(); $('#Indicador29seccion').hide(); $('#Indicador30seccion').hide();$('#Indicador31seccion').show();});
    });

