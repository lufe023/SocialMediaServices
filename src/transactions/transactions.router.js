const express = require("express");
const router = express.Router();
const passport = require("passport");
const transactionsServices = require("./transactions.controllers");
const roleValidate = require("../middlewares/role.middleware");
require("../middlewares/auth.middleware")(passport);

router.post(
    "/desactive",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator", "Client"]),
    transactionsServices.createTransaction
);

module.exports = router;
