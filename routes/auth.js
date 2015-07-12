module.exports = function (app) {
    var bcrypt = require('bcrypt-nodejs');

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    var session = require('express-session');
    var bodyParser = require('body-parser');

    var models = require('../models');
    var ensure = require('./ensure.js');
    var config = require('../config.js');

    /**
     * Sessions setup
     */

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({
        secret: config.session_secret,
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    /**
     * Passport serialization
     */

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    /**
     * Passport local strategy users setup
     */

    passport.use('local-user', new LocalStrategy({
            usernameField: 'user',
            passwordField: 'pass'
        },
        function (username, password, done) {
            models.Player.find({
                where: models.Sequelize.or(
                    {email: username},
                    {username: username}
                )
            }).then(function (user) {
                if (user == null)
                    return done(null, false);

                if (bcrypt.compareSync(password, user.password)) {
                    return done(null, {
                        id: user.id,
                        username: user.username
                    });
                } else {
                    return done(null, false);
                }
            }).error(function (err) {
                return done(null, false);
            });
        }
    ));

    /**
     * Routing
     */

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-user', function (err, user, info) {
            if (err) {
                return res.render('login.jade', {message: 'Login failed!'});
            }
            if (!user) {
                return res.render('login.jade', {message: 'Login failed!'});
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.render('login.jade', {message: 'Login failed!'});
                }
                req.session.message = 'Login successful';
                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.post('/register', function (req, res) {
        models.Player.find({
            where: {
                username: req.body.user
            }
        }).then(function (model) {
            if (model != null) {
                console.log('User already found');
                res.render('register.jade', {user: req.user, message: 'User already exists!'});
            } else {
                models.Player.create({
                    username: req.body.user,
                    password: bcrypt.hashSync(req.body.pass)
                }).then(function (result) {
                    console.log('User created.');
                    res.render('register.jade', {user: req.user, message: 'User successfully registered!'});
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};