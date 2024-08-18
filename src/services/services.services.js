// services/services.services.js
const servicesControllers = require("./services.controllers");

const getAllServices = async (req, res) => {
    try {
        const data = await servicesControllers.getAllServices();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getServiceById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await servicesControllers.getServiceById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "Service not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createService = async (req, res) => {
    const serviceData = req.body;
    try {
        const newService = await servicesControllers.createService(serviceData);
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateService = async (req, res) => {
    const id = req.params.id;
    const serviceData = req.body;
    try {
        const [updated] = await servicesControllers.updateService(
            id,
            serviceData
        );
        if (updated) {
            res.status(200).json({
                message: `Service with ID: ${id} updated successfully!`,
            });
        } else {
            res.status(404).json({ message: "Service not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteService = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await servicesControllers.deleteService(id);
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Service not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener todas las categorías
const getAllCategories = (req, res) => {
    servicesControllers
        .getAllCategories()
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: err }));
};

//Obtener servicios por categoría
const getServicesByCategory = (req, res) => {
    const parentCategory = req.params.category;
    servicesControllers
        .getServicesByCategory(parentCategory)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: err.message }));
};

//Obtener servicios por categoría
const getServicesByCategoryForAdmins = (req, res) => {
    const parentCategory = req.params.category;
    servicesControllers
        .getServicesByCategoryForAdmins(parentCategory)
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json({ message: err.message }));
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
};
