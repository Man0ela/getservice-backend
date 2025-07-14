var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente

// --- Rotas ---
var indexRouter = require('./routes/index');
var servicosRouter = require('./routes/servicos');
var profissionaisRouter = require('./routes/profissionais');
var clientesRouter = require('./routes/cliente');
var authRouter = require('./routes/auth');

var app = express();

// --- Middlewares ---
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Uso das Rotas ---
app.use('/api', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/servicos', servicosRouter);
app.use('/api/profissionais', profissionaisRouter);
app.use('/api/clientes', clientesRouter);

// Exporta o app configurado para ser usado pelo ./bin/www
module.exports = app;