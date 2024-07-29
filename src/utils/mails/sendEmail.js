const nodemailer = require("nodemailer");
require("dotenv").config();

enviarMail = async (from, mailReceiver, subject, text, html) => {
    const config = {
        host: process.env.HOST_EMAIL_SENDER,
        port: process.env.HOST_EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.PASSWORD_HOST_USER,
        },
    };

    const mensaje = {
        from: from,
        to: mailReceiver,
        subject: subject,
        text: text,
        html: html,
    };

    const transport = nodemailer.createTransport(config);

    const info = await transport.sendMail(mensaje);

    return info;
};

module.exports = {
    enviarMail,
};
