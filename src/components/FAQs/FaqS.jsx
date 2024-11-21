import React, { useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

const faqs = [
  {
    question: "What is Book My Bus?",
    answer:
      "Book My Bus is an online platform that allows users to book bus tickets, check routes, and track buses in real-time for a convenient travel experience.",
  },
  {
    question: "How can I book a ticket?",
    answer:
      "To book a ticket, simply search for buses between your desired locations, select a bus, and complete the booking by making a secure payment.",
  },
  {
    question: "Can I track my bus in real-time?",
    answer:
      "Yes, our platform offers real-time tracking so you can monitor the location of your bus and stay updated on its estimated arrival time.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major payment methods, including credit/debit cards, net banking, and popular digital wallets.",
  },
  {
    question: "Is customer support available?",
    answer:
      "Yes, we offer 24/7 customer support to assist you with any questions or issues related to booking, tracking, or payment.",
  },
  {
    question: "How can I cancel my booking?",
    answer:
      "You can cancel your booking through your account, by selecting the 'My Tickets' section, and clicking on the cancellation option for your desired ticket.",
  },
  {
    question: "Are there any discounts available?",
    answer:
      "Yes, we offer seasonal discounts and special offers. Check our website regularly for updates on discounts and promotional codes.",
  },
  {
    question: "Can I change my travel dates after booking?",
    answer:
      "Yes, you can change your travel dates based on availability, but a rescheduling fee may apply depending on the circumstances.",
  },
];

function FaqS() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const toggleFAQ = (index) =>
    setActiveIndex(activeIndex === index ? null : index);

  const highlightTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <strong key={i} className="text-Darkgreen font-semibold">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const filteredFAQs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div className="min-h-screen bg-white2">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white2 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-white2 opacity-90 max-w-2xl mx-auto">
            Find answers to common questions about our bus booking service
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 -mt-8">
        {/* Search Input */}
        <div className="relative mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full p-4 pl-12 bg-white rounded-xl shadow-lg border-2 border-transparent focus:border-LightGreen focus:ring-2 focus:ring-LightGreen/20 transition-all duration-300 text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl">No FAQs found</div>
              <p className="text-gray-500 mt-2">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            filteredFAQs.map(({ question, answer }, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-6 focus:outline-none group"
                  aria-expanded={activeIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-left group-hover:text-Darkgreen transition-colors duration-300">
                    {highlightTerm(question, searchTerm)}
                  </h3>
                  <span className="ml-4 flex-shrink-0">
                    {activeIndex === index ? (
                      <FaChevronUp className="text-Darkgreen transform transition-transform duration-300" />
                    ) : (
                      <FaChevronDown className="text-gray-400 group-hover:text-Darkgreen transform transition-transform duration-300" />
                    )}
                  </span>
                </button>
                {activeIndex === index && (
                  <div
                    id={`faq-answer-${index}`}
                    className="p-6 pt-0 text-base md:text-lg text-gray-600 animate-fadeIn"
                  >
                    <div className="border-t border-gray-100 pt-4">
                      {highlightTerm(answer, searchTerm)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-16 px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Our support team is here to help 24/7
          </p>
          <button className="bg-white2 text-Darkgreen px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaqS;
