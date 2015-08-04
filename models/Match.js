module.exports = function (sequelize, Sequelize) {
    var Match = sequelize.define('Match', {
        desc: {
            type: Sequelize.STRING
        },
        scheduled: {
            type: Sequelize.DATE
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Match.belongsTo(models.Season);
                Match.belongsTo(models.Clan, {as: 'TeamOne'});
                Match.belongsTo(models.Clan, {as: 'TeamTwo'});
                Match.hasMany(models.Result);
            }
        }
    });

    return Match;
};