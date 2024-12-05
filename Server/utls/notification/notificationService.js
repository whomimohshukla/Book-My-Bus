const nodemailer = require("nodemailer");
const twilio = require("twilio");

require("dotenv").config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer
const emailTransporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Send SMS using Twilio
exports.sendSMS = async (phoneNumber, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return {
      success: true,
      messageId: response.sid,
    };
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw new Error("Failed to send SMS notification");
  }
};

// utils/notification/notificationService.js

exports.sendEmail = async (
  to,
  subject,
  { location, emergencyType, description, busId, timestamp }
) => {
  const emergencyTypeMap = {
    medical: "Medical Emergency 🚑",
    accident: "Accident Emergency 🚨",
    security: "Security Emergency 👮",
    fire: "Fire Emergency 🚒",
    other: "Emergency Alert ⚠️",
  };

  const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  const formattedTime = new Date(timestamp || Date.now()).toLocaleString();

  const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
              <div style="background-color: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">⚠️ EMERGENCY ALERT ⚠️</h1>
                  <p style="font-size: 18px; margin-top: 10px;">${
                    emergencyTypeMap[emergencyType] || emergencyTypeMap.other
                  }</p>
              </div>
  
              <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="margin-bottom: 20px;">
                      <h2 style="color: #dc3545; margin-bottom: 15px;">Emergency Details</h2>
                      <p style="margin: 5px 0;"><strong>Time:</strong> ${formattedTime}</p>
                      <p style="margin: 5px 0;"><strong>Bus ID:</strong> ${busId}</p>
                      <p style="margin: 5px 0;"><strong>Type:</strong> ${
                        emergencyType?.toUpperCase() || "Not Specified"
                      }</p>
                      ${
                        description
                          ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${description}</p>`
                          : ""
                      }
                  </div>
  
                  <div style="margin-bottom: 20px;">
                      <h2 style="color: #dc3545; margin-bottom: 15px;">Location Information</h2>
                      <p style="margin: 5px 0;"><strong>Coordinates:</strong> ${
                        location.latitude
                      }, ${location.longitude}</p>
                      <div style="margin: 15px 0;">
                          <a href="${googleMapsLink}" 
                             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                             🗺️ View on Google Maps
                          </a>
                      </div>
                  </div>
  
                  <div style="margin-bottom: 20px; background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 5px solid #ffc107;">
                      <h3 style="color: #856404; margin-top: 0;">Immediate Actions Required:</h3>
                      <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                          <li>Contact emergency services if necessary</li>
                          <li>Try to establish communication with the bus</li>
                          <li>Keep your phone accessible for updates</li>
                          <li>Follow emergency protocols as established</li>
                      </ul>
                  </div>
  
                  <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px;">
                      <p style="margin: 0; color: #721c24; font-size: 14px;">
                          <strong>Note:</strong> This is an automated emergency alert from the BookMyBus Emergency Response System. 
                          Please respond according to established emergency protocols.
                      </p>
                  </div>
              </div>
  
              <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
                  <p>This is an automated emergency notification from BookMyBus Emergency Response System.</p>
                  <p>Please do not reply to this email. For immediate assistance, contact emergency services.</p>
              </div>
          </div>
      `;

  const mailOptions = {
    from: {
      name: "BookMyBus Emergency Alert",
      address: process.env.EMAIL_USER,
    },
    to: to,
    subject: `🚨 ${subject} - Immediate Action Required`,
    html: htmlContent,
    // Plain text version for email clients that don't support HTML
    text: `
  EMERGENCY ALERT - ${emergencyTypeMap[emergencyType] || "Emergency Alert"}
  
  Time: ${formattedTime}
  Bus ID: ${busId}
  Type: ${emergencyType?.toUpperCase() || "Not Specified"}
  ${description ? `Description: ${description}\n` : ""}
  
  Location Information:
  Coordinates: ${location.latitude}, ${location.longitude}
  Google Maps Link: ${googleMapsLink}
  
  Immediate Actions Required:
  - Contact emergency services if necessary
  - Try to establish communication with the bus
  - Keep your phone accessible for updates
  - Follow emergency protocols as established
  
  Note: This is an automated emergency alert from the BookMyBus Emergency Response System.
  Please respond according to established emergency protocols.
  
  DO NOT REPLY TO THIS EMAIL. For immediate assistance, contact emergency services.
          `,
  };

  try {
    const response = await emailTransporter.sendMail(mailOptions);
    console.log("Emergency email sent successfully:", response.messageId);
    return response;
  } catch (error) {
    console.error("Emergency email sending failed:", error);
    throw error;
  }
};
