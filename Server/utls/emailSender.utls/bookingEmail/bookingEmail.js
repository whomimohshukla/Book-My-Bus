// utils/mailSender.js
const nodemailer = require("nodemailer");
const emailTemplates = require("./BookingTempelate");
const generateTicketPdf = require("../../pdf.utils/generateTicketPdf");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error verifying mail configuration:', error);
  } else {
    console.log('Mail server is ready to send messages');
  }
});

exports.sendEmail = async (to, subject, text, html, attachments = []) => {
  const mailOptions = {
    from: `"BookMyBus" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html: html || text, // Use HTML if provided, fallback to text
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Specific email sending functions
exports.sendBookingConfirmation = async (booking, schedule) => {
  try {
    if (!booking || !booking.contactDetails || !booking.contactDetails.email) {
      console.error('Invalid booking data for email:', booking);
      throw new Error('Invalid booking data: missing contact email');
    }

    if (!schedule) {
      console.error('Invalid schedule data for email:', schedule);
      throw new Error('Invalid schedule data');
    }

    const html = emailTemplates.getBookingConfirmationTemplate(booking, schedule);

    // Generate ticket PDF buffer
    let pdfBuffer;
    try {
      pdfBuffer = await generateTicketPdf(booking, schedule);
    } catch (pdfErr) {
      console.error('Failed to generate PDF ticket:', pdfErr);
      // Proceed without attachment if PDF generation fails
    }

    await this.sendEmail(
      booking.contactDetails.email,
      'Booking Confirmation - BookMyBus',
      'Your booking has been confirmed',
      html,
      pdfBuffer
        ? [
            {
              filename: `ticket-${booking._id}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ]
        : []
    );
    console.log('Booking confirmation email sent successfully to:', booking.contactDetails.email);
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    // Don't throw the error to prevent booking creation failure
    // but log it for monitoring
  }
};

exports.sendPaymentConfirmation = async (payment, booking) => {
  const html = emailTemplates.getPaymentConfirmationTemplate(payment, booking);
  await this.sendEmail(
    booking.contactDetails.email,
    "Payment Confirmation - BookMyBus",
    "Your payment has been processed",
    html
  );
};

exports.sendCancellationConfirmation = async (booking, refundDetails) => {
  const html = emailTemplates.getCancellationTemplate(booking, refundDetails);
  await this.sendEmail(
    booking.contactDetails.email,
    "Booking Cancellation - BookMyBus",
    "Your booking has been cancelled",
    html
  );
};
