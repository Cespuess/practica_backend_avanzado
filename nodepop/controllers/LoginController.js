const { Usuario } = require('../models');

class LoginController {
  index(req, res, next) {
    res.locals.email = '';
    res.locals.error = '';
    res.render('login', { title: 'Nodepop' });
  }

  async post(req, res, next) {
    try {
      const { email, password } = req.body;
      const usuario = await Usuario.findOne({ email: email });

      // si no lo encuentra o la contraseña no coincide
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.locals.email = email;
        res.locals.error = 'Usuario / Contraseña no válidos';
        return res.render('login', { title: 'Nodepop' });
      }

      req.session.userId = usuario._id;

      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }

  logout(req, res, next) {
    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }
      res.redirect('/login');
    });
  }
}

module.exports = LoginController;
