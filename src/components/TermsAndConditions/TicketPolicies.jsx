import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTicketAlt,
  FaBan,
  FaExchangeAlt,
  FaClock,
  FaBusAlt,
  FaInfoCircle,
  FaIdCard,
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

function TicketPolicies() {
  const navigate = useNavigate();
  const handleAccept = () => {
    localStorage.setItem("termsAccepted", true);
    navigate("/");
    toast.success("Ticket policies accepted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 py-12 px-4 font-poppins">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ticket <span className="text-Darkgreen">Policies</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At <span className="font-semibold text-Darkgreen">BookMyBus</span>, we
            ensure a smooth and hassle-free booking experience for all our travelers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PolicySection
            icon={<FaTicketAlt />}
            title="Ticket Booking"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Valid information required</li>
                <li>Confirmation upon payment</li>
                <li>Verify travel details</li>
                <li>E-ticket generation</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaBan />}
            title="Ticket Cancellation"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>24-hour cancellation window</li>
                <li>Operator-specific charges</li>
                <li>7-10 days refund processing</li>
                <li>Easy cancellation process</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaExchangeAlt />}
            title="Rescheduling"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Subject to operator approval</li>
                <li>Based on seat availability</li>
                <li>Additional charges may apply</li>
                <li>Time restrictions apply</li>
              </ul>
            }
          />

          <PolicySection
            icon={<FaBusAlt />}
            title="Boarding and Travel"
            content={
              <ul className="list-disc pl-4 space-y-2">
                <li>Valid ID mandatory</li>
                <li>15 minutes early arrival</li>
                <li>Correct boarding point</li>
                <li>Follow operator guidelines</li>
              </ul>
            }
          />
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center flex-shrink-0">
              <FaClock className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Important Timelines
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Cancellation</h3>
                  <p className="text-sm text-gray-600">Up to 24 hours before departure</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Refund Processing</h3>
                  <p className="text-sm text-gray-600">7-10 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <FaIdCard className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
            <p className="text-sm text-yellow-700">
              Remember to carry a valid government-issued photo ID along with your e-ticket. 
              This is mandatory for boarding and verification purposes.
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
              href="/refundPolicies"
              className="text-Darkgreen hover:text-LightGreen transition-colors duration-300 flex items-center space-x-2"
            >
              <FaExchangeAlt className="text-lg" />
              <span>Refund Policy</span>
            </a>
            <a
              href="/termsAndConditions"
              className="text-Darkgreen hover:text-LightGreen transition-colors duration-300 flex items-center space-x-2"
            >
              <FaInfoCircle className="text-lg" />
              <span>Terms & Conditions</span>
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

export default TicketPolicies;
