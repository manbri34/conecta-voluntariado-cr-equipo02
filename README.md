# ConectaVoluntariado CR

Aplicación web para centralizar la gestión de oportunidades de voluntariado en Costa Rica: organizaciones, actividades, turnos, solicitudes, aprobaciones, asistencia, horas acreditadas y retroalimentación.

## Información del curso

- **Universidad:** Universidad Cenfotec
- **Curso:** SOFT-11 – Proyecto Integrador 1
- **Sección:** SCV1
- **Periodo:** 2026-C3
- **Docente:** Pablo Monestel Gamboa
- **Equipo:** 02

## Integrantes

- Manfred Briceño Sánchez
- Lucía Segura Acuña

## Documentación

- [Especificación de Requisitos de Software (ERS) – v1.0](docs/requirements/ERS-ConectaVoluntariado-Equipo02-v1.0.pdf)
- [Fuente editable de la ERS](docs/requirements/ERS-ConectaVoluntariado-Equipo02-v1.0.docx)
- [Matriz de trazabilidad](docs/requirements/traceability-matrix.md)

## Tecnologías

| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript | Avance 2 (actual) |
| Backend | Node.js, Express | Planificado |
| Persistencia | MongoDB Atlas, Mongoose | Planificado |
| Gestión | GitHub | En uso |

## Versiones

| Tag | Descripción |
|---|---|
| `avance-1` | ERS v1.0 – línea base de requisitos |
| `avance-2` | Frontend con HTML, CSS y JavaScript (sin backend) |

---

## Avance 2 – Frontend

Primera versión funcional del frontend: permite consultar actividades de voluntariado (cargadas desde un JSON) y completar una solicitud de inscripción simulada con validaciones en JavaScript. No usa backend ni base de datos, y los datos no persisten al recargar.

### Cómo ejecutar

1. Clonar el repositorio.
2. Abrir en VS Code la carpeta que contiene `index.html` e instalar la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.

> Debe usarse un servidor local: abrir los HTML con doble clic bloquea `fetch()` sobre el JSON.
> SweetAlert2 se carga por CDN, por lo que se necesita conexión a internet.

### Estructura

```
├── index.html
├── actividades.html
├── inscripcion.html
├── css/        index.css, actividades.css, inscripcion.css
├── js/         utils.js, index.js, actividades.js, inscripcion.js
├── data/       actividades.json
└── img/
```

### Funcionalidades

- **Inicio:** presentación del proyecto, acceso a Actividades e Inscripción y actividades destacadas desde el JSON.
- **Actividades:** tarjetas generadas con `fetch()` y template literals; filtro por categoría y por ubicación (`filter()` y `addEventListener`) con mensaje cuando no hay resultados.
- **Inscripción:** select llenado desde el JSON; validación con `trim()` y expresiones regulares (correo y teléfono de 8 dígitos); mensajes con SweetAlert2; objeto de inscripción en consola (`console.log` y `JSON.stringify`).