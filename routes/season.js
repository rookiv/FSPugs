module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/season', function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        var seasons = [];

        models.Clan.findAll({
            include: [
                {model: models.Match, as: 'TeamOne', include: [models.Season, models.Result]},
                {model: models.Match, as: 'TeamTwo', include: [models.Season, models.Result]}
            ]
        }).then(function (result) {
            console.log(result);
            seasons = result;

            result.forEach(function (clanV, i) {
                var clan = {};
                clan.id = clanV.id;
                clan.name = clanV.name;
                clan.seasons = {};

                clanV.TeamOne.forEach(function (matchV, i) {
                    var result = matchV.Result.result;
                    var season = matchV.Season.name;

                    if (season in clan.seasons) {
                        if (result === 'TeamOne') {
                            clan.seasons[season].wins++;
                        } else if (result === 'TeamTwo') {
                            clan.seasons[season].losses++;
                        } else if (result === 'Tie') {
                            clan.seasons[season].ties++;
                        }
                    } else {
                        if (result === 'TeamOne') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 1;
                            clan.seasons[season].losses = 0;
                            clan.seasons[season].ties = 0;
                        } else if (result === 'TeamTwo') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 0;
                            clan.seasons[season].losses = 1;
                            clan.seasons[season].ties = 0;
                        } else if (result === 'Tie') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 0;
                            clan.seasons[season].losses = 0;
                            clan.seasons[season].ties = 1;
                        }
                    }
                });

                clanV.TeamTwo.forEach(function (matchV, i) {
                    var result = matchV.Result.result;
                    var season = matchV.Season.name;

                    if (season in clan.seasons) {
                        if (result === 'TeamTwo') {
                            clan.seasons[season].wins++;
                        } else if (result === 'TeamOne') {
                            clan.seasons[season].losses++;
                        } else if (result === 'Tie') {
                            clan.seasons[season].ties++;
                        }
                    } else {
                        if (result === 'TeamTwo') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 1;
                            clan.seasons[season].losses = 0;
                            clan.seasons[season].ties = 0;
                        } else if (result === 'TeamOne') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 0;
                            clan.seasons[season].losses = 1;
                            clan.seasons[season].ties = 0;
                        } else if (result === 'Tie') {
                            clan.seasons[season] = {};
                            clan.seasons[season].wins = 0;
                            clan.seasons[season].losses = 0;
                            clan.seasons[season].ties = 1;
                        }
                    }
                });

                seasons.push(clan);
            });

            console.log(seasons);
        }).then(function () {
            res.render('season.jade', {
                user: req.user,
                path: req.path,
                message: msg,
                seasons: seasons
            });
        });
    });
};