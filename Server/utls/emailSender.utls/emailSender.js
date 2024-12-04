const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (to, subject, text) => {
  try {
    // Ensure environment variables are set
    const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      console.warn("Mail configuration is incomplete.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // Enhanced HTML email template with professional styling
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background-color: #1a73e8; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: white; margin: 0;">BookMyBus</h1>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h2 style="color: #1a73e8; margin-top: 0;">Email Verification</h2>
              
              <p style="color: #333333;">Dear User,</p>
              
              <p style="color: #333333;">Thank you for choosing BookMyBus. To ensure the security of your account, please verify your email address using the following verification code:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
                <h2 style="color: #1a73e8; margin: 0; font-size: 24px; letter-spacing: 2px;">${text}</h2>
              </div>
              
              <p style="color: #333333;">This verification code will expire in 10 minutes for security purposes. Please enter this code on the verification page to complete your registration.</p>
              
              <p style="color: #333333;">If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666666; margin-bottom: 5px;">Best regards,</p>
                <p style="color: #1a73e8; font-weight: bold; margin-top: 0;">The BookMyBus Team</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px;">
              <p style="color: #666666; font-size: 12px; margin: 5px 0;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="color: #666666; font-size: 12px; margin: 5px 0;">
                ${new Date().getFullYear()} BookMyBus. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const plainText = `
      BookMyBus - Email Verification

      Dear User,

      Thank you for choosing BookMyBus. To ensure the security of your account, please verify your email address using the following verification code:

      ${text}

      This verification code will expire in 10 minutes for security purposes. Please enter this code on the verification page to complete your registration.

      If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.

      Best regards,
      The BookMyBus Team

      Note: This is an automated message. Please do not reply to this email.
      ${new Date().getFullYear()} BookMyBus. All rights reserved.
    `;

    const info = await transporter.sendMail({
      from: `"BookMyBus" <${MAIL_USER}>`,
      to,
      subject,
      text: plainText,
      html: emailContent,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = mailSender;
