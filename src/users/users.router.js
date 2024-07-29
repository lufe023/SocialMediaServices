const router = require("express").Router();
const passport = require("passport");
const userServices = require("./users.services");
const roleValidate = require("../middlewares/role.middleware");
require("../middlewares/auth.middleware")(passport);

//? rutas raiz

router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    roleValidate(["Administrator"]),
    userServices.getAllUsers
);

//TODO el registerUser ira en la ruta /auth/register

//! router.route('/').get( userServices.getAllUsers)

//? rutas dinamicas por ID /users/:id

//! router.get('/:id')
//! router.patch('/:id')
//! router.put('/:id')
//! router.delete('/:id')

//? Ruta de informacion propia del usuario loggeado
router
    .route("/me")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Cliente"]),
        userServices.getMyUser
    )
    .patch(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Cliente"]),
        userServices.patchMyUser
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        userServices.deleteMyUser
    );

//? /api/v1/users/passwordRequest
router.route("/passwordRequest").post(userServices.requestForgotPassword);

router
    .route("/passwordRequest/:idRequest")
    .patch(userServices.changeForgotPassword);

//? /api/v1/users/:id
router
    .route("/:id")
    .get(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator", "Cliente"]),
        userServices.getUserById
    )
    .patch(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        userServices.patchUser
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        roleValidate(["Administrator"]),
        userServices.deleteUser
    );

module.exports = router;
