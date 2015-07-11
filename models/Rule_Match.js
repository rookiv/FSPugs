module.exports = function (sequelize, Sequelize) {
    var Rule_Match = sequelize.define('Rule_Match', {
        value: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Rule_Match.belongsTo(models.Rule, {as: 'rule'});
                Rule_Match.belongsTo(models.Match, {as: 'match'});
            }
        }
    });

    return Rule_Match;
};