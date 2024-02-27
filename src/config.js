//? Dependencies
require('dotenv').config()

const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV, //? Desarrollo, Testing, Produccion
    jwtSecret: process.env.JWT_SECRET,
    host: process.env.HOST,
    frontendHost: process.env.FRONTENDHOST,
    db: {
        host: process.env.DB_HOST ,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        dbName: process.env.DB_NAME 
    }
}

module.exports = config