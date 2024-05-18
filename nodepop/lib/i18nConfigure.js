const i18n = require('i18n');
const path = require('node:path');

i18n.configure({
  locales: ['es', 'en'],
  directory: path.join(__dirname, '..', 'locales'),
  cookie: 'nodepop-language',
  defaultLocale: 'es',
  autoReload: true
});

i18n.setLocale('es');

module.exports = i18n;
