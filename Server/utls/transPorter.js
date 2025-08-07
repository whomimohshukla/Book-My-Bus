// contactEmail.js



const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // replace with your environment variable
    pass: process.env.MAIL_PASS, // replace with your environment variable
  },
});

module.exports = transporter;
