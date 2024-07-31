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

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
