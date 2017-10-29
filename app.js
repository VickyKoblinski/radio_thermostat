require('dotenv').config()
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var index = require('./routes/index');

require('./RadioThermostat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/', index);

app.get('/sonoff2ON', (req, res) => {
  console.log('running sonoff2ON');
  request.put(
    {
      url: 'http://sonoff2/api/relay/0',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `apikey=${process.env.SONOFF_API_KEY}&value=1`
    },
    (err, httpResponse, body) => {
      console.log('response');
      res.send('OK');
    }
  );
});

app.get('/sonoff2OFF', (req, res) => {
  console.log('running sonoff2OFF');
  request.put(
    {
      url: 'http://sonoff2/api/relay/0',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `apikey=${process.env.SONOFF_API_KEY}&value=1`
    },
    (err, httpResponse, body) => {
      console.log('response');
      res.send('OK');
    }
  );
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
