const nodemailer = require("nodemailer");
require("dotenv").config();

// Log the MAIL_USER to check if it's correctly loaded from the environment variables
console.log(process.env.MAIL_USER);

// Create a transporter using your email service configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587, // Set the appropriate port (e.g., 587 for TLS, 465 for SSL)
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // Email address from environment variables
    pass: process.env.MAIL_PASS, // Password from environment variables
  },
});

// Function to send email
exports.sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"BookMyBus" <${process.env.MAIL_USER}>`, // Use process.env.MAIL_USER
    to,
    subject,
    text,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
