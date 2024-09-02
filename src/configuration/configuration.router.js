const router = require("express").Router();
const passport = require("passport");
const configurationServices = require("./configuration.services");
const roleValidate = require("../middlewares/role.middleware");
require("../middlewares/auth.middleware")(passport);

// Ruta para obtener todas las configuraciones
router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.getAllConfigurationsServices
);

// Ruta para obtener todas las configuraciones
router.get(
    "/balance",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.getAccountBalance
);

// Ruta para obtener una configuración por ID
router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.getConfigurationByIdService
);

// Ruta para crear una nueva configuración
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.createConfigurationService
);

// Ruta para actualizar una configuración por ID
router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.updateConfigurationByIdService
);

// Ruta para eliminar una configuración por ID
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    configurationServices.deleteConfigurationByIdService
);

module.exports = router;
