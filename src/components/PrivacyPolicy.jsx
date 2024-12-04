import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 pt-28 md:pt-32 lg:pt-36">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <div className="prose prose-lg">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mt-6">1. Information We Collect</h2>
            <p className="text-gray-600">
              We collect information you provide directly to us when using BookMyBus, including:
              - Personal information (name, email address)
              - Travel preferences and booking history
              - Payment information
            </p>
            
            <h2 className="text-xl font-semibold text-gray-800 mt-6">2. How We Use Your Information</h2>
            <p className="text-gray-600">
              We use the information we collect to:
              - Process your bookings
              - Send you booking confirmations and updates
              - Improve our services
              - Communicate with you about our services
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">3. Information Sharing</h2>
            <p className="text-gray-600">
              We do not sell or share your personal information with third parties except as necessary to provide our services.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">4. Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mt-6">5. Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
