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
                        username: user.username,
                        role: user.role
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
                return res.render('login.jade', {
                    message: 'Login failed!',
                    path: req.path
                });
            }
            if (!user) {
                return res.render('login.jade', {
                    message: 'Login failed!',
                    path: req.path
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return res.render('login.jade', {
                        message: 'Login failed!',
                        path: req.path
                    });
                }
                req.session.message = 'Login successful!';

                if (req.session.returnTo) {
                    return res.redirect(req.session.returnTo);
                }

                return res.redirect('/');
            });
        })(req, res, next);
    });

    app.post('/register', function (req, res) {
        if (req.body.pass !== req.body.pass2) {
            res.render('register.jade', {
                message: 'Your passwords do not match!',
                path: req.path
            });
            return;
        }

        models.Player.find({
            where: models.Sequelize.or(
                {email: req.body.email},
                {username: req.body.user}
            )
        }).then(function (model) {
            if (model != null) {
                console.log('User already found');
                res.render('register.jade', {
                    message: 'User with this name or email already exists!',
                    path: req.path
                });
            } else {
                models.Player.create({
                    username: req.body.user,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.pass),
                    role: 'User',
                    profile_text: 'I\'m new around here'
                }).then(function (result) {
                    console.log('User created.');
                    res.render('login.jade', {
                        user: req.user,
                        message: 'You have successfully registered!',
                        path: req.path
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        req.session.message = 'User logged out successfully!';
        res.redirect('/');
    });


    app.get('/init', function (req, res) {
        res.json('Re-initializing...');
        models.sequelize.sync({force: true}).then(function () {
            return models.Player.create({
                username: 'rukqoa',
                email: 'rukqoa@gmail.com',
                ingame_nick: 'rukqoa',
                password: bcrypt.hashSync('hunter2'),
                profile_text: 'I built this site.',
                role: 'Admin'
            });
        });
    });
};