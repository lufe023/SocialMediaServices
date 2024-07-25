const Users = require("./users.models");
const Roles = require("./roles.models");
const Transactions = require("./transactions.models");
const Services = require("./services.models");
const FundTransactions = require("./fundTransactions.models");
const Funds = require("./funds.models");

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
    Users.hasOne(Funds, { foreignKey: "user_id" });
};

module.exports = initModels;

/* */
