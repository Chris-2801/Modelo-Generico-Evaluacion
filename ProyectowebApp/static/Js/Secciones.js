$(document).ready(function () {
    // Manejo de visibilidad para secciones
    $('#IntroduccionCurriculo').on('click', function () {
        $('#IntroSection').show(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#showPerfil').on('click', function () {
        $('#PerilEgresoSection').show(); $('#IntroSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#showProyectoCurricular').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').show(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#showMallaCurricular').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').show(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#ShowSyllabus').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').show();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#showMetodologiaAprendizaje').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').show();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').hide();
    });

    $('#showEscenarioPracticas').on('click', function () {
        $('#IntroSection').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').show();$('#TACSection').hide();
    });

    $('#ShowTAC').on('click', function () {
        $('#IntroduccionCurriculo').hide(); $('#PerilEgresoSection').hide(); $('#ProyectoCurricularSection').hide(); 
        $('#MallaCurricularSection').hide(); $('#SyllabusSection').hide();$('#MetodologiaRecursosAprendizajeSection').hide();
        $('#EscenariosPracticasFormativasSection').hide();$('#TACSection').show();
    });
});