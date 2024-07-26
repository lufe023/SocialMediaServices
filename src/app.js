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
const userRouter = require("./users/users.router");
const authRouter = require("./auth/auth.router");
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

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
/**/
