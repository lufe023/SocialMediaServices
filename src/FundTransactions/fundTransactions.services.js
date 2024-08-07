const fundTransactionControllers = require("./fundTransactions.controllers");

const getAllFundTransactions = (req, res) => {
    fundTransactionControllers
        .getAllFundTransactions()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getFundTransactionById = (req, res) => {
    const id = req.params.id;
    fundTransactionControllers
        .getFundTransactionById(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(404).json({ message: err.message });
        });
};

const createFundTransaction = (req, res) => {
    const transactionData = req.body;
    fundTransactionControllers
        .createFundTransaction(transactionData)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const updateFundTransaction = (req, res) => {
    const id = req.params.id;
    const transactionData = req.body;
    fundTransactionControllers
        .updateFundTransaction(id, transactionData)
        .then((data) => {
            if (data[0]) {
                res.status(200).json({
                    message: `Transaction with ID: ${id} updated successfully!`,
                });
            } else {
                res.status(404).json({ message: "Invalid ID" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const deleteFundTransaction = (req, res) => {
    const id = req.params.id;
    fundTransactionControllers
        .deleteFundTransaction(id)
        .then((data) => {
            if (data) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Invalid ID" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getFundTransactionsByUserId = (req, res) => {
    const userId = req.params.userId;
    fundTransactionControllers
        .getFundTransactionsByUserId(userId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getTransactionsHistoryService = (req, res) => {
    const userId = req.params.userId;
    fundTransactionControllers
        .getTransactionsHistory(userId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

module.exports = {
    getAllFundTransactions,
    getFundTransactionById,
    createFundTransaction,
    updateFundTransaction,
    deleteFundTransaction,
    getFundTransactionsByUserId,
    getTransactionsHistoryService,
};
