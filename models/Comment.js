module.exports = function (sequelize, Sequelize) {
    var Comment = sequelize.define('Comment', {
        text: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Comment.belongsTo(models.Player, {as: 'player'});
                Comment.belongsTo(models.Match, {as: 'match'});
            }
        }
    });

    return Comment;
};