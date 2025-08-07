// controllers/newsletter.controller.js
const NewsletterSubscriber = require("../../models/NewsletterSubscriber.Model/newsletterSubscriber.model");
const { sendEmail } = require("../../utls/emailSender.utls/bookingEmail/bookingEmail");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // upsert
    let subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) {
      subscriber = await NewsletterSubscriber.create({ email });
    }

    // send confirmation email (simple HTML)
    try {
      await sendEmail(
        email,
        "Subscribed to BookMyBus Newsletter",
        `Thank you for subscribing to BookMyBus updates!`,
        `<p>Hi there,</p><p>Thank you for subscribing to the <strong>BookMyBus</strong> newsletter. You'll now receive exclusive offers and travel tips straight to your inbox.</p><p>Happy travels!<br/>BookMyBus Team</p>`
      );
    } catch (e) {
      console.error("Newsletter confirmation email failed", e);
    }

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
