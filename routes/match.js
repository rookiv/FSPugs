module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');


    app.get('/pug', function (req, res) {
        res.render('pug.jade', {user: req.user, path: req.path});
    });

};