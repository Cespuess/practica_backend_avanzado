class LoginController {
  index(req, res, next) {
    res.render('login', { title: 'Nodepop' });
  }
}

module.exports = LoginController;
