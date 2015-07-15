module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/profile', ensure.user, function (req, res) {
        if (req.query.id) {
            models.Player.find(req.query.id).then(function (player) {
                res.render('profile.jade', {user: req.user, path: req.path, profile: player});
            });
        } else {
            // Assume your own
            models.Player.find(req.user.id).then(function (player) {
                res.render('profile.jade', {user: req.user, path: req.path, profile: player});
            });
        }
    });

    app.get('/profile-edit', function (req, res) {
        res.render('profile-edit.jade', {user: req.user, path: req.path});
    });
};