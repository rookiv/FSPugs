module.exports = function (sequelize, Sequelize) {
    var Clan = sequelize.define('Clan', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Clan.hasMany(models.Clan_Player);
            }
        }
    });

    return Clan;
};