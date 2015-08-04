module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/season', function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        var clans = [], seasons = {};

        models.Clan.findAll({
            include: [
                {model: models.Match, as: 'TeamOne', include: [models.Season, models.Result]},
                {model: models.Match, as: 'TeamTwo', include: [models.Season, models.Result]}
                //{ all: true }
            ]
        }).then(function (result) {
            result.forEach(function (clanV, i) {
                var clan = {};
                clan.id = clanV.id;
                clan.name = clanV.name;

                console.log(clanV.toJSON());

                clanV.TeamOne.forEach(function (matchV, i) {
                    var result = matchV.Results[0].result;
                    var season = matchV.Season;

                    // create season if not exists
                    if (!(season.name in seasons)) {
                        seasons[season.name] = {};
                        seasons[season.name].id = season.id;
                        seasons[season.name].name = season.name;
                        seasons[season.name].desc = season.desc;
                        seasons[season.name].clans = {};
                    }

                    // create clan in season if not exists
                    if (!(clan.id in seasons[season.name].clans)) {
                        seasons[season.name].clans[clan.id] = {};
                        seasons[season.name].clans[clan.id].name = clan.name;
                        seasons[season.name].clans[clan.id].wins = 0;
                        seasons[season.name].clans[clan.id].losses = 0;
                        seasons[season.name].clans[clan.id].ties = 0;
                    }

                    // record results
                    if (result === 'TeamOne') {
                        seasons[season.name].clans[clan.id].wins++;
                    } else if (result === 'TeamTwo') {
                        seasons[season.name].clans[clan.id].losses++;
                    } else if (result === 'Tie') {
                        seasons[season.name].clans[clan.id].ties++;
                    }
                });

                clanV.TeamTwo.forEach(function (matchV, i) {
                    var result = matchV.Results[0].result;
                    var season = matchV.Season;

                    // create season if not exists
                    if (!(season.name in seasons)) {
                        seasons[season.name] = {};
                        seasons[season.name].id = season.id;
                        seasons[season.name].name = season.name;
                        seasons[season.name].desc = season.desc;
                        seasons[season.name].clans = {};
                    }

                    // create clan in season if not exists
                    if (!(clan.id in seasons[season.name].clans)) {
                        seasons[season.name].clans[clan.id] = {};
                        seasons[season.name].clans[clan.id].name = clan.name;
                        seasons[season.name].clans[clan.id].wins = 0;
                        seasons[season.name].clans[clan.id].losses = 0;
                        seasons[season.name].clans[clan.id].ties = 0;
                    }

                    // record results
                    if (result === 'TeamTwo') {
                        seasons[season.name].clans[clan.id].wins++;
                    } else if (result === 'TeamOne') {
                        seasons[season.name].clans[clan.id].losses++;
                    } else if (result === 'Tie') {
                        seasons[season.name].clans[clan.id].ties++;
                    }
                });
            });

            console.log(JSON.stringify(seasons));
        }).then(function () {
            res.render('season.jade', {
                user: req.user,
                path: req.path,
                message: msg,
                seasons: seasons
            });
        });
    });

    app.get('/season-test', function (req, res) {
        var clan1Id = 0, clan2Id = 0, seasonId = 0, matchId = 0;

        models.Clan.create({
            name: 'IBP',
            desc: 'I buy power!'
        }).then(function (clan) {
            clan1Id = clan.id;

            return models.Clan.create({
                name: 'POEX',
                desc: 'Order of the phoenix'
            });
        }).then(function (clan) {
            clan2Id = clan.id;

            return models.Season.create({
                name: 'North America League Season 1',
                desc: '1st NA league ever in FS'
            });
        }).then(function (season) {
            seasonId = season.id;

            return models.Match.create({
                TeamOneId: clan1Id,
                TeamTwoId: clan2Id,
                SeasonId: seasonId
            });
        }).then(function (match) {
            matchId = match.id;

            return models.Result.create({
                result: 'TeamOne',
                MatchId: matchId,
                SubmitterId: clan1Id
            });
        }).then(function () {
            return models.Result.create({
                result: 'TeamOne',
                MatchId: matchId,
                SubmitterId: clan2Id
            });
        });
    });
};