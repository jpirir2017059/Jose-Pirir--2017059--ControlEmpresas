'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptación-PirirRomero';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no lleva cabecera de autenticación'})
    }else{
        var token = req.headers.authorization.replace(/['"']+/g,'');

        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'})
            }
        }catch(err){
            return res.status(401).send({message: 'Token no valido'})
        }
        req.empresa = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no lleva cabecera de autenticación'})
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');

        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token ha expirado'})
            }
            if(payload.username != 'admin'){
                return res.status(401).send({message: 'No tienes permiso para acceder a esta ruta'})
            }
        }catch(err){
            return res.status(404).send({message: 'Token inválido'})
        }

        req.empresa = payload;
        next();
    }
}