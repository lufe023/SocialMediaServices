const usersControllers = require("./users.controllers");
const { enviarMail } = require("../utils/mails/sendEmail");

const getAllUsers = (req, res) => {
    usersControllers
        .getAllUsers()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const getUserById = (req, res) => {
    const id = req.params.id;
    usersControllers
        .getUserById(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(404).json({ message: err.message });
        });
};

const registerUser = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        birthday,
        gender,
        country,
    } = req.body;

    if (firstName && lastName && email && password && phone && birthday) {
        //? Ejecutamos el controller
        usersControllers
            .createUser({
                firstName,
                lastName,
                email,
                password,
                phone,
                birthday,
                gender,
                country,
            })
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                res.status(400).json(err.message);
            });
    } else {
        //? Error cuando no mandan todos los datos necesarios para crear un usuario
        res.status(400).json({
            message: "All fields must be completed",
            fields: {
                firstName: "string",
                lastName: "string",
                email: "example@example.com",
                password: "string",
                phone: "+521231231231",
                birthday: "YYYY/MM/DD",
            },
        });
    }
};

const requestForgotPassword = (req, res) => {
    const email = req.body.email;

    // Extraer frontendHost URL del frontend desde los encabezados
    const frontendHost = req.headers.referer || req.headers.origin;
    if (!frontendHost) {
        return res
            .status(400)
            .json({ message: "No se pudo determinar el dominio de origen" });
    }

    usersControllers
        .requestForgotPassword(email)
        .then((data) => {
            if (data[0] != 0) {
                res.status(201).json({ message: "Petición enviada" });

                // Crear el cuerpo del correo en formato HTML
                let bodyEmail = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #333;">Recuperación de Contraseña</h2>
                        <p style="font-size: 16px; color: #666;">Se ha hecho una petición para recuperar la contraseña en nuestro sistema. Haga clic en el siguiente enlace para recuperar su contraseña:</p>
                        <a href='${frontendHost}#/recoverypassword/${data[1]}' style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none; margin: 20px 0;">Recuperar Contraseña</a>
                        <p style="font-size: 14px; color: #999;">Si no solicitó este correo, puede ignorarlo.</p>
                        <p style="font-size: 14px; color: #999;">Saludos,<br>El equipo de Luis Fernando Microsystem</p>
                    </div>
                `;

                if (email.includes("@")) {
                    enviarMail(
                        "no-reply@mielector.com",
                        email,
                        "Recuperación de Contraseña",
                        "La recuperación se envió",
                        bodyEmail
                    );
                }
            } else {
                res.status(400).json({
                    message: "Esta petición no pudo ser procesada",
                });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const changeForgotPassword = (req, res) => {
    const idRequest = req.params.idRequest;

    const { newPassword, confirmNewPassword } = req.body;

    if (confirmNewPassword && newPassword) {
        if (confirmNewPassword === newPassword) {
            usersControllers
                .changeForgotPassword(idRequest, { newPassword })
                .then((data) => {
                    if (data[0]) {
                        res.status(200).json({
                            message: `Contraseña cambiada satisfactoriamente`,
                        });
                    } else {
                        res.status(404).json({
                            message: "esta peticion no es valida",
                        });
                    }
                })
                .catch((err) => {
                    res.status(400).json({ message: err.message });
                });
        } else {
            res.status(400).json({ message: "Las contraseñas no coinciden" });
        }
    } else {
        res.status(400).json({
            message: "Debe enviar todas las celdas",
            fields: {
                confirmNewPassword: "string",
                newPassword: "string",
            },
        });
    }
};

const patchUser = (req, res) => {
    const id = req.params.id;
    const data = req.body;
    usersControllers
        .updateUser(id, data)
        .then((data) => {
            if (data[0]) {
                res.status(200).json({
                    message: `User with ID: ${id}, edited succesfully!`,
                });
            } else {
                res.status(404).json({ message: "Invalid ID h" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

const deleteUser = (req, res) => {
    const id = req.params.id;
    usersControllers
        .deleteUser(id)
        .then((data) => {
            if (data) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Invalid ID" });
            }
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

//? My user services

const getMyUser = (req, res) => {
    const id = req.user.id; //? req.user contiene la informacion del token desencriptado
    usersControllers
        .getUserById(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

// TODO crear rutas protegidas /me, con los verbos para update y delete

const patchMyUser = (req, res) => {
    const id = req.user.id;
    const { firstName, lastName, phone, birthday, gender, country } = req.body;

    usersControllers
        .updateUser(id, {
            firstName,
            lastName,
            phone,
            birthday,
            gender,
            country,
        })
        .then(() => {
            res.status(200).json({
                message: `Your user was edited succesfully!`,
            });
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

//? 2 tipos de delete:
//* 1. por administrador
//* 2. por mi mismo

const deleteMyUser = (req, res) => {
    const id = req.user.id;

    usersControllers
        .updateUser(id, { status: "inactive" })
        .then(() => {
            res.status(200).json({
                message: `Your user was deleted succesfully!`,
            });
        })
        .catch((err) => {
            res.status(400).json({ message: err.message });
        });
};

module.exports = {
    getAllUsers,
    getUserById,
    patchUser,
    registerUser,
    deleteUser,
    getMyUser,
    patchMyUser,
    deleteMyUser,
    requestForgotPassword,
    changeForgotPassword,
};
