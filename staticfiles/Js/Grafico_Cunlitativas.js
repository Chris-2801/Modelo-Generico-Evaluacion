// Obtener los datos enviados desde Django (estos datos deben estar en formato JSON)
const datosGrafico = JSON.parse('{{ datos_grafico_json|safe }}');

// Depuración de los datos
console.log('Datos recibidos:', datosGrafico); 

let chart; // Para almacenar la instancia del gráfico
const ctx = document.getElementById('grafico_Cualitativo').getContext('2d');

// Obtener los años disponibles desde los datos
const aniosDisponibles = Object.keys(datosGrafico['anios']);
const anoSelect = document.getElementById('ano');
const anoInicioSelect = document.getElementById('ano-inicio');
const anoFinSelect = document.getElementById('ano-fin');

// Función para llenar los selectores de año
function llenarAnios() {
    // Limpiar los selectores antes de agregar las opciones
    anoSelect.innerHTML = '';
    anoInicioSelect.innerHTML = '';
    anoFinSelect.innerHTML = '';

    // Llenar el selector de años
    aniosDisponibles.forEach(ano => {
        let option = new Option(ano, ano);
        anoSelect.add(option);

        let optionInicio = new Option(ano, ano);
        anoInicioSelect.add(optionInicio);

        let optionFin = new Option(ano, ano);
        anoFinSelect.add(optionFin);
    });
}

// Llamar a la función para llenar los años disponibles
llenarAnios();

// Mapa de colores predefinidos para cada tipo (Ejemplo: Exposiciones Nacional e Internacional)
const coloresPorTipo = {
    "Nacional": "rgba(255, 99, 132, 0.6)", // Rojo para Nacional
    "Internacional": "rgba(54, 162, 235, 0.6)", // Azul para Internacional
    "Tipo1": "rgba(75, 192, 192, 0.6)", // Verde claro para un tipo más
    "Tipo2": "rgba(153, 102, 255, 0.6)" // Morado para otro tipo
};

// Función para actualizar el gráfico
function actualizarGrafico() {
    const categoria = document.getElementById('categoria').value; // Categoría seleccionada
    const filtro = document.getElementById('filtro').value; // Tipo de filtro (todo, un año, rango de años)
    let etiquetas = [];
    let valores = [];

    // Depuración de la categoría y el filtro
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

    // Filtrar los datos según el filtro seleccionado
    const aniosFiltrados = filtrarAnios(filtro);

    // Depuración de los años filtrados
    console.log('Años filtrados:', aniosFiltrados);

    // Actualizar los datos según la categoría seleccionada
    if (categoria === 'tipos_documentos') {
        // Para 'Tipos de Documentos', mostrar la frecuencia de cada tipo de documento por año
        etiquetas = aniosFiltrados; // Los años
        valores = Object.keys(datosGrafico['tipos_documentos']).map(tipo => {
            console.log('Procesando tipo:', tipo);
            console.log('Datos para este tipo:', datosGrafico['tipos_documentos'][tipo]);
            return aniosFiltrados.map(anio => datosGrafico['tipos_documentos'][tipo][anio] || 0);
        });
    } else {
        // Para las otras categorías (estados, áreas, exposiciones), mostrarlas como un solo dataset
        etiquetas = aniosFiltrados; // Los años
        valores = Object.keys(datosGrafico[categoria]).map(estado => {
            console.log('Procesando estado:', estado);
            console.log('Datos para este estado:', datosGrafico[categoria][estado]);
            return aniosFiltrados.map(anio => datosGrafico[categoria][estado][anio] || 0);
        });
    }

    // Configurar los datasets
    const data = {
        labels: etiquetas, // Los valores únicos (Años)
        datasets: valores.map((valoresPorTipo, index) => {
            const tipo = Object.keys(datosGrafico[categoria])[index]; // Obtener el nombre del tipo
            const color = coloresPorTipo[tipo] || getRandomColor(); // Usar el color predefinido o uno aleatorio

            return {
                label: tipo, // Etiqueta con el tipo de documento
                data: valoresPorTipo,
                backgroundColor: color, // Usa el color específico para cada tipo
                borderColor: 'rgba(75, 192, 192, 1)', // Color de los bordes
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)', // Color cuando el usuario pasa el ratón
                hoverBorderColor: 'rgba(75, 192, 192, 1)', // Color del borde cuando pasa el ratón
                borderRadius: 5, // Bordes redondeados para las barras
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)', // Sombra para las barras
            };
        })
    };

    // Depuración de los datos para el gráfico
    console.log('Data para el gráfico:', data);

    // Configuración adicional para el gráfico
    const options = {
        responsive: true, // Hacer el gráfico responsivo
        plugins: {legend: {position: 'top', labels: {font: {family: 'Arial', size: 20}}}},
        scales: {
            y: {
                beginAtZero: true, // Asegurarse de que el eje Y comience desde 0
                grid: {color: 'rgba(0, 0, 0, 0.1)'}, // Color de las líneas de la cuadrícula
                ticks: {font: {size: 14}} // Tamaño de las etiquetas en el eje Y
            },
            x: {
                grid: {color: 'rgba(0, 0, 0, 0.1)'}, // Color de las líneas de la cuadrícula
                ticks: {font: {size: 14}} // Tamaño de las etiquetas en el eje X
            }
        },
        animation: {
            duration: 1000, // Duración de la animación del gráfico
            easing: 'easeInOutBounce', // Efecto de la animación
        }
    };

    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (barras)
        data: data,
        options: options
    });
}

// Función para generar un color aleatorio (si es necesario)
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Función para filtrar los años según el filtro seleccionado
function filtrarAnios(filtro) {
    let aniosFiltrados = [];
    if (filtro === 'un_ano') {
        const anoSeleccionado = document.getElementById('ano').value;
        aniosFiltrados = [anoSeleccionado]; // Solo un año
    } else if (filtro === 'rango_anos') {
        const anoInicio = document.getElementById('ano-inicio').value;
        const anoFin = document.getElementById('ano-fin').value;
        aniosFiltrados = aniosDisponibles.filter(ano => ano >= anoInicio && ano <= anoFin); // Rango de años
    } else {
        aniosFiltrados = aniosDisponibles; // Todos los años
    }
    return aniosFiltrados;
}

// Inicializa el gráfico con la primera categoría (Tipos de Documentos)
actualizarGrafico();
