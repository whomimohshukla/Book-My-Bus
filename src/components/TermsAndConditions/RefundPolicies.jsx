import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMoneyBillWave,
  FaClock,
  FaPercentage,
  FaExclamationTriangle,
  FaBan,
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

function RefundPolicies() {
  const navigate = useNavigate();
  const handleAccept = () => {
    localStorage.setItem("termsAccepted", true);
    navigate("/");
    toast.success("Refund policies accepted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 py-12 px-4 font-poppins">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refund <span className="text-Darkgreen">Policies</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At <span className="font-semibold text-Darkgreen">BookMyBus</span>, we
            ensure a transparent and fair refund process for all our customers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PolicySection
            icon={<FaMoneyBillWave />}
            title="Eligibility for Refund"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Cancellations as per operator's policy</li>
                <li>No refunds for missed buses</li>
                <li>Special conditions for promotional tickets</li>
                <li>Subject to booking terms</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaClock />}
            title="Refund Processing Time"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>7-10 business days processing time</li>
                <li>Bank processing time additional</li>
                <li>Status updates via email</li>
                <li>24/7 support assistance</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaPercentage />}
            title="Partial Refunds"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Available for partial cancellations</li>
                <li>Non-refundable service charges</li>
                <li>Prorated refund calculations</li>
                <li>Original payment method credit</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaExclamationTriangle />}
            title="Service Disruptions"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Full refund for operator cancellations</li>
                <li>Weather-related delays excluded</li>
                <li>Alternative booking options</li>
                <li>Compensation policies</li>
              </ul>
            }
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center flex-shrink-0">
              <FaBan className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Non-Refundable Scenarios
              </h2>
              <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-2">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Post-departure cancellations</li>
                  <li>No-show cases</li>
                  <li>Violation of terms and conditions</li>
                  <li>Special fare tickets (as marked)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <FaInfoCircle className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
            <p className="text-sm text-yellow-700">
              Please note that all refund requests must be initiated through your account dashboard or by contacting our customer support. Keep your booking ID handy for faster processing.
            </p>
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

export default RefundPolicies;
