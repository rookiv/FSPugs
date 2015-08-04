module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/season', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        res.render('season.jade', {
            user: req.user,
            path: req.path,
            message: msg
        });
    });
};