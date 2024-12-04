const User = require("../../models/User.Login.Signup/user.model");
const bcrypt = require("bcrypt");
const OTP = require("../../models/Otp.model/otp.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendEmail } = require("../../utls/emailSender.utls/mailSender");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// otp sender api

exports.otpSender = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExists = await OTP.findOne({ otp: generatedOtp });

    while (otpExists) {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: generatedOtp });
    }

    await OTP.create({ email, otp: generatedOtp });
    console.log("OTP entry created:", generatedOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while sending OTP:", error);
    res.status(500).json({ message: "Error occurred while sending OTP" });
  }
};

// resend otp entry with email
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the existing OTP entry
    const existingOtpEntry = await OTP.findOne({ email });

    // If an OTP entry exists, delete it (clean up old OTP)
    if (existingOtpEntry) {
      await OTP.deleteOne({ email });
    }

    // Generate a new OTP
    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExists = await OTP.findOne({ otp: generatedOtp });

    // Ensure the OTP is unique
    while (otpExists) {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: generatedOtp });
    }

    // Save the new OTP entry
    await OTP.create({ email, otp: generatedOtp });
    console.log("New OTP entry created:", generatedOtp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Error occurred while resending OTP:", error);
    res.status(500).json({ message: "Error occurred while resending OTP" });
  }
};

// user signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, otp, passengerType } =
      req.body;
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !otp ||
      !passengerType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // matches the password if don't matches

    if (password != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // check if otp is valid
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // check the otp and recent otp (macthes from db and recent)
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user and add it to the database and add it to the list of users

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      passengerType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });
    res.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login the user and get the password

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check the existance of the email and password fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required.." });
    }
    // find the user by email if does not exist

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //compare the email and password from db using the bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // if everything is valid return the user
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      passengerType: user.passengerType,
    };
    console.log(user.role);
    // generate the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    user.token = token;
    user.password = undefined;

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        message: "User logged in successfully",
        success: true,
        token,
        user,
      });
    console.log(user);
  } catch (error) {
    res.status(500).json({ message: "error while logging in", error: error });
  }
};

//logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// forget password  of login form when password is invalid or invalid email address

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Step 1a: Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Step 1b: Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Step 1c: Generate a password reset token (JWT) to include in the reset link
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    console.log("Reset token:", resetToken);

    // Step 1d: Construct the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    // console.log("Reset link:", resetLink);
    // Step 1e: HTML content for the reset email
    const htmlContent = `
      <p>You requested a password reset</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `;

    // Step 1f: Send email to user with password reset link
    await sendEmail(email, "Password Reset Request", htmlContent);

    // Respond with a success message
    return res
      .status(200)
      .json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res
      .status(500)
      .json({ message: "Error occurred during password reset request" });
  }
};

// reset the password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Token, new password, and confirm password are required",
      });
    }

    //  Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //  Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Find the user by email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //  Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //  Update the password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Error occurred during password reset" });
  }
};

// update the profile

exports.updateProfile = async (req, res) => {
  try {
    const { name, passengerType } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.passengerType = passengerType;
    user.image = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
    console.log(user);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Error occurred while updating profile" });
  }
};

// update the password

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully", user });
    console.log(user);
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ message: "Error occurred while updating password" });
  }
};

// Google signup
exports.googleSignup = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate JWT and return
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Create new user
    const password = await bcrypt.hash(email + process.env.JWT_SECRET, 10); // Create a secure random password

    if (!user) {
      await User.create({
        name,
        email,
        password,
        role: "Passenger", // Default role for Google signup
        passengerType: "Adult", // Default passenger type
        isEmailVerified: true, // Google accounts are already verified
        profilePicture: picture,
      });
    }
    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google signup error:", error);
    res.status(500).json({
      message: "Google signup failed",
      error: error.message,
    });
  }
};
