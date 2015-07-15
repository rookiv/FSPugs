module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/profile', function (req, res) {
        res.render('profile.jade', {user: req.user, path: req.path});
    });

    app.get('/profile-edit', function (req, res) {
        res.render('profile-edit.jade', {user: req.user, path: req.path});
    });
};