import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaBus, FaUser, FaEnvelope, FaLock, FaIdCard, FaUserTag } from "react-icons/fa";

function InputField({ label, type, name, value, onChange, placeholder, icon: Icon, error, as = "input", options = [] }) {
  return (
    <div className="mb-4">
      <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-Darkgreen" />
        {label}
      </label>
      {as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-LightGreen focus:border-LightGreen transition-all duration-300 outline-none bg-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 pl-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-LightGreen focus:border-LightGreen transition-all duration-300 outline-none"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "passenger",
    passengerType: "adult",
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
            role: "passenger",
            passengerType: "adult",
          });
          navigate("/");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-lg p-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform duration-300">
              <FaBus className="text-white2 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us for a better journey</p>
          </div>

          {/* Google Sign In Button */}
          <div>
            <button
              onClick={() => {
                const googleLoginBtn = document.querySelector('.google-login-button');
                if (googleLoginBtn) googleLoginBtn.click();
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border-2 border-gray-200 hover:border-LightGreen hover:bg-gray-50 transition-all duration-300 group"
            >
              <FaGoogle className="w-5 h-5 text-Darkgreen group-hover:scale-110 transition-transform duration-300" />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
            <div className="hidden">
              <GoogleLogin
                className="google-login-button"
                onSuccess={(response) => console.log("Google login success:", response)}
                onError={() => console.log("Google login error")}
                useOneTap
                theme="filled_blue"
                shape="pill"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={FaUser}
              error={errors.name}
            />

            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              icon={FaEnvelope}
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={FaLock}
              error={errors.confirmPassword}
            />

            <InputField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              icon={FaIdCard}
              error={errors.role}
              as="select"
              options={[
                { value: "admin", label: "Admin" },
                { value: "passenger", label: "Passenger" }
              ]}
            />

            <InputField
              label="Passenger Type"
              name="passengerType"
              value={formData.passengerType}
              onChange={handleChange}
              icon={FaUserTag}
              error={errors.passengerType}
              as="select"
              options={[
                { value: "adult", label: "Adult" },
                { value: "child", label: "Child" },
                { value: "Senior", label: "Senior" },
                { value: "student", label: "Student" }
              ]}
            />

            {otpSent && (
              <div className="space-y-2">
                <InputField
                  label="OTP"
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  icon={FaLock}
                  error={errors.otp}
                />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-Darkgreen hover:text-LightGreen transition-colors duration-300"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-3 bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 font-semibold rounded-lg hover:opacity-90 transform hover:scale-[0.99] transition-all duration-300"
              >
                Send OTP
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 font-semibold rounded-lg hover:opacity-90 transform hover:scale-[0.99] transition-all duration-300"
              >
                Create Account
              </button>
            )}
          </form>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <Link to="/termsAndConditions" className="text-Darkgreen hover:text-LightGreen transition-colors duration-300">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-Darkgreen hover:text-LightGreen transition-colors duration-300">
                Privacy Policy
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-Darkgreen font-semibold hover:text-LightGreen transition-colors duration-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Signup;
