var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var router = require('./routes/routes');

var cors = require('cors')

var app = express();
app.use(cors());
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.get('/adminPanel', (req, res) => {
  res.sendFile('./views/adminLogin.html', {root: __dirname});
});

app.get('/adminPanel/adminDashboard', (req, res) => {
  res.sendFile('./views/adminDashboard.html', {root: __dirname});
});

module.exports = app;
