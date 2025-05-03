// Precargar logo al inicio del flujo (ej. al cargar la página o antes de generar PDF)
function preloadLogo() {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      logoImg = this;
      resolve();
    };
    img.onerror = function () {
      console.warn('No se pudo precargar el logo');
      resolve(); // Continuar incluso si falla
    };
    img.src = '/static/Img/Logo_UCE.png?t=' + new Date().getTime();
  });
}

const PDFConfig = {
  page: {
    width: 210,   // Ancho A4 en mm
    height: 297   // Alto A4 en mm
  },
  margins: {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
  },
  table: {
    width: 180,
    cellPadding: 1.5
  },
  styles: {
    title: { fontSize: 14, fontStyle: 'bold',font:'times', halign: 'center', textColor: [0, 0, 0] },
    sectionTitle: { fontSize: 14, fontStyle: 'bold',font:'times', textColor: [0, 0, 0], marginBottom: 8 },
    tableHeader: { 
      fillColor: [255, 255, 255],  // Blanco para el encabezado
      textColor: [0, 0, 0], 
      fontStyle: 'bold',
      font:'times',
      fontSize: 10,
      cellPadding: 3,
      lineColor: [0, 0, 0],       // Líneas negras para encabezados
      lineWidth: 0.1               // Grosor ligeramente mayor
    },
    tableCell: { 
      fontSize: 8, 
      font:'times',
      textColor: [0, 0, 0], 
      lineWidth: 0.1,              
      cellPadding: 1.5,
      lineColor: [0, 0, 0],        // Líneas negras para celdas
      fillColor: [255, 255, 255],   // Fondo blanco para todas las celdas
      valign: 'middle'
    },
  }
};

