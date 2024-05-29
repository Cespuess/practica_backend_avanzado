'use strict';
require('dotenv').config();

const connection = require('./lib/connectMongoose');
const { Anuncio, Usuario } = require('./models');
const { pregunta } = require('./lib/utils');
const path = require('path');
const { URL } = require('url');
const fs = require('fs').promises;

async function main() {
  // Espera a que se conecte a la base de datos para reinicializar la BBDD
  try {
    // esperar a que se conecte a la BBDD
    await new Promise((resolve) => connection.once('open', resolve));

    // hacer la pregunta para no borrar todos los documentos por error
    const borrar = await pregunta(
      'Estas seguro que quieres borrar el contenido de esta BD (no): '
    );
    if (!borrar) {
      process.exit();
    }

    await inicializaUsuarios();
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

  const [administrador, cliente] = await Promise.all([
    Usuario.findOne({ email: 'administrador@example.com' }),
    Usuario.findOne({ email: 'cliente@example.com' })
  ]);
  const insertados = await Anuncio.insertMany([
    {
      nombre: 'Móvil OPPO A78',
      venta: true,
      precio: 199,
      foto: 'oppo_a78.jpg',
      tags: ['mobile', 'work'],
      owner: administrador._id
    },
    {
      nombre: 'Móvil Iphone 13',
      venta: false,
      precio: 949,
      foto: 'iphone_13.jpg',
      tags: ['mobile', 'work'],
      owner: cliente._id
    },
    {
      nombre: 'Bambas Munich Mini Track',
      venta: true,
      precio: 30,
      foto: 'munich_mini_track.jpg',
      tags: ['lifestyle'],
      owner: administrador._id
    },
    {
      nombre: 'Portátil Acer Nitro',
      venta: true,
      precio: 949,
      foto: 'acer_nitro.jpg',
      tags: ['work'],
      owner: cliente._id
    },
    {
      nombre: 'Logitech Marathon Mouse',
      venta: false,
      precio: 42.99,
      foto: 'marathon_mouse.jpg',
      tags: ['work'],
      owner: administrador._id
    },
    {
      nombre: 'Fiat 500',
      venta: true,
      precio: 14800,
      foto: 'fiat_500.jpg',
      tags: ['motor'],
      owner: cliente._id
    },
    {
      nombre: 'Pantalones tejanos talla: 44',
      venta: false,
      precio: 15,
      foto: 'tejanos.jpg',
      tags: ['lifestyle'],
      owner: administrador._id
    },
    {
      nombre: 'Honda Civic',
      venta: false,
      precio: 12350,
      foto: 'honda_civic.jpg',
      tags: ['motor'],
      owner: cliente._id
    },
    {
      nombre: 'Móvil Samsung A14',
      venta: true,
      precio: 450,
      foto: 'samsung_a14.jpg',
      tags: ['mobile'],
      owner: administrador._id
    },
    {
      nombre: 'Camiseta blanca talla XL',
      venta: false,
      precio: 5.5,
      foto: 'camiseta_blanca.jpg',
      tags: ['lifestyle'],
      owner: cliente._id
    },
    {
      nombre: 'Teclado mecánico EASYTAO',
      venta: true,
      precio: 220,
      foto: 'teclado.jpg',
      tags: ['lifestyle'],
      owner: administrador._id
    }
  ]);
  console.log(`Creados ${insertados.length} anuncios`);
}

async function inicializaUsuarios() {
  // borrar todos los usuarios
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear usuarios iniciales
  const inserted = await Usuario.insertMany([
    {
      email: 'administrador@example.com',
      password: await Usuario.hashPassword('1234')
    },
    {
      email: 'cliente@example.com',
      password: await Usuario.hashPassword('1234')
    }
  ]);
  console.log(`Creados ${inserted.length} usuarios.`);
}

// ---------------------------------------------------------------------

main();
