module.exports = function (sequelize, Sequelize) {
    var Result = sequelize.define('Result', {
        result: {
            type: Sequelize.STRING,
            allowNull: false
        },
        screenshot_url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Result.belongsTo(models.Match, {as: 'Match'});
            }
        }
    });

    return Result;
};