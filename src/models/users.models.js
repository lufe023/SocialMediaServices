const db = require("../utils/database");
const { DataTypes } = require("sequelize");
const Roles = require("../models/roles.models");

const Users = db.define("users", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true, // Cambiado a true para que sea opcional
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true, // Cambiado a true para que sea opcional
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Cambiado a true para que sea opcional
    },
    passwordRequest: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    phone: {
        type: DataTypes.STRING, // +52
        allowNull: true,
        unique: true,
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Roles,
            key: "id",
        },
        defaultValue: 1,
    },
    country: {
        type: DataTypes.STRING,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "is_verified",
        defaultValue: false,
    },
});

module.exports = Users;

/* */
