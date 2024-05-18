class LanguageController {
  changeLocale(req, res, next) {
    const language = req.params.language;
    res
      .cookie('nodepop-language', language, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .redirect('back');
  }
}

module.exports = LanguageController;
