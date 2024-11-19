import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import backgroundImage from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/empty-red-seats-inside-public-bus-sunset-empty-red-bus-seats-warm-sunset-light-creating-cozy-urban-scene-commuting-336102958.webp";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthProvider";z

function Login() {
  // const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Use navigate for redirection

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/google-login",
        {
          token: credentialResponse.credential,
        }
      );
      // login(response.data.token); // Save token to context
      navigate("/ticket"); // Redirect to ticket page after successful login
      toast.success("Logged in with Google successfully!");
      localStorage.setItem("token", response.data.token); // Store JWT token
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email,
        password,
      });
      toast.success("Logged in successfully!");
      localStorage.setItem("token", response.data.token);
      // ogin(response.data.token); // Save token to context
      navigate("/getTicket"); // Redirect to ticket page after successful login
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div
        className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="bg-white border p-6 md:p-10 mt-20 mb-48 rounded-lg shadow-3xl w-full max-w-lg space-y-4 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-2xl font-bold text-center text-Darkgreen mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 font-medium mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-600 font-medium mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
                className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
              />
            </div>

            {errorMessage && (
              <p className="text-Darkgreen text-sm mb-4">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-Darkgreen hover:shadow-none hover:scale-95 transition-all duration-200 text-white font-semibold rounded-lg hover:bg-Darkgreen shadow-md"
            >
              Login
            </button>
          </form>
          <div className="flex items-center justify-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-600 font-medium">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="text-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() =>
                toast.error("Google login failed. Please try again.")
              }
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>

          <div className="text-center mt-4 text-sm text-white2">
            <p className="mb-2">
              Unlock special discounts and cashbacks by signing in! By
              continuing, you confirm that you agree with our{" "}
              <Link
                to="/termsAndConditions"
                className="text-Darkgreen font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacyPolicy"
                className="text-Darkgreen font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-Darkgreen font-semibold hover:underline"
              >
                Sign up
              </Link>
              .
            </p>
          </div>

          <ToastContainer />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
