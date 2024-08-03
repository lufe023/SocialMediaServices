const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Users = require("./users.models");
const Services = require("./services.models");

const ServiceOrders = db.define("serviceOrders", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: "id",
        },
        field: "user_id",
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Services,
            key: "id",
        },
        field: "service_id",
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalCost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    customerPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
    jqawOrderId: {
        type: DataTypes.STRING,
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

module.exports = ServiceOrders;
