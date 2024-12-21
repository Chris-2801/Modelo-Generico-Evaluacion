
console.log('Datos recibidos:', datosGrafico); // Depuración de datos

let chart; // Para almacenar la instancia del gráfico
const ctx = document.getElementById('grafico_Cualitativo').getContext('2d');

// Obtener los años disponibles desde los datos
const aniosDisponibles = Object.keys(datosGrafico['anios']);
const anoSelect = document.getElementById('ano');
const anoInicioSelect = document.getElementById('ano-inicio');
const anoFinSelect = document.getElementById('ano-fin');

// Función para llenar los selectores de año
function llenarAnios() {
    // Limpiar los selectores
    anoSelect.innerHTML = '';
    anoInicioSelect.innerHTML = '';
    anoFinSelect.innerHTML = '';

    // Agregar opciones a los selectores
    aniosDisponibles.forEach(ano => {
        let option = new Option(ano, ano);
        anoSelect.add(option);

        let optionInicio = new Option(ano, ano);
        anoInicioSelect.add(optionInicio);

        let optionFin = new Option(ano, ano);
        anoFinSelect.add(optionFin);
    });
}

llenarAnios();

// Mapa de colores predefinidos
const coloresPorTipo = {
    "Nacional": "rgba(255, 99, 132, 0.6)", // Rojo
    "Internacional": "rgba(54, 162, 235, 0.6)", // Azul
    "Tipo1": "rgba(75, 192, 192, 0.6)", // Verde claro
    "Tipo2": "rgba(153, 102, 255, 0.6)" // Morado
};

// Función para actualizar el gráfico
function actualizarGrafico() {
    const categoria = document.getElementById('categoria').value; // Categoría seleccionada
    const filtro = document.getElementById('filtro').value; // Filtro seleccionado
    let etiquetas = [];
    let valores = [];

    console.log('Categoría seleccionada:', categoria);
    console.log('Filtro seleccionado:', filtro);

    // Mostrar u ocultar los selectores según el filtro
    if (filtro === 'un_ano') {
        document.getElementById('selector-ano').style.display = 'block';
        document.getElementById('selector-rango').style.display = 'none';
    } else if (filtro === 'rango_anos') {
        document.getElementById('selector-ano').style.display = 'none';
        document.getElementById('selector-rango').style.display = 'block';
    } else {
        document.getElementById('selector-ano').style.display = 'none';
        document.getElementById('selector-rango').style.display = 'none';
    }

    // Filtrar los años
    const aniosFiltrados = filtrarAnios(filtro);
    console.log('Años filtrados:', aniosFiltrados);

    // Actualizar los datos según la categoría seleccionada
    if (categoria === 'tipos_documentos') {
        etiquetas = aniosFiltrados;
        valores = Object.keys(datosGrafico['tipos_documentos']).map(tipo => {
            return aniosFiltrados.map(anio => datosGrafico['tipos_documentos'][tipo][anio] || 0);
        });
    } else {
        etiquetas = aniosFiltrados;
        valores = Object.keys(datosGrafico[categoria]).map(estado => {
            return aniosFiltrados.map(anio => datosGrafico[categoria][estado][anio] || 0);
        });
    }

    // Configurar los datasets
    const data = {
        labels: etiquetas,
        datasets: valores.map((valoresPorTipo, index) => {
            const tipo = Object.keys(datosGrafico[categoria])[index];
            const color = coloresPorTipo[tipo] || getRandomColor();

            return {
                label: tipo,
                data: valoresPorTipo,
                backgroundColor: color,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
                hoverBorderColor: 'rgba(75, 192, 192, 1)',
                borderRadius: 5
            };
        })
    };

    console.log('Data para el gráfico:', data);

    // Configuración del gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { font: { family: 'Arial', size: 20 } } }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                ticks: { font: { size: 14 } }
            },
            x: {
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                ticks: { font: { size: 14 } }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutBounce'
        }
    };

    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Función para filtrar los años según el filtro seleccionado
function filtrarAnios(filtro) {
    let aniosFiltrados = [];
    if (filtro === 'un_ano') {
        const anoSeleccionado = document.getElementById('ano').value;
        aniosFiltrados = [anoSeleccionado];
    } else if (filtro === 'rango_anos') {
        const anoInicio = document.getElementById('ano-inicio').value;
        const anoFin = document.getElementById('ano-fin').value;
        aniosFiltrados = aniosDisponibles.filter(ano => ano >= anoInicio && ano <= anoFin);
    } else {
        aniosFiltrados = aniosDisponibles;
    }
    return aniosFiltrados;
}

// Función para generar un color aleatorio
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Llamar a la función inicial para crear el gráfico
actualizarGrafico();

document.getElementById('descargarBtn1').addEventListener('click', function() {
    const canvas = document.getElementById('grafico_Cualitativo');
    const enlace = document.createElement('a');

    // Asegúrate de que la imagen sea PNG con fondo blanco
    enlace.href = canvas.toDataURL('image/png'); 
    enlace.download = 'grafico.png';  // Nombre del archivo descargado
    enlace.click();  // Ejecutamos la descarga
});
