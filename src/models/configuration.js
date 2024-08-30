const { DataTypes } = require("sequelize");
const db = require("../utils/database");

const configuration = db.define("configuration", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    siteTitle: {
        type: DataTypes.STRING,
    },
    multiplier: {
        type: DataTypes.FLOAT,
        default: 1,
    },
});

module.exports = configuration;
