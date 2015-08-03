module.exports = function (sequelize, Sequelize) {
    var Player = sequelize.define('Player', {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        ingame_nick: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        profile_text: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Player.belongsTo(models.Clan);
            }
        }
    });

    return Player;
};