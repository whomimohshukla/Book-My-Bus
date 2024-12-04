import React from 'react';

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 pt-28 md:pt-32 lg:pt-36">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using BookMyBus, you accept and agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. User Registration</h2>
            <p className="text-gray-600">
              - You must provide accurate information during registration
              - You are responsible for maintaining the security of your account
              - You must be at least 18 years old to use our services
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Booking and Cancellation</h2>
            <p className="text-gray-600">
              - All bookings are subject to availability
              - Cancellation policies vary by service provider
              - Refunds are processed according to our refund policy
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. User Conduct</h2>
            <p className="text-gray-600">
              Users agree to:
              - Not violate any applicable laws
              - Not interfere with the service's operation
              - Not engage in fraudulent activities
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">6. Contact</h2>
            <p className="text-gray-600">
              For any questions regarding these terms, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
