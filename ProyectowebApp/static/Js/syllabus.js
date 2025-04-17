document.addEventListener('DOMContentLoaded', function() {
    // Botón Generar PDF
    //document.getElementById('generar-pdf').addEventListener('click', generarPDF);
    
    // Botón Limpiar Formularios
    document.getElementById('limpiar-formularios').addEventListener('click', limpiarFormularios);
});

// Función para limpiar todos los formularios
function limpiarFormularios() {
    if (confirm('¿Está seguro que desea limpiar todos los formularios? Esta acción no se puede deshacer.')) {
        // Limpiar inputs de texto, number y textareas
        document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
            input.value = '';
        });
        
        // Desmarcar checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Restaurar valores por defecto específicos
        document.getElementById('facultad').value = 'FACULTAD DE INGENIERIA EN GEOLOGÍA, MINAS, PETRÓLEOS Y AMBIENTAL';
        document.getElementById('carrera').value = 'GEOLOGIA';
        document.getElementById('modalidad').value = 'PRESENCIAL';
        document.getElementById('UnidadCurricular').value = 'PROFESIONAL';
        document.getElementById('campo-formacion').value = 'PRAXIS PROFESIONAL';
        document.getElementById('periodo').value = 'OCTUBRE 2024 – MARZO 2025';
        document.getElementById('semestre').value = 'NOVENO SEMESTRE';
        document.getElementById('ejecucion').value = '16 SEMANAS';
        document.getElementById('docencia-hrs').value = '32';
        document.getElementById('practica-hrs').value = '32';
        document.getElementById('autonomo-hrs').value = '32';
        document.getElementById('hrs-total').value = '80';
        
        // Restaurar valores de evaluación
        document.querySelectorAll('#evaluacion-form input[type="number"]').forEach(input => {
            input.value = '20';
        });
        
        // Restaurar porcentajes y ponderaciones
        document.getElementById('Porcen').value = '35%';
        document.getElementById('Pond').value = '7 puntos';
        document.getElementById('Porcen1').value = '25%';
        document.getElementById('Pond1').value = '5 puntos';
        document.getElementById('Porcen2').value = '10%';
        document.getElementById('Pond2').value = '2 puntos';
        document.getElementById('Porcen3').value = '30%';
        document.getElementById('Pond3').value = '6 puntos';
        document.getElementById('PorcenT').value = '100%';
        
        // Limpiar recursos bibliográficos (dejar solo básica y complementaria)
        const recursoBody = document.getElementById('recurso-body');
        while (recursoBody.children.length > 2) {
            recursoBody.removeChild(recursoBody.lastChild);
        }
        
        // Limpiar microcurrículo (dejar solo un capítulo)
        const capituloContainer = document.getElementById('capitulo-container');
        while (capituloContainer.children.length > 1) {
            capituloContainer.removeChild(capituloContainer.lastChild);
        }
        
        // Limpiar semanas del primer capítulo
        const primerCapitulo = document.querySelector('.capitulo');
        const semanaBody = primerCapitulo.querySelector('.semana-body');
        while (semanaBody.children.length > 1) {
            semanaBody.removeChild(semanaBody.lastChild);
        }
        
        alert('Todos los formularios han sido limpiados.');
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Añadir y Eliminar Bibliografia
document.addEventListener('DOMContentLoaded', function () {
    function activarBotonesEliminar() {
      document.querySelectorAll('.remove-row').forEach(button => {
        button.onclick = function () {
          this.closest('tr').remove();
        };
      });
    }
  
    activarBotonesEliminar();
  
    document.getElementById('add-recurso').addEventListener('click', function () {
      const tbody = document.getElementById('recurso-body');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>
          <input type="text" id="basCom" value="BÁSICA/COMPLEMENTARIA">
          <button type="button" id="remove-row" class="remove-row">Eliminar</button>
        </td>
        <td><textarea class="large-textarea"></textarea></td>
        <td><textarea class="large-textarea"></textarea></td>
        <td><textarea class="large-textarea"></textarea></td>
        <td><textarea class="large-textarea"></textarea></td>
      `;
      tbody.appendChild(newRow);
      activarBotonesEliminar();
    });
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
document.getElementById('generar-pdf').addEventListener('click', async function() {
  try {
      // 1. Crear un nuevo documento PDF
      const { PDFDocument, rgb } = PDFLib;
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      
      // 2. Configurar la página A4 (595 x 842 puntos)
      const page = pdfDoc.addPage([595, 842]);
      
      // 3. Capturar el HTML como imagen para el fondo
      const element = document.getElementById('SyllabusSection');
      const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          scrollY: -window.scrollY
      });
      
      // 4. Agregar la imagen como fondo del PDF
      const pngImage = await pdfDoc.embedPng(canvas.toDataURL('image/png'));
      const pngDims = pngImage.scale(0.5);
      page.drawImage(pngImage, {
          x: 0,
          y: page.getHeight() - pngDims.height,
          width: pngDims.width,
          height: pngDims.height,
      });
      
      // 5. Obtener el formulario PDF
      const form = pdfDoc.getForm();
      
      // 6. Función para mapear campos del HTML al PDF
      const mapFields = [
          // Datos Informativos
          { id: 'facultad', x: 50, y: 800, width: 400, height: 15 },
          { id: 'carrera', x: 50, y: 775, width: 150, height: 15 },
          { id: 'modalidad', x: 250, y: 775, width: 150, height: 15 },
          { id: 'asignatura', x: 50, y: 750, width: 150, height: 15 },
          { id: 'codigo', x: 250, y: 750, width: 150, height: 15 },
          { id: 'UnidadCurricular', x: 50, y: 725, width: 400, height: 15 },
          { id: 'campo-formacion', x: 50, y: 700, width: 200, height: 15 },
          { id: 'periodo', x: 50, y: 675, width: 400, height: 15 },
          { id: 'semestre', x: 50, y: 650, width: 150, height: 15 },
          { id: 'ejecucion', x: 250, y: 650, width: 150, height: 15 },
          { id: 'proyecto', x: 50, y: 625, width: 400, height: 15 },
          
          // Organización del Aprendizaje
          { id: 'docencia-hrs', x: 150, y: 575, width: 50, height: 15 },
          { id: 'practica-hrs', x: 350, y: 575, width: 50, height: 15 },
          { id: 'autonomo-hrs', x: 500, y: 575, width: 50, height: 15 },
          { id: 'hrs-total', x: 500, y: 550, width: 50, height: 15 },
          
          // Detalle de Horas de Tutoría
          { id: 'hrsIP', x: 100, y: 500, width: 50, height: 15 },
          { id: 'hrsGP', x: 200, y: 500, width: 50, height: 15 },
          { id: 'hrsIV', x: 300, y: 500, width: 50, height: 15 },
          { id: 'hrsGV', x: 400, y: 500, width: 50, height: 15 },
          { id: 'Tot_P', x: 150, y: 475, width: 50, height: 15 },
          { id: 'Tot_V', x: 350, y: 475, width: 50, height: 15 },
          
          // Aportes al Perfil de Egreso (textareas)
          { id: 'asignaturaEquivalentesT', x: 300, y: 400, width: 250, height: 60, multiline: true },
          { id: 'codigoeqq', x: 600, y: 400, width: 100, height: 60, multiline: true },
          
          // Agrega aquí todos los demás campos de tu formulario...
      ];
      
      // 7. Agregar todos los campos al PDF
      for (const field of mapFields) {
          const htmlElement = document.getElementById(field.id);
          if (htmlElement) {
              const value = htmlElement.value || htmlElement.textContent || '';
              
              if (field.multiline) {
                  // Campo de texto multilínea
                  const textField = form.createTextField(field.id);
                  textField.setText(value);
                  textField.addToPage(page, {
                      x: field.x,
                      y: page.getHeight() - field.y,
                      width: field.width,
                      height: field.height,
                      borderWidth: 0,
                      multiline: true,
                      backgroundColor: rgb(1, 1, 1, 0.01),
                  });
              } else {
                  // Campo de texto normal
                  const textField = form.createTextField(field.id);
                  textField.setText(value);
                  textField.addToPage(page, {
                      x: field.x,
                      y: page.getHeight() - field.y,
                      width: field.width,
                      height: field.height,
                      borderWidth: 0,
                      backgroundColor: rgb(1, 1, 1, 0.01),
                  });
              }
          }
      }
      
      // 8. Guardar y descargar el PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Planificacion_Microcurricular_Editable.pdf';
      link.click();
      
  } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor intenta nuevamente.');
  }
});