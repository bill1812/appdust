// app.modules
var adaro = require('adaro');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var frameguard = require('frameguard');
var logger = require('morgan');
var mimetype = require('mime-types');
var path = require('path');
var xfo = require('./bin/www');

// app.localModules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// app.localVariable
var app = express();

// app.localLetVar
var mimeTIE = 'text/html';
// app.disable('x-powered-by');

// app.uses
app.use(compression());
app.use(logger('dev' /* options: immediate, skip, stream, combined, common, [dev], short, tiny */ ));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function (req, res, next) {
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie(
      'yummyCookie',
      randomNumber,
      { maxAge: 0.5 * 60 * 60,
        httpOnly: true,
        signed: false,
        sameSite: true
      }
    );
    console.log('\x1b[35m\x1b[1m', ' cookie: ' + randomNumber, '\x1b[37m\x1b[0m');
  }
  next();
});
app.use(frameguard({
  action: xfo.xframeorigin //,
  //domain: '',
  //domain: '',
  //domain: '',
  //domain: ''
}));
app.use(express.static(path.join(__dirname, 'public'),
  { dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    fallthrough: true,
    immutable: false,
    index: false,
    lastModified: true,
    maxAge: '1h',
    redirect: true,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
      mimeTIE = mimetype.lookup(path);
      if (mimeTIE !== 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.setHeader('Expires', new Date(Date.now() + 2 * 60* 60).toUTCString());
    //  console.log('path: ' + path);
      }
    //  console.log('Current mimeTypes: ' + mimeTIE);
    }
  }
));

// app.mounts
app.use('/', indexRouter);
app.use('/users', usersRouter);

// view engine setup @app.view.render
app.engine('dust', adaro.dust());

// app.view.engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

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

  var theErr = [
    req.app.get('env'),
    res.statusCode.toString()
  ];
  // console.log('\ntheErr[0]: ' + theErr[0] + ' theErr[1]: ' + theErr[1] +'\n');
  // console.log('res.locals.message: ' + res.locals.message + '\n');
  // console.log('res.locals.error: '   + res.locals.error   + '\n');
  // console.log('err: ' + err + '\n');

  if (theErr[0] === 'development') {
    res.render('error');
  } else {
    //  built-in!
    var htmlhead = '<!DOCTYPE html><html lang="en"><head><title>Error</title><link rel="shortcut icon" type="image/x-icon" href="/img/error.ico" /><style type="text/css">html{font-family: sans-serif;line-height: 1.15;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%}body{margin: 0}small{font-size: 80%}body, html{width: 100%;height: 100%;background-color: #21232a}body{color: #fff;text-align: center;text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);padding: 0;min-height: 100%;-webkit-box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);display: table;font-family: "Open Sans", Arial, sans-serif}h1{font-size: 2em;margin: 0.67em 0font-family: inherit;font-weight: 500;line-height: 1.1;color: inherit;font-size: 36px}h1 small{font-size: 68%;font-weight: 400;line-height: 1;color: #777}.lead{color: silver;font-size: 21px;line-height: 1.4}.cover{display: table-cell;vertical-align: middle;padding: 0 20px}</style></head><body><div class="cover">';
    switch (theErr[1]) {
    case '401':
      res.send(htmlhead + '<h1>Unauthorized <small>Error 401</small></h1><p class="lead">The requested resource requires an authentication.</p></div></body></html>');
      break;
    case '403':
      res.send(htmlhead + '<h1>Access Denied <small>Error 403</small></h1><p class="lead">The requested resource requires an authentication.</p></div></body></html>');
      break;
    case '404':
      res.send(htmlhead + '<h1>Resource not found - <small>Error 404</small></h1><p class="lead">The requested resource could not be found but may be available again in the future.</p></div></body></html>');
      break;
    case '500':
      res.send(htmlhead + '<h1>Webservice currently unavailable - <small>Error 500</small></h1><p class="lead">An unexpected condition was encountered.<br>Our service team has been dispatched to bring it back online.</p></div></body></html>');
      break;
    default:
      break;
    }
  // res.render(theErr[1]);
  }
  // next();
});

module.exports = app;

/* \gen4node\templates\js\app.js.ejs */