// ============== FUNCIONES AUXILIARES ==============
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Error al cargar: ${src}`));
    document.head.appendChild(script);
  });
}

function getFormData() {
  const data = {};
  document.querySelectorAll('input, textarea, select').forEach(element => {
    if (element.id && element.type !== 'button') {
      if (element.type === 'checkbox') {
        data[element.id] = element.checked ? '✓' : '□';
      } else if (element.type === 'number') {
        data[element.id] = element.value || '0';
      } else {
        data[element.id] = element.value || '';
      }
    }
  });
  return data;
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'pdf-error-alert';
  errorDiv.innerHTML = `
    <span>⚠️ ${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

function addTextSafe(doc, text, x, y, options = {}) {
  try {
    const safeText = String(text || '').substring(0, 500);
    const safeX = Math.max(PDFConfig.margins.left, Math.min(x, PDFConfig.page.width - PDFConfig.margins.right));
    const safeY = Math.max(PDFConfig.margins.top, Math.min(y, PDFConfig.page.height - PDFConfig.margins.bottom));
    
    const defaultOptions = {
      maxWidth: PDFConfig.table.width,
      align: 'left',
      fontSize: options.fontSize || 10
    };
    
    doc.setFontSize(defaultOptions.fontSize);
    if (options.fontStyle) doc.setFont(undefined, options.fontStyle);
    if (options.textColor) doc.setTextColor(...options.textColor);
    
    doc.text(safeText, safeX, safeY, {
      maxWidth: defaultOptions.maxWidth,
      align: options.align || defaultOptions.align
    });
    
    return true;
  } catch (error) {
    console.error('Error en addTextSafe:', error);
    return false;
  }
}

function createTable(doc, body, startY, columnStyles = {}, options = {}) {
  const tableConfig = {
    startY: startY,
    margin: {
      top: PDFConfig.margins.top + 25,  // ← espacio para logo + título
      left: PDFConfig.margins.left,
      right: PDFConfig.margins.right
    },
    styles: {
      ...PDFConfig.styles.tableCell,
      cellPadding: PDFConfig.table.cellPadding,
      fontSize: options.fontSize || PDFConfig.styles.tableCell.fontSize,
      overflow: 'linebreak',
    },
    headStyles: {
      ...PDFConfig.styles.tableHeader,
      cellPadding: PDFConfig.table.cellPadding
    },
    columnStyles: columnStyles,
    tableWidth: options.tableWidth || PDFConfig.table.width,
    showHead: options.showHead !== false,
    alternateRowStyles: false,

    // 👉 Agregar encabezado en cada página de tabla
    didDrawPage: function (data) {
      const logoWidth = 15;
      const logoX = (PDFConfig.page.width - logoWidth) / 2;

      if (logoImg) {
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', logoX, PDFConfig.margins.top, logoWidth, logoHeight);

        const titleY = PDFConfig.margins.top + logoHeight + 5;
        doc.setFontSize(PDFConfig.styles.title.fontSize);
        doc.setFont('havelica', 'bold');
        doc.text('PLANIFICACIÓN MICRO-CURRICULAR', PDFConfig.page.width / 2, titleY, { align: 'center' });
      } else {
        doc.setFontSize(PDFConfig.styles.title.fontSize);
        doc.text('PLANIFICACIÓN MICRO-CURRICULAR', PDFConfig.page.width / 2, PDFConfig.margins.top + 20, { align: 'center' });
      }
    }
  };

  if (options.headerRows) {
    tableConfig.head = body.slice(0, options.headerRows);
    tableConfig.body = body.slice(options.headerRows);
  } else {
    tableConfig.body = body;
  }

  doc.autoTable(tableConfig);

  return doc.lastAutoTable.finalY + (options.extraSpace || 5);
}


// ============== SECCIONES DEL PDF ==============
function addDatosInformativos(doc, yPos, formData) {

  addTextSafe(doc, '1. DATOS INFORMATIVOS', PDFConfig.margins.left, yPos, {});yPos += 5;

  yPos = createTable(doc, [
    [{content: ` ${formData['facultad'] || 'FACULTAD DE INGENIERIA EN GEOLOGÍA, MINAS, PETRÓLEOS Y AMBIENTAL'}`,styles: {fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]},colSpan: 4}],
    [{ content: 'CARRERA', styles: {fontStyle: 'bold', font: 'times'}}, formData['carrera'] || 'GEOLOGIA',
      { content: 'MODALIDAD', styles: {fontStyle: 'bold', font: 'times'}}, formData['modalidad'] || 'PRESENCIAL',],
    [{ content: 'ASIGNATURA', styles: { fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]} }, {content: formData['asignatura'] || 'ENERGIAS ALTERNATIVAS',styles: {font: 'times', fillColor: [255, 255, 255]}},
      { content: 'CÓDIGO', styles: { fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]} },{content: formData['codigo'] || 'IGP09PPP04',styles: {font: 'times', fillColor: [255, 255, 255]}}],
    [{ content: 'UNIDAD DE ORGANIZACIÓN CURRICULAR', styles: { fontStyle: 'bold', font: 'times' } },
      { content: formData['UnidadCurricular'] || 'PROFESIONAL', styles: { font: 'times' }, colSpan: 3 } ],
    [{ content: 'CAMPO DE FORMACIÓN', styles: { fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]} },
      { content: formData['campo-formacion'] || 'PRAXIS PROFESIONAL', styles: { font: 'times', fillColor: [255, 255, 255]}, colSpan: 3 }], 
    [{ content: 'ITINERARIO:', styles: { fontStyle: 'bold', font:'times'}},
      formData['ITINERARIO'] || '',{ content: `SI ${formData['itinerario_si'] === '✓' ? '✓' : '□'}`, styles: { halign: 'center' }},
      { content: `NO ${formData['itinerario_no'] === '✓' ? '✓' : '□'}`, styles: { halign: 'center' }}],
    [{ content: 'PERÍODO ACADÉMICO', styles: { fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]} },
      { content: formData['periodo'] || 'OCTUBRE 2024 – MARZO 2025', styles: { font: 'times', fillColor: [255, 255, 255]}, colSpan: 3 }],
    [{ content: 'PERÍODO ACADÉMICO (semestre):', styles: {fontStyle: 'bold', font: 'times' }},
      formData['semestre'] || 'NOVENO SEMESTRE', { content: 'PERÍODO DE EJECUCIÓN (Tiempo):', styles: {fontStyle: 'bold', font: 'times' }},
      formData['ejecucion'] || '16 SEMANAS'],
    [{ content: 'PROYECTO INTEGRADOR DE SABERES', styles: { fontStyle: 'bold', font: 'times', fillColor: [255, 255, 255]} },
      { content: formData['proyecto'] || '', styles: { font: 'times', fillColor: [255, 255, 255]}, colSpan: 3 }],
    ], yPos, {0: { cellWidth: 40 },1: { cellWidth: 45 },2: { cellWidth: 40 },3: { cellWidth: 45 },});

  yPos = createTable(doc, [
    [
      { content: 'PRE-REQUISITOS:', styles: { fontStyle: 'times', fontStyle:'bold' }},
      'Asignatura / o sus equivalentes:',
      formData['asignaturaEquivalentesT'] || '',
      { content: 'CÓDIGO:', styles: { fontStyle: 'bold',font:'times'}},
      formData['codigoeqq'] || ''
    ],
    [
      { content: 'CO-REQUISITOS:', styles: { fontStyle: 'bold', font:'times' }},
      'Asignatura / o sus equivalentes:',
      formData['asignaturaCOT'] || '',
      { content: 'CÓDIGO:', styles: { fontStyle: 'bold', font:'times' }},
      formData['codigoCO'] || ''
    ]
  ], yPos, {
    0: { cellWidth: 40 },
    1: { cellWidth: 40 },
    2: { cellWidth: 35 },
    3: { cellWidth: 20 },
    4: { cellWidth: 35 }
  },);

  // Tabla de organización del aprendizaje
  yPos = createTable(doc, [
    [
      { 
        content: 'ORGANIZACIÓN DEL APRENDIZAJE', 
        rowSpan: 2, 
        styles: { valign: 'middle', fontStyle: 'bold', font:'times'}
      },
      'Componente Docencia',
      { content: `#hrs: ${formData['docencia-hrs'] || '0'}`, styles: { halign: 'center', font:'times'}},
      'Práctica, aplicación y experimentación',
      { content: `#hrs: ${formData['practica-hrs'] || '0'}`, styles: { halign: 'center',font:'times' }},
      'Componente Trabajo Autónomo',
      { content: `#hrs: ${formData['autonomo-hrs'] || '0'}`, styles: { halign: 'center',font:'times' }}
    ],
    [
      { content: 'TOTAL HORAS ASIGNATURA', colSpan: 5, styles: { fontStyle: 'bold',font:'times' }},
      { content: `#hrs: ${formData['hrs-total'] || '0'}`, styles: { halign: 'center',font:'times' }},
    ],
  ], yPos, {
    0: { cellWidth: 40 },
    1: { cellWidth: 33 },
    2: { cellWidth: 10 },
    3: { cellWidth: 34 },
    4: { cellWidth: 10 },
    5: { cellWidth: 33 },
    6: { cellWidth: 10 }
  }); 

  // La segunda tabla comienza exactamente donde terminó la primera
  yPos = createTable(doc, [
    [
      { 
        content: 'DETALLE DE HORAS DE TUTORÍA', 
        rowSpan: 4, 
        styles: { valign: 'middle', halign: 'center', fontStyle: 'bold', cellPadding: 2 } // Reducir cellPadding si es necesario
      },
      { content: 'PRESENCIALES', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', font:'times', cellPadding: 2 }},
      { content: 'VIRTUALES', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', font:'times', cellPadding: 2 }}
    ],
    [
      'INDIVIDUALES',
      'GRUPALES',
      'INDIVIDUALES',
      'GRUPALES'
    ],
    [
      { content: formData['hrsIP'] || '0', styles: { halign: 'center', cellPadding: 2 }},
      { content: formData['hrsGP'] || '0', styles: { halign: 'center', cellPadding: 2 }},
      { content: formData['hrsIV'] || '0', styles: { halign: 'center', cellPadding: 2 }},
      { content: formData['hrsGV'] || '0', styles: { halign: 'center', cellPadding: 2 }}
    ],
    [
      { content: `Total Presenciales: ${formData['Tot_P'] || '0'}`, colSpan: 2, styles: { halign: 'center', cellPadding: 2 }},
      { content: `Total Virtuales: ${formData['Tot_V'] || '0'}`, colSpan: 2, styles: { halign: 'center', cellPadding: 2 }}
    ]
  ], yPos, { // Usar el mismo yPos sin añadir espacio
    0: { cellWidth: 40 },
    1: { cellWidth: 32.5 },
    2: { cellWidth: 32.5 },
    3: { cellWidth: 32.5 },
    4: { cellWidth: 32.5 }
  }, { 
    margin: { top: 0 }, // Eliminar margen superior
    styles: { cellPadding: 2 } // Reducir el padding interno si es necesario
  });
  return yPos += 5;
}

function addPerfilEgreso(doc, yPos, formData) {
  doc.setFontSize(PDFConfig.styles.sectionTitle.fontSize);
  addTextSafe(doc, '2. APORTES AL PERFIL DE EGRESO', 
             PDFConfig.margins.left, yPos, { fontStyle: 'bold' });
  yPos += 5;
   // Tabla de perfil de egreso
   yPos = createTable(doc, [
    [
      { content: 'Resultados de Aprendizaje del Perfil de Egreso', styles: { fontStyle: 'bold', font: 'times' } },
      { content: 'Resultados de Aprendizaje integrador de la Asignatura a o sus equivalentes', styles: { fontStyle: 'bold', font: 'times' } },
    ],
    [
      formData['ResulApre'] || ' ',
      formData['ResulApreInt'] || ' ',
    ],
    [
      { content: 'CARACTERIZACIÓN DE LA ASIGNATURA (APORTE AL ESTUDIO DE PERTINENCIA, ROL ESENCIAL DE LA ASIGNATURA, ARTICULACIÓN CON LA INVESTIGACIÓN Y LAS PRÁCTICAS PRE PROFESIONALES)', styles: { fontStyle: 'bold', font: 'times' } },
      formData['caracterizacion-asignatura'] || ' ',
    ],
    [
      { content: 'METODOLOGÍAS DE ENSEÑANZA APRENDIZAJE (REGULARIDADES DADA LA NATURALEZA DE LA CARRERA Y LA ASIGNATURA EN CUANTO A MÉTODOS, TÉCNICAS Y RECURSOS DIDÁCTICOS CON VISIÓN HACIA LA INNOVACIÓN)', styles: { fontStyle: 'bold', font: 'times' } },
      formData['metodologias-enseñanza'] || ' ',
    ],
  ], yPos, {
    0: { cellWidth: 85 },
    1: { cellWidth: 85 }
  });
  return yPos += 5;
}

function addEvaluacion(doc, yPos, formData) {

  doc.setFontSize(PDFConfig.styles.sectionTitle.fontSize);
  addTextSafe(doc, '3. EVALUACIÓN DURANTE PERÍODO ACADÉMICO (Sobre 20 puntos)', 
             PDFConfig.margins.left, yPos, { fontStyle: 'bold', font:'times' });
  yPos += 5;

  // Tabla de evaluación
  yPos = createTable(doc, [
    [
      { content: 'INDICADOR', styles: { fontStyle: 'bold', font:'times' }},
      { content: 'NOTA SOBRE 20', styles: { fontStyle: 'bold', halign: 'center', font:'times' }},
      { content: 'PORCENTAJE', styles: { fontStyle: 'bold', halign: 'center', font:'times' }},
      { content: 'PONDERACIÓN', styles: { fontStyle: 'bold', halign: 'center', font:'times' }}
    ],
    [
      'EVALUACIÓN FORMATIVA INDIVIDUAL',
      { content: formData['EvInd'] || '20', styles: { halign: 'center', font:'times' }},
      { content: '35%', styles: { halign: 'center', font:'times' }},
      { content: '7 puntos', styles: { halign: 'center', font:'times' }}
    ],
    [
      'EVALUACIÓN FORMATIVA COLABORATIVA',
      { content: formData['EvCol'] || '20', styles: { halign: 'center', font:'times' }},
      { content: '25%', styles: { halign: 'center', font:'times' }},
      { content: '5 puntos', styles: { halign: 'center', font:'times' }}
    ],
    [
      'EVALUACIÓN SUMATIVA INTERMEDIA',
      { content: formData['EvIntermedia'] || '20', styles: { halign: 'center', font:'times' }},
      { content: '10%', styles: { halign: 'center', font:'times'}},
      { content: '2 puntos', styles: { halign: 'center', font:'times' }}
    ],
    [
      'EVALUACIÓN SUMATIVA TOTAL',
      { content: formData['EvTotal'] || '20', styles: { halign: 'center', font:'times' }},
      { content: '30%', styles: { halign: 'center' , font:'times'}},
      { content: '6 puntos', styles: { halign: 'center', font:'times' }}
    ],
    [
      { content: 'TOTAL', styles: { fontStyle: 'bold', font:'times' }},
      { content: '20', styles: { fontStyle: 'bold', halign: 'center', font:'times' }},
      { content: '100%', styles: { fontStyle: 'bold', halign: 'center', font:'times' }},
      { content: '20 puntos', styles: { fontStyle: 'bold', halign: 'center', font:'times' }}
    ]
  ], yPos, {
    0: { cellWidth: 80 },
    1: { cellWidth: 30 },
    2: { cellWidth: 30 },
    3: { cellWidth: 30 }
  });

  return yPos + 5;
}

function addRecursosBibliograficos(doc, yPos) {
  doc.setFontSize(PDFConfig.styles.sectionTitle.fontSize);
  addTextSafe(doc, '4. RECURSOS BIBLIOGRÁFICOS', PDFConfig.margins.left, yPos, {
    fontStyle: 'bold', font: 'times'
  });
  yPos += 5;

  const tableRows = [
    [
      { 
        content: 'BIBLIOGRAFÍA POR UNIDAD/TEMA/CAPÍTULO', 
        rowSpan: 2, 
        styles: { valign: 'middle', halign: 'center', fontStyle: 'bold', font: 'times' }
      },
      { content: 'FÍSICA', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', font: 'times' }},
      { content: 'VIRTUAL', colSpan: 2, styles: { halign: 'center', fontStyle: 'bold', font: 'times' }}
    ],
    [
      'TÍTULO/AUTOR /AÑO',
      'EDITORIAL',
      'TÍTULO/AUTOR /AÑO',
      'URL'
    ]
  ];

  const recursos = Array.from(document.querySelectorAll('#recurso-body tr')).map(recurso => {
    // Buscar el tipo de recurso (puede ser un <input> o un <select>)
    const inputElement = recurso.querySelector('input[type="text"]') || recurso.querySelector('select');
    const tipo = inputElement ? inputElement.value.trim().toUpperCase() : ''; // Eliminado el valor predeterminado

    const textos = recurso.querySelectorAll('textarea');
    return {
      tipo,
      campos: [
        textos[0] ? textos[0].value : ' ',
        textos[1] ? textos[1].value : ' ',
        textos[2] ? textos[2].value : ' ',
        textos[3] ? textos[3].value : ' '
      ]
    };
  }).filter(recurso => recurso.tipo); // Filtrar los recursos que no tienen tipo vacío

  // Agrupar consecutivos del mismo tipo
  let i = 0;
  while (i < recursos.length) {
    const actualTipo = recursos[i].tipo;
    let count = 1;

    // Contar cuántos seguidos tienen el mismo tipo
    while (i + count < recursos.length && recursos[i + count].tipo === actualTipo) {
      count++;
    }

    // Primera fila con rowSpan
    tableRows.push([
      { content: actualTipo, rowSpan: count, styles: { fontStyle: 'bold', font: 'times', valign: 'middle', halign: 'center' } },
      ...recursos[i].campos
    ]);

    // Las siguientes filas SIN la primera columna (de tipo) pero con los campos restantes
    for (let j = 1; j < count; j++) {
      tableRows.push([
        '', // Espacio vacío en lugar del tipo
        ...recursos[i + j].campos
      ]);
    }

    i += count; // Avanzar al siguiente grupo de recursos
  }

  yPos = createTable(doc, tableRows, yPos, {
    0: { cellWidth: 40 },
    1: { cellWidth: 35 },
    2: { cellWidth: 30 },
    3: { cellWidth: 35 },
    4: { cellWidth: 30 }
  });

  return yPos + 5;
}

function addMicrocurriculo(doc, yPos, formData) {
  doc.setFontSize(PDFConfig.styles.sectionTitle.fontSize);
  addTextSafe(doc, '5. MICROCURRÍCULO', PDFConfig.margins.left, yPos, {
    fontStyle: 'bold', font:'times'
  });
  yPos += 5;

  const capitulos = document.querySelectorAll('#capitulo-container .capitulo');
  
  capitulos.forEach((capitulo, index) => {
    try {
      // Obtener datos del capítulo
      const noInput = capitulo.querySelector('input[name="no"]');
      const nombreInput = capitulo.querySelector('input[name="NombImp"]');
      const escenarioInputs = capitulo.querySelectorAll('tr:nth-child(3) input');
      const resultadoTextarea = capitulo.querySelector('tr:nth-child(4) textarea');
      
      const no = noInput ? noInput.value : (index + 1);
      const nombre = nombreInput ? nombreInput.value : `Capítulo ${index + 1}`;
      const resultado = resultadoTextarea ? resultadoTextarea.value : ' ';

      // Crear filas para la tabla unificada
      const tableRows = [
        // Encabezado principal
        [
          { 
            content: 'DESCRIPCIÓN MICROCURRICULAR POR UNIDAD/TEMA/CAPÍTULO',
            colSpan: 6,
            styles: { halign: 'center', fontStyle: 'bold', font:'times' }
          }
        ],
        // Datos del capítulo
        [
          'UNIDAD/TEMA/CAPÍTULO',
          { content: no.toString(), styles: { halign: 'center' , font:'times'} },
          { content: nombre, colSpan: 4, styles: { fontStyle: 'bold', font:'times' } }
        ],
        // Escenarios de aprendizaje (encabezado)
        [
          { 
            content: 'ESCENARIOS DE APRENDIZAJE', 
            rowSpan: 2, 
            styles: { valign: 'middle', fontStyle: 'bold', font:'times' }
          },
          'AULA',
          'LABORATORIOS /TALLERES /OTROS',
          'VIRTUAL',
          'INSTITUCIÓN RECEPTORA PARA PPP / PVS'
        ],
        // Escenarios de aprendizaje (valores)
        [
          escenarioInputs[0] ? escenarioInputs[0].value : ' ',
          escenarioInputs[1] ? escenarioInputs[1].value : ' ',
          escenarioInputs[2] ? escenarioInputs[2].value : ' ',
          escenarioInputs[3] ? escenarioInputs[3].value : ' '
        ],
        // Resultado de aprendizaje
        [
          { 
            content: 'RESULTADO DE APRENDIZAJE', 
            colSpan: 2, 
            styles: { fontStyle: 'bold', font:'times' }
          },
          { 
            content: resultado, 
            colSpan: 4 
          }
        ],
        // Encabezado de contenidos
        [
          { 
            content: 'CONTENIDOS DE LA ASIGNATURA O SUS EQUIVALENTES ESTRUCTURADOS POR UNIDAD, TEMA Y CAPÍTULO',
            colSpan: 6,
            styles: { halign: 'center', font:'times' }
          }
        ],
        // Encabezado de semanas
        [
          { content: 'SEMANA', styles: { fontStyle: 'bold', halign: 'center', font:'times' }},
          { content: 'CONTENIDO', styles: { fontStyle: 'bold', font:'times' }},
          { content: 'DOCENCIA', styles: { fontStyle: 'bold', font:'times' }},
          { content: 'PRÁCTICAS', styles: { fontStyle: 'bold', font:'times' }},
          { content: 'AUTÓNOMO', styles: { fontStyle: 'bold', font:'times' }},
          { content: 'EVALUACIÓN', styles: { fontStyle: 'bold', font:'times' }}
        ]
      ];

      // Agregar semanas al array de filas
      const semanas = capitulo.querySelectorAll('.semana-body tr');
      semanas.forEach(semana => {
        const inputs = Array.from(semana.querySelectorAll('td')).map(td => {
          const input = td.querySelector('input');
          const textarea = td.querySelector('textarea');
          return input || textarea;
        }).filter(Boolean);
        
        if (inputs.length >= 6) {
          tableRows.push([
            { content: inputs[0].value || ' ', styles: { halign: 'center', font:'times' }},
            inputs[1].value || ' ',
            inputs[2].value || ' ',
            inputs[3].value || ' ',
            inputs[4].value || ' ',
            inputs[5].value || ' '
          ]);
        }
      });

      // Crear la tabla completa en una sola llamada
      yPos = createTable(doc, tableRows, yPos, {
        0: { cellWidth: 25 },  // Ancho para primera columna (ajustar según necesidad)
        1: { cellWidth: 30 },  // Columna "No."
        2: { cellWidth: 30 },  // Columnas de contenido
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 }
      });

      // Espacio entre capítulos
      yPos += 5;
    } catch (error) {
      console.error(`Error procesando capítulo ${index + 1}:`, error);
    }
  });

  return yPos;
}

function addAprobacion(doc, yPos, formData) {
  doc.setFontSize(PDFConfig.styles.sectionTitle.fontSize);
  addTextSafe(doc, '6. REVISIÓN Y APROBACIÓN', PDFConfig.margins.left, yPos, { fontStyle: 'bold' , font:'times'});
  yPos += 5;

  // Función helper para obtener valores
  const getValue = (field, defaultValue = '') => formData[field] || defaultValue;

  // Formatear contenido de cada celda con alineación uniforme
  const formatCellContent = (date, name, firma, extraLine = '') => {
    const lines = [date, name];
    if (extraLine) lines.push(extraLine);

    const totalLinesBeforeFirma = 8;

    // Rellenar con líneas vacías si faltan
    while (lines.length < totalLinesBeforeFirma) {
      lines.push('');
    }

    // Añadir la línea de firma
    lines.push(`FIRMA: ${firma}`);

    return lines.join('\n');
  };

  // Crear la tabla
  yPos = createTable(doc, [
    [
      { content: 'ELABORADO POR', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'COORDINADOR DE ÁREA', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'REVISADO', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'APROBADO', styles: { fontStyle: 'bold', halign: 'center', font:'times' } }
    ],
    [
      {
        content: formatCellContent(
          getValue('elaborado-fecha', 'FECHA: dia/mes/año'),
          getValue('elaborado-por', 'Nombre'),
          getValue('elaborado-firma', '________________')
        )
      },
      {
        content: formatCellContent(
          getValue('coordinador-fecha', 'FECHA: dia/mes/año'),
          getValue('coordinador-por', 'Nombre'),
          getValue('coordinador-firma', '________________')
        )
      },
      {
        content: formatCellContent(
          getValue('revisado-fecha', 'FECHA: dia/mes/año'),
          getValue('revisado-por', 'Nombre'),
          getValue('revisado-firma', '________________')
        )
      },
      {
        content: formatCellContent(
          getValue('aprobado-fecha', 'FECHA: dia/mes/año'),
          getValue('aprobado-por', 'Nombre'),
          getValue('aprobado-firma', '________________'),
          getValue('Razon', 'RAZÓN: Aprobado ad Referendum 2025-03-28')
        )
      }
    ],
    [
      { content: 'Docente', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'Docente', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'Director de Carrera', styles: { fontStyle: 'bold', halign: 'center', font:'times' } },
      { content: 'Director - Presidente', styles: { fontStyle: 'bold', halign: 'center', font:'times' } }
    ],
  ], yPos, {
    0: { cellWidth: 42.5 },
    1: { cellWidth: 42.5 },
    2: { cellWidth: 42.5 },
    3: { cellWidth: 42.5 },
    theme: {
      table: { fillColor: 255, textColor: 0, lineWidth: 0 },
      head: { textColor: 0, lineWidth: 0.5 },
      body: { lineWidth: 0 }
    },
    styles: {
      valign: 'top', // Alineación vertical superior para uniformidad
      fontSize: 9
    }
  });
}


// ============== FUNCIÓN PRINCIPAL ==============
let logoImg = null;

function preloadLogo() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      logoImg = img;
      resolve();
    };
    img.onerror = function () {
      console.warn('No se pudo cargar el logo');
      resolve(); // No interrumpir generación si falla el logo
    };
    img.src = '/static/Img/Logo_UCE.png?t=' + new Date().getTime(); // Evita caché
  });
}

