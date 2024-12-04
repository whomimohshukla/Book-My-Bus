const express = require("express");
const routes = express.Router();

//import controllers

const {
  otpSender,
  signup,
  resendOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  googleSignup,
} = require("../../controllers/User.Controller.Auth/User.Auth.controller");
const { auth } = require("../../middleware/User.Auth.Middleware");

// mount controllers with routes

routes.post("/otp-Verify", otpSender);
routes.post("/signup", signup);
routes.post("/resend-otp", resendOtp);
routes.post("/login", login);
routes.post("/google-signup", googleSignup);
routes.post("/forgotPassword", forgotPassword);
routes.post("/resetPassword", resetPassword);
routes.put("/profile", auth, updateProfile);
routes.put("/change-password", auth, updatePassword);

module.exports = routes;
