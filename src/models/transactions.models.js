// models/transactions.models.js
const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Users = require("./users.models");
const Services = require("./services.models");

const Transactions = db.define("transactions", {
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
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
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

Transactions.addHook("afterCreate", async (transaction, options) => {
    const Funds = require("./funds.models");
    const fund = await Funds.findOne({ where: { userId: transaction.userId } });
    if (fund) {
        fund.balance -= transaction.amount;
        await fund.save();
    }
});

module.exports = Transactions;
