import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TermsAndConditions() {
  const navigate = useNavigate();
  const handleAccept = () => {
    // Save acceptance to localStorage
    localStorage.setItem("termsAccepted", true);

    navigate("/");

    // Redirect or take another action
    alert("You have accepted the terms and conditions!");

    // Display a success message
    toast.success("Terms and conditions accepted!");
  };
  return (
    <div className="flex font-poppins justify-center items-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 w-full max-w-4xl space-y-6">
        <ToastContainer />
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-Darkgreen">BookMyBus</span>. By
          accessing or using our services, you agree to the following terms and
          conditions. Please read them carefully before using the platform.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            1. User Responsibilities
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Ensure that all information provided during registration or ticket
            booking is accurate and up-to-date. - Comply with all applicable
            laws and regulations while using our platform. - Avoid any
            fraudulent activities, including unauthorized ticket purchases or
            misuse of our services.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            2. Booking Policy
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Tickets once booked are non-refundable unless stated otherwise. -
            We are not responsible for delays, cancellations, or disruptions
            caused by external factors like traffic or weather. - Always verify
            your ticket details, including travel date, time, and destination,
            before confirming.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            3. Privacy Policy
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Your personal data is collected and used only to provide and
            improve our services. - We adhere to strict privacy guidelines and
            do not share your information with third parties without your
            consent.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            4. Disclaimer
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - BookMyBus is a ticket booking platform and does not operate or own
            the buses listed on the website. - We do not guarantee the quality
            of service provided by the operators listed on our platform.
          </p>
        </div>

        {/* <div className="text-center mt-6">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-Darkgreen text-white font-semibold rounded-lg shadow-md hover:bg-Darkgreen-dark hover:scale-95 transition-transform"
          >
            Accept & Continue
          </button>
          <a
            href="/privacy-policy"
            className="text-sm text-Darkgreen hover:underline"
          >
            View Privacy Policy
          </a>
        </div> */}

        <div className="text-center mt-6 space-x-4">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-Darkgreen text-white font-semibold rounded-lg shadow-md hover:bg-Darkgreen-dark hover:scale-95 transition-transform"
          >
            Accept & Continue
          </button>
          <a
            href="/privacyPolicy"
            className="text-sm text-Darkgreen hover:underline"
          >
            View Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
