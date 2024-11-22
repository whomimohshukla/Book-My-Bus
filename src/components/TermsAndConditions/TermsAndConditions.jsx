import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUserShield,
  FaTicketAlt,
  FaUserLock,
  FaExclamationCircle,
  FaFileContract,
  FaInfoCircle,
} from "react-icons/fa";

function PolicySection({ icon, title, content }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center flex-shrink-0">
          <div className="text-2xl text-white">{icon}</div>
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
            {title}
          </h2>
          <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

function TermsAndConditions() {
  const navigate = useNavigate();
  const handleAccept = () => {
    localStorage.setItem("termsAccepted", true);
    navigate("/");
    toast.success("Terms and conditions accepted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 py-12 px-4 font-poppins">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & <span className="text-Darkgreen">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold text-Darkgreen">BookMyBus</span>. 
            Please read our terms carefully before using our services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PolicySection
            icon={<FaUserShield />}
            title="User Responsibilities"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Provide accurate information</li>
                <li>Comply with applicable laws</li>
                <li>Avoid fraudulent activities</li>
                <li>Maintain account security</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaTicketAlt />}
            title="Booking Policy"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Non-refundable tickets unless specified</li>
                <li>Verify details before confirming</li>
                <li>Subject to operator's terms</li>
                <li>Cancellation policy applies</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaUserLock />}
            title="Privacy Policy"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Data collection for service improvement</li>
                <li>Strict privacy guidelines</li>
                <li>No unauthorized data sharing</li>
                <li>Secure information handling</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaExclamationCircle />}
            title="Disclaimer"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Platform for ticket booking only</li>
                <li>No bus operation ownership</li>
                <li>Service quality by operators</li>
                <li>Limited liability scope</li>
              </ul>
            }
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center flex-shrink-0">
              <FaFileContract className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Agreement
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. We reserve the right to modify these terms at any time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <FaInfoCircle className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
            <p className="text-sm text-yellow-700">
              These terms and conditions may be updated periodically. We recommend checking this page regularly for any changes. Your continued use of our services constitutes acceptance of these terms.
            </p>
          </div>
        </div>

        <div className="text-center mt-12 space-y-4">
          <button
            onClick={handleAccept}
            className="px-8 py-4 bg-gradient-to-r from-Darkgreen to-LightGreen text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[0.98] transition-all duration-300"
          >
            Accept & Continue
          </button>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="/privacyPolicy"
              className="text-Darkgreen hover:text-LightGreen transition-colors duration-300 flex items-center space-x-2"
            >
              <FaUserLock className="text-lg" />
              <span>Privacy Policy</span>
            </a>
            <a
              href="/refundPolicies"
              className="text-Darkgreen hover:text-LightGreen transition-colors duration-300 flex items-center space-x-2"
            >
              <FaTicketAlt className="text-lg" />
              <span>Refund Policy</span>
            </a>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default TermsAndConditions;
