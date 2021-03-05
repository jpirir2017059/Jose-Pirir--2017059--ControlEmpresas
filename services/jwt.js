'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = ('encriptación-PirirRomero');

exports.createToken = (empresa)=>{
    var payload = {
        sub: empresa._id,
        username: empresa.username,
        email: empresa.email,
        iat: moment().unix(),
        exp: moment().add(2, 'hours').unix()
    }
    return jwt.encode(payload, secretKey);
}