// controllers/services.controllers.js
const Services = require("../models/services.models");

const getAllServices = async () => {
    return await Services.findAll();
};

const getServiceById = async (id) => {
    return await Services.findOne({ where: { id } });
};

const createService = async (serviceData) => {
    return await Services.create(serviceData);
};

const updateService = async (id, serviceData) => {
    return await Services.update(serviceData, { where: { id } });
};

const deleteService = async (id) => {
    return await Services.destroy({ where: { id } });
};

// Obtener todas las categorías (único)
const getAllCategories = async () => {
    const services = await Services.findAll({
        attributes: ["parentCategory"],
        group: ["parentCategory"],
    });
    return services.map((service) => service.parentCategory);
};

// Obtener servicios por categoría
const getServicesByCategory = async (parentCategory) => {
    return await Services.findAll({
        where: {
            parentCategory: parentCategory,
            published: true,
        },
    });
};

// Obtener servicios por categoría
const getServicesByCategoryForAdmins = async (parentCategory) => {
    return await Services.findAll({
        where: {
            parentCategory: parentCategory,
        },
    });
};

const updateServiceGroup = async (services) => {
    const transaction = await Services.sequelize.transaction();

    try {
        await Promise.all(
            services.map(async (service) => {
                const [updatedRows] = await Services.update(
                    {
                        // Campos que se deben actualizar
                        name: service.name,
                        price: service.price,
                        jqawPrice: service.jqawPrice,
                        rate: service.rate,
                        minQuantity: service.minQuantity,
                        maxQuantity: service.maxQuantity,
                        category: service.category,
                        parentCategory: service.parentCategory,
                        dripfeed: service.dripfeed,
                        refill: service.refill,
                        cancel: service.cancel,
                        published: service.published,
                    },
                    {
                        where: { id: service.id },
                        transaction,
                    }
                );
                console.log(
                    `Rows updated for service ID ${service.id}:`,
                    updatedRows
                );
            })
        );

        await transaction.commit();
        return {
            success: true,
            message: "Servicios actualizados correctamente",
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error actualizando servicios:", error);
        throw new Error("Error actualizando servicios");
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getAllCategories,
    getServicesByCategory,
    getServicesByCategoryForAdmins,
    updateServiceGroup,
};
