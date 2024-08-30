// routes/services.routes.js
const express = require("express");
const passport = require("passport");
const servicesServices = require("./services.services");
const SynchronizeService = require("./imporServices");
const roleValidate = require("../middlewares/role.middleware");

require("../middlewares/auth.middleware")(passport);

const router = express.Router();

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        servicesServices.getAllServices
    )

    .post(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        servicesServices.createService
    );

router.get(
    "/categories",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator", "Client"]),
    servicesServices.getAllCategories
);

router
    .route("/original")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        servicesServices.getAllServicesFromJQAW
    );

router.get(
    "/category/:category",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator", "Client"]),
    servicesServices.getServicesByCategory
);

router.get(
    "/admin/category/:category",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    servicesServices.getServicesByCategoryForAdmins
);

router
    .route("/:id")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        servicesServices.getServiceById
    )
    .patch(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        servicesServices.updateService
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        servicesServices.deleteService
    );

router
    .route("/edit/group")
    .patch(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        servicesServices.updateServiceGroup
    );

router
    .route("/synchronize")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        SynchronizeService.importJqawServices
    );

module.exports = router;
