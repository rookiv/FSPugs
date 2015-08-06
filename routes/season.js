module.exports = function (app) {
    var models = require('../models');
    var ensure = require('./ensure.js');

    app.get('/season', function (req, res) {
        var msg = req.session.message;
        req.session.message = null;

        var rankings = {};

        models.Clan.findAll({
            include: [
                {
                    model: models.Match,
                    as: 'TeamOne',
                    include: [models.Season]
                },
                {
                    model: models.Match,
                    as: 'TeamTwo',
                    include: [models.Season]
                }
            ]
        }).then(function (result) {
            result.forEach(function (clanV, i) {
                var clan = {};
                clan.id = clanV.id;
                clan.name = clanV.name;

                clanV.TeamOne.forEach(function (matchV, i) {
                    var result = matchV.final_result;
                    var season = matchV.Season;

                    // create season if not exists
                    if (!(season.name in rankings)) {
                        rankings[season.name] = {};
                        rankings[season.name].id = season.id;
                        rankings[season.name].name = season.name;
                        rankings[season.name].desc = season.desc;
                        rankings[season.name].clans = {};
                    }

                    // create clan in season if not exists
                    if (!(clan.id in rankings[season.name].clans)) {
                        rankings[season.name].clans[clan.id] = {};
                        rankings[season.name].clans[clan.id].name = clan.name;
                        rankings[season.name].clans[clan.id].wins = 0;
                        rankings[season.name].clans[clan.id].losses = 0;
                        rankings[season.name].clans[clan.id].ties = 0;
                    }

                    // record results
                    if (result === 'TeamOne') {
                        rankings[season.name].clans[clan.id].wins++;
                    } else if (result === 'TeamTwo') {
                        rankings[season.name].clans[clan.id].losses++;
                    } else if (result === 'Tie') {
                        rankings[season.name].clans[clan.id].ties++;
                    }
                });

                clanV.TeamTwo.forEach(function (matchV, i) {
                    var result = matchV.final_result;
                    var season = matchV.Season;

                    // create season if not exists
                    if (!(season.name in rankings)) {
                        rankings[season.name] = {};
                        rankings[season.name].id = season.id;
                        rankings[season.name].name = season.name;
                        rankings[season.name].desc = season.desc;
                        rankings[season.name].clans = {};
                    }

                    // create clan in season if not exists
                    if (!(clan.id in rankings[season.name].clans)) {
                        rankings[season.name].clans[clan.id] = {};
                        rankings[season.name].clans[clan.id].name = clan.name;
                        rankings[season.name].clans[clan.id].wins = 0;
                        rankings[season.name].clans[clan.id].losses = 0;
                        rankings[season.name].clans[clan.id].ties = 0;
                    }

                    // record results
                    if (result === 'TeamTwo') {
                        rankings[season.name].clans[clan.id].wins++;
                    } else if (result === 'TeamOne') {
                        rankings[season.name].clans[clan.id].losses++;
                    } else if (result === 'Tie') {
                        rankings[season.name].clans[clan.id].ties++;
                    }
                });
            });
        }).then(function () {
            return models.Season.findAll({
                include: [{
                    model: models.Match,
                    include: [
                        {model: models.Clan, as: 'TeamOne'},
                        {model: models.Clan, as: 'TeamTwo'}
                    ]
                }]
            });
        }).then(function (matches) {
            console.log(JSON.stringify(matches));
            res.render('season.jade', {
                user: req.user,
                path: req.path,
                message: msg,
                rankings: rankings,
                matches: matches
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
                SeasonId: seasonId,
                final_result: 'TeamOne'
            });
        }).then(function () {
            return models.Match.create({
                TeamOneId: clan2Id,
                TeamTwoId: clan1Id,
                SeasonId: seasonId,
                final_result: 'TeamTwo'
            });
        });
    });
};