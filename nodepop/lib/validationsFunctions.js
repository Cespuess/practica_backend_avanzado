const { valBody, valQuery } = require('./validaciones');

const validations = {
  AdsSearchParams: [
    valQuery.precio,
    valQuery.venta,
    valQuery.tags,
    valQuery.precioMin,
    valQuery.precioMax,
    valQuery.nombre,
    valQuery.noFieldsWeb
  ],
  CreateAd: [valBody.nombre, valBody.venta, valBody.precio, valBody.tags]
};

module.exports = validations;
