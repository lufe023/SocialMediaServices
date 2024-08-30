const Services = require("../models/services.models");
const AuditLog = require("../models/AuditLog");
require("dotenv").config();
const axios = require("axios");

const importJqawServices = async (req, res) => {
    try {
        const response = await axios.post("https://jqaw.org/api/v2", {
            key: process.env.JQAW_API_KEY,
            action: "services",
        });

        const servicesData = response.data;
        if (!Array.isArray(servicesData)) {
            console.error(
                "La respuesta de la API no es un array:",
                servicesData
            );
            return res.status(500).json({
                message: "La respuesta de la API de JQAW no es válida.",
            });
        }

        const existingServices = await Services.findAll();
        const existingServiceIds = existingServices.map(
            (service) => service.service
        );

        for (const service of servicesData) {
            let parentCategory = determineParentCategory(service.name);

            const jqawPrice = parseFloat(service.rate) / 1000;

            const existingService = await Services.findOne({
                where: { service: service.service },
            });

            if (existingService) {
                // Si el servicio existe, lo actualizamos si hay cambios
                if (
                    existingService.name !== service.name ||
                    existingService.type !== service.type ||
                    existingService.description !== service.description ||
                    existingService.jqawPrice !== jqawPrice ||
                    existingService.rate !== service.rate ||
                    existingService.minQuantity !== service.min ||
                    existingService.maxQuantity !== service.max ||
                    existingService.category !== service.category ||
                    existingService.parentCategory !== parentCategory ||
                    existingService.dripfeed !== service.dripfeed ||
                    existingService.refill !== service.refill ||
                    existingService.cancel !== service.cancel
                ) {
                    await existingService.update({
                        name: service.name,
                        type: service.type,
                        description: service.description || "",
                        jqawPrice: jqawPrice,
                        rate: service.rate,
                        minQuantity: service.min,
                        maxQuantity: service.max,
                        category: service.category,
                        parentCategory: parentCategory,
                        dripfeed: service.dripfeed,
                        refill: service.refill,
                        cancel: service.cancel,
                    });

                    await AuditLog.create({
                        serviceId: existingService.id,
                        action: "update",
                        description: `El servicio ${existingService.name} ha sido actualizado.`,
                    });
                }
            } else {
                // Si el servicio no existe, lo creamos y lo registramos en la auditoría
                const newService = await Services.create({
                    service: service.service,
                    name: service.name,
                    type: service.type,
                    description: service.description || "",
                    jqawPrice: jqawPrice,
                    rate: service.rate,
                    minQuantity: service.min,
                    maxQuantity: service.max,
                    category: service.category,
                    parentCategory: parentCategory,
                    dripfeed: service.dripfeed,
                    refill: service.refill,
                    cancel: service.cancel,
                    published: false, // No se publica automáticamente
                });

                await AuditLog.create({
                    serviceId: newService.id,
                    action: "create",
                    description: `Nuevo servicio ${newService.name} creado.`,
                });
            }

            // Marcar como existente
            existingServiceIds.splice(
                existingServiceIds.indexOf(service.service),
                1
            );
        }

        // Despublicar servicios que ya no existen en la API
        for (const serviceId of existingServiceIds) {
            const serviceToUnpublish = await Services.findOne({
                where: { service: serviceId },
            });
            if (serviceToUnpublish) {
                await serviceToUnpublish.update({ published: false });

                await AuditLog.create({
                    serviceId: serviceToUnpublish.id,
                    action: "unpublish",
                    description: `El servicio ${serviceToUnpublish.name} ya no está disponible y ha sido despublicado.`,
                });
            }
        }

        res.status(200).json({
            message: "Servicios importados y actualizados con éxito.",
        });
    } catch (error) {
        console.error("Error importando servicios de JQAW:", error);
        res.status(500).json({
            message: "Error importando servicios de JQAW.",
        });
    }
};

const determineParentCategory = (name) => {
    const nameLowerCase = name.toLowerCase();
    if (nameLowerCase.includes("instagram")) return "Instagram";
    if (nameLowerCase.includes("twitter")) return "Twitter";
    if (nameLowerCase.includes("facebook")) return "Facebook";
    if (nameLowerCase.includes("tiktok")) return "TikTok";
    if (nameLowerCase.includes("youtube")) return "YouTube";
    if (nameLowerCase.includes("linkedin")) return "LinkedIn";
    if (nameLowerCase.includes("snapchat")) return "Snapchat";
    if (nameLowerCase.includes("pinterest")) return "Pinterest";
    if (nameLowerCase.includes("soundcloud")) return "SoundCloud";
    if (nameLowerCase.includes("spotify")) return "Spotify";
    if (nameLowerCase.includes("threads")) return "Threads";
    if (nameLowerCase.includes("twitch")) return "Twitch";
    if (nameLowerCase.includes("telegram")) return "Telegram";
    return "Otros";
};

module.exports = {
    importJqawServices,
};
