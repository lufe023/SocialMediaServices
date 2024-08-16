//? Dependencies
const uuid = require("uuid");

const Users = require("../models/users.models");
const { hashPassword } = require("../utils/crypto");
const { Model } = require("sequelize");
const Funds = require("../models/funds.models");
const Roles = require("../models/roles.models");
const { Sequelize, Op } = require("sequelize");
const getAllUsers = async (offset, limit) => {
    const data = await Users.findAll({
        offset: offset,
        limit: limit,
        attributes: {
            exclude: ["password"],
        },

        include: [{ model: Funds, as: "fondos" }, { model: Roles }],
        attributes: { exclude: ["password"] },
    });
    return data;
};

const getUserById = async (id) => {
    const data = await Users.findOne({
        where: {
            id: id,
        },
        include: [{ model: Funds, as: "fondos" }, { model: Roles }],
        attributes: { exclude: ["password"] },
    });
    return data;
};

const createUser = async (data) => {
    const newUser = await Users.create({
        id: uuid.v4(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashPassword(data.password),
        phone: data.phone,
        birthday: data.birthday,
        gender: data.gender,
        country: data.country,
    });
    return newUser;
};

const updateUser = async (id, data) => {
    const result = await Users.update(data, {
        where: {
            id,
        },
    });
    return result;
};

const deleteUser = async (id) => {
    const data = await Users.destroy({
        where: {
            id,
        },
    });
    return data;
};

//? Un servidor contiene la API
//? Otro servidor contiene la Base de Datos

const getUserByEmail = async (email) => {
    //? SELECT * FROM users where email = 'sahid.kick@academlo.com'//
    const data = await Users.findOne({
        where: {
            email: email,
            status: "active",
        },
        include: [
            {
                model: Roles,
            },
        ],
    });
    return data;
};

const requestForgotPassword = async (email) => {
    const codigo = uuid.v4();
    const result = await Users.update(
        {
            passwordRequest: codigo,
        },
        {
            where: {
                email,
            },
        }
    );
    return [result, codigo];
};

const changeForgotPassword = async (idRequest, data) => {
    const result = await Users.update(
        {
            password: hashPassword(data.newPassword),
            passwordRequest: null,
        },
        {
            where: {
                passwordRequest: idRequest,
            },
        }
    );
    return result;
};

const changeUserRoleController = async (id, newRole) => {
    const change = await Users.update(
        {
            role: newRole,
        },
        {
            where: {
                id,
            },
        }
    );

    return change;
};

const findUserController = async (findWord) => {
    let looking = findWord.trim().replace(/-/g, "");

    // Separar el nombre y el apellido
    const [firstName, ...lastNameParts] = looking.split(" ");
    const lastName = lastNameParts.join(" ");

    // Construir las condiciones dinámicamente
    let whereConditions = [
        { email: { [Op.iLike]: `%${looking}%` } },
        { phone: { [Op.iLike]: `%${looking}%` } },
    ];

    // Condiciones adicionales basadas en la entrada
    if (firstName) {
        whereConditions.push({ firstName: { [Op.iLike]: `%${firstName}%` } });
    }
    if (lastName) {
        whereConditions.push({ lastName: { [Op.iLike]: `%${lastName}%` } });
    }
    if (firstName && lastName) {
        whereConditions.push({
            [Op.and]: [
                { firstName: { [Op.iLike]: `%${firstName}%` } },
                { lastName: { [Op.iLike]: `%${lastName}%` } },
            ],
        });
    }

    const data = await Users.findAndCountAll({
        limit: 5,
        where: {
            [Op.or]: whereConditions,
        },
        include: [
            {
                model: Roles,
            },
        ],
    });

    return data;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    requestForgotPassword,
    changeForgotPassword,
    changeUserRoleController,
    findUserController,
};
