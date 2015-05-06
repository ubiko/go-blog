var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var methodOverride = require('method-override')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var configDB = require('./config/database');

var routes = require('./routes/index');

var app = express();
var sessionStore = new session.MemoryStore;

// mongoDB configuration
mongoose.connect(configDB.url, function(err, res){
    if(err){
        console.log('error connecting to database, ' + err);
    }else{
        console.log('connecting to database');
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
    secret: 'cookieSecret',
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
// https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.flashMessage = req.session.flashMessage;
    delete req.session.flashMessage;
    next();
});

// custom http method
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// passport config
var passport = require('./config/passport');

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);
user = require('./routes/users')(app);
article = require('./routes/articles')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
