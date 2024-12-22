$(document).ready(function () {
    // Manejo de visibilidad para secciones
    $('#showTables').on('click', function () {
        $('#tablasSection').show(); // Muestra la sección de Tablas
        $('#calculosSection').hide(); // Oculta la sección de IPA Total
        $('#calculosCarreraSection').hide(); // Oculta la sección de IPA Carrera
        $('#IntroSection').hide(); // Oculta la sección de Introducción
        $('#Indicador20').hide(); // Oculta la sección de Indicador20 por defecto
    });

    $('#showCalculations').on('click', function () {
        $('#calculosSection').show(); // Muestra la sección de IPA Total
        $('#tablasSection').hide(); // Oculta la sección de Tablas
        $('#calculosCarreraSection').hide(); // Oculta la sección de IPA Carrera
        $('#IntroSection').hide(); // Oculta la sección de Introducción
        $('#Indicador20').hide(); // Oculta la sección de Indicador20 por defecto
    });

    $('#showCalculationsCarrera').on('click', function () {
        $('#calculosCarreraSection').show(); // Muestra la sección de IPA Carrera
        $('#tablasSection').hide(); // Oculta la sección de Tablas
        $('#calculosSection').hide(); // Oculta la sección de IPA Total
        $('#IntroSection').hide(); // Oculta la sección de Introducción
        $('#Indicador20').hide(); // Oculta la sección de Indicador20 por defecto
    });

    // Manejo de visibilidad para la sección de Introducción
    $('#Introduccion').on('click', function () {
        $('#IntroSection').show(); // Muestra la sección de Introducción
        $('#tablasSection').hide(); // Oculta la sección de Tablas
        $('#calculosSection').hide(); // Oculta la sección de IPA Total
        $('#calculosCarreraSection').hide(); // Oculta la sección de IPA Carrera
        $('#Indicador20').hide(); // Oculta la sección de Indicador20 por defecto
    });

    // Nuevo manejo de visibilidad para la sección Indicador20
    $('#ShowIndicador20').on('click', function () {
        $('#Indicador20').show(); // Muestra la sección de Indicador20
        $('#tablasSection').hide(); // Oculta la sección de Tablas
        $('#calculosSection').hide(); // Oculta la sección de IPA Total
        $('#calculosCarreraSection').hide(); // Oculta la sección de IPA Carrera
        $('#IntroSection').hide(); // Oculta la sección de Introducción
    });
});

    
function initializeTableWithFilters(tableId, withExportButtons = true, withColumnFilters = true) {
    var options = {
        pageLength: 10,
        dom: 'Bfrtip',  // Agregar el área de los botones (B = Buttons)
        buttons: withExportButtons ? [
            {
                extend: 'copy',       // Botón para copiar
                exportOptions: {
                    columns: ':visible', // Exporta solo las columnas visibles
                    modifier: {
                        page: 'all' // Exporta todas las filas, no solo las visibles
                    }
                }
            },
            {
                extend: 'excel',      // Botón para Excel
                exportOptions: {
                    columns: ':visible', // Exporta solo las columnas visibles
                    modifier: {
                        page: 'all' // Exporta todas las filas, no solo las visibles
                    },
                    format: {
                        header: function (d, columnIdx) {
                            // Asegura que solo se exporte el texto original del encabezado
                            return $(tableId).DataTable().settings()[0].aoColumns[columnIdx].sTitle;
                        }
                    }
                }
            }
        ] : [],  // Si no hay export buttons, no los agrega
        language: {
            emptyTable: "No hay resultados"
        },
        searching: true, // Habilita la búsqueda global (solo una caja de búsqueda)
        initComplete: function () {
            if (withColumnFilters) {
                // Si se desea habilitar los filtros por columna
                this.api().columns().every(function () {
                    var column = this;
                    var headerText = $(column.header()).text(); // Texto original del encabezado
                    $(column.header()).html( // Modifica el contenido del encabezado
                        '<div style="display: flex; flex-direction: column; align-items: flex-start;">' +
                            '<span>' + headerText + '</span>' +
                            '<select style="margin-top: 5px;">' +
                                '<option value="">...</option>' +
                            '</select>' +
                        '</div>'
                    );

                    var select = $(column.header()).find('select'); // Selecciona el filtro insertado

                    // Llena el select con valores únicos de la columna
                    column.data().unique().sort().each(function (d, j) {
                        if (d) { // Evita añadir valores vacíos
                            select.append('<option value="' + d + '">' + d + '</option>');
                        }
                    });

                    // Aplica el filtro cuando se selecciona un valor
                    select.on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex($(this).val());
                        column.search(val ? '^' + val + '$' : '', true, false).draw();
                    });
                });
            }
        }
    };

    $(tableId).DataTable(options);
}
    // Inicializa todas las tablas con esta configuración
    initializeTableWithFilters('#personal_academico_table');
    initializeTableWithFilters('#documento_table');
    initializeTableWithFilters('#documento_table_Calculos');
    initializeTableWithFilters('#documentos_adicionales_table', false, false);
    initializeTableWithFilters('#IPA_Anual');
    initializeTableWithFilters('#IPA_Anual_Carrera');
    initializeTableWithFilters('#IPA_Carrera_Rango');
    initializeTableWithFilters('#documentos_table_Indicador20', false, false);
