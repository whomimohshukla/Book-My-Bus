import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaWhatsapp, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";

const faqs = [
  {
    question: "How do I book a bus ticket?",
    answer: "Booking a ticket is easy! Simply enter your source, destination, and travel date on our homepage. Select your preferred bus from the available options, choose your seat, and proceed with the payment.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancellations made 24 hours before departure are eligible for a refund. The refund amount varies based on how early you cancel. Check our cancellation policy page for detailed information.",
  },
  {
    question: "How can I get my bus ticket?",
    answer: "After successful booking, your e-ticket will be sent to your registered email address. You can also download it from the 'My Bookings' section in your account.",
  },
  {
    question: "Is it safe to travel during COVID-19?",
    answer: "We ensure all buses follow COVID-19 safety protocols including regular sanitization, mandatory masks, and temperature checks. We recommend checking current travel guidelines before booking.",
  },
  {
    question: "Can I reschedule my ticket?",
    answer: "Yes, you can reschedule your ticket up to 24 hours before departure, subject to availability. A rescheduling fee may apply based on the operator's policy.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-6 flex items-center justify-between focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-800">{question}</span>
        {isOpen ? (
          <FaChevronUp className="text-Darkgreen" />
        ) : (
          <FaChevronDown className="text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    toast.success("Thank you for your message. We'll get back to you soon!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white2 pt-28 md:pt-32 px-4 sm:px-6 md:px-8 font-poppins">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Can We <span className="text-Darkgreen">Help?</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help make your journey smooth and comfortable
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mb-4">
              <FaPhone className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Available 24/7 for your queries</p>
            <a
              href="tel:+1234567890"
              className="text-Darkgreen hover:text-LightGreen transition-colors"
            >
              +1 (234) 567-890
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mb-4">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Get response within 24 hours</p>
            <a
              href="mailto:support@bookmybus.com"
              className="text-Darkgreen hover:text-LightGreen transition-colors"
            >
              support@bookmybus.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-Darkgreen to-LightGreen rounded-full flex items-center justify-center mb-4">
              <FaWhatsapp className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              WhatsApp Support
            </h3>
            <p className="text-gray-600 mb-4">Quick responses on WhatsApp</p>
            <a
              href="https://wa.me/1234567890"
              className="text-Darkgreen hover:text-LightGreen transition-colors"
            >
              Chat with us
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Find quick answers to common questions about our services
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600">
                Have a specific question? We're here to help!
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-Darkgreen/20"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-Darkgreen to-LightGreen text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[0.98] transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
