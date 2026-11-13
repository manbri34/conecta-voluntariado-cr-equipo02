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

// Crea una etiqueta con clase y texto
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

function crearTarjetaActividad(actividad) {
    const tarjeta = crearElemento('article', 'tarjeta-actividad');

    // Bloque de imagen
    const wrapperImagen = crearElemento('div', 'tarjeta-imagen-wrapper');
    if (actividad.imagen) {
        const img = document.createElement('img');
        img.src = actividad.imagen;
        img.alt = '';            // decorativa: el título ya describe la actividad
        img.loading = 'lazy';
        wrapperImagen.append(img);
    }
    wrapperImagen.append(crearElemento('span', 'categoria-badge', actividad.categoria));

    // Bloque de información
    const wrapperInfo = crearElemento('div', 'tarjeta-info-wrapper');
    if (actividad.organizacion) {
        wrapperInfo.append(crearElemento('span', 'organizacion-nombre', actividad.organizacion));
    }
    wrapperInfo.append(crearElemento('h3', 'actividad-titulo', actividad.nombre));

    // Ubicación y fecha
    const meta = crearElemento('div', 'actividad-detalles-meta');
    meta.append(
        crearElemento('p', 'detalle-item', actividad.ubicacion),
        crearElemento('p', 'detalle-item', formatearFecha(actividad.fecha))
    );

    // Enlace
    const enlace = crearElemento('a', 'link-ver-actividad', 'Ver actividad');
    enlace.href = `actividades.html?id=${actividad.id}`;
    enlace.setAttribute('aria-label', `Ver actividad: ${actividad.nombre}`);

    // Cupos y enlace
    const fila = crearElemento('div', 'tarjeta-footer-fila');
    fila.append(
        crearElemento('span', 'cupos-info', textoCupos(actividad.cuposDisponibles)),
        enlace
    );

    wrapperInfo.append(meta, crearElemento('hr', 'linea-divisoria'), fila);
    tarjeta.append(wrapperImagen, wrapperInfo);
    return tarjeta;
}

function renderDestacadas(actividades) {
    const tarjetas = actividades.map(actividad => crearTarjetaActividad(actividad));
    elGridDestacadas.replaceChildren(...tarjetas);
}

function renderMensajeDestacadas(texto) {
    elGridDestacadas.replaceChildren(crearElemento('p', 'mensaje-estado', texto));
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