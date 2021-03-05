'use strict'

var Empresa = require('../models/empresa.model');
var Empleado = require('../models/empleado.model');

function setEmpleado(req, res){
    var empresaId = req.params.id;
    var params = req.body;
    var empleado = new Empleado();

    if(empresaId != req.empresa.sub){
        return res.status(500).send({message: 'No tiene los permisos necesarios'})
    }else{
        Empresa.findById(empresaId, (err, empresaFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(empresaFind){
                empleado.name = params.name;
                empleado.puesto = params.puesto;
                empleado.departamento = params.departamento;

                empleado.save((err, empleadoSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar al empleado'})
                    }else if(empleadoSaved){
                        Empresa.findByIdAndUpdate(empresaId, {$push: {empleados: empleadoSaved._id}}, {new: true}, (err, empleadoPush)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al agregar empleado'})
                            }else if(empleadoPush){
                                res.send({message: 'Empleado agregado', empleadoPush})
                            }else{
                                return res.status(500).send({message: 'No se guardó el empleado'})
                            }
                        })
                    }else{
                        return res.status(500).send({message: 'No se guardo el empleado'})
                    }
                })
            }else{
                return res.status(500).send({message: 'La empresa no existe'})
            }
        })
    }
}

function updateEmpleado(req, res){
    let empresaId = req.params.idEmpresa;
    let empleadoId = req.params.idEmpleado;
    let update = req.body;

    if(empresaId != req.empresa.sub){
        return res.status(500).send({message: 'No tiene permiso para realizar esta accion'})
    }else{
        if(update.name && update.departamento){
            Empleado.findById(empleadoId, (err, empleadoFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(empleadoFind){
                    Empresa.findOne({_id: empresaId, empleados: empleadoId}, (err, empresaFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error genereal al buscar'})
                        }else if(empresaFind){
                            Empleado.findByIdAndUpdate(empleadoId, update, {new: true} ,(err, empleadoUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'})
                                }else if(empleadoUpdated){
                                    return res.send({message: 'Empleado actualizado', empleadoUpdated})
                                }else{
                                    return res.status(404).send({message: 'Empleado no actualizado'})
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'Empresa no encontrada'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Empleado a actualizar inexistente'})
                }
            })
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos minimos para actualizar (nombre y departamento)'})
        }
    }

}

function removeEmpleado(req, res){
    let empresaId = req.params.idEmpresa;
    let empleadoId = req.params.idEmpleado;

    if(empresaId != req.empresa.sub){
        return res.status(500).send({message: 'No tiene permiso para realizar esta acción'})
    }else{
        Empresa.findOneAndUpdate({_id: empresaId, empleados: empleadoId},
            {$pull:{empleados: empleadoId}}, {new: true}, (err, empleadoPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(empleadoPull){
                    Empleado.findByIdAndRemove(empleadoId, (err, empleadoRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar empleado'})
                        }else if(empleadoRemoved){
                            res.send({message: 'Empleado eliminado'})
                        }else{
                            return res.status(500).send({message: 'Empleado ya eliminado o no se pudo eliminar'})
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar el empleado'})
                }
            })
    }
}

/*function searchEmpleado(req, res){
    var params = req.body;
    let empresaId =  req.parms.idEmpresa;

    if(empresaId == req.params.idEmpleado){
    if(params.search){
        Empresa.Empleado.find({$or:[{name: params.search.toLowerCase()},
                            {departamento: params.search.toLowerCase()},
                            {puesto: params.search.toLowerCase()}]}, (err, resultSearch)=>{
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
}else{
    return res.status(500).send({message: 'No tiene permiso para realizar esta acción'})
}
}*/

module.exports = {
    setEmpleado,
    updateEmpleado,
    removeEmpleado
}