var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');



var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var portfolioRouter = require('./routes/portfolio');

var app = express();

// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log("App is running on port " + port);
// });


// view engine setup
app.set('views', [path.join(__dirname, 'views')
  , path.join(__dirname, 'views/portfolio/'),
   path.join(__dirname, 'views/layout/'),
   path.join(__dirname, 'views/system/'),
   path.join(__dirname, 'views/userinputdataform/')
]);




// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/portfolio', express.static('public'))
// ----------session login------------------------

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());

// -------------------------------------

app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/portfolio', portfolioRouter);




module.exports = app;
