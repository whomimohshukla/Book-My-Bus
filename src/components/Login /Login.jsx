import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import { FaEnvelope, FaLock, FaBus, FaGoogle } from "react-icons/fa";
import api from "../../utils/api";

function InputField({ label, type, value, onChange, placeholder, icon: Icon }) {
	return (
		<div className='mb-6'>
			<label className='block text-gray-700 font-medium mb-2'>{label}</label>
			<div className='relative'>
				<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
					<Icon className='h-5 w-5 text-gray-400' />
				</div>
				<input
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required
					className='w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-LightGreen focus:ring-2 focus:ring-LightGreen/20 transition-all duration-300 text-gray-700'
				/>
			</div>
		</div>
	);
}

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	useEffect(() => {
		setIsButtonDisabled(!(email.length > 0 && password.length > 0));
	}, [email, password]);

	const handleGoogleLoginSuccess = async (credentialResponse) => {
		const toastId = toast.loading("Signing in with Google...", {
			position: "bottom-right",
		});

		try {
			setIsLoading(true);
			// console.log("Google credential response:", credentialResponse);

			if (!credentialResponse.credential) {
				throw new Error("No credential received from Google");
			}

			const response = await axios.post(
				"http://localhost:8000/api/user/google-signup", // Use the same endpoint as signup
				{
					token: credentialResponse.credential,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			// console.log("Server response:", response.data);

			if (
				response.status === 200 &&
				response.data.token &&
				response.data.user
			) {
				const { token, user } = response.data;
				login(token, user);
				toast.update(toastId, {
					render: "Successfully signed in with Google! Redirecting...",
					type: "success",
					isLoading: false,
					autoClose: 3000,
				});
				navigate(user.role === "admin" ? "/admin" : "/");
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (error) {
			console.error("Google login error details:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});

			let errorMessage = "Google login failed. ";
			if (error.response?.data?.message) {
				errorMessage += error.response.data.message;
			} else if (error.message) {
				errorMessage += error.message;
			} else {
				errorMessage += "Please try again.";
			}

			toast.update(toastId, {
				render: errorMessage,
				type: "error",
				isLoading: false,
				autoClose: 5000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleLoginError = () => {
		console.error("Google Sign-In was unsuccessful.");
		toast.error("Google login failed. Please try again.");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setIsLoading(true);

		if (!email || !password) {
			setErrorMessage("Please enter both email and password.");
			toast.error("Please enter both email and password.");
			setIsLoading(false);
			return;
		}

		try {
			// const response = await axios.post("http://localhost:8000/api/user/login", {
			//   email,
			//   password,
			// });
			const response = await api.post("/user/login", {
				email,
				password,
			});

			// console.log("Login response:", response.data);

			const { token, user } = response.data;

			if (!token || !user) {
				throw new Error("Invalid server response");
			}

			// Normalize user role to lowercase
			const normalizedUser = {
				...user,
				role: user.role ? user.role.toLowerCase() : null,
			};

			// console.log('Normalized user data before login:', normalizedUser);

			// Store auth data
			login(token, normalizedUser);

			toast.success(`Welcome back, ${normalizedUser.name}!`);

			// Clear form
			setEmail("");
			setPassword("");

			// Navigate based on role (case-insensitive)
			const userRole = normalizedUser.role?.toLowerCase();
			// console.log('User role for navigation:', userRole);

			if (userRole === "admin") {
				// console.log("Admin user detected, navigating to admin dashboard");
				navigate("/admin");
			} else {
				// console.log("Regular user detected, navigating to ticket page");
				const from = location.state?.from?.pathname || "/getTicket";
				navigate(from);
			}
		} catch (error) {
			console.error("Login error:", error);
			const message =
				error.response?.data?.message || "Login failed. Please try again.";
			setErrorMessage(message);
			toast.error(message);
			setIsLoading(false);
		}
	};

	return (
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<div className='min-h-screen bg-gradient-to-br from-Darkgreen/5 to-LightGreen/5 pt-24 md:pt-28'>
				<div className='flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] px-4 py-8'>
					{/* Logo Section */}
					<div className='mb-8 text-center'>
						<div className='w-16 h-16 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mx-auto mb-4'>
							<FaBus className='text-white2 text-3xl' />
						</div>
						<h1 className='text-3xl font-bold text-gray-800'>
							Welcome Back!
						</h1>
						<p className='text-gray-600 mt-2'>
							Sign in to continue your journey
						</p>
					</div>

					{/* Login Card */}
					<div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
						{/* Google Sign In Button */}
						<div className='mb-8'>
							<GoogleLogin
								onSuccess={handleGoogleLoginSuccess}
								onError={handleGoogleLoginError}
								useOneTap
								theme='filled_blue'
								size='large'
								text='signin_with'
								shape='rectangular'
								width='400'
								locale='en'
								render={({ onClick }) => (
									<button
										onClick={onClick}
										className='w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-lg border-2 border-gray-200 hover:border-LightGreen hover:bg-gray-50 hover:shadow-md transition-all duration-300 group relative overflow-hidden'
									>
										<div className='absolute inset-0 w-3 bg-gradient-to-r from-Darkgreen to-LightGreen transform -skew-x-12 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-full'></div>
										<img
											src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
											alt='Google'
											className='w-6 h-6 transform group-hover:scale-110 transition-transform duration-300'
										/>
										<span className='text-gray-700 font-medium text-base transform group-hover:scale-105 transition-transform duration-300'>
											Continue with Google
										</span>
									</button>
								)}
							/>
						</div>

						{/* Improved Divider */}
						<div className='relative mb-8'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-200'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-6 py-2 bg-white text-gray-500 text-sm font-medium rounded-full border border-gray-200'>
									or continue with email
								</span>
							</div>
						</div>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<InputField
								label='Email Address'
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='john@example.com'
								icon={FaEnvelope}
							/>

							<InputField
								label='Password'
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Enter your password'
								icon={FaLock}
							/>

							{errorMessage && (
								<div className='text-red-500 text-sm mt-2'>
									{errorMessage}
								</div>
							)}

							<button
								type='submit'
								disabled={isButtonDisabled || isLoading}
								className='w-full bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
							>
								{isLoading ? (
									<div className='flex items-center justify-center'>
										<div className='w-5 h-5 border-2 border-white2 border-t-transparent rounded-full animate-spin mr-2'></div>
										Signing in...
									</div>
								) : (
									"Sign In with Email"
								)}
							</button>
						</form>

						{/* Footer Links */}
						<div className='mt-8 text-center text-sm text-gray-600'>
							<p className='mb-4'>
								By continuing, you agree to our{" "}
								<Link
									to='/termsAndConditions'
									className='text-Darkgreen hover:underline'
								>
									Terms & Conditions
								</Link>{" "}
								and{" "}
								<Link
									to='/privacyPolicy'
									className='text-Darkgreen hover:underline'
								>
									Privacy Policy
								</Link>
							</p>
							<p>
								Don't have an account?{" "}
								<Link
									to='/signup'
									className='text-Darkgreen font-semibold hover:underline'
								>
									Create Account
								</Link>
							</p>
						</div>
					</div>
				</div>

				<ToastContainer
					position='bottom-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme='colored'
				/>
			</div>
		</GoogleOAuthProvider>
	);
}

export default Login;
