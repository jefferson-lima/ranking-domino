var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var defaultHandler = require('./errorHandlers/DefaultHandler');
var PartidaController = require('./controllers/PartidaController');
var JogadorController = require('./controllers/JogadorController');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var partidaController = new PartidaController();
var jogadorController = new JogadorController();

app.get('/novaPartida', (req, res) => {res.render('novaPartida')});

app.post('/salvarPartida', (req, res) => {
  partidaController.salvarPartida(req, res);
});

app.get(['/','/ranking'], (req, res) => {
  partidaController.rankingPorJogador(req, res);
});

app.get('/jogadores', (req, res) => {
  jogadorController.listar(req, res);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(defaultHandler);

module.exports = app;
