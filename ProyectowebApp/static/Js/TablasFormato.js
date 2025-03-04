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
        pageLength: 5,
        dom: 'Bfrtip',
        buttons: withExportButtons ? [
            {
                extend: 'copy',
                exportOptions: {
                    columns: ':visible',
                    modifier: {
                        page: 'all'
                    }
                }
            },
            {
                extend: 'excel',
                exportOptions: {
                    columns: ':visible',
                    modifier: {
                        page: 'all'
                    },
                    format: {
                        header: function (d, columnIdx) {
                            return $(tableId).DataTable().settings()[0].aoColumns[columnIdx].sTitle;
                        }
                    }
                }
            }
        ] : [],
        language: {
            emptyTable: "No hay resultados"
        },
        searching: true,
        columnDefs: [
            {
                targets: '_all', // Aplica a todas las columnas
                className: 'dt-center', // Centra el contenido de todas las celdas
                width: 'auto', // Deja que DataTable ajuste automáticamente el ancho de las columnas
                orderable: true, // Asegura que todas las columnas sean ordenables
            }
        ],
        initComplete: function () {
            if (withColumnFilters) {
                this.api().columns().every(function () {
                    var column = this;
                    var headerText = $(column.header()).text();
                    $(column.header()).html(
                        '<div style="display: flex; flex-direction: column; align-items: flex-start;">' +
                            '<span>' + headerText + '</span>' +
                            '<select style="margin-top: 5px;">' +
                                '<option value="">...</option>' +
                            '</select>' +
                        '</div>'
                    );

                    var select = $(column.header()).find('select');
                    column.data().unique().sort().each(function (d, j) {
                        if (d) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        }
                    });

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
