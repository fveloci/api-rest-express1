const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const logger = require("./logger");
const config = require('config');
const express = require('express');
const morgan = require('morgan');
const Joi = require('joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// Middleware de tercero
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan allowed');
}


// DATABASE jobs
debug("Conectando con la base de datos")

// Config entornos
console.log('Application: ' + config.get('nombre'))
console.log('BD server: ' + config.get('configDB.host'))

/*app.use(function(req, res, next){
    console.log("Logging...");
    next();
});*/

//app.use(logger);

const usuarios = [
    {id: 1, nombre: "Pepe"},
    {id: 2, nombre: "Tito"},
    {id: 3, nombre: "pipo"}
]

app.get('/', (req, res) => {
    res.send('Hola desde express');
});
app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
})

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = userExist(req.params.id);
    if(!usuario) res.status(404).send('User not found')
    res.send(usuario);
})

app.post('/api/usuarios', (req, res) => {    
    
    
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

app.put('/api/usuarios/:id', (req, res) => {
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

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = userExist(req.params.id);
    if(!usuario){
        res.status(404).send('User not found');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando puerto ${port}...`);
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