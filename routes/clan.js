module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/clan', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        if (req.query.browse) {
            models.Clan.findAll({
                include: [models.Player]
            }).then(function (clans) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    results: clans,
                    message: msg
                });
            });
        } else if (req.query.id) {
            models.Clan.find({
                where: {id: req.query.id},
                include: [models.Player]
            }).then(function (clan) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    clan: clan,
                    message: msg
                });
            });
        } else {
            models.Player.find({
                where: {id: req.user.id},
                include: [{model: models.Clan, include: [models.Player]}]
            }).then(function (player) {
                res.render('clan.jade', {
                    user: req.user,
                    path: req.path,
                    message: msg,
                    player: player
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

        var secret = require('crypto').randomBytes(16).toString('hex');
        var clanId = 0;

        models.Clan.create({
            name: req.body.name,
            description: req.body.desc,
            secret_code: secret
        }).then(function (clan) {
            return clan.save();
        }).then(function (clan) {
            clanId = clan.id;
            return models.Player.find(req.user.id);
        }).then(function (player) {
            player.ClanId = clanId;
            return player.save();
        }).then(function (player) {
            req.session.message = 'Clan created!';
            res.redirect('/clan');
        });
    });

    app.get('/clan-leave', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        res.render('clan-leave.jade', {
            user: req.user,
            path: req.path,
            message: msg
        });
    });

    app.post('/clan-leave', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        models.Player.find({
            where: {id: req.user.id},
            include: [{model: models.Clan, include: [models.Player]}]
        }).then(function (player) {
            player.ClanId = null;
            return player.save();
        }).then(function (player) {
            res.redirect('/clan');
        });
    });

    app.post('/clan-join', ensure.user, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        var clanId = null;

        models.Clan.find({
            where: {secret_code: req.body.code}
        }).then(function (clan) {
            if (clan != null) {
                clanId = clan.id;
            }
            return models.Player.find({
                where: {id: req.user.id},
                include: [{model: models.Clan, include: [models.Player]}]
            });
        }).then(function (player) {
            player.ClanId = clanId;
            return player.save();
        }).then(function (player) {
            if (!clanId) {
                req.session.message = 'Invalid join code!';
            } else {
                req.session.message = 'Clan joined!';
            }

            res.redirect('/clan');
        });
    });

};