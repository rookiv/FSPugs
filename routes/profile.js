module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');
    var bcrypt = require('bcrypt-nodejs');

    app.get('/profile', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        if (req.query.id) {
            models.Player.find(req.query.id).then(function (player) {
                res.render('profile.jade', {
                    user: req.user,
                    path: req.path,
                    profile: player,
                    message: msg
                });
            });
        } else {
            // Assume your own
            models.Player.find(req.user.id).then(function (player) {
                res.render('profile.jade', {
                    user: req.user,
                    path: req.path,
                    profile: player,
                    message: msg
                });
            });
        }
    });

    app.get('/profile-edit', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        res.render('profile-edit.jade', {
            user: req.user,
            path: req.path,
            message: msg
        });
    });

    app.post('/profile-edit', ensure.user, function (req, res) {
        // determine which was changed
        if (!req.body.type) {
            res.render('profile-edit.jade', {user: req.user, path: req.path, message: 'Edit failed!'});
            return;
        }

        var type = req.body.type;

        models.Player.find(req.user.id).then(function (player) {
            if (type === 'basic') {
                player.ingame_nick = req.body.steam !== '' ? req.body.steam : player.ingame_nick;
                player.profile_text = req.body.aboutme !== '' ? req.body.aboutme : player.profile_text;
            } else if (type === 'contact') {
                player.email = req.body.email;
            } else if (type === 'password') {
                if (bcrypt.compareSync(req.body.currentpass, player.password) && req.body.pass === req.body.pass2) {
                    player.password = bcrypt.hashSync(req.body.pass);
                } else {
                    return null;
                }
            } else {
                return null;
            }
            return player.save();
        }).then(function (player) {
            if (player) {
                req.session.message = 'Edit successful';
                res.redirect('/profile');
            } else {
                res.render('profile-edit.jade', {
                    user: req.user,
                    path: req.path,
                    message: 'Edit failed!'
                });
            }
        });
    });
};