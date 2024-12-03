const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (to, subject, text) => {
  console.log(text);
  try {
    // Ensure environment variables are set
    const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      console.warn("Mail configuration is incomplete.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587, // Common SMTP port
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // Send email
    // Define the email content
    const emailContent = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to BookMyBus!</h2>
      <p>Thank you for signing up. Please verify your email address using the OTP below:</p>
      <h3 style="color: #007BFF;"><strong>${text}</strong></h3>
      <p>This OTP is valid for a limited time only. Please enter it on the verification page to complete your signup process.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>The BookMyBus Team</p>
    </div>
  `;
    const info = await transporter.sendMail({
      from: `"BookMyBus" <${MAIL_USER}>`,
      to,
      subject,
      text,
      html: emailContent, // Dynamic HTML body
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = mailSender;
