module.exports = function (sequelize, Sequelize) {
    var User = sequelize.define('User', {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
            }
        }
    });

    return User;
};