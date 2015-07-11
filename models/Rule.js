module.exports = function (sequelize, Sequelize) {
    var Rule = sequelize.define('Rule', {
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
            }
        }
    });

    return Rule;
};