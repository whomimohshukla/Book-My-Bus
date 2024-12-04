import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaBus, FaUser, FaEnvelope, FaLock, FaIdCard, FaUserTag } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthProvider";

function InputField({ label, type, name, value, onChange, placeholder, icon: Icon, error, as = "input", options = [] }) {
  return (
    <div className="mb-4">
      <label className=" text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center">
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
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "Passenger",
    passengerType: "Adult",
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGoogleSignupSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      console.log('Google credential response:', credentialResponse);
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const response = await axios.post(
        "http://localhost:8000/api/user/google-signup",
        {
          token: credentialResponse.credential,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Server response:', response.data);
      
      if (response.status === 200 && response.data.token && response.data.user) {
        const { token, user } = response.data;
        login(token, user.role);
        toast.success("Signup successful! You're now logged in.");
        navigate(user.role === 'Admin' ? "/admin" : "/");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Google signup error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = "Google signup failed. ";
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignupError = (error) => {
    console.error("Google Sign-Up error:", error);
    toast.error("Google signup failed. Please make sure you're using a valid Google account.");
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
          "http://localhost:8000/api/user/otp-Verify",
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
        "http://localhost:8000/api/user/resend-otp",
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
        setIsLoading(true);
        // First signup request
        const signupResponse = await axios.post(
          "http://localhost:8000/api/user/signup",
          formData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (signupResponse.status === 200) {
          // Automatically login after successful signup
          const loginResponse = await axios.post(
            "http://localhost:8000/api/user/login",
            {
              email: formData.email,
              password: formData.password,
            }
          );

          if (loginResponse.status === 200) {
            const { token, user } = loginResponse.data;
            // Store auth data using the login function from context
            login(token, user.role);
            
            toast.success("Account created successfully! You're now logged in.");
            
            // Clear form
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              otp: "",
              role: "Passenger",
              passengerType: "Adult",
            });

            // Navigate based on role
            if (user.role === 'Admin') {
              navigate("/admin");
            } else {
              navigate("/getTicket");
            }
          }
        }
      } catch (err) {
        console.error('Signup/Login error:', err);
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 pt-28 md:pt-32 lg:pt-36">
        <ToastContainer />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            {/* Logo and Title */}
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <FaBus className="text-white2 text-3xl sm:text-4xl" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm sm:text-base">Join us for a better journey</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 sm:space-y-8">
              {/* Google Sign In Button */}
              <div className="w-full">
                <button
                  onClick={() => {
                    const googleLoginBtn = document.querySelector('[role="button"]');
                    if (googleLoginBtn) googleLoginBtn.click();
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 font-semibold hover:opacity-90 transform hover:scale-[0.99] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <FaGoogle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>
                    {isLoading ? "Signing up..." : "Continue with Google"}
                  </span>
                </button>
                <div className="hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSignupSuccess}
                    onError={handleGoogleSignupError}
                    useOneTap
                    type="standard"
                    theme="filled_blue"
                    shape="rectangular"
                    size="large"
                    width="100%"
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

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
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
                  </div>

                  <div className="sm:col-span-2">
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
                  </div>

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
                      { value: "Admin", label: "Admin" },
                      { value: "Passenger", label: "Passenger" }
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
                      { value: "Adult", label: "Adult" },
                      { value: "Child", label: "Child" },
                      { value: "Senior", label: "Senior" },
                      { value: "Student", label: "Student" }
                    ]}
                  />
                </div>

                {otpSent && (
                  <div className="space-y-3">
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

                <button
                  type={otpSent ? "submit" : "button"}
                  onClick={otpSent ? undefined : handleSendOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 font-semibold rounded-xl hover:opacity-90 transform hover:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white2 border-t-transparent rounded-full animate-spin mr-2"></div>
                      {otpSent ? "Creating Account..." : "Sending OTP..."}
                    </div>
                  ) : (
                    otpSent ? "Create Account" : "Send OTP"
                  )}
                </button>
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
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Signup;
