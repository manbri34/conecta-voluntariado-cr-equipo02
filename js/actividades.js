// actividades.js

// ═══ 1. TEMPORAL (se mueve a main.js cuando exista) ═══

const RUTA_ACTIVIDADES = 'data/actividades.json';

async function cargarJSON(ruta) {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${ruta} (estado ${respuesta.status})`);
    }
    return respuesta.json();
}

// ═══ 2. REFERENCIAS AL DOM ═══

const elBarraFiltros = document.getElementById('barra-filtros');
const elGridActividades = document.getElementById('grid-actividades');

// ═══ 3. ESTADO DE LA PÁGINA ═══

// Actividades vigentes ya ordenadas; los filtros trabajan sobre esta lista
let actividadesVigentes = [];

// ═══ 4. FUNCIONES DE CÁLCULO ═══

// "2026-11-24" → Date en hora local (evita el desfase de zona horaria)
function convertirFechaLocal(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
}

// Hoy a las 00:00, para comparar solo el día
function obtenerHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
}

// Activas y con fecha de hoy en adelante (las llenas SÍ se incluyen)
function filtrarVigentes(actividades, hoy) {
    return actividades.filter(actividad =>
        actividad.activa &&
        convertirFechaLocal(actividad.fecha) >= hoy
    );
}

// De la más próxima a la más lejana, sobre una copia
function ordenarPorFecha(actividades) {
    return [...actividades].sort((a, b) =>
        convertirFechaLocal(a.fecha) - convertirFechaLocal(b.fecha)
    );
}

// Categorías sin repetir, en orden alfabético
function obtenerCategorias(actividades) {
    const unicas = new Set(actividades.map(actividad => actividad.categoria));
    return [...unicas].sort((a, b) => a.localeCompare(b, 'es'));
}

function filtrarPorCategoria(actividades, categoria) {
    if (categoria === 'todas') return actividades;
    return actividades.filter(actividad => actividad.categoria === categoria);
}

// "2026-12-10" → "10 dic"
function formatearFecha(fechaISO) {
    return convertirFechaLocal(fechaISO).toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'short'
    });
}

function textoCupos(cantidad) {
    if (cantidad === 0) return 'Sin cupos';
    return cantidad === 1 ? '1 cupo' : `${cantidad} cupos`;
}

// actividades.html?id=3 → 3   |   sin id → null
function leerIdDeURL() {
    const id = new URLSearchParams(window.location.search).get('id');
    return id ? Number(id) : null;
}

// ═══ 5. FUNCIONES DE RENDER ═══

// Crea una etiqueta con clase y texto
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

// TEMPORAL: es la misma tarjeta de indexconecta.js. Puede ir a main.js para no duplicarla
// Devuelve el HTML de una tarjeta como texto (template literal)
function crearTarjetaActividad(actividad) {
    const claseLlena = actividad.cuposDisponibles === 0 ? 'tarjeta-actividad--llena' : '';

    const imagen = actividad.imagen
        ? `<img src="${actividad.imagen}" alt="" loading="lazy">`
        : '';

    const organizacion = actividad.organizacion
        ? `<span class="organizacion-nombre">${actividad.organizacion}</span>`
        : '';

    return `
        <article class="tarjeta-actividad ${claseLlena}" data-id="${actividad.id}">
            <div class="tarjeta-imagen-wrapper">
                ${imagen}
                <span class="categoria-badge">${actividad.categoria}</span>
            </div>
            <div class="tarjeta-info-wrapper">
                ${organizacion}
                <h3 class="actividad-titulo">${actividad.nombre}</h3>
                <div class="actividad-detalles-meta">
                    <p class="detalle-item">${actividad.ubicacion}</p>
                    <p class="detalle-item">${formatearFecha(actividad.fecha)}</p>
                </div>
                <hr class="linea-divisoria">
                <div class="tarjeta-footer-fila">
                    <span class="cupos-info">${textoCupos(actividad.cuposDisponibles)}</span>
                    <a href="actividades.html?id=${actividad.id}" class="link-ver-actividad"
                       aria-label="Ver actividad: ${actividad.nombre}">Ver actividad</a>
                </div>
            </div>
        </article>
    `;
}

// Filtros

function crearBotonFiltro(texto, categoria) {
    const boton = crearElemento('button', 'btn-filtro', texto);
    boton.type = 'button';
    boton.dataset.categoria = categoria;
    boton.setAttribute('aria-pressed', 'false');
    return boton;
}

function renderFiltros(categorias) {
    const botones = [
        crearBotonFiltro('Todas', 'todas'),
        ...categorias.map(categoria => crearBotonFiltro(categoria, categoria))
    ];
    elBarraFiltros.replaceChildren(...botones);
    marcarFiltroActivo('todas');
}

// Marca visualmente (class) y para lectores de pantalla (aria-pressed)
function marcarFiltroActivo(categoria) {
    elBarraFiltros.querySelectorAll('.btn-filtro').forEach(boton => {
        const activo = boton.dataset.categoria === categoria;
        boton.classList.toggle('active', activo);
        boton.setAttribute('aria-pressed', String(activo));
    });
}

// Lista

function renderActividades(actividades) {
    if (actividades.length === 0) {
        renderMensaje('No hay actividades en esta categoría por ahora.');
        return;
    }
    elGridActividades.innerHTML = actividades
        .map(actividad => crearTarjetaActividad(actividad))
        .join('');
}

function renderMensaje(texto) {
    elGridActividades.innerHTML = `<p class="mensaje-estado">${texto}</p>`;
}

// Llega desde inicio con ?id= → scroll a la tarjeta y resaltarla
function resaltarActividad(id) {
    const tarjeta = elGridActividades.querySelector(`[data-id="${id}"]`);
    if (!tarjeta) return;

    tarjeta.classList.add('tarjeta-actividad--resaltada');
    tarjeta.setAttribute('tabindex', '-1');
    tarjeta.focus({ preventScroll: true });
    tarjeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ═══ 6. EVENTOS ═══

// Un solo listener en la barra para todos los botones (delegación de eventos)
function manejarClickFiltro(evento) {
    const boton = evento.target.closest('.btn-filtro');
    if (!boton) return;

    const categoria = boton.dataset.categoria;
    marcarFiltroActivo(categoria);
    renderActividades(filtrarPorCategoria(actividadesVigentes, categoria));
}

// ═══ 7. INICIO ═══

async function iniciar() {
    try {
        const actividades = await cargarJSON(RUTA_ACTIVIDADES);
        actividadesVigentes = ordenarPorFecha(filtrarVigentes(actividades, obtenerHoy()));

        if (actividadesVigentes.length === 0) {
            elBarraFiltros.hidden = true;
            renderMensaje('Por ahora no hay actividades publicadas. Vuelve pronto.');
            return;
        }

        renderFiltros(obtenerCategorias(actividadesVigentes));
        renderActividades(actividadesVigentes);
        elBarraFiltros.addEventListener('click', manejarClickFiltro);

        const idSolicitado = leerIdDeURL();
        if (idSolicitado !== null) {
            resaltarActividad(idSolicitado);
        }
    } catch (error) {
        console.error(error);
        elBarraFiltros.hidden = true;
        renderMensaje('No pudimos cargar las actividades. Intenta recargar la página.');
    }
}

iniciar();