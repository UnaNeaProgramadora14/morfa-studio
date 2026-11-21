const promptsEjemplo = [
  "Tengo una marca nueva de botellas térmicas y quiero renders realistas para vender en Instagram y mi tienda online.",
  "Necesito modelar una pieza mecánica de soporte con medidas exactas para mandarla a imprimir en 3D.",
  "Tengo solo un boceto dibujado a mano de un mueble minimalista y quiero ver cómo quedaría antes de fabricarlo."
];

function analizarProyectoLocal(texto, archivoAdjunto = "") {
  const consulta = texto.toLowerCase();

  let servicioRecomendado = "Paquete Lanzamiento Integral MORFA";
  let enfoque = "Combinado (Técnico + Comercial)";
  let precioEstimado = "$380.000 - $480.000 COP";
  let tiempoEstimado = "6 a 9 días hábiles";
  let formatosEntrega = "Modelo maestro 3D (.OBJ/.STEP) + 4 Renders 4K";
  let requisitosCliente = "Bocetos o referencias visuales, dimensiones aproximadas y paleta de colores de tu marca.";

  const esIndustrial = /(pieza|mecanica|mecánica|industrial|cad|imprimir|impresion|impresión|medidas|plano|soporte|carcasa|ingenieria|ingeniería|prototipo|encaje|stl|step)/.test(consulta);
  const esComercial = /(marca|render|vender|instagram|tienda|botella|envase|empaque|packaging|publicidad|producto|catalogo|catálogo|logo|cafe|café|cosmético|cosmetico)/.test(consulta);

  if (esIndustrial && !esComercial) {
    servicioRecomendado = "Modelado Técnico y Pieza Industrial";
    enfoque = "Técnico / Ingeniería CAD";
    precioEstimado = "$220.000 - $340.000 COP";
    tiempoEstimado = "4 a 7 días hábiles";
    formatosEntrega = "Archivos CAD listos para fabricación (.STEP, .STL) + Vistas técnicas";
    requisitosCliente = "Plano o croquis con cotas/medidas principales, material previsto y tolerancias requeridas.";
  } else if (esComercial && !esIndustrial) {
    const esEmpaque = /(envase|empaque|botella|caja|packaging|etiqueta)/.test(consulta);
    servicioRecomendado = esEmpaque
      ? "Visualización de Packaging y Envases"
      : "Render Fotorrealista de Estudio";
    enfoque = "Visualización Comercial & Branding";
    precioEstimado = "$200.000 - $300.000 COP";
    tiempoEstimado = "3 a 5 días hábiles";
    formatosEntrega = "4 Renders 4K con iluminación de estudio (PNG/JPG) + Modelo 3D optimizado";
    requisitosCliente = "Logotipo o etiquetas en alta calidad, fotos de referencia y estilo de iluminación deseado.";
  }

  const notaArchivo = archivoAdjunto
    ? ` Además, recibimos tu archivo adjunto ("${archivoAdjunto}"), lo cual agiliza el levantamiento inicial de proporciones.`
    : "";

  return {
    servicioRecomendado,
    enfoque,
    precioEstimado,
    tiempoEstimado,
    formatosEntrega,
    requisitosCliente,
    resumenIA: `Basado en tu descripción, detectamos un requerimiento con enfoque ${enfoque.toLowerCase()}. Recomendamos iniciar con "${servicioRecomendado}".${notaArchivo}`
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const inputIA = document.getElementById('iaPromptInput');
  const archivoInput = document.getElementById('iaArchivoInput');
  const archivoNombre = document.getElementById('iaArchivoNombre');
  const btnAnalizar = document.getElementById('btnAnalizarIA');
  const resultadoBox = document.getElementById('iaResultadoBox');
  const loadingBox = document.getElementById('iaLoading');

  let nombreArchivoActual = "";

  if (archivoInput && archivoNombre) {
    archivoInput.addEventListener('change', () => {
      if (archivoInput.files && archivoInput.files[0]) {
        nombreArchivoActual = archivoInput.files[0].name;
        archivoNombre.textContent = `Adjunto: ${nombreArchivoActual}`;
        archivoNombre.style.color = '#38BDF8';
      } else {
        nombreArchivoActual = "";
        archivoNombre.textContent = "Ningún archivo seleccionado";
        archivoNombre.style.color = '';
      }
    });
  }

  document.querySelectorAll('.chip-ejemplo').forEach((chip, index) => {
    chip.addEventListener('click', () => {
      if (inputIA && promptsEjemplo[index]) {
        inputIA.value = promptsEjemplo[index];
        inputIA.focus();
      }
    });
  });

  if (btnAnalizar && inputIA) {
    btnAnalizar.addEventListener('click', () => {
      const texto = inputIA.value.trim();
      if (texto.length < 10) {
        alert('Por favor describe un poco más tu idea o proyecto (mínimo 10 caracteres).');
        return;
      }

      resultadoBox.classList.remove('active');
      loadingBox.classList.add('active');
      btnAnalizar.disabled = true;

      setTimeout(() => {
        const diagnostico = analizarProyectoLocal(texto, nombreArchivoActual);

        document.getElementById('iaServicio').textContent = diagnostico.servicioRecomendado;
        document.getElementById('iaEnfoque').textContent = diagnostico.enfoque;
        document.getElementById('iaResumen').textContent = diagnostico.resumenIA;
        document.getElementById('iaPrecio').textContent = diagnostico.precioEstimado;
        document.getElementById('iaTiempo').textContent = diagnostico.tiempoEstimado;
        document.getElementById('iaFormatos').textContent = diagnostico.formatosEntrega;
        document.getElementById('iaRequisitos').textContent = diagnostico.requisitosCliente;

        const btnAplicar = document.getElementById('btnAplicarCotizacion');
        btnAplicar.onclick = () => {
          const selectServicio = document.getElementById('contactoServicio');
          const textareaMensaje = document.getElementById('contactoMensaje');
          if (selectServicio) selectServicio.value = diagnostico.servicioRecomendado;
          if (textareaMensaje) {
            const textoArchivo = nombreArchivoActual ? `\nArchivo adjunto de referencia: ${nombreArchivoActual}` : "";
            textareaMensaje.value = `Hola MORFA Studio, utilicé el Cotizador IA.\nIdea del proyecto: "${texto}"${textoArchivo}\nServicio sugerido: ${diagnostico.servicioRecomendado} (${diagnostico.precioEstimado}).`;
          }
          document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
        };

        loadingBox.classList.remove('active');
        resultadoBox.classList.add('active');
        btnAnalizar.disabled = false;
      }, 900);
    });
  }
});