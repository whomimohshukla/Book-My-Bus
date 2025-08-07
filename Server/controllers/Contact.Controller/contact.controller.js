const ContactMessage = require("../../models/Contact.model/contact.model");
const transporter = require("../../utls/transPorter");
exports.createContact = async (req, res) => {
	try {
		const { name, email, message } = req.body;
		if (!name || !email || !message) {
			return res.status(400).json({ error: "All fields are required." });
		}

		// Check if the email already exists
		const existingContact = await ContactMessage.findOne({ email });
		if (existingContact) {
			return res.status(400).json({ error: "Email already exists." });
		}

		const newContactMessage = new ContactMessage({ name, email, message });
		await newContactMessage.save();
		console.log("Message saved to database");

		const mailOptions = {
			from: `"${name}" <${email}>`,
			to: "mimohshukla0001@gmail.com",
			subject: `New Contact Inquiry - Book My Bus`,
			text: `
Dear Book My Bus Team,

A new contact inquiry has been received through the website contact form.

Contact Details:
---------------
Name: ${name}
Email: ${email}

Message:
--------
${message}

This message was sent via the Book My Bus contact form at ${new Date().toLocaleString()}.

Best regards,
Book My Bus System
-------------------
Note: This is an automated message. Please do not reply directly to this email.
      `,
			html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5282;">New Contact Inquiry - Book My Bus</h2>
          
          <p>Dear Book My Bus Team,</p>
          
          <p>A new contact inquiry has been received through the website contact form.</p>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          
          <p style="color: #718096; font-size: 0.875rem;">
            This message was sent via the Book My Bus contact form at ${new Date().toLocaleString()}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="color: #718096; font-size: 0.875rem;">
            Best regards,<br>
            Book My Bus System
          </p>
          
          <p style="color: #a0aec0; font-size: 0.75rem; font-style: italic;">
            Note: This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
				res.status(500).json({ error: "Failed to send email" });
			} else {
				console.log("Email sent: " + info.response);
				res.status(200).json({ message: "Email sent successfully" });
			}
		});
	} catch (error) {
		console.error("Error saving message to database:", error);
		res.status(500).json({ error: "Failed to save message" });
	}
};
