const transactionsControllers = require("./transactions.services");

const createTransaction = async (req, res) => {
    const transactionData = req.body;
    try {
        const transaction = await transactionsControllers.createTransaction(
            transactionData
        );
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createTransaction,
};
