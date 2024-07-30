const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Services = db.define("services", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    service: { type: DataTypes.STRING },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    minQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dripfeed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    refill: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    cancel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
    },
});

module.exports = Services;
