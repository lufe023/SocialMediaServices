const uuid = require("uuid");
const Configuration = require("../models/configuration");

// Crear una nueva configuración
const createConfiguration = async (data) => {
    const newConfiguration = await Configuration.create({
        id: uuid.v4(),
        siteTitle: data.siteTitle,
        multiplier: data.multiplier,
    });

    return newConfiguration;
};

// Obtener todas las configuraciones
const getAllConfigurations = async () => {
    const configurations = await Configuration.findAll();
    return configurations;
};

// Obtener una configuración por ID
const getConfigurationById = async (id) => {
    const configuration = await Configuration.findOne({
        where: { id },
    });

    if (!configuration) {
        throw new Error("Configuration not found");
    }

    return configuration;
};

// Actualizar una configuración por ID
const updateConfigurationById = async (id, data) => {
    const configuration = await Configuration.findOne({
        where: { id },
    });

    if (!configuration) {
        throw new Error("Configuration not found");
    }

    await configuration.update({
        siteTitle: data.siteTitle,
        multiplier: data.multiplier,
    });

    return configuration;
};

// Eliminar una configuración por ID
const deleteConfigurationById = async (id) => {
    const configuration = await Configuration.findOne({
        where: { id },
    });

    if (!configuration) {
        throw new Error("Configuration not found");
    }

    await configuration.destroy();

    return { message: "Configuration deleted successfully" };
};

module.exports = {
    createConfiguration,
    getAllConfigurations,
    getConfigurationById,
    updateConfigurationById,
    deleteConfigurationById,
};
