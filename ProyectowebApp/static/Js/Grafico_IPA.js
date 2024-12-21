// Gráfico general (PC, PA, LyCL, IPA, PIA)
const ctxGeneral = document.getElementById('graficoGeneral').getContext('2d');
const graficoGeneral = new Chart(ctxGeneral, {
    type: 'line',
    data: {
        labels: datosGraficoIPA.años,  // Eje X: años
        datasets: [
            {
                label: 'Producción Científica (PC)',
                data: datosGraficoIPA.produccion_cientifica,  // Datos de Producción Científica
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            },
            {
                label: 'Producción Artística (PA)',
                data: datosGraficoIPA.produccion_artistica,  // Datos de Producción Artística
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            },
            {
                label: 'Libros y Capítulos (LyCL)',
                data: datosGraficoIPA.libros_capitulos,  // Datos de Libros y Capítulos
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true
            },
            {
                label: 'Índice de Propiedad Académica (IPA)',
                data: datosGraficoIPA.ipa_anual,  // Datos de IPA Anual
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true
            },
            {
                label: 'Propiedad Intelectual Aplicada (PIA)',
                data: datosGraficoIPA.pia,  // Datos de PIA
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'linear',  // Usar una escala lineal para el eje X
                position: 'bottom',  // Asegurarse de que el eje X esté en la parte inferior
                ticks: {
                    stepSize: 1, // Dividir el eje X en cada año
                    min: Math.min(...datosGraficoIPA.años),  // Valor mínimo de los años (primero)
                    max: Math.max(...datosGraficoIPA.años),  // Valor máximo de los años (último)
                    callback: function(value) {
                        return value;  // Asegura que se muestren los años
                    }
                }
            },
            y: {
                beginAtZero: true  // Asegura que el eje Y comience desde cero
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
        },
        backgroundColor: 'white', // Fondo blanco para el gráfico
    }
});

// Funcionalidad de filtrado
document.getElementById('filtrarBtn').addEventListener('click', function() {
    const añoInicio = parseInt(document.getElementById('añoInicio').value);  // Año de inicio
    const añoFin = parseInt(document.getElementById('añoFin').value);  // Año de fin

    // Filtrar los datos según el rango de años
    const añosFiltrados = datosGraficoIPA.años.filter(año => año >= añoInicio && año <= añoFin);
    const produccionCientificaFiltrada = datosGraficoIPA.produccion_cientifica.filter((_, index) => datosGraficoIPA.años[index] >= añoInicio && datosGraficoIPA.años[index] <= añoFin);
    const produccionArtisticaFiltrada = datosGraficoIPA.produccion_artistica.filter((_, index) => datosGraficoIPA.años[index] >= añoInicio && datosGraficoIPA.años[index] <= añoFin);
    const librosCapitulosFiltrados = datosGraficoIPA.libros_capitulos.filter((_, index) => datosGraficoIPA.años[index] >= añoInicio && datosGraficoIPA.años[index] <= añoFin);
    const ipaAnualFiltrado = datosGraficoIPA.ipa_anual.filter((_, index) => datosGraficoIPA.años[index] >= añoInicio && datosGraficoIPA.años[index] <= añoFin);
    const piaFiltrada = datosGraficoIPA.pia.filter((_, index) => datosGraficoIPA.años[index] >= añoInicio && datosGraficoIPA.años[index] <= añoFin);

    // Actualizar los datos del gráfico
    graficoGeneral.data.labels = añosFiltrados;
    graficoGeneral.data.datasets[0].data = produccionCientificaFiltrada;
    graficoGeneral.data.datasets[1].data = produccionArtisticaFiltrada;
    graficoGeneral.data.datasets[2].data = librosCapitulosFiltrados;
    graficoGeneral.data.datasets[3].data = ipaAnualFiltrado;
    graficoGeneral.data.datasets[4].data = piaFiltrada;

    // Actualizar el gráfico
    graficoGeneral.update();
});

// Funcionalidad de descarga del canvas
document.getElementById('descargarBtn').addEventListener('click', function() {
    const canvas = document.getElementById('graficoGeneral');
    const enlace = document.createElement('a');

    // Asegúrate de que la imagen sea PNG con fondo blanco
    enlace.href = canvas.toDataURL('image/png'); 
    enlace.download = 'grafico.png';  // Nombre del archivo descargado
    enlace.click();  // Ejecutamos la descarga
});

