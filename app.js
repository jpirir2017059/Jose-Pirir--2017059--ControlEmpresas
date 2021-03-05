'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var empresaRoutes = require('./routes/empresa.routes');
var empleadoRoutes = require('./routes/empleado.routes');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', empresaRoutes);
app.use('/api', empleadoRoutes);

module.exports = app;