const Services = require("../models/services.models");
require("dotenv").config();
const axios = require("axios");

const importJqawServices = async (req, res) => {
    try {
        const response = await axios.post("https://jqaw.org/api/v2", {
            key: process.env.JQAW_API_KEY,
            action: "services",
        });

        const servicesData = response.data;

        // Verificar la estructura de la respuesta
        console.log("Respuesta de la API de JQAW:", servicesData);

        if (!Array.isArray(servicesData)) {
            console.error(
                "La respuesta de la API no es un array:",
                servicesData
            );
            return res.status(500).json({
                message: "La respuesta de la API de JQAW no es válida.",
            });
        }

        // Guardar cada servicio en la base de datos
        const savedServices = await Promise.all(
            servicesData.map(async (service) => {
                // Asignar la categoría madre basándose en la descripción del servicio
                let parentCategory = "Otros"; // Valor por defecto

                const nameLowerCase = service.name.toLowerCase();

                if (nameLowerCase.includes("instagram")) {
                    parentCategory = "Instagram";
                } else if (nameLowerCase.includes("twitter")) {
                    parentCategory = "Twitter";
                } else if (nameLowerCase.includes("facebook")) {
                    parentCategory = "Facebook";
                } else if (nameLowerCase.includes("tiktok")) {
                    parentCategory = "TikTok";
                } else if (nameLowerCase.includes("youtube")) {
                    parentCategory = "YouTube";
                } else if (nameLowerCase.includes("linkedin")) {
                    parentCategory = "LinkedIn";
                } else if (nameLowerCase.includes("snapchat")) {
                    parentCategory = "Snapchat";
                } else if (nameLowerCase.includes("pinterest")) {
                    parentCategory = "Pinterest";
                } else if (nameLowerCase.includes("soundcloud")) {
                    parentCategory = "SoundCloud";
                } else if (nameLowerCase.includes("spotify")) {
                    parentCategory = "Spotify";
                } else if (nameLowerCase.includes("threads")) {
                    parentCategory = "threads ";
                } else if (nameLowerCase.includes("twitch")) {
                    parentCategory = "Twitch ";
                } else if (nameLowerCase.includes("telegram")) {
                    parentCategory = "Telegram ";
                }

                return await Services.create({
                    service: service.service,
                    name: service.name,
                    type: service.type,
                    description: service.description || "", // Proporcionar un valor por defecto si falta
                    jqawPrice: service.rate, // Usar `rate` como el precio en JQAW
                    rate: service.rate,
                    minQuantity: service.min,
                    maxQuantity: service.max,
                    category: service.category,
                    parentCategory: parentCategory, // Nueva categoría madre
                    dripfeed: service.dripfeed,
                    refill: service.refill,
                    cancel: service.cancel,
                });
            })
        );

        res.status(200).json({
            message: "Servicios importados con éxito.",
            data: savedServices,
        });
    } catch (error) {
        console.error("Error importando servicios de JQAW:", error);
        res.status(500).json({
            message: "Error importando servicios de JQAW.",
        });
    }
};

module.exports = {
    importJqawServices,
};
