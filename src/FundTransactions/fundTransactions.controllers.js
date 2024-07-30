const FundTransactions = require("../models/fundTransactions.models");

const getAllFundTransactions = async () => {
    const data = await FundTransactions.findAll();
    return data;
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
};
