// routes/services.routes.js
const express = require("express");
const passport = require("passport");
const servicesServices = require("./services.services");
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
        roleValidate(["Administrator", "Client"]),
        servicesServices.deleteService
    );

module.exports = router;
