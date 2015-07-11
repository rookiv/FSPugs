module.exports = function (sequelize, Sequelize) {
    var Clan_Player = sequelize.define('Clan_Player', {
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Clan_Player.belongsTo(models.Player, {as: 'player'});
                Clan_Player.belongsTo(models.Clan, {as: 'clan'});
            }
        }
    });

    return Clan_Player;
};