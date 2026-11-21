const RUTA_ACTIVIDADES = 'data/actividades.json';
const CANTIDAD_DESTACADAS = 3;

async function obtenerActividades() {
    const respuesta = await fetch(RUTA_ACTIVIDADES);
    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${RUTA_ACTIVIDADES} (estado ${respuesta.status})`);
    }
    return respuesta.json();
}

// ═══ 2. REFERENCIAS AL DOM ═══

const elGridDestacadas = document.getElementById('grid-destacadas');

// ═══ 3. FUNCIONES DE CÁLCULO ═══

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

// Activas, con cupos y con fecha de hoy en adelante
function filtrarDisponibles(actividades, hoy) {
    return actividades.filter(actividad =>
        actividad.activa &&
        actividad.cuposDisponibles > 0 &&
        convertirFechaLocal(actividad.fecha) >= hoy
    );
}

// Mezcla una copia con Fisher–Yates y toma las primeras
function elegirAleatorias(lista, cantidad) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, cantidad);
}

// "2026-12-10" → "10 dic"
function formatearFecha(fechaISO) {
    return convertirFechaLocal(fechaISO).toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'short'
    });
}

function textoCupos(cantidad) {
    return cantidad === 1 ? '1 cupo' : `${cantidad} cupos`;
}

// ═══ 4. FUNCIONES DE RENDER ═══

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

function renderDestacadas(actividades) {
    elGridDestacadas.innerHTML = actividades
        .map(actividad => crearTarjetaActividad(actividad))
        .join('');
}

function renderMensajeDestacadas(texto) {
    elGridDestacadas.innerHTML = `<p class="mensaje-estado">${texto}</p>`;
}

// ═══ PENDIENTE: bienvenida y tarjeta de horas ═══

// ═══ 5. INICIO ═══

async function iniciar() {
    try {
        const actividades = await obtenerActividades();
        const disponibles = filtrarDisponibles(actividades, obtenerHoy());

        if (disponibles.length === 0) {
            renderMensajeDestacadas('Por ahora no hay actividades disponibles. Vuelve pronto.');
            return;
        }

        renderDestacadas(elegirAleatorias(disponibles, CANTIDAD_DESTACADAS));
    } catch (error) {
        console.error(error);
        renderMensajeDestacadas('No pudimos cargar las actividades. Intenta recargar la página.');
    }
}

iniciar();