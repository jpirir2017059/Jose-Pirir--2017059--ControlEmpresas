'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var empresaSchema = Schema({
    username: String,
    email: String,
    password: String,
    empleados: [{type: Schema.ObjectId, ref: 'empleado'}]
});

module.exports = mongoose.model('empresa', empresaSchema);