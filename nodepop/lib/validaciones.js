'use strict';

const { query, body } = require('express-validator');

// Validadores query----------------------------------------------------------------------------------------
const valQuery = {
  // Validar que el precio, precio_min y precio_max sea numérico
  precio: query('precio')
    .isNumeric()
    .optional()
    .withMessage('Tiene que ser numérico.'),
  precioMin: query('precio_min')
    .isNumeric()
    .optional()
    .withMessage('Tiene que ser numérico.'),
  precioMax: query('precio_max')
    .isNumeric()
    .optional()
    .withMessage('Tiene que ser numérico.'),

  // Validar que "venta" sea bool
  venta: query('venta')
    .isBoolean()
    .optional()
    .withMessage('Tiene que ser true o false'),

  // Validar nombre
  nombre: query('nombre')
    .optional()
    .notEmpty()
    .withMessage('Tienes que poner algo como nombre a buscar.'),

  // No dejar buscar por fields
  noFieldsWeb: query('fields')
    .not()
    .exists()
    .withMessage('Esta opción no está disponible en la web, solo en la API.'),

  // Validar tags que esten en la lista
  tags: query('tags')
    .optional()
    .isIn(['lifestyle', 'mobile', 'motor', 'work'])
    .withMessage(
      'El tag tiene que ser uno de los siguientes: work, lifestyle, motor, mobile.'
    )
};

// Validadores body------------------------------------------------------------------------------------------------------
const valBody = {
  // Validamos tags que esten en la lista en peticiones
  tags: body('tags')
    .notEmpty()
    .withMessage('Tienes que poner al menos un tag al anuncio')
    .isIn(['lifestyle', 'mobile', 'motor', 'work'])
    .withMessage(
      'El tag tiene que ser uno de los siguientes: work, lifestyle, motor, mobile.'
    ),

  // Validar nombre
  nombre: body('nombre')
    .notEmpty()
    .withMessage('El producto tiene que tener un nombre.'),

  // Validar que "venta" sea bool
  venta: body('venta')
    .isBoolean()
    .withMessage('El valor del campo Venta tiene que ser true o false.'),

  // Validar precio
  precio: body('precio')
    .isNumeric()
    .withMessage('El precio tiene que ser un número.')
};

module.exports = { valBody, valQuery };
