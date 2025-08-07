const { default: mongoose } = require("mongoose");
const mailSender = require("../../utls/emailSender.utls/emailSender");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: "5m" } },
  },
  {
    timestamps: true,
  }
);

// / Function to send email
const sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from BookMyBus",
      ` ${otp}`
    );
    console.log("Email sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate error
  }
};

// Pre-save middleware to send OTP via email
OTPSchema.pre("save", async function (next) {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

const otp = mongoose.model("OTP", OTPSchema);
module.exports = otp;
