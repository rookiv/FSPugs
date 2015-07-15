module.exports = function (sequelize, Sequelize) {
    var Clan_Player = sequelize.define('Clan_Player', {
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Clan_Player.belongsTo(models.Player);
                Clan_Player.belongsTo(models.Clan);
            }
        }
    });

    return Clan_Player;
};