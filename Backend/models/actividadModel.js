"use strict";

const mongoose = require("mongoose");

const actividadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    cupos: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Actividad", actividadSchema, "actividades");