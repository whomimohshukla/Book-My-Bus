import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/busBg.jpg";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "passenger", // reset role
    passengerType: "adult", // reset passenger type
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    if (!formData.otp && otpSent) newErrors.otp = "OTP is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (formData.email) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/send-otp",
          { email: formData.email }
        );
        if (response.status === 200) {
          setOtpSent(true);
          toast.success("OTP sent to your email");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error sending OTP");
      }
    } else {
      toast.error("Please enter an email first");
    }
  };
  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/resendOtp",
        { email: formData.email }
      );
      if (response.status === 200) {
        toast.success("OTP resent to your email");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resending OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/signup",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          toast.success("Signup successful");
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
            role: "passenger", // reset role
            passengerType: "adult", // reset passenger type
          });
          navigate("/home");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      
      <div
        className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fallback color
          backgroundBlendMode: "overlay", // Transparent overlay
        }}
      >
        <ToastContainer />
        <div className="bg-white border p-6 md:p-10 mt-20 mb-48 rounded-lg shadow-3xl w-full max-w-lg space-y-11 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-Darkgreen">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-600 text-xs">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-600 text-xs">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm md:text-base font-semibold ">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-600">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
              >
                {/* <option value="">Select Role</option> */}
                <option value="admin">Admin</option>
                <option value="User">User</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-xs">{errors.role}</p>
              )}
            </div>
            <div>
              <label className="block text-sm md:text-base font-semibold text-gray-600">
                Passenger Type
              </label>
              <select
                name="passengerType"
                value={formData.passengerType}
                onChange={handleChange}
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
              >
                {/* <option value="">Select Passenger Type</option> */}
                <option value="adult">Adult</option>
                <option value="child">Child</option>
                <option value="Senior">Senior</option>
                <option value="student">student</option>
              </select>
              {errors.passengerType && (
                <p className="text-red-600 text-xs">{errors.passengerType}</p>
              )}
            </div>
            {otpSent && (
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-600">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
                  placeholder="Enter the OTP sent to your email"
                />
                {errors.otp && (
                  <p className="text-red-600 text-xs">{errors.otp}</p>
                )}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="mt-2 text-sm text-blue-600 hover:underline "
                >
                  Resend OTP
                </button>
              </div>
            )}
            {!otpSent && (
              <div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2 bg-Darkgreen hover:shadow-none hover:scale-95 transition-all duration-200  text-white2 font-semibold rounded-lg hover:bg-Darkgreen  shadow-md"
                >
                  Send OTP
                </button>
              </div>
            )}
            <div>
              <button
                type="submit"
               className="w-full py-2 bg-Darkgreen hover:shadow-none hover:scale-95 transition-all duration-200  text-white2 font-semibold rounded-lg hover:bg-Darkgreen  shadow-md"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-600 font-medium">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <div className="text-center">
            <GoogleLogin
              onSuccess={(response) =>
                console.log("Google login success:", response)
              }
              onError={() => console.log("Google login error")}
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>
          {/* Discounts and Terms Message */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Sign in to avail exciting discounts and cashbacks! By signing up,
            you agree to our{" "}
            <Link
              to="/terms"
              className="text-Darkgreen font-semibold hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-Darkgreen font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-Darkgreen font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Signup;
