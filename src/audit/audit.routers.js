// routes/services.routes.js
const express = require("express");
const passport = require("passport");
const SynchronizeService = require("../services/imporServices");
const roleValidate = require("../middlewares/role.middleware");

require("../middlewares/auth.middleware")(passport);

const router = express.Router();

router
    .route("/synchronize")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        SynchronizeService.importJqawServices
    );

module.exports = router;
