'use strict'

var express = require('express');
var empleadoControler = require('../controlers/empleado.controler');
var mdAuth = require('../middlewares/authenticated')

var api = express.Router();

api.put('/setEmpleado/:id', mdAuth.ensureAuth, empleadoControler.setEmpleado);//funciona
api.put('/:idEmpresa/updateEmpleado/:idEmpleado', mdAuth.ensureAuth, empleadoControler.updateEmpleado);//funciona
api.put('/:idEmpresa/removeEmpleado/:idEmpleado', mdAuth.ensureAuth, empleadoControler.removeEmpleado);//funciona
module.exports = api;