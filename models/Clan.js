module.exports = function (sequelize, Sequelize) {
    var Clan = sequelize.define('Clan', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        },
        secret_code: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Clan.hasMany(models.Player);
                Clan.hasMany(models.Match, {as: 'TeamOne'});
                Clan.hasMany(models.Match, {as: 'TeamTwo'});
            }
        }
    });

    return Clan;
};