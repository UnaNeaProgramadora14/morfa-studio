// Credenciales del Administrador de MORFA Studio (para defensa y gestión)
const ADMIN_USER = "admin";
const ADMIN_PASS = "morfa2026";

// Obtener solicitudes de contacto guardadas
function obtenerSolicitudes() {
  return JSON.parse(localStorage.getItem('morfa_solicitudes')) || [];
}

// Llenar el <select> del formulario con los servicios actuales del catálogo
function cargarOpcionesContacto() {
  const select = document.getElementById('contactoServicio');
  if (!select || typeof obtenerServicios !== 'function') return;

  const servicios = obtenerServicios();
  select.innerHTML = `<option value="Proyecto Personalizado a Medida">Proyecto Personalizado a Medida</option>` +
    servicios.map(s => `<option value="${s.titulo}">${s.titulo}</option>`).join('');
}

// Renderizar tabla/lista de solicitudes en el Panel Admin
function renderizarSolicitudesAdmin() {
  const lista = document.getElementById('adminSolicitudesList');
  const contador = document.getElementById('totalSolicitudesBadge');
  if (!lista) return;

  const solicitudes = obtenerSolicitudes();
  if (contador) contador.textContent = solicitudes.length;

  if (solicitudes.length === 0) {
    lista.innerHTML = `<p class="empty-msg">Aún no hay solicitudes registradas desde el formulario web.</p>`;
    return;
  }

  lista.innerHTML = solicitudes.map((sol, idx) => `
    <div class="admin-item-card">
      <div class="admin-item-head">
        <strong>${sol.nombre}</strong>
        <span>${sol.fecha}</span>
      </div>
      <small class="admin-tag">${sol.servicio}</small>
      <p class="admin-contact-info"><i class="bx bx-envelope"></i> ${sol.correo} | <i class="bx bx-phone"></i> ${sol.telefono || 'Sin teléfono'}</p>
      <p class="admin-msg">${sol.mensaje}</p>
      <button class="btn-delete-mini" onclick="eliminarSolicitud(${idx})">
        <i class="bx bx-trash"></i> Marcar como atendida / Eliminar
      </button>
    </div>
  `).join('');
}

function eliminarSolicitud(index) {
  const solicitudes = obtenerSolicitudes();
  solicitudes.splice(index, 1);
  localStorage.setItem('morfa_solicitudes', JSON.stringify(solicitudes));
  renderizarSolicitudesAdmin();
}

// Renderizar gestión de catálogo en el Panel Admin
function renderizarCatalogoAdmin() {
  const lista = document.getElementById('adminCatalogoList');
  if (!lista || typeof obtenerServicios !== 'function') return;

  const servicios = obtenerServicios();
  lista.innerHTML = servicios.map(s => `
    <div class="admin-cat-row">
      <div>
        <strong>${s.titulo}</strong>
        <span>${s.etiqueta} • ${s.precio}</span>
      </div>
      <button class="btn-delete-mini" onclick="eliminarServicioAdmin(${s.id})">
        <i class="bx bx-trash"></i>
      </button>
    </div>
  `).join('');
}

function eliminarServicioAdmin(id) {
  if (!confirm('¿Eliminar este servicio del catálogo público?')) return;
  const actuales = obtenerServicios().filter(s => s.id !== id);
  localStorage.setItem('morfa_servicios', JSON.stringify(actuales));
  renderizarCatalogoAdmin();
  if (typeof renderizarCatalogo === 'function') renderizarCatalogo();
  cargarOpcionesContacto();
}

document.addEventListener('DOMContentLoaded', () => {
  cargarOpcionesContacto();

  // 1. FORMULARIO DE CONTACTO REAL
  const formContacto = document.getElementById('formContacto');
  const alertaContacto = document.getElementById('contactoAlerta');

  if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
      e.preventDefault();

      const nuevaSolicitud = {
        nombre: document.getElementById('contactoNombre').value.trim(),
        correo: document.getElementById('contactoCorreo').value.trim(),
        telefono: document.getElementById('contactoTelefono').value.trim(),
        servicio: document.getElementById('contactoServicio').value,
        mensaje: document.getElementById('contactoMensaje').value.trim(),
        fecha: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
      };

      const solicitudes = obtenerSolicitudes();
      solicitudes.unshift(nuevaSolicitud);
      localStorage.setItem('morfa_solicitudes', JSON.stringify(solicitudes));

      formContacto.reset();
      if (alertaContacto) {
        alertaContacto.style.display = 'block';
        setTimeout(() => { alertaContacto.style.display = 'none'; }, 5000);
      }
      renderizarSolicitudesAdmin();
    });
  }

  // 2. MODAL DE LOGIN Y PANEL ADMIN
  const adminModal = document.getElementById('adminModal');
  const openAdminBtn = document.getElementById('openAdminBtn');
  const closeAdminBtn = document.getElementById('closeAdminModal');
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');
  const formLogin = document.getElementById('formAdminLogin');
  const loginError = document.getElementById('adminLoginError');
  const btnLogout = document.getElementById('btnAdminLogout');

  function verificarSesionAdmin() {
    const logueado = sessionStorage.getItem('morfa_admin_auth') === 'true';
    if (logueado) {
      loginView.style.display = 'none';
      dashboardView.style.display = 'block';
      renderizarSolicitudesAdmin();
      renderizarCatalogoAdmin();
    } else {
      loginView.style.display = 'block';
      dashboardView.style.display = 'none';
    }
  }

  if (openAdminBtn && adminModal) {
    openAdminBtn.addEventListener('click', () => {
      verificarSesionAdmin();
      adminModal.classList.add('active');
    });
  }

  if (closeAdminBtn && adminModal) {
    closeAdminBtn.addEventListener('click', () => adminModal.classList.remove('active'));
  }

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('adminUser').value.trim();
      const pass = document.getElementById('adminPass').value.trim();

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('morfa_admin_auth', 'true');
        loginError.style.display = 'none';
        formLogin.reset();
        verificarSesionAdmin();
      } else {
        loginError.style.display = 'block';
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('morfa_admin_auth');
      verificarSesionAdmin();
    });
  }

  // 3. AGREGAR NUEVO SERVICIO DESDE EL PANEL ADMIN
  const formNuevoServicio = document.getElementById('formNuevoServicio');
  if (formNuevoServicio) {
    formNuevoServicio.addEventListener('submit', (e) => {
      e.preventDefault();
      const servicios = obtenerServicios();
      const nuevo = {
        id: Date.now(),
        titulo: document.getElementById('newServTitulo').value.trim(),
        categoria: document.getElementById('newServCategoria').value,
        etiqueta: document.getElementById('newServEtiqueta').value.trim(),
        precio: document.getElementById('newServPrecio').value.trim(),
        tiempo: document.getElementById('newServTiempo').value.trim(),
        imagen: document.getElementById('newServImg').value.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
        descripcionCorta: document.getElementById('newServDesc').value.trim(),
        entregables: "Archivo fuente 3D + Vistas en alta resolución a medida."
      };

      servicios.push(nuevo);
      localStorage.setItem('morfa_servicios', JSON.stringify(servicios));
      formNuevoServicio.reset();
      renderizarCatalogoAdmin();
      if (typeof renderizarCatalogo === 'function') renderizarCatalogo();
      cargarOpcionesContacto();
      alert('Servicio publicado en el catálogo de MORFA Studio.');
    });
  }
});