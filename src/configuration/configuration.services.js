const configurationControllers = require("./configuration.controllers");
const { host } = require("../config");

const getAllConfigurationsServices = (req, res) => {
    // Donde inicia
    const offset = Number(req.query.offset) || 0;

    // Capacidad máxima
    const limit = Number(req.query.limit) || 10;

    const urlBase = `${host}/api/v1/configurations`;

    configurationControllers
        .getAllConfigurations(offset, limit)
        .then((data) => {
            const nextPage =
                data.count - offset >= limit
                    ? `${urlBase}?offset=${offset + limit}&limit=${limit}`
                    : null;
            res.status(200).json({
                next: nextPage,
                prev:
                    offset > 0
                        ? `${urlBase}?offset=${offset - limit}&limit=${limit}`
                        : null,
                offset,
                limit,
                count: data.length,
                results: data,
            });
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getConfigurationByIdService = (req, res) => {
    const id = req.params.id;

    configurationControllers
        .getConfigurationById(id)
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Configuration not found" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const createConfigurationService = (req, res) => {
    const { siteTitle, multiplier } = req.body;

    configurationControllers
        .createConfiguration({ siteTitle, multiplier })
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const updateConfigurationByIdService = (req, res) => {
    const id = req.params.id;
    const { siteTitle, multiplier } = req.body;

    configurationControllers
        .updateConfigurationById(id, { siteTitle, multiplier })
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Configuration not found" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const deleteConfigurationByIdService = (req, res) => {
    const id = req.params.id;

    configurationControllers
        .deleteConfigurationById(id)
        .then(() => {
            res.status(200).json({
                message: "Configuration deleted successfully",
            });
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getAccountBalance = (req, res) => {
    configurationControllers
        .getAccountBalance()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
};

module.exports = {
    getAllConfigurationsServices,
    getConfigurationByIdService,
    createConfigurationService,
    updateConfigurationByIdService,
    deleteConfigurationByIdService,
    getAccountBalance,
};
