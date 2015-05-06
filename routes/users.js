var User = require('../models/user');
var passport = require('passport');

module.exports = function(app){

    /**
    * User registration
    */

    registerProcess = function(req, res){

        console.log('POST -/register')
        passport.authenticate('local-signup', function(err, user, info){
          if ((err) || (!user)) {
            res.redirect('/register');
            return;
          }
          return res.redirect('/login');
        })(req, res);
    };

    /**
    * User login
    */

    loginProcess = function(req, res){
        console.log('POST -/login')
        passport.authenticate('local-login', function(err, user, info){
            if ((err) || (!user)) {
                res.redirect('/login');
                return;
            }
            return res.redirect('/articles')
        })(req, res);
    };

    logout = function(req, res) {
        req.logout();
        res.redirect('/login');
    };

    // Link routes and actions

    app.get('/register', function(req, res) {
        return res.render('users/register', { message: null });
    });

    app.get('/login', function(req, res) {
        return res.render('users/login', { message: null });
    });

    app.get('/logout', logout);

    app.post('/register', registerProcess);

    app.post('/login', loginProcess);
    
};