const userServices = require("../users/users.controllers");

const roleValidate = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Obtener el ID del usuario desde el token JWT
            const userId = req.user.id;

            // Obtener el usuario de la base de datos
            const user = await userServices.getUserById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado" });
            }

            // Verificar si el rol del usuario coincide con alguno de los roles requeridos
            const userRole = user.user_role.roleName;
            const isActive = user.active;

            if (!requiredRoles.includes(userRole)) {
                return res.status(403).json({
                    message: `No tienes el rol requerido para realizar esta acción. Se requiere uno de los siguientes roles: ${requiredRoles.join(
                        ", "
                    )}`,
                });
            }

            // Verificar si el usuario está activo
            if (!isActive) {
                return res.status(403).json({
                    message: `No tienes permisos para esta acción, usuario desactivado`,
                });
            }

            // Continuar al siguiente middleware o controlador
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = roleValidate;
