import React, { useState } from "react";
import {
  FaBus,
  FaTicketAlt,
  FaLock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Highlight from "../../Utls/Highlight";
import CTAButton from "../../Utls/Home/Button";
import BusSearch2 from "../../Utls/Home/BusSearch2";
import Amenties from "./Amenties";
import Testimonials from "./Testimonials";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="text-left w-full flex justify-between items-center text-lg font-medium text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 text-sm md:text-base">{answer}</p>
      )}
    </div>
  );
}

function Home() {
  const faqData = [
    {
      question: "How do I book a ticket?",
      answer:
        "You can book a ticket by using our bus search feature, selecting your preferred route, and completing the payment process.",
    },
    {
      question: "Can I cancel my ticket?",
      answer:
        "Yes, you can cancel your ticket through the 'My Tickets' section. Cancellation policies may apply.",
    },
    {
      question: "Is online payment secure?",
      answer:
        "Yes, we use secure payment gateways to ensure your information is protected.",
    },
  ];

  return (
    <div className="font-poppins text-grayText text-white mt-28">
      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row justify-center md:justify-around gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-4 md:ml-6 text-center md:text-left">
          <Highlight
            text={"Welcome to Book My Bus!"}
            className="ml-auto md:ml-0"
          />
          <p className="text-2xl md:text-3xl font-semibold">
            Explore. Book. Travel.
          </p>
          <p className="text-lg md:text-2xl font-medium">
            Get started today and enjoy the ride!
          </p>
          <div className="mt-4 md:mt-6 mx-auto md:mx-0 w-36 md:w-44">
            <CTAButton active="true" linkto="/getTicket">
              GET TICKETS NOW
            </CTAButton>
          </div>
        </div>
        <div className="flex justify-center md:justify-end mt-8 md:mt-0">
          <BusSearch2 />
        </div>
      </div>

      <div className="text-center mt-20 mb-64 md:mt-40 font-poppins bg-simon p-8 md:p-40 text-black">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Get Your Tickets in Just 3 Simple Steps!
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 px-4 md:px-0">
          Discover why choosing our bus service is the best decision for your
          travel needs.
          <br /> With just a few clicks, you can secure your journey with ease!
        </p>

        {/* Step Cards */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 md:px-0">
          <div className="flex flex-col items-center">
            <div className="bg-lightgreen p-6 shadow-lg rounded-md flex flex-col items-center">
              <FaBus className="text-3xl md:text-4xl text-gray-800 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold">1. Search Buses</h2>
              <p className="text-gray-600 text-sm md:text-base">
                Find the best routes and timings for your journey.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-lightgreen p-6 shadow-lg rounded-md flex flex-col items-center">
              <FaTicketAlt className="text-3xl md:text-4xl text-gray-800 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold">
                2. Choose Your Ticket
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Select your preferred bus and seat.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-lightgreen p-6 shadow-lg rounded-md flex flex-col items-center">
              <FaLock className="text-3xl md:text-4xl text-gray-800 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold">
                3. Secure Payment
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Make your payment securely and confirm your booking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <Amenties />

      {/* Testimonial section  */}

      <Testimonials></Testimonials>
      {/* FAQ Section */}
      <div className="text-center mt-20 font-poppins bg-white p-10 rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-4 md:space-y-6 text-left">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
