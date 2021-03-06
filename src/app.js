var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const pug = require('pug');
const screenSize = require('./config/screenSize');

var indexRouter = require('./routes/index');

var rosConnection = require('./adapters/rosConnection');
rosConnection.listener();

var app = express();

// Create socket.
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.io = io;

var processToInteraction = require('./adapters/processToInteraction');
processor = new processToInteraction(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Listen of the conversation is active.
var willy_is_active = 0;
rosConnection.on('rosIsActive', function (is_active) {
  // Change only the content and mood when willy is switching between active and not active.
  if (willy_is_active === is_active) {
    return;
  }
  willy_is_active = is_active;

  var content = '';

  if (is_active) {
    io.emit('changeMood', 'green');
    io.emit('changeFormat', screenSize.medium);

    content = pug.renderFile('views/active_information.pug', {});
    io.emit('changeContent', content);
  }
  else {
    io.emit('changeMood', 'default');

    io.emit('changeFormat', screenSize.large);

    content = pug.renderFile('views/not_active_information.pug', {});
    io.emit('changeContent', content);
  }
});

// Process the input from a ros topic.
rosConnection.on('rosTextInput', function (message) {
    io.emit('textInput', message);

    // Only interact when the is_active topic publish 1.
    if (!willy_is_active) {
        return;
    }

    processor.processText(message);
    processor.textInput(message);
});


module.exports = app;
