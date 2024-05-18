class LoginController {
  index(req, res, next) {
    res.locals.email = '';
    res.locals.error = '';
    res.render('login', { title: 'Nodepop' });
  }

  post(req, res, next) {
    try {
      const { email, password } = req.body;
    } catch (error) {}
  }
}

module.exports = LoginController;
