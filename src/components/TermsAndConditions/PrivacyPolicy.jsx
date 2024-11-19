import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivacyPolicy() {
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
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Privacy Policy
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          At <span className="font-semibold text-Darkgreen">BookMyBus</span>, we
          value your trust and are committed to protecting your personal
          information. This policy outlines how we collect, use, and safeguard
          your data.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Personal details such as name, email address, phone number, and
            payment information for booking tickets. - Technical information
            like your device type, IP address, and browser details for improving
            our services.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - To process bookings and manage your account. - To improve user
            experience and troubleshoot technical issues. - To send important
            updates, promotions, and notifications about our services.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            3. Data Sharing and Security
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - We do not sell or rent your personal data to third parties. - Your
            data is shared only with trusted service providers for processing
            transactions or enhancing user experience. - Robust security
            measures are implemented to prevent unauthorized access or misuse of
            your data.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            4. Your Rights
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - You can access, update, or delete your personal information at any
            time by contacting our support team. - You may also opt out of
            receiving marketing communications.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            5. Policy Updates
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - This privacy policy may be updated periodically to reflect changes
            in our practices or for legal compliance. - We encourage you to
            review this page regularly for the latest information.
          </p>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-Darkgreen text-white font-semibold rounded-lg shadow-md hover:bg-Darkgreen-dark hover:scale-95 transition-transform"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
