var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./lib/connectMongoose');
const {
  AdsController,
  LoginController,
  LanguageController,
  MyAdsController
} = require('./controllers');
const validations = require('./lib/validationsFunctions');
const sessionAuth = require('./lib/sessionAuthMiddleware');
const jwtAuth = require('./lib/authJWT');
const I18n = require('./lib/i18nConfigure');
const authJWT = require('./lib/authJWT');

var app = express();
const adsController = new AdsController();
const loginController = new LoginController();
const languageController = new LanguageController();
const myAdsController = new MyAdsController();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    name: 'nodepop-session',
    secret: process.env.SECRET_SESSION,
    saveUnitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({ mongoUrl: process.env.URL_MONGODB })
  })
);

// para tener session disponible en .ejs
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(I18n.init);

// Rutas del API
app.post('/api/authenticate', loginController.postApiToken);
app.use('/api/anuncios', authJWT, require('./routes/api/anuncios'));

// Rutas del website
app.get('/', sessionAuth, validations.AdsSearchParams, adsController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
app.get('/change-language/:language', languageController.changeLocale);
app.get('/myAds', sessionAuth, myAdsController.index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // errores de validación en /api/anuncios
  if (err.array) {
    const errInfo = err.array({})[0];
    err.message = `Campo no válido - ${errInfo.type} ${errInfo.path} in ${errInfo.location} ${errInfo.msg}`;
    err.status = 422;
  }

  res.status(err.status || 500);

  // si el fallo es en la API, responder en formato JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
