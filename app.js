var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var servicosRouter = require('./routes/servicos');
var profissionaisRouter = require('./routes/profissionais'); 
var clientesRouter = require('./routes/cliente');
const connectDB = require('./config/database'); // <-- Com './'


// Conecta ao banco de dados
connectDB(); 

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/servicos', servicosRouter);
app.use('/profissionais', profissionaisRouter); 
app.use('/clientes', clientesRouter);
module.exports = app;
