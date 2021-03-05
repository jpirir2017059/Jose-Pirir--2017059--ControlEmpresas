'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3200;
var createAdmin = require('./controlers/empresa.controler')

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/ControlEmpresas', {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log('El servidor de NodeJS se conecta de manera correcta a la DB.')
    createAdmin.createAdmin();
    app.listen(port, ()=>{
        console.log('El servidor de express está funcionando correctamente');
    })
})
    .catch((err)=>{
        console.log('Error al conectarse a la BD.', err);
    
})