var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var app = express();


var port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
let io = require('socket.io')(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {

  console.log('new socket has connected on Client', socket.id);

  socket.on('move', (data) => {
    console.log(`socket ${socket.id} made a move ${data}`);
    socket.broadcast.emit('move', data);
  })

})




/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log('Server has started on port', port);
});

module.exports = app;
