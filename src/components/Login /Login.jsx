import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import backgroundImage from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/empty-red-seats-inside-public-bus-sunset-empty-red-bus-seats-warm-sunset-light-creating-cozy-urban-scene-commuting-336102958.webp";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider"; // Importing useAuth for login handling

function InputField({ label, type, value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-600 font-medium mb-2">
        {label}:
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full p-3 border border-Darkgreen rounded-md focus:ring-2 focus:ring-Darkgreen focus:outline-none"
      />
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth(); // Using AuthContext for managing login

  // Disable login button if email or password is empty
  useEffect(() => {
    setIsButtonDisabled(!(email.length > 0 && password.length > 0));
  }, [email, password]); // Dependencies are email and password

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(
        "http://localhost:8000/api/v1/google-login",
        {
          token: credentialResponse.credential,
        }
      );
      login(response.data.token); // Using context to handle token
      toast.success("Logged in with Google successfully!");
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Start loading

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        email,
        password,
      });
      login(response.data.token); // Using context for login
      toast.success("Logged in successfully!");
      navigate("/getTicket");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during login:", error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div
        className="flex justify-center items-center min-h-screen p-4 bg-cover bg-center"
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
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errorMessage && (
              <p className="text-Darkgreen text-sm mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-Darkgreen hover:shadow-none hover:scale-95 transition-all duration-200 text-white font-semibold rounded-lg hover:bg-Darkgreen shadow-md"
              disabled={isButtonDisabled || isLoading} // Disable button based on state
            >
              {isLoading ? (
                <span>Loading...</span> // Loading text
              ) : (
                "Login"
              )}
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
