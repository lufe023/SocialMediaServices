const axios = require("axios");
const ServiceOrders = require("../models/serviceOrders.models");
const Services = require("../models/services.models");
const Funds = require("../models/funds.models");
const Users = require("../models/users.models");

const API_KEY = process.env.JQAW_API_KEY;

async function createServiceOrder(req, res) {
    const { userId, serviceId, quantity, link } = req.body;

    try {
        const service = await Services.findByPk(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        const fund = await Funds.findOne({ where: { userId } });
        if (!fund) {
            return res
                .status(404)
                .json({ message: "Fondos no encontrados para el usuario" });
        }

        const totalCost = service.rate * quantity;
        if (fund.balance < totalCost) {
            return res.status(400).json({ message: "Fondos insuficientes" });
        }

        // Llamada a la API externa
        let response;
        try {
            response = await axios.post("https://jqaw.org/api/v2", null, {
                params: {
                    key: API_KEY,
                    action: "add",
                    service: service.service,
                    link,
                    quantity,
                },
            });
        } catch (error) {
            console.error("Error al llamar a la API externa:", error);
            return res
                .status(500)
                .json({ message: "Error al comunicarse con la API externa" });
        }

        // Validar la respuesta de la API externa
        const jqawOrderId = response.data.order;
        if (!jqawOrderId) {
            return res
                .status(500)
                .json({ message: "Error al crear la orden en la API externa" });
        }

        // Crear la orden en tu base de datos
        const newOrder = await ServiceOrders.create({
            userId,
            serviceId,
            quantity,
            totalCost,
            customerPrice: service.price * quantity,
            status: "created",
            jqawOrderId,
            link,
        });

        // Actualizar los fondos del usuario
        fund.balance -= totalCost;
        await fund.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creando la orden:", error);
        res.status(400).json({ message: error.message });
    }
}

const getUserServiceOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const serviceOrders = await ServiceOrders.findAll({
            where: { userId },
            include: [
                {
                    model: Services,
                    as: "service", // asegúrate de que el alias sea correcto
                    attributes: [
                        "name",
                        "description",
                        "price",
                        "parentCategory",
                    ], // atributos que deseas incluir
                },
            ],
        });

        const orderIds = serviceOrders
            .map((order) => order.jqawOrderId)
            .join(",");

        const response = await axios.get(`https://jqaw.org/api/v2`, {
            params: {
                key: API_KEY,
                action: "status",
                orders: orderIds,
            },
        });

        const statusData = response.data;
        const ordersWithStatus = serviceOrders.map((order) => {
            const statusInfo = statusData[order.jqawOrderId] || {
                status: "Unknown",
            };

            return {
                ...order.toJSON(),
                externalStatus: statusInfo.status,
                startCount: statusInfo.start_count,
                remains: statusInfo.remains,
                totalCost: order.totalCost,
                serviceDetails: order.service, // detalles del servicio referenciado
            };
        });

        res.status(200).json(ordersWithStatus);
    } catch (error) {
        console.error("Error obteniendo las órdenes del usuario:", error);
        res.status(500).json({
            message: "Error obteniendo las órdenes del usuario.",
        });
    }
};

module.exports = {
    createServiceOrder,
    getUserServiceOrders,
};
