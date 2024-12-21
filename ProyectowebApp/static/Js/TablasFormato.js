$(document).ready(function () {
    // Manejo de visibilidad para secciones
    $('#showTables').on('click', function () {
        $('#tablasSection').show(); // Muestra la sección de Tablas
        $('#calculosSection').hide(); // Oculta la sección de Cálculos
    });

    $('#showCalculations').on('click', function () {
        $('#calculosSection').show(); // Muestra la sección de Cálculos
        $('#tablasSection').hide(); // Oculta la sección de Tablas
    });
    
    // Función para inicializar tablas con filtros y botones de exportación
    function initializeTableWithFilters(tableId, withExportButtons = true, withColumnFilters = true) {
        var options = {
            pageLength: 10,
            dom: 'Bfrtip',  // Agregar el área de los botones (B = Buttons)
            buttons: withExportButtons ? [
                'copy',       // Botón para copiar
                'excel',      // Botón para Excel
            ] : [],  // Si no hay export buttons, no los agrega
            language: {
                emptyTable: "No matching records found" // Mensaje cuando no hay resultados
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
});