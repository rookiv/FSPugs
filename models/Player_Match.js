module.exports = function (sequelize, Sequelize) {
    var Player_Match = sequelize.define('Player_Match', {
        team: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Player_Match.belongsTo(models.Player, {as: 'player'});
                Player_Match.belongsTo(models.Match, {as: 'match'});
            }
        }
    });

    return Player_Match;
};