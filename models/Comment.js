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
                Comment.belongsTo(models.Player, {as: 'Player'});
                Comment.belongsTo(models.Match, {as: 'Match'});
            }
        }
    });

    return Comment;
};