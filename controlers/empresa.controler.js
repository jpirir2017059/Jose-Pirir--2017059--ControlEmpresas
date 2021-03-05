'use strict'


var Empresa = require('../models/empresa.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var pdf = require('html-pdf');
var Empleado = require('../models/empleado.model');
const e = require('express');

function pruebaControlador(req, res){
    res.status(200).send({message: ':D'})
}
    
function saveEmpresa(req, res){
    var empresa = new Empresa();
    var params = req.body;

    if(params.username.toLowerCase() && params.password && params.email.toLowerCase()){
        Empresa.findOne({username: params.username.toLowerCase()}, (err, empresaFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'});
        }else if(empresaFind){
            return res.send({message: 'Username ya utilizado'});
        }else{
            bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error general en el servidor'});
                }else if(passwordHash){
                    empresa.password = passwordHash;
                    empresa.username = params.username.toLowerCase();
                    empresa.email = params.email.toLowerCase();
                    empresa.save((err, empresaSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general en el servidor'})
                        }else if(empresaSaved){
                            return res.send({message: 'Empresa guardada', empresaSaved})
                        }else{
                            return res.status(500).send({message: 'No se pudo guardar la empresa'})
                        }
                    })
                }else{
                    return res.status(401).send({message: 'Contraseña no encriptada'})
                }
            })
        }
        })
}else{
    return res.send({message: 'Ingrese los datos obligatorios (username, email y contraseña)'})
}
}

function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        Empresa.findOne({username: params.username.toLowerCase()}, (err, empresaFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'})
            }else if(empresaFind){
                bcrypt.compare(params.password, empresaFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la verificación de contraseña'})
                    }else if(checkPassword){
                        if(params.gettoken){
                            return res.send({token: jwt.createToken(empresaFind)})
                        }else{
                            return res.send({message: 'Usuario logeado'})
                        }
                    }else{
                        return res.status(404).send({message: 'Contraseña incorrecta'})
                    }
                })
            }else{
                return res.send({message: 'Usuario no encontrado'})
            }
        })
    }else{
        return res.status(500).send({message: 'Ingrese los datos obligatorios'})
    }
}

function createAdmin(req, res){
    let empresa = new Empresa();
    empresa.username = 'admin';
    empresa.password = '12345';

    Empresa.findOne({username: empresa.username}, (err, empresaFind)=>{
        if(err){
            console.log('Error al crear admin')
        }else if(empresaFind){
            console.log('Admin ya creado');
        }else{
            bcrypt.hash(empresa.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error general en el servidor'});
                }else if(passwordHash){
                    empresa.password = passwordHash;
                    empresa.username = empresa.username;
                    empresa.save((err, empresaSaved)=>{
                        if(err){
                            console.log('Error general en el servidor')
                        }else if(empresaSaved){
                            console.log('Admin creado')
                        }else{
                            return res.status(500).send({message: 'No se pudo guardar la empresa'})
                        }
                    })
                }else{
                    return res.status(401).send({message: 'Contraseña no encriptada'})
                }
            })
        }
    })
}

function updateEmpresa(req, res){
    let empresaId = req.params.id;
    let update = req.body;

    if('admin' != req.empresa.username && empresaId != req.empresa.sub  ){
        return res.status(401).send({message: 'No tiene permiso para realizar esta acción'})
    }else{

    if(update.password){
        return res.status(401).send({message: 'No se puede actualizar la contraseña desde esta función'})
    }else{

    if(update.username){
        Empresa.findOne({username: update.username.toLowerCase()}, (err, empresaFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(empresaFind){
                return res.send({message: 'Nombre de empresa ya en uso'})
            }else{
                Empresa.findByIdAndUpdate(empresaId, update, {new: true}, (err, empresaUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(empresaUpdated){
                        return res.send({message: 'Empresa actualizada', empresaUpdated})
                    }else{
                        return res.send({message: 'No se pudo actualizar la empresa'})
                    }
            })
        }
        })
    }else{
        Empresa.findByIdAndUpdate(empresaId, update, {new: true}, (err, empresaUpdated)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(empresaUpdated){
                return res.send({message: 'Empresa actualizada', empresaUpdated})
            }else{
                return res.send({message: 'No se pudo actualizar el usuario'})
            }
        })
    }
}
}
}

function removeEmpresa(req, res){
    let empresaId = req.params.id;
    let params = req.body;

    if('admin' != req.empresa.username && empresaId != req.empresa.sub ){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        Empresa.findOne({_id: empresaId}, (err, empresaFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al eliminar'});
            }else if(empresaFind){
                bcrypt.compare(params.password, empresaFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al verificar contraseña'});
                    }else if(checkPassword){
                        Empresa.findByIdAndRemove(empresaId, (err, empresaRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(empresaRemoved){
                                return res.send({message: 'Empresa eliminada'});
                            }else{
                                return res.status(403).send({message: 'Empresa no eliminada'});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'Contraseña incorrecta, no puedes eliminar la cuenta de la empresa sin la contraseña'});
                    }
                })
            }else{
                return res.status(403).send({message: 'Usuario no eliminado'});
            } 
        })
    }
}

function getEmpresas(req, res){
    Empresa.find({}).populate('empleados').exec((err, empresas)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'})
        }else if(empresas){
            return res.send({message: 'Empresas: ', empresas})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

function search(req, res){
    var params = req.body;

    if(params.search){
        Empresa.find({$or:[{username: params.search.toLowerCase()},
                            {email: params.search.toLowerCase()}]}, (err, resultSearch)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'})
                                }else if(resultSearch){
                                    return res.send({message: 'Coincidencias encontradas: ', resultSearch})
                                }else{
                                    return res.status(403).send({message: 'Busqueda sin resultados'})
                                }
                            })
    }else{
        return res.status(403).send({message: 'Ingrese los datos en el campo de busqueda'})
    }
}

function empresaPdf (req, res){
    let empresaId = req.params.id;

    if(empresaId == req.empresa.sub){
    Empresa.findOne({_id: empresaId}).populate().exec((err, empresaFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al crear pdf'})
        }else if(empresaFind){
            let empleados = empresaFind.empleados;
            let empleadosEncontrados = [];
            var empleadosPdf = [];
            empleados.forEach(dato =>{
                empleadosEncontrados.push(dato);
            })
            console.log(empleadosEncontrados);

            empleadosEncontrados.forEach(dato => {
                Empleado.find({_id: dato}).exec((err, empleadoEncontrado)=>{
                    if(err){
                        console.log(err);
                    }else if(empleadosEncontrados.length > 0){
                        let empleados = empleadoEncontrado;
                        empleados.forEach(dato =>{
                            empleadosPdf.push(dato);
                        })

            let contenido = `
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                    <title>PDF</title>
                </head>
                <body>
                <table border="1" style="margin: 0 auto; ">
                <tbody>
                    <tr>
                        <th style="font-size: 25px"> Nombre </th>
                        <th style="font-size: 25px"> Departamento </th>
                        <th style="font-size: 25px"> Puesto </th>
                    </tr>
                    ${empleadosPdf.map(empleados => 
                        `<tr><td "font-size: 15px">${empleados.name}</td>
                             <td "font-size: 15px">${empleados.departamento}</td>
                             <td "font-size: 15px">${empleados.puesto}</td></tr>`).join(' ')}
                </tbody>    
                </table>        
                </body>
            </html>
            `;

            let opciones = {
                "header": {
                    "height": "60px",
                    
                    "contents": `<div style="text-align: center; background-color:#a0dcef; font-size:40px">`  + empresaFind.username + `</div>` 
                }
            }

            pdf.create(contenido, opciones).toFile('./PDF/Empleados' + empresaFind.username + `.pdf`, (err, res)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(res);
                }
            })
        }else{
            return res.status(403).send({message: 'No se entontraron contactos'})
        }
    })
})
res.status(200).send({message: 'El pdf fue creado'})
}else{
    res.status(404).send({message: 'No se encontraron empleados'})
}
    })
}else{
    return res.status(500).send({message: 'No tiene los permisos necesarios'})
}
}

/*
function excelEmpresa(req, res){
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name');


const data = [
 {
    "nombre": empleados.name,
    "departamento": empleados.departamento,
    "puesto": empleados.puesto
 }
]

const headingColumnNames = [
    "Nombre",
    "Departamento",
    "Puesto",
]

//Write Column Title in Excel file
let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});

//Write Data in Excel file
let rowIndex = 2;
data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
}); 
wb.write(empresaFind.username+'.xlsx');
console.log('Excel creado de manera excitosa')
}
*/
module.exports = {
    login,
    createAdmin,
    saveEmpresa,
    pruebaControlador,
    updateEmpresa,
    removeEmpresa,
    getEmpresas,
    search,
    empresaPdf
}