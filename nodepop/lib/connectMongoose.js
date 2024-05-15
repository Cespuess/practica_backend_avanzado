const mongoose = require('mongoose');

// Mensajes en la terminal para comprobar si se ha conectado bien a la BBDD 
mongoose.connection.on('error', err => {
  console.log('Error de conexión', err);
})

mongoose.connection.once('open', () => {
  console.log('Conectado a MongoDB en', mongoose.connection.name);
})

mongoose.connect('mongodb://127.0.0.1:27017/nodepop');

module.exports= mongoose.connection;