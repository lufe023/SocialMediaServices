//? Dependencies
const uuid = require("uuid");

const Users = require("../models/users.models");
const { hashPassword } = require("../utils/crypto");
const { Model } = require("sequelize");
const Funds = require("../models/funds.models");
const Roles = require("../models/roles.models");

const getAllUsers = async () => {
    const data = await Users.findAll({
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

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail,
    requestForgotPassword,
    changeForgotPassword,
};
