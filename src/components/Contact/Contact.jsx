import React, { useRef, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import busImage from "../../assets/maps.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/api";

function Contact() {
	const formRef = useRef(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		const formData = new FormData(event.target);
		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			message: formData.get("message"),
		};

		// Show sending notification
		const toastId = toast.loading("Sending your message...", {
			position: "bottom-right",
			autoClose: false,
		});

		try {
			// const response = await fetch("http://localhost:8000/api/contact/contactMessage", {
			//   method: "POST",
			//   headers: {
			//     "Content-Type": "application/json",
			//   },
			//   body: JSON.stringify(data),
			// });

			const response =api.post("/contact/contactMessage", data)

			if (response.ok) {
				// Update the loading toast to success
				toast.update(toastId, {
					render:
						"Thank you for your message! We'll get back to you soon.",
					type: "success",
					isLoading: false,
					autoClose: 5000,
					closeButton: true,
					closeOnClick: true,
					draggable: true,
				});
				formRef.current.reset();
			} else {
				// Update the loading toast to error
				toast.update(toastId, {
					render: "Failed to send message. Please try again.",
					type: "error",
					isLoading: false,
					autoClose: 5000,
					closeButton: true,
					closeOnClick: true,
					draggable: true,
				});
			}
		} catch (error) {
			console.error("Error:", error);
			// Update the loading toast to error
			toast.update(toastId, {
				render:
					"Network error. Please check your connection and try again.",
				type: "error",
				isLoading: false,
				autoClose: 5000,
				closeButton: true,
				closeOnClick: true,
				draggable: true,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen bg-white2 pt-24 md:pt-20'>
			{/* Hero Section */}
			<div className='bg-gradient-to-r from-Darkgreen to-LightGreen py-16 md:py-20 px-4 md:px-8'>
				<div className='max-w-6xl mx-auto text-center'>
					<h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-white2 mb-4 md:mb-6'>
						Get in Touch
					</h1>
					<p className='text-base md:text-lg lg:text-xl text-white2 opacity-90 max-w-2xl mx-auto px-4'>
						Have questions? We'd love to hear from you. Send us a message
						and we'll respond as soon as possible.
					</p>
				</div>
			</div>

			{/* Contact Info Cards */}
			<div className='max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 -mt-16 relative z-10'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
					{[
						{
							icon: <FaPhoneAlt className='text-3xl' />,
							text: "+1 (800) 123-4567",
							title: "Call Us",
						},
						{
							icon: <FaEnvelope className='text-3xl' />,
							text: "info@bookmybus.com",
							title: "Email Us",
						},
						{
							icon: <FaMapMarkerAlt className='text-3xl' />,
							text: "123 Main St, City, Country",
							title: "Visit Us",
						},
					].map((item, index) => (
						<div
							key={index}
							className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'
						>
							<div className='w-16 h-16 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center text-white2 mb-6'>
								{item.icon}
							</div>
							<h3 className='text-xl font-semibold text-gray-800 mb-2'>
								{item.title}
							</h3>
							<p className='text-gray-600'>{item.text}</p>
						</div>
					))}
				</div>

				{/* Main Content */}
				<div className='mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12'>
					{/* Map Image */}
					<div className='relative h-[300px] md:h-[400px] lg:h-full'>
						<div className='absolute inset-0 bg-gradient-to-r from-Darkgreen to-LightGreen opacity-10 rounded-xl'></div>
						<img
							src={busImage}
							alt='Location Map'
							className='w-full h-full object-cover rounded-xl shadow-lg'
						/>
					</div>

					{/* Contact Form */}
					<div className='bg-white rounded-xl shadow-lg p-6 md:p-8'>
						<h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8'>
							Send us a Message
						</h2>
						<form
							ref={formRef}
							onSubmit={handleSubmit}
							className='space-y-6'
						>
							<div>
								<label className='block text-gray-700 font-medium mb-2'>
									Your Name
								</label>
								<input
									type='text'
									name='name'
									required
									className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-LightGreen focus:ring-2 focus:ring-LightGreen/20 transition-all duration-300'
									placeholder='John Doe'
								/>
							</div>
							<div>
								<label className='block text-gray-700 font-medium mb-2'>
									Your Email
								</label>
								<input
									type='email'
									name='email'
									required
									className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-LightGreen focus:ring-2 focus:ring-LightGreen/20 transition-all duration-300'
									placeholder='john@example.com'
								/>
							</div>
							<div>
								<label className='block text-gray-700 font-medium mb-2'>
									Message
								</label>
								<textarea
									name='message'
									required
									rows='4'
									className='w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-LightGreen focus:ring-2 focus:ring-LightGreen/20 transition-all duration-300'
									placeholder='Your message here...'
								></textarea>
							</div>
							<button
								type='submit'
								disabled={isSubmitting}
								className='w-full bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70'
							>
								{isSubmitting ? "Sending..." : "Send Message"}
							</button>
						</form>
					</div>
				</div>
			</div>

			{/* Social Links */}
			<div className='bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-12 md:py-16 px-4 md:px-8 mt-12 md:mt-16'>
				<div className='max-w-4xl mx-auto text-center'>
					<h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8'>
						Connect With Us
					</h2>
					<div className='flex justify-center gap-4 md:gap-8'>
						{[
							{
								icon: <FiFacebook className='text-3xl' />,
								url: "https://facebook.com",
							},
							{
								icon: <FiTwitter className='text-3xl' />,
								url: "https://twitter.com",
							},
							{
								icon: <FiInstagram className='text-3xl' />,
								url: "https://instagram.com",
							},
							{
								icon: <FiLinkedin className='text-3xl' />,
								url: "https://linkedin.com",
							},
						].map((social, index) => (
							<a
								key={index}
								href={social.url}
								target='_blank'
								rel='noopener noreferrer'
								className='bg-white2 p-4 rounded-full hover:scale-110 transition-transform duration-300'
							>
								<span className='text-Darkgreen'>{social.icon}</span>
							</a>
						))}
					</div>
				</div>
			</div>

			<ToastContainer
				position='bottom-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
				style={{ zIndex: 9999 }}
			/>
		</div>
	);
}

export default Contact;
