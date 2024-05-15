const { valBody, valQuery } = require('./validaciones');

function validationsAdsSearchParams() {
  return [
    valQuery.precio,
    valQuery.venta,
    valQuery.tags,
    valQuery.precioMin,
    valQuery.precioMax,
    valQuery.nombre,
    valQuery.noFieldsWeb
  ];
}

module.exports = { validationsAdsSearchParams };
