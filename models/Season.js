module.exports = function (sequelize, Sequelize) {
    var Season = sequelize.define('Season', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        desc: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Season.hasMany(models.Match);
            }
        }
    });

    return Season;
};