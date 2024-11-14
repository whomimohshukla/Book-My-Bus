import React, { useRef, useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";
import busImage from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/maps.jpg"; // Ensure this path is correct
import { toast, ToastContainer } from "react-toastify"; // Import toastify functions
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

function Contact() {
  const formRef = useRef(null); // Reference for the form
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);  // Set loading state to true
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("http://localhost:8000/api/v2/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Message sent successfully!"); // Show success toast
        formRef.current.reset(); // Clear the form after submission
      } else {
        toast.error("Failed to send message."); // Show error toast
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again."); // Show error toast
    } finally {
      setIsSubmitting(false);  // Set loading state to false
    }
  };

  return (
    <div className="font-poppins text-black bg-grayWhite mb-36 p-8 md:p-16">
      {/* Heading */}
      <h1 className="text-center text-4xl md:text-5xl font-bold mb-16 mt-7 text-gray-800">
        Get in <span className="text-Darkgreen">Touch</span>
      </h1>

      {/* Contact Info Section */}
      <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
        <div className="flex items-center gap-4 text-gray-600">
          <FaPhoneAlt className="text-Darkgreen text-2xl" />
          <span className="text-lg md:text-xl">+1 (800) 123-4567</span>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <FaEnvelope className="text-Darkgreen text-2xl" />
          <span className="text-lg md:text-xl">info@bookmybus.com</span>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <FaMapMarkerAlt className="text-Darkgreen text-2xl" />
          <span className="text-lg md:text-xl">123 Main St, City, Country</span>
        </div>
      </div>

      {/* Image and Contact Form Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Bus Image */}
        <div className="w-full md:w-1/2 lg:w-1/3 mb-8 md:mb-0">
          <img
            src={busImage}
            alt="Bus"
            className="rounded-lg shadow-lg w-full h-80 object-cover md:h-96 lg:h-auto"
          />
        </div>

        {/* Contact Form */}
        <form
          ref={formRef} // Attach ref here
          className="w-full md:w-1/2 bg-white p-8 md:p-16 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-6 mb-6">
            <label className="text-gray-700 text-lg font-semibold">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-Darkgreen"
              placeholder="Enter your name"
            />

            <label className="text-gray-700 text-lg font-semibold">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-Darkgreen"
              placeholder="Enter your email"
            />

            <label className="text-gray-700 text-lg font-semibold">
              Message
            </label>
            <textarea
              rows="4"
              name="message"
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring focus:ring-Darkgreen"
              placeholder="Type your message here"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting} // Disable the button when submitting
            className="w-full bg-Darkgreen text-white py-3 rounded font-semibold hover:bg-green-700 hover:shadow-md transition-all duration-200"
          >
            {isSubmitting ? "Sending..." : "SEND MESSAGE"} {/* Show "Sending..." text when submitting */}
          </button>
        </form>
      </div>

      {/* Social Media Links Section */}
      <div className="flex justify-center gap-8 mt-40">
        <a
          href="https://facebook.com"
          className="text-gray-600 hover:text-Darkgreen"
        >
          <FiFacebook className="text-3xl" />
        </a>
        <a
          href="https://twitter.com"
          className="text-gray-600 hover:text-Darkgreen"
        >
          <FiTwitter className="text-3xl" />
        </a>
        <a
          href="https://instagram.com"
          className="text-gray-600 hover:text-Darkgreen"
        >
          <FiInstagram className="text-3xl" />
        </a>
        <a
          href="https://linkedin.com"
          className="text-gray-600 hover:text-Darkgreen"
        >
          <FiLinkedin className="text-3xl" />
        </a>
      </div>

      {/* ToastContainer to display toasts */}
      <ToastContainer />
    </div>
  );
}

export default Contact;
