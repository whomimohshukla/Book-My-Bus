import React from "react";
import { FaBullseye, FaHandshake, FaEye } from "react-icons/fa";
import ourMission from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/chuttersnap-ywDi4b-z5fw-unsplash.jpg";
import busTicketGif from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/busTicket.jpg";
import vision from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/vision.jpg";


// all about about
function About() {
  return (
    <div className="font-poppins bg-white2 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-20 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-white2">Book My Bus</span>
          </h1>
          <p className="text-center text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Book My Bus is here to make your travel booking experience smooth,
            convenient, and enjoyable. Whether you're planning a short trip or a
            long journey, we have you covered.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 space-y-24">
        {/* Our Mission Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-block bg-LightGreen bg-opacity-10 rounded-lg p-3">
              <FaBullseye className="text-3xl text-Darkgreen" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-Darkgreen">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Book My Bus, our mission is to make travel bookings as easy and
              efficient as possible. We're focused on offering an intuitive
              platform where you can find the best routes, compare ticket options,
              and secure your journey with ease.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={ourMission}
              alt="Our Mission"
              className="w-full rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1">
            <img
              src={busTicketGif}
              alt="Why Choose Us"
              className="w-full rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            />
          </div>
          <div className="flex-1 space-y-6">
            <div className="inline-block bg-LightGreen bg-opacity-10 rounded-lg p-3">
              <FaHandshake className="text-3xl text-Darkgreen" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-Darkgreen">
              Why Choose Us?
            </h2>
            <ul className="space-y-4 text-lg text-gray-600">
              {[
                "Easy to use platform with quick bookings",
                "Wide range of buses and routes to choose from",
                "Affordable and transparent ticket prices",
                "Real-time bus tracking and secure payments",
                "24/7 customer support for all your needs"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-Darkgreen flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-block bg-LightGreen bg-opacity-10 rounded-lg p-3">
              <FaEye className="text-3xl text-Darkgreen" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-Darkgreen">
              Our Vision
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We envision a world where booking bus travel is seamless, reliable,
              and enjoyable for everyone. We're constantly improving our platform
              and exploring new features to bring you the best experience.
            </p>
          </div>
          <div className="flex-1">
            <img
              src={vision}
              alt="Our Vision"
              className="w-full rounded-2xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-Darkgreen to-LightGreen text-white2 py-16 px-8 md:px-16 mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Bus Routes" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
