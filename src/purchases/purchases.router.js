const express = require("express");
const router = express.Router();
const passport = require("passport");
const orderServices = require("./purchases.services");
const roleValidate = require("../middlewares/role.middleware");
require("../middlewares/auth.middleware")(passport);

router.get("/:userId", orderServices.getUserServiceOrders);

router.post(
    "/buy",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator", "Client"]),
    orderServices.createServiceOrder
);

module.exports = router;
