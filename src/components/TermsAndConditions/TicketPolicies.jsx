import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TicketPolicies() {
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
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 w-full max-w-4xl space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Ticket Policies
        </h1>

        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          At <span className="font-semibold text-Darkgreen">BookMyBus</span>, we
          strive to provide a seamless ticketing experience. Please review the
          following ticket policies to ensure a smooth booking process.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            1. Ticket Booking
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Tickets must be booked using valid and accurate information. -
            Bookings are confirmed only upon successful payment and generation
            of a ticket. - Ensure that the travel details (date, time, and
            destination) are correct before finalizing the booking.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            2. Ticket Cancellation
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Cancellations can be made up to 24 hours before the scheduled
            departure. - Cancellation charges may apply as per the operator's
            policy. - Refunds for cancellations will be processed within 7-10
            business days.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            3. Refund Policy
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Refunds are processed only for eligible cancellations. - In case
            of service disruptions (e.g., bus cancellations), full refunds will
            be issued. - Payment gateway charges, if any, are non-refundable.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            4. Rescheduling
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Tickets can be rescheduled only if the bus operator allows it. -
            Rescheduling is subject to availability and may involve additional
            charges.
          </p>

          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            5. Boarding and Travel
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            - Passengers are required to carry a valid government-issued photo
            ID along with their e-ticket. - Arrive at the boarding point at
            least 15 minutes before departure. - We are not responsible for
            missed buses due to late arrival or incorrect boarding point
            details.
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

export default TicketPolicies;
