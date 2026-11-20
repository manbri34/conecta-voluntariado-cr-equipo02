"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

require("dotenv").config();

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

const actividadesRoutes = require('./routes/actividadesRoutes');

//Inicio Endpoint temporal

app.use("/api", actividadesRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conectado a MongoDB");

        app.listen(process.env.PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error de conexión: ", error)
    });

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

//En un proyecto nuevo de front-end consuman el endpoint de actividades usando
//fetch y lo muestren en consola