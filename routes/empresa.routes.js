'use strict'

var express = require('express');
var empresaControler = require('../controlers/empresa.controler');
var mdAuth = require('../middlewares/authenticated')

var api = express.Router();

/*api.get('/pruebaControlador', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], empresaControler.pruebaControlador); //funciona*/
api.post('/saveEmpresa', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin] ,empresaControler.saveEmpresa); //funciona
api.post('/login', empresaControler.login); //funciona
api.put('/updateEmpresa/:id', [mdAuth.ensureAuth || mdAuth.ensureAuthAdmin], empresaControler.updateEmpresa); //funciona
api.delete('/removeEmpresa/:id', [mdAuth.ensureAuth || mdAuth.ensureAuthAdmin], empresaControler.removeEmpresa); //funciona
api.get('/getEmpresas', mdAuth.ensureAuthAdmin, empresaControler.getEmpresas);//funciona
api.post('/search', mdAuth.ensureAuthAdmin, empresaControler.search);//funciona
api.get('/empresaPdf/:id', mdAuth.ensureAuth, empresaControler.empresaPdf);//funciona

module.exports = api;