const express = require('express');
const Joi = require('joi');
const routes = express.Router();


const usuarios = [
    {id: 1, nombre: "Pepe"},
    {id: 2, nombre: "Tito"},
    {id: 3, nombre: "pipo"}
]


routes.get('/', (req, res) => {
    res.send(usuarios);
})

routes.get('/', (req, res) => {
    let usuario = userExist(req.params.id);
    if(!usuario) res.status(404).send('User not found')
    res.send(usuario);
})

routes.post('/', (req, res) => {    
    
    
    const {error, value} = validateUser(req.body.nombre)

    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario)
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
    /*if(!req.body.nombre || req.body.nombre.length <= 2) {
        res.status(400).send('Must enter a name, min 3 characters');
        return;
    }

    */
})

routes.put('/:id', (req, res) => {
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = userExist(req.params.id)
    if(!usuario) {
        res.status(404).send('User not found')
        return;
    }
   
    const {error, value} = validateUser(req.body.nombre)

    if(error){       
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
})

routes.delete('/:id', (req, res) => {
    let usuario = userExist(req.params.id);
    if(!usuario){
        res.status(404).send('User not found');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
})


function userExist(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validateUser(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(30).required()
    })
    return (schema.validate({nombre: nom}));
}

module.exports = routes;