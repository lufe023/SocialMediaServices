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
        // Este callback no se llamará, passport redirige automáticamente
    }
);

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
        // Obtén la URL base del frontend desde una variable de entorno
        const frontendHost =
            process.env.FRONTEND_HOST || "http://localhost:5173";

        // Asegúrate de que frontendHost no tenga una barra inclinada al final
        const frontendHostWithoutTrailingSlash = frontendHost.replace(
            /\/+$/,
            ""
        );

        if (err || !user) {
            // Redirigir al frontend con un mensaje de error si el usuario no está activo
            return res.redirect(
                `${frontendHostWithoutTrailingSlash}/login?error=${encodeURIComponent(
                    "El usuario no está activo"
                )}`
            );
        }

        const { token } = user;

        res.redirect(
            `${frontendHostWithoutTrailingSlash}/login?token=${token}`
        );
    })(req, res, next);
});
// Ruta para cerrar sesión
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

module.exports = router;
