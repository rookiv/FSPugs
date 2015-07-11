module.exports = function (sequelize, Sequelize) {
    var Dispute = sequelize.define('Dispute', {
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        detail: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Dispute.belongsTo(models.Match, {as: 'match'});
            }
        }
    });

    return Dispute;
};