import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShieldAlt, FaUserLock, FaHandshake, FaUserCog, FaBell } from "react-icons/fa";

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

function PrivacyPolicy() {
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
            Privacy <span className="text-Darkgreen">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At <span className="font-semibold text-Darkgreen">BookMyBus</span>, we
            value your trust and are committed to protecting your personal
            information.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PolicySection
            icon={<FaShieldAlt />}
            title="Information We Collect"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Personal details for booking tickets</li>
                <li>Contact information</li>
                <li>Payment details</li>
                <li>Device and browser information</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaUserLock />}
            title="Data Security"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>End-to-end encryption</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
                <li>Protected user data storage</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaHandshake />}
            title="How We Use Your Information"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Process bookings and payments</li>
                <li>Improve user experience</li>
                <li>Send important updates</li>
                <li>Provide customer support</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaUserCog />}
            title="Your Rights"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
                <li>Update your preferences</li>
              </ul>
            }
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center flex-shrink-0">
              <FaBell className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Policy Updates
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                This privacy policy may be updated periodically to reflect changes
                in our practices or for legal compliance. We encourage you to
                review this page regularly for the latest information.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={handleAccept}
            className="px-8 py-4 bg-gradient-to-r from-Darkgreen to-LightGreen text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[0.98] transition-all duration-300"
          >
            Accept & Continue
          </button>
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

export default PrivacyPolicy;
