const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

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
        res.locals.error = res.__('Usuario / Contraseña no válidos');
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

  async postApiToken(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await Usuario.findOne({ email });

      if (!user || !(await user.comparePassword(password)))
        return res.json({ error: 'invalid credentials' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
      });

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoginController;
