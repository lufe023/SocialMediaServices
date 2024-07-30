// models/fundTransactions.models.js
const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Users = require("./users.models");
const Funds = require("./funds.models"); // Asegúrate de importar Funds

const FundTransactions = db.define("fund_transactions", {
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
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
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

FundTransactions.addHook("afterCreate", async (transaction, options) => {
    try {
        const fund = await Funds.findOne({
            where: { userId: transaction.userId },
        });
        if (fund) {
            fund.balance += transaction.amount;
            await fund.save();
        } else {
            // Crear un registro de Funds si no existe para el usuario
            await Funds.create({
                userId: transaction.userId,
                balance: transaction.amount,
            });
        }
    } catch (error) {
        console.error("Error actualizando el balance de Funds:", error);
    }
});

module.exports = FundTransactions;
