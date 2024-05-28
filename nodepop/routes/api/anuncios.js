var express = require('express');
var router = express.Router();
const upload = require('../../lib/uploadConfigure');
const Anuncio = require('../../models/Anuncio');
const { listado } = require('../../lib/utils');
const { validationResult } = require('express-validator');
const { valBody, valQuery } = require('../../lib/validaciones');
const createThumbnail = require('../../lib/requesterThumbnail');

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
router.post('/', upload.single('foto'), async (req, res, next) => {
  try {
    const tagsErrorMsg =
      'Hay que poner almenos un tag de la lista: work, lifestyle, motor, mobile.';
    if (!('tags' in req.body)) {
      throw new Error(tagsErrorMsg);
    } else {
      const arrayTags = ['work', 'lifestyle', 'motor', 'mobile'];
      if (Array.isArray(req.body.tags)) {
        if (!req.body.tags.every((tag) => arrayTags.includes(tag)))
          throw new Error(tagsErrorMsg);
      } else {
        if (!arrayTags.includes(req.body.tags)) throw new Error(tagsErrorMsg);
      }
    }

    const data = req.body;
    data.owner = req.apiUserId;
    data.foto = req.file.filename;

    // creamos una instancia del anuncio
    const anuncio = new Anuncio(data);

    // lo guardamos en la BD
    const anuncioGuardado = await anuncio.save();
    createThumbnail(data.foto);

    res.json({ anuncioCreado: anuncioGuardado });
  } catch (error) {
    next(error);
  }
});

// PUT /api/anuncios/<_id>  (body)
// Modificar un anuncio

router.put(
  '/:id',
  [valBody.tags, valBody.nombre, valBody.venta, valBody.precio, valBody.foto],
  async (req, res, next) => {
    try {
      validationResult(req).throw();
      const id = req.params.id;
      const data = req.body;

      const anuncioActualizado = await Anuncio.findByIdAndUpdate(id, data, {
        new: true
      });

      res.json({ anuncioModificado: anuncioActualizado });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/anuncios/<_id>
// Eliminar un anuncio
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const producto = await Anuncio.find({ _id: id });
    await Anuncio.deleteOne({ _id: id });
    res.json({ productoEliminado: producto[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
