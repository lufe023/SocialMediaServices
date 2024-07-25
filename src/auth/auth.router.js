//? Auth va a contener las rutas de autorizacion y autenticacion
//* Login
//* Register
//* Recovery Password
//* Verify User

const router = require("express").Router();
const passport = require("passport");
const authServices = require("./auth.services");
const { registerUser } = require("../users/users.services");

//? /api/v1/auth

router.post("/register", registerUser);

router.post("/login", authServices.login);

// Ruta para iniciar el proceso de autenticación con Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
        const { token } = req.user;
        res.status(200).json({
            message: "Correct Credentials",
            token,
        });
        //res.redirect(`http://localhost:3000?token=${token}`);
    }
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const { token } = req.user;
        res.redirect(`http://localhost:5173#/login?token=${token}`);
    }
);

// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

/* sin secretos*/
module.exports = router;
