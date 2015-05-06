var passport          = require('passport'),
    LocalStrategy     = require('passport-local').Strategy,
    bcrypt            = require('bcrypt'),
    User              = require('../models/user')

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
    function(req, email, password, done) {
        User.findOne({ email: email }, function(err, user) {
            if (err) { return done(null, err); }
            if (!user || user.length < 1) { return done(null, false, 'account not found'); }
            bcrypt.compare(password, user.password, function(err, res) {
                if (!res) return done(null, false, 'invalid password');
                return done(null, user);
            });
        });
    })
);

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },

    function(req, email, password, done) {

        User.findOne({ email: email }, function(err, user){
            if (err) { return done(null, false, 'err'); }
            if (user){
                return done(null, false, 'user exists');
            } else {
                User.create({ email: email, password: password }, function(err, user){
                    if(err){
                        return done(null, false, 'failed to create');
                    } else {
                        return done(null, user);
                    }
                })
            }
        })
    })
);
