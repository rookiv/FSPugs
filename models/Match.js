module.exports = function (sequelize, Sequelize) {
    var Match = sequelize.define('Match', {}, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
            }
        }
    });

    return Match;
};