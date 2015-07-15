module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');
    var bcrypt = require('bcrypt-nodejs');

    app.get('/clan', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        if (req.query.browse) {
            models.Clan.findAll({
                include: [{model: models.Clan_Player, include: [models.Player]}]
            }).then(function (clans) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    results: clans,
                    message: msg
                });
            });
        } else if (req.query.id) {
            models.Clan.findAll({
                where: {id: req.query.id},
                include: [{model: models.Clan_Player, include: [models.Player]}]
            }).then(function (clan) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    clan: clan[0],
                    message: msg
                });
            });
        } else {
            models.Clan_Player.findAll({
                where: {PlayerId: req.user.id},
                include: [models.Clan]
            }).then(function (clans) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    message: msg,
                    clans: clans
                });
            });
        }
    });

    app.get('/clan-create', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        res.render('clan-create.jade', {
            user: req.user,
            path: req.path,
            message: msg
        });
    });

    app.post('/clan-create', function (req, res) {
        if (!req.body.name || req.body.name === '') {
            res.render('clan-create.jade', {
                user: req.user,
                path: req.path,
                message: 'Clan needs a name!'
            });
        }

        models.Clan.create({
            name: req.body.name,
            description: req.body.desc
        }).then(function (clan) {
            return clan.save();
        }).then(function (clan) {
            return models.Clan_Player.create({
                PlayerId: req.user.id,
                ClanId: clan.id,
                status: 'owner'
            });
        }).then(function (clanplayer) {
            req.session.message = 'Clan created!';
            res.redirect('/clan');
        });
    });
};