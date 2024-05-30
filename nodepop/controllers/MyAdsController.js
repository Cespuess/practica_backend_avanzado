const { Anuncio, Usuario } = require('../models');

class MyAdsController {
  async index(req, res, next) {
    try {
      const userId = req.session.userId;
      const user = await Usuario.find({ _id: userId });
      const anuncios = await Anuncio.find({ owner: userId });
      const userName = user[0].email.split('@')[0];
      res.render('myAds', {
        title: 'Nodepop',
        anuncios,
        userName,
        error: false
      });
    } catch (error) {
      res.render('myAds', { title: 'Nodepop', error: error });
    }
  }
}

module.exports = MyAdsController;
