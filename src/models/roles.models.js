const db = require("../utils/database");
const { DataTypes } = require("sequelize");

const Roles = db.define("user_roles", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    roleName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "role_name",
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Roles;
/* */
