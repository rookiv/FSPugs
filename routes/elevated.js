module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/elevated', ensure.elevated, function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        var seasons, users, clans;

        models.Season.findAll()
            .then(function (result) {
                seasons = result;
                return models.Player.findAll();
            }).then(function (result) {
                users = result;
                return models.Clan.findAll({
                    include: [models.Player]
                });
            }).then(function (result) {
                clans = result;
            }).then(function () {
                res.render('elevated.jade', {
                    user: req.user,
                    path: req.path,
                    message: msg,
                    seasons: seasons,
                    users: users,
                    clans: clans
                });
            });
    });

    app.post('/elevated-create-season', ensure.elevated, function (req, res) {
        if (!req.body.name || req.body.name === '') {
            res.render('elevated.jade', {
                user: req.user,
                path: req.path,
                message: 'Season needs a name!'
            });
        }

        models.Season.create({
            name: req.body.name,
            description: req.body.desc
        }).then(function (season) {
            return season.save();
        }).then(function (season) {
            req.session.message = 'Season created!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-modify-season', ensure.elevated, function (req, res) {
        models.Season.find({
            where: {id: req.body.season}
        }).then(function (season) {
            season.name = req.body.name;
            season.desc = req.body.desc;
            return season.save();
        }).then(function (season) {
            req.session.message = 'Season modified!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-remove-season', ensure.elevated, function (req, res) {
        models.Season.find({
            where: {id: req.body.season}
        }).then(function (season) {
            return season.destroy();
        }).then(function (season) {
            req.session.message = 'Season removed!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-ban-user', ensure.elevated, function (req, res) {
        models.Player.find({
            where: {id: req.body.user}
        }).then(function (player) {
            player.role = 'Banned';
            return player.save();
        }).then(function (player) {
            req.session.message = 'Player banned!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-unban-user', ensure.elevated, function (req, res) {
        models.Player.find({
            where: {id: req.body.user}
        }).then(function (player) {
            player.role = 'User';
            return player.save();
        }).then(function (player) {
            req.session.message = 'Player unbanned!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-upgrade-user', ensure.elevated, function (req, res) {
        models.Player.find({
            where: {id: req.body.user}
        }).then(function (player) {
            player.role = 'Admin';
            return player.save();
        }).then(function (player) {
            req.session.message = 'Player upgraded to admin!';
            res.redirect('/elevated');
        });
    });

    app.post('/elevated-dissolve-clan', ensure.elevated, function (req, res) {
        models.Clan.find({
            where: {id: req.body.clan}
        }).then(function (clan) {
            return clan.destroy();
        }).then(function (clan) {
            req.session.message = 'Clan dissolved!';
            res.redirect('/elevated');
        });
    });
};