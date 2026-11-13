
"use strict";

const titulo = document.querySelector('#titulo');
titulo.textContent = "Nueva Inscripcion";

const formulario = document.querySelector('#form-inscripcion');
const selectActividad = document.querySelector('#actividad');
const mensajeFormulario = document.querySelector('#mensaje-formulario');

const inputNombre = document.querySelector('#nombre');
const inputCorreo = document.querySelector('#correo');
const inputTelefono = document.querySelector('#telefono');
const inputMotivacion = document.querySelector('#motivacion');
const inputConfirmacion = document.querySelector('#terminos');

let actividades = [];

selectActividad.addEventListener('change', () => {

    console.log('La actividad cambio');
});

formulario.addEventListener('submit', event => {

    event.preventDefault();

    let error = validar();

    if (error !== "") {

        Swal.fire({
            "icon": "error",
            "title": "Error en el registro",
            "text": error,
            "confirmButtonText": "Aceptar",
            "confirmButtonColor": '#d33'
        });

        return;

    } else {

        let inscripcion = {
            "nombre": inputNombre.value.trim(),
            "correo": inputCorreo.value.trim(),
            "telefono": inputTelefono.value,
            "idActividad": selectActividad.value,
            "motivacion": inputMotivacion.value.trim()
        };

        console.log(inscripcion);
        console.log(JSON.stringify(inscripcion));

        Swal.fire({
            "icon": "success",
            "title": "Registro Exitoso",
            "text": "La información de la inscripción fue procesada correctamente.",
            "confirmButtonText": "Aceptar",
            "confirmButtonColor": 'rgba(63, 255, 101, 1)'
        });
    }
});


function validar() {

    let nombre = inputNombre.value.trim();
    let correo = inputCorreo.value.trim();
    let telefono = inputTelefono.value;
    let motivacion = inputMotivacion.value.trim();
    let idActividad = selectActividad.value;

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[0-9]{8}$/;

    if (nombre === "" || nombre.length < 3) {

        inputNombre.classList.add("error");

        return "El nombre es obligatorio y debe tener al menos 3 caracteres.";

    } else {

        inputNombre.classList.remove("error");
    }


    if (correo === "" || !regexCorreo.test(correo)) {

        inputCorreo.classList.add("error");

        return "Ingrese un correo electrónico válido.";

    } else {

        inputCorreo.classList.remove("error");
    }


    if (!regexTelefono.test(telefono)) {

        inputTelefono.classList.add("error");

        return "El teléfono debe contener exactamente 8 dígitos.";

    } else {

        inputTelefono.classList.remove("error");
    }


    let actividadValida = actividades.find(actividad => {

        return actividad.id === Number(idActividad) &&
            actividad.activa === true &&
            actividad.cuposDisponibles > 0;
    });

    if (idActividad === "" || !actividadValida) {

        selectActividad.classList.add("error");

        return "Debe seleccionar una actividad válida con cupos disponibles.";

    } else {

        selectActividad.classList.remove("error");
    }


    if (motivacion.length < 20) {

        inputMotivacion.classList.add("error");

        return "La motivación debe contener al menos 20 caracteres.";

    } else {

        inputMotivacion.classList.remove("error");
    }

    if (!inputConfirmacion.checked) {

        inputConfirmacion.classList.add("error");

        return "Debe confirmar que la información ingresada es correcta.";

    } else {

        inputConfirmacion.classList.remove("error");
    }

    return "";
};


async function cargarActividades() {

    try {

        const respuesta = await fetch('data/actividades.json');

        if (!respuesta.ok) {

            throw new Error('No fue posible cargar las actividades');
        }

        actividades = await respuesta.json();

        let actividadesDisponibles = actividades.filter(actividad => {

            return actividad.activa === true && actividad.cuposDisponibles > 0;
        });

        selectActividad.innerHTML = `
            <option value="">
                Seleccione una actividad
            </option>
        `;

        actividadesDisponibles.forEach(actividad => {

            let opcion = `
                <option value="${actividad.id}">
                    ${actividad.nombre}
                </option>
            `;

            selectActividad.innerHTML += opcion;
        });


    } catch (error) {

        console.log(error);

        Swal.fire({
            "icon": "error",
            "title": "Error al cargar actividades",
            "text": "No fue posible cargar las actividades disponibles.",
            "confirmButtonText": "Aceptar",
            "confirmButtonColor": '#d33'
        });
    }
};


cargarActividades();