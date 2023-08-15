const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const logger = require("./logger");
const config = require('config');
const express = require('express');
const morgan = require('morgan');

const usuarios = require('./routes/usuarios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

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


app.get('/', (req, res) => {
    res.send('Hola desde express');
});
app.get('/code', (res, res, next) => {
    res.send('CODE: 500');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando puerto ${port}...`);
    console.log(`Puerto ${port} probando commit`);
})

