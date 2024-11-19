import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RefundPolicies() {
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
          Refund Policies
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Thank you for choosing{" "}
          <span className="font-semibold text-Darkgreen">BookMyBus</span>. We
          understand that plans can change, and we have outlined our refund
          policies to ensure a smooth process for cancellations and refunds.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            1. Eligibility for Refund
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Refunds are applicable only for tickets canceled as per the
            operator's cancellation policy. - Refunds are not issued for missed
            buses due to passenger delays or incorrect boarding point details. -
            Tickets purchased under promotional offers or discounts may be
            non-refundable.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            2. Refund Processing Time
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Refunds for eligible cancellations will be processed within 7-10
            business days. - In case of delays in refund processing, please
            contact our support team for assistance.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            3. Partial Refunds
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - If only a part of your booking is canceled, a partial refund will
            be processed for the canceled segment. - Additional fees, such as
            payment gateway charges, are non-refundable.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            4. Service Disruptions
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - In the event of bus cancellations by the operator, a full refund
            will be issued to the original payment method. - BookMyBus is not
            responsible for delays or disruptions caused by external factors
            such as weather or traffic.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            5. Non-Refundable Scenarios
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - No refunds will be issued for tickets canceled after the departure
            time. - Tickets that do not meet the cancellation policy criteria
            are non-refundable.
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

export default RefundPolicies;