function addHeaderWithLogo(doc, yPos) {
  return new Promise((resolve) => {
    try {
      const logoWidth = 15; // ancho en mm

      let logoHeight = 0;
      if (logoImg) {
        logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        const logoX = (PDFConfig.page.width - logoWidth) / 2;
        doc.addImage(logoImg, 'PNG', logoX, yPos, logoWidth, logoHeight);
      }

      const titleY = yPos + logoHeight + 5;
      doc.setFontSize(PDFConfig.styles.title.fontSize);
      doc.setFont('havelica', 'bold');
      doc.text('PLANIFICACIÓN MICRO-CURRICULAR', PDFConfig.page.width / 2, titleY, { align: 'center', font: 'times' });

      resolve(titleY + 10);
    } catch (error) {
      console.warn('Error al agregar logo:', error);
      const fallbackY = yPos + 15;
      doc.setFontSize(PDFConfig.styles.title.fontSize);
      doc.text('PLANIFICACIÓN MICRO-CURRICULAR', PDFConfig.page.width / 2, fallbackY, { align: 'center', font: 'times' });
      resolve(fallbackY + 10);
    }
  });
}

async function generarPDF() {
  const btn = document.getElementById('generar-pdf');
  if (!btn) return;

  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
  await preloadLogo();
  try {
    await preloadLogo(); // 👈 PRE-CARGAMOS el logo antes de comenzar

    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    doc.setProperties({
      title: 'PLANIFICACIÓN MICRO-CURRICULAR',
      creator: 'Sistema de Syllabus'
    });

    let yPos = await addHeaderWithLogo(doc, PDFConfig.margins.top);
    const formData = getFormData();

    const addNewPage = async () => {
      doc.addPage();
      yPos = await addHeaderWithLogo(doc, PDFConfig.margins.top);
    };

    yPos = addDatosInformativos(doc, yPos, formData);
    if (yPos > PDFConfig.page.height - 50) await addNewPage();

    yPos = addPerfilEgreso(doc, yPos, formData);
    if (yPos > PDFConfig.page.height - 50) await addNewPage();

    yPos = addEvaluacion(doc, yPos, formData);
    if (yPos > PDFConfig.page.height - 50) await addNewPage();

    yPos = addRecursosBibliograficos(doc, yPos, formData);
    if (yPos > PDFConfig.page.height - 50) await addNewPage();

    yPos = addMicrocurriculo(doc, yPos, formData);
    if (yPos > PDFConfig.page.height - 50) await addNewPage();

    yPos = addAprobacion(doc, yPos, formData);

    const carrera = formData['carrera'] || 'GEOLOGIA';
    const asignatura = formData['asignatura'] || 'ENERGIAS_ALTERNATIVAS';
    const periodo = (formData['periodo'] || 'OCT2024-MAR2025').replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    doc.save(`Syllabus_${carrera}_${asignatura}_${periodo}_${timestamp}.pdf`);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    showError(`Error al generar el PDF: ${error.message}`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generar-pdf')?.addEventListener('click', generarPDF);
  document.getElementById('limpiar-formularios')?.addEventListener('click', limpiarFormularios);
});

// Función para limpiar formularios
function limpiarFormularios() {
  if (confirm('¿Está seguro que desea limpiar todos los formularios? Esta acción no se puede deshacer.')) {
      // Limpiar inputs
      document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
          input.value = '';
      });
      
      // Desmarcar checkboxes
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = false;
      });
      
      // Restaurar valores por defecto
      const defaults = {
          'facultad': 'FACULTAD DE INGENIERIA EN GEOLOGÍA, MINAS, PETRÓLEOS Y AMBIENTAL',
          'carrera': 'GEOLOGIA',
          'modalidad': 'PRESENCIAL',
          'UnidadCurricular': 'PROFESIONAL',
          'campo-formacion': 'PRAXIS PROFESIONAL',
          'periodo': 'OCTUBRE 2024 – MARZO 2025',
          'semestre': 'NOVENO SEMESTRE',
          'ejecucion': '16 SEMANAS',
          'docencia-hrs': '32',
          'practica-hrs': '32',
          'autonomo-hrs': '32',
          'hrs-total': '80'
      };
      
      Object.entries(defaults).forEach(([id, valor]) => {
          const el = document.getElementById(id);
          if (el) el.value = valor;
      });
      
      // Restaurar evaluación
      document.querySelectorAll('#evaluacion-form input[type="number"]').forEach(input => {
          input.value = '20';
      });
      
      alert('Todos los formularios han sido restablecidos.');
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Añadir y Eliminar Bibliografia
document.addEventListener('DOMContentLoaded', function () {
  // Función para activar los botones de eliminar
  function activarBotonesEliminar() {
    document.querySelectorAll('.remove-row').forEach(button => {
      button.onclick = function () {
        this.closest('tr').remove();
      };
    });
  }

  // Función para agregar una nueva fila
  document.getElementById('add-recurso').addEventListener('click', function () {
    const tbody = document.getElementById('recurso-body');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>
        <select id="basCom">
          <option value="BÁSICA">BÁSICA</option>
          <option value="COMPLEMENTARIA">COMPLEMENTARIA</option>
        </select>
        <span class="arrow move-up">&#8593;</span> <!-- Flecha hacia arriba -->
        <span class="arrow move-down">&#8595;</span> <!-- Flecha hacia abajo -->
        <button type="button" class="remove-row">Eliminar</button>
      </td>
      <td><textarea class="large-textarea"></textarea></td>
      <td><textarea class="large-textarea"></textarea></td>
      <td><textarea class="large-textarea"></textarea></td>
      <td><textarea class="large-textarea"></textarea></td>
    `;
    tbody.appendChild(newRow);
    
    // Volver a activar los botones de eliminar
    activarBotonesEliminar();

    // Agregar la funcionalidad para mover filas hacia arriba
    newRow.querySelector('.move-up').addEventListener('click', function () {
      const row = this.closest('tr');
      const previousRow = row.previousElementSibling;
      if (previousRow) {
        // Mover la fila hacia arriba
        row.parentNode.insertBefore(row, previousRow);
      }
    });

    // Agregar la funcionalidad para mover filas hacia abajo
    newRow.querySelector('.move-down').addEventListener('click', function () {
      const row = this.closest('tr');
      const nextRow = row.nextElementSibling;
      if (nextRow) {
        // Mover la fila hacia abajo
        row.parentNode.insertBefore(nextRow, row);
      }
    });
  });

  // Inicializar los botones de eliminar en las filas existentes
  activarBotonesEliminar();
});
  
  //Añadir y Eliminar Capítulo/Semana
document.addEventListener('DOMContentLoaded', function () {
    function activarBotonesCapitulo(capitulo) {
      const addSemanaBtn = capitulo.querySelector('.add-semana');
      const semanaBody = capitulo.querySelector('.semana-body');
      const eliminarCapituloBtn = capitulo.querySelector('.eliminate-capitulo');
  
      // Añadir semana
      addSemanaBtn.addEventListener('click', () => {
        const nuevaSemana = document.createElement('tr');
        nuevaSemana.innerHTML = `
          <td>
            <input type="text" value="">
            <button type="button" id = "remove-semana" class="remove-semana">Eliminar semana</button>
          </td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
        `;
        semanaBody.appendChild(nuevaSemana);
      });
  
      // Eliminar semana
      semanaBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-semana')) {
          const fila = e.target.closest('tr');
          fila.remove();
        }
      });
  
      // Eliminar capítulo
      eliminarCapituloBtn.addEventListener('click', () => {
        capitulo.remove();
      });
    }
  
    const primerCapitulo = document.querySelector('.capitulo');
    activarBotonesCapitulo(primerCapitulo);
  
    document.getElementById('add-capitulo').addEventListener('click', function () {
      const contenedor = document.getElementById('capitulo-container');
      const nuevoCapitulo = primerCapitulo.cloneNode(true);
  
      // Limpiar inputs/textarea
      nuevoCapitulo.querySelectorAll('input, textarea').forEach(el => el.value = '');
  
      // Dejar solo una semana
      const semanaBody = nuevoCapitulo.querySelector('.semana-body');
      semanaBody.innerHTML = `
        <tr>
          <td>
            <input type="text" value="">
            <button type="button" id="remove-semana" class="remove-semana">Eliminar semana</button>
          </td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
          <td><textarea class="large-textarea"></textarea></td>
        </tr>
      `;
  
      contenedor.appendChild(nuevoCapitulo);
      activarBotonesCapitulo(nuevoCapitulo);
    });
  });
  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

