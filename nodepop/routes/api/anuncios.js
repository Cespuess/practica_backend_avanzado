var express = require('express');
const path = require('path');
const fs = require('fs');
var router = express.Router();
const upload = require('../../lib/uploadConfigure');
const Anuncio = require('../../models/Anuncio');
const { listado } = require('../../lib/utils');
const { validationResult } = require('express-validator');
const { valQuery } = require('../../lib/validaciones');
const createThumbnail = require('../../lib/requesterThumbnail');
const { CreateAd } = require('../../lib/validationsFunctions');

// GET users listing

// devuelve una lista de anuncios entera o con filtros
router.get(
  '/',
  [
    valQuery.precio,
    valQuery.venta,
    valQuery.tags,
    valQuery.precioMin,
    valQuery.precioMax,
    valQuery.nombre
  ],
  async function (req, res, next) {
    try {
      validationResult(req).throw(); // lanza el error si alguna validación no ha pasado
      const anuncios = await listado(req, Anuncio);
      res.json({ resultados: anuncios });
    } catch (error) {
      next(error);
    }
  }
);

// devuelve la lista de tags disponibles
router.get('/listatags', function (req, res, next) {
  const tagsDisponibles = ['work', 'lifestyle', 'motor', 'mobile'];
  res.json({ resultado: tagsDisponibles });
});

// POST /api/anuncios

// crear un anuncio
router.post('/', upload.single('foto'), CreateAd, async (req, res, next) => {
  try {
    validationResult(req).throw();
    if (!req.file)
      throw new Error('Hay que incluir una foto para la creación del anuncio');

    const data = req.body;
    data.owner = req.apiUserId;
    data.foto = req.file.filename;

    // creamos una instancia del anuncio
    const anuncio = new Anuncio(data);

    // lo guardamos en la BD
    const anuncioGuardado = await anuncio.save();

    createThumbnail(data.foto, anuncioGuardado.id);

    res.json({ anuncioCreado: anuncioGuardado });
  } catch (error) {
    // si finalmente el anuncio no se crea correctamente, eliminamos la imagen subida
    if (req.file) {
      const pathFile = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'assets',
        'img',
        'ads',
        req.file.filename
      );
      fs.unlinkSync(pathFile);
    }
    next(error);
  }
});

// DELETE /api/anuncios/<_id>
// Eliminar un anuncio
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const producto = await Anuncio.find({ _id: id });
    // borrado de las imágenes
    const sharedPath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'assets',
      'img',
      'ads'
    );
    const pathDeleteFoto = path.join(sharedPath, producto[0].foto);
    const pathDeleteThumbnail = path.join(sharedPath, producto[0].thumbFoto);
    fs.unlinkSync(pathDeleteFoto);
    fs.unlinkSync(pathDeleteThumbnail);

    await Anuncio.deleteOne({ _id: id });
    res.json({ productoEliminado: producto[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
