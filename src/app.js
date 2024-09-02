//? Dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./utils/passport");
const db = require("./utils/database");

//? Files
const { port } = require("./config");
//* Routes
const configurationRouter = require("./configuration/configuration.router");
const userRouter = require("./users/users.router");
const authRouter = require("./auth/auth.router");
const transactionRouter = require("./FundTransactions/fundTransactions.router");
const services = require("./services/services.router");
const serviceOrders = require("./purchases/purchases.router");
const audit = require("./audit/audit.routers");

const initModels = require("./models/initModels");
const path = require("path");

//? Initial Configs
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

db.authenticate()
    .then(() => {
        console.log("Database Authenticated");
    })
    .catch((err) => {
        console.log(err);
    });

// db.sync({ alter: true })
db.sync({ alter: false })
    .then(() => {
        console.log("Database Synced");
    })
    .catch((err) => {
        console.log(err);
    });

initModels();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/v1/configurations", configurationRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/services", services);
app.use("/api/v1/serviceOrders", serviceOrders);
app.use("/api/v1/audit", audit);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

/**/
