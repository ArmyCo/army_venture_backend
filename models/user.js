const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        user_army_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        belonged_unit_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true  // 활성화하여 createdAt 및 updatedAt 관리
    });

    return User;
};
