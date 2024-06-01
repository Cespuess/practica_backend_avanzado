const { Anuncio } = require('../models');
const { listado } = require('../lib/utils');
const { validationResult } = require('express-validator');

class AdsController {
  async index(req, res, next) {
    try {
      validationResult(req).throw();
      const anuncios = await listado(req, Anuncio);
      res.render('index', {
        title: 'Nodepop',
        anuncios: anuncios,
        error: false
      });
    } catch (error) {
      if (error.array) {
        const errorInfo = error.array({})[0];
        error.message = `Campo no válido - ${errorInfo.type} ${errorInfo.path} in ${errorInfo.location} ${errorInfo.msg}`;
        error.status = 422;
      }

      res.render('index', { title: 'Nodepop', error: error });
    }
  }
}
module.exports = AdsController;
