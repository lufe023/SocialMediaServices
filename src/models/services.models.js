const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const Services = db.define("services", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        // Precio para el cliente final
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    jqawPrice: {
        // Precio del servicio en jqaw
        type: DataTypes.FLOAT,
        allowNull: true,
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
    parentCategory: {
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
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
