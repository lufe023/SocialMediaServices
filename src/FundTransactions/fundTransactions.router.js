const router = require("express").Router();
const passport = require("passport");
const fundTransactionServices = require("./fundTransactions.services");
const roleValidate = require("../middlewares/role.middleware");
require("../middlewares/auth.middleware")(passport);

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.getAllFundTransactions
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.createFundTransaction
    );

router
    .route("/:id")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.getFundTransactionById
    )
    .patch(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.updateFundTransaction
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.deleteFundTransaction
    );

router
    .route("/history/:userId")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.getTransactionsHistoryService
    );
router
    .route("/user/:userId")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Client"]),
        fundTransactionServices.getFundTransactionsByUserId
    );

module.exports = router;
