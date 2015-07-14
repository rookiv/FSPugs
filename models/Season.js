module.exports = function (sequelize, Sequelize) {
    var Season = sequelize.define('Season', {
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
            }
        }
    });

    return Season;
};