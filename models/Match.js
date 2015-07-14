module.exports = function (sequelize, Sequelize) {
    var Match = sequelize.define('Match', {
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        scheduled: {
            type: Sequelize.DATE
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Match.belongsTo(models.Season, {as: 'season'});
            }
        }
    });

    return Match;
};