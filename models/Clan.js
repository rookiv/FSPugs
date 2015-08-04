module.exports = function (sequelize, Sequelize) {
    var Clan = sequelize.define('Clan', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        desc: {
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
                Clan.hasMany(models.Match, {foreignKey: 'TeamOneId', as: 'TeamOne'});
                Clan.hasMany(models.Match, {foreignKey: 'TeamTwoId', as: 'TeamTwo'});
                Clan.hasMany(models.Result, {as: 'Submitter'});
            }
        }
    });

    return Clan;
};