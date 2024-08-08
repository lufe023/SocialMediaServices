const FundTransactions = require("../models/fundTransactions.models");
const ServiceOrders = require("../models/serviceOrders.models");
const Services = require("../models/services.models");

const getAllFundTransactions = async () => {
    const data = await FundTransactions.findAll();
    return data;
};

const getTransactionsHistory = async (userId) => {
    try {
        const fundTransactions = await FundTransactions.findAll({
            where: { userId },
        });
        const serviceOrders = await ServiceOrders.findAll({
            where: { userId },
            include: [
                {
                    model: Services,
                    as: "service",
                },
            ],
        });

        const transactions = [];

        // Formatea y agrega transacciones de fondos
        fundTransactions.forEach((transaction) => {
            transactions.push({
                id: transaction.id,
                userId: transaction.userId,
                amount: transaction.amount,
                type: transaction.type === "deposit" ? "Ingreso" : "Egreso",
                typeDetail: transaction.description,
                description: transaction.description,
                createdAt: transaction.createdAt,
            });
        });

        // Formatea y agrega órdenes de servicio
        serviceOrders.forEach((order) => {
            transactions.push({
                id: order.id,
                userId: order.userId,
                amount: -order.customerPrice, // Monto negativo para egresos
                type: "Egreso",
                typeDetail: order.link,
                description: order.serviceDescription, //`Servicio: ${order.service.category}`,
                order: order,
                createdAt: order.createdAt,
            });
        });

        // Ordena las transacciones por fecha
        transactions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return transactions;
    } catch (error) {
        console.error("Error obteniendo las transacciones:", error);
        throw error;
    }
};

const getFundTransactionById = async (id) => {
    const data = await FundTransactions.findOne({
        where: { id },
    });
    return data;
};

const createFundTransaction = async (transactionData) => {
    const newTransaction = await FundTransactions.create(transactionData);
    return newTransaction;
};

const updateFundTransaction = async (id, transactionData) => {
    const result = await FundTransactions.update(transactionData, {
        where: { id },
    });
    return result;
};

const deleteFundTransaction = async (id) => {
    const result = await FundTransactions.destroy({
        where: { id },
    });
    return result;
};

const getFundTransactionsByUserId = async (userId) => {
    const data = await FundTransactions.findAll({
        where: { userId },
    });
    return data;
};

module.exports = {
    getAllFundTransactions,
    getFundTransactionById,
    createFundTransaction,
    updateFundTransaction,
    deleteFundTransaction,
    getFundTransactionsByUserId,
    getTransactionsHistory,
};
