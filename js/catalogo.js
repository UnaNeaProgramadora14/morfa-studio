// Base de datos inicial de servicios 3D de MORFA Studio (se guarda en localStorage para que el Admin pueda editarla)
const serviciosIniciales = [
  {
    id: 1,
    titulo: "Modelado 3D de Producto Comercial",
    categoria: "comercial",
    etiqueta: "E-Commerce & Marcas",
    precio: "Desde $180.000 COP",
    tiempo: "3 - 5 días hábiles",
    imagen: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Creación de modelos tridimensionales limpios y detallados de tus productos a partir de bocetos, planos o fotografías.",
    entregables: "Archivo fuente 3D (.OBJ / .FBX / .BLEND), 2 vistas previas en alta resolución y malla optimizada."
  },
  {
    id: 2,
    titulo: "Render Fotorrealista de Estudio",
    categoria: "comercial",
    etiqueta: "Publicidad & Lanzamiento",
    precio: "Desde $250.000 COP",
    tiempo: "4 - 6 días hábiles",
    imagen: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Iluminación profesional, texturas realistas y composición minimalista lista para catálogos, redes sociales o pauta digital.",
    entregables: "4 renders en resolución 4K (PNG/JPG), variaciones de ángulo e iluminación de estudio."
  },
  {
    id: 3,
    titulo: "Modelado Técnico y Pieza Industrial",
    categoria: "industrial",
    etiqueta: "Ingeniería & Prototipado",
    precio: "Desde $220.000 COP",
    tiempo: "4 - 7 días hábiles",
    imagen: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee152?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Diseño paramétrico de piezas mecánicas, carcasas, componentes y objetos con medidas exactas antes de fabricación.",
    entregables: "Archivo CAD técnico (.STEP / .STL para impresión 3D), vistas ortogonales y despiece básico."
  },
  {
    id: 4,
    titulo: "Visualización de Packaging y Envases",
    categoria: "comercial",
    etiqueta: "Branding & Empaques",
    precio: "Desde $200.000 COP",
    tiempo: "3 - 5 días hábiles",
    imagen: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Prototipado visual de botellas, cajas, etiquetas y empaques personalizados para validar tu marca antes de imprimir.",
    entregables: "Modelo 3D del envase con etiqueta aplicada + 3 renders en escenario minimalista."
  },
  {
    id: 5,
    titulo: "Ensamblaje y Prototipo Funcional 3D",
    categoria: "industrial",
    etiqueta: "Diseño de Producto",
    precio: "Desde $350.000 COP",
    tiempo: "6 - 9 días hábiles",
    imagen: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Desarrollo integral de objetos compuestos por múltiples piezas encajables, validación de tolerancias y estética.",
    entregables: "Ensamblaje completo, archivos individuales listos para prototipado rápido y render técnico."
  },
  {
    id: 6,
    titulo: "Paquete Lanzamiento Integral MORFA",
    categoria: "paquete",
    etiqueta: "Servicio Combinado",
    precio: "Desde $450.000 COP",
    tiempo: "7 - 10 días hábiles",
    imagen: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=900&q=80",
    descripcionCorta: "Nuestra solución combinada: modelado técnico de precisión + renders comerciales listos para presentar a inversores o clientes.",
    entregables: "Modelo 3D maestro + archivos técnicos + 5 renders comerciales 4K."
  }
];

// Obtener servicios desde localStorage o cargar los iniciales
function obtenerServicios() {
  const guardados = localStorage.getItem('morfa_servicios');
  if (guardados) {
    return JSON.parse(guardados);
  }
  localStorage.setItem('morfa_servicios', JSON.stringify(serviciosIniciales));
  return serviciosIniciales;
}

// Renderizar tarjetas del catálogo
function renderizarCatalogo(filtro = 'todos') {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;

  const servicios = obtenerServicios();
  const filtrados = filtro === 'todos'
    ? servicios
    : servicios.filter(s => s.categoria === filtro);

  grid.innerHTML = filtrados.map(servicio => `
    <article class="service-card" data-aos="fade-up">
      <div class="card-img-wrapper">
        <span class="card-badge">${servicio.etiqueta}</span>
        <img src="${servicio.imagen}" alt="${servicio.titulo}" loading="lazy" />
      </div>
      <div class="card-body">
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcionCorta}</p>
        <div class="card-meta">
          <span><i class="bx bx-time-five"></i> ${servicio.tiempo}</span>
          <strong>${servicio.precio}</strong>
        </div>
        <button class="btn btn-outline btn-full" onclick="abrirModalServicio(${servicio.id})">
          Ver detalles y entregables
        </button>
      </div>
    </article>
  `).join('');
}

// Modal de detalle de servicio
function abrirModalServicio(id) {
  const servicio = obtenerServicios().find(s => s.id === id);
  if (!servicio) return;

  const modal = document.getElementById('servicioModal');
  document.getElementById('modalImg').src = servicio.imagen;
  document.getElementById('modalEtiqueta').textContent = servicio.etiqueta;
  document.getElementById('modalTitulo').textContent = servicio.titulo;
  document.getElementById('modalDescripcion').textContent = servicio.descripcionCorta;
  document.getElementById('modalEntregables').textContent = servicio.entregables;
  document.getElementById('modalTiempo').textContent = servicio.tiempo;
  document.getElementById('modalPrecio').textContent = servicio.precio;

  // Botón para pre-llenar el contacto con este servicio
  const btnCotizar = document.getElementById('modalCotizarBtn');
  btnCotizar.onclick = () => {
    modal.classList.remove('active');
    const selectServicio = document.getElementById('contactoServicio');
    if (selectServicio) selectServicio.value = servicio.titulo;
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  renderizarCatalogo();

  // Botones de filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderizarCatalogo(btn.dataset.filter);
    });
  });

  // Cerrar modal
  const closeModal = document.getElementById('closeServicioModal');
  const modal = document.getElementById('servicioModal');
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
});