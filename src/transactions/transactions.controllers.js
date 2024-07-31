const Transaction = require("../models/transactions.models");
const Fund = require("../models/funds.models");
const FundTransaction = require("../models/fundTransactions.models");
const User = require("../models/users.models");

const createTransaction = async (req, res) => {
    const { serviceId, amount, userId } = req.body;

    if (!serviceId || !amount || !userId) {
        return res
            .status(400)
            .json({ message: "Todos los campos son requeridos." });
    }

    try {
        // Busca al usuario para obtener su saldo actual
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Verifica si el usuario tiene suficientes fondos
        if (user.funds < amount) {
            return res.status(400).json({ message: "Fondos insuficientes." });
        }

        // Resta el monto de los fondos del usuario
        await User.update(
            { funds: user.funds - amount },
            { where: { id: userId } }
        );

        // Registra la compra en la tabla de transacciones
        const newTransaction = await Transaction.create({
            serviceId,
            amount,
            userId,
            type: "purchase", // Tipo de transacción (puede ser 'purchase', 'invoice', etc.)
        });

        // Registra la transacción en la tabla de fondos
        await FundTransaction.create({
            serviceId,
            amount, // Registra el monto positivo para el historial de transacciones
            userId,
            type: "purchase",
        });

        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports = {
    createTransaction,
};
