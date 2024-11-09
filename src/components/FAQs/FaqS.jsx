import React, { useState, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

  // Debounced input handler
  const handleInputChange = (event) => setSearchTerm(event.target.value);

  const toggleFAQ = (index) =>
    setActiveIndex(activeIndex === index ? null : index);

  // Highlight search term in results
  const highlightTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <strong key={i} className="text-indigo-600">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // Filter FAQs based on search term
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
    <div className="bg-grayWhite p-8 md:p-16 mb-64 mt-14">
      <h2 className="text-center text-4xl md:text-5xl font-bold mb-28 text-Darkgreen">
        Frequently Asked Questions
      </h2>

      {/* Search Input */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-4 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* FAQ List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFAQs.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No FAQs found</div>
        ) : (
          filteredFAQs.map(({ question, answer }, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {highlightTerm(question, searchTerm)}
                </h3>
                <span>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-Darkgreen" />
                  ) : (
                    <FaChevronDown className="text-Darkgreen" />
                  )}
                </span>
              </button>
              {activeIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="p-4 text-base md:text-lg text-gray-600 bg-white"
                >
                  {highlightTerm(answer, searchTerm)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default FaqS;
