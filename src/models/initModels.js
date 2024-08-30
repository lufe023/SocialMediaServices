const Users = require("./users.models");
const Roles = require("./roles.models");
const Transactions = require("./transactions.models");
const Services = require("./services.models");
const FundTransactions = require("./fundTransactions.models");
const Funds = require("./funds.models");
const ServiceOrders = require("./serviceOrders.models");
const AuditLog = require("./AuditLog");
const Configuration = require("./configuration");

const initModels = () => {
    Users.belongsTo(Roles, { foreignKey: "role" });
    Roles.hasMany(Users, { foreignKey: "role" });

    Transactions.belongsTo(Users, { foreignKey: "user_id" });
    Users.hasMany(Transactions, { foreignKey: "user_id" });

    Transactions.belongsTo(Services, { foreignKey: "service_id" });
    Services.hasMany(Transactions, { foreignKey: "service_id" });

    FundTransactions.belongsTo(Users, { foreignKey: "user_id" });
    Users.hasMany(FundTransactions, { foreignKey: "user_id" });

    Funds.belongsTo(Users, { foreignKey: "user_id" });
    Users.hasOne(Funds, {
        foreignKey: "userId",
        sourceKey: "id",
        as: "fondos",
    });

    // Agregar asociaciones entre ServiceOrders y Services
    ServiceOrders.belongsTo(Services, {
        foreignKey: "serviceId",
        as: "service",
    });
    Services.hasMany(ServiceOrders, { foreignKey: "serviceId" });
};

module.exports = initModels;
