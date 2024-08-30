const axios = require("axios");
const ServiceOrders = require("../models/serviceOrders.models");
const Funds = require("../models/funds.models");
const Users = require("../models/users.models");
const Configuration = require("../models/configuration"); // Importa el modelo de configuración si no está importado ya

const API_KEY = process.env.JQAW_API_KEY;

// Función para obtener la lista de servicios desde JQAW con el precio unitario calculado
async function getServiceByIdWithPricing(serviceId) {
    try {
        const configId = process.env.CONFIGURATION_ID;
        const configuration = await Configuration.findOne({
            where: { id: configId },
        });

        if (!configuration) {
            throw new Error("Configuration not found");
        }

        const Mult = configuration.multiplier;

        const response = await axios.post("https://jqaw.org/api/v2", {
            key: API_KEY,
            action: "services",
        });

        const services = response.data;

        const service = services.find(
            (s) => s.service.toString() === serviceId.toString()
        );
        if (!service) return null;

        const rate = parseFloat(service.rate);
        const unitedPrice = (rate / 1000) * Mult;
        service.unitedPrice = parseFloat(unitedPrice.toFixed(5)); // Redondear a 5 decimales

        return service;
    } catch (error) {
        console.error("Error fetching services from JQAW:", error);
        return null;
    }
}

async function createServiceOrder(req, res) {
    const { userId, serviceId, quantity, link } = req.body;

    try {
        // Obtener el servicio con el precio unitario calculado
        const service = await getServiceByIdWithPricing(serviceId);

        if (!service) {
            return res.status(404).json({
                message: `Servicio ${serviceId} no fue encontrado encontrado`,
            });
        }

        const fund = await Funds.findOne({ where: { userId } });
        if (!fund) {
            return res
                .status(404)
                .json({ message: "Fondos no encontrados para el usuario" });
        }

        // Calcular el precio a cobrar al cliente
        const customerPrice = service.unitedPrice * quantity;
        if (fund.balance < customerPrice) {
            return res.status(400).json({ message: "Fondos insuficientes" });
        }

        // Llamada a la API externa para crear la orden
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
            serviceDescription: service.name,
            totalCost: service.unitedPrice * quantity,
            customerPrice,
            status: "created",
            jqawOrderId,
            link,
        });

        // Actualizar los fondos del usuario
        fund.balance -= customerPrice;
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
                serviceDetails: order.serviceDescription,
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
