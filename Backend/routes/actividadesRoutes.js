"use strict";

const express = require('express');
const router = express.Router();

const Actividad = require("../models/actividadModel");

router.get("/actividades", async (req, res) => {
    try {
        const actividades = await Actividad.find();
        res.json(actividades);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al consultar actividades"
        });
    }
});

//http:localhost:3000/api/actividades
router.get("/actividades/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let actividad = await Actividad.findById(id);

        if (!actividad) {
            return res.status(404).json({
                mensaje: 'Actividad no encontrada'
            });
        }

        res.json(actividad);

    } catch (error) {
        res.status(error.name === "CastError" ? 400 : 500)
            .json({
                mensaje: "Error al consultar la actividad"
            });
    }

});

router.post('/actividad', async (req, res) => {
    try {

        let actividad = new Actividad({
            nombre: req.body.nombre,
            ubicacion: req.body.ubicacion,
            cupos: req.body.cupos
        });

        await actividad.save();

        res.status(201).json({
            mensaje: 'Actividad registrada corrrectamente',
            actividad
        });
    } catch (error) {
        res.status(error.name === "validationError" ? 400 : 500)
            .json({
                mensaje: error.message
            });
    }

});

router.put("/actividades/:id", (req, res) => {

    let id = Number(req.params.id);

    let actividad = actividades.find(actividad => actividad.id === id);

    if (actividad) {

        actividad.nombre = req.body.nombre;
        actividad.ubicacion = req.body.ubicacion;
        actividad.cupos = req.body.cupos;

        res.json(actividad);

    } else {
        res.status(404).json({ mensaje: "Actividad no encontrada" });
    }

});

router.delete("/actividades", (req, res) => {

    let id = Number(req.body.id);

    let actividad = actividades.find(actividad => actividad.id === id);

    if (!actividad) {
        return res.status(404).json({
            mensaje: "Actividad no encontrada"
        });
    }

    actividades = actividades.filter(actividad => actividad.id !== id);

    res.json({
        mensaje: "Actividad eliminada correctamente"
    });

});

module.exports = router;



