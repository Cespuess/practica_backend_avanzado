'use strict';

const connection = require('./lib/connectMongoose');
const Anuncio = require('./models/Anuncio');
const {pregunta} = require('./lib/utils');
const path = require('path');
const { URL } = require('url');
const fs = require('fs').promises;


async function main() {
  // Espera a que se conecte a la base de datos para reinicializar la BBDD
  try {
    // esperar a que se conecte a la BBDD
    await new Promise((resolve) => connection.once('open', resolve));
  
    // hacer la pregunta para no borrar todos los documentos por error
    const borrar = await pregunta('Estas seguro que quieres borrar el contenido de esta BD (no): ');
    if (!borrar) {
      process.exit();
    }
  
    await inicializaAnuncios();
  
    // cerramos la conexión con la BBDD
    connection.close();    
  } catch (error) {
    console.log('Hubo un error', error);
  }
}

async function inicializaAnuncios() {
  // Reinicializará la BBDD 

  // primero borrarmos todos los documento que pueda haber en la BBDD y mostramos en consola el número de documentos eliminados
  const eliminados = await Anuncio.deleteMany();
  console.log(`Eliminados ${eliminados.deletedCount} anuncios`);

  // importamos los anuncios iniciales y mostramos en consola la cantidad de documentos creados  
  const insertados = await Anuncio.insertMany(await getAnuncios());
  console.log(`Creados ${insertados.length} anuncios`);
}

async function getAnuncios() {
    const directorioActual = __dirname;
    const url = new URL(`file:/${path.join(directorioActual, 'lib', 'anuncios.json')}`);
    const data = await fs.readFile(url, 'utf8');
    const result = JSON.parse(data);
    return result.anuncios;  
}


// ---------------------------------------------------------------------

main()