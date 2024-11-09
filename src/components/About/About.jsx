import React from "react";
import { FaBullseye, FaHandshake, FaEye } from "react-icons/fa";
import ourMission from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/chuttersnap-ywDi4b-z5fw-unsplash.jpg";
import busTicketGif from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/busTicket.jpg";
import vision from "/home/whomimohshukla/Desktop/Project Mine/BookMyBus/src/assets/vision.jpg";

function About() {
  return (
    <div className="font-poppins text-black bg-grayWhite mb-36 p-8 md:p-16">
      {/* Heading */}
      <h1 className="text-center text-4xl md:text-5xl font-bold mb-16 mt-7 text-gray-800">
        About-
        <span className="text-Darkgreen">Book My Bus</span>
      </h1>
      <p className="text-center text-lg md:text-xl text-gray-600 mb-24 mt-16 px-4 md:px-0">
        Book My Bus is here to make your travel booking experience smooth,
        convenient, and enjoyable. Whether you're planning a short trip or a
        long journey, we have you covered.
      </p>

      {/* Our Mission Section */}
      <div className="flex flex-col items-center md:flex-row gap-8 md:gap-16 mb-28">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FaBullseye className="text-Darkgreen" />{" "}
            <span className="text-4xl">Our Mission</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            At Book My Bus, our mission is to make travel bookings as easy and
            efficient as possible. We’re focused on offering an intuitive
            platform where you can find the best routes, compare ticket options,
            and secure your journey with ease.
          </p>
        </div>
        <img
          src={ourMission}
          alt="Our Mission"
          className="w-full md:w-1/2 rounded-md shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        />
      </div>

      {/* Why Choose Us Section */}
      <div className="flex flex-col items-center md:flex-row gap-8 md:gap-16 mb-28">
        <img
          src={busTicketGif}
          alt="Why Choose Us"
          className="w-full md:w-1/2 rounded-md shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FaHandshake className="text-Darkgreen" />{" "}
            <span className="text-4xl">Why Choose Us? </span>
          </h2>
          <ul className="list-disc list-inside text-base md:text-lg text-gray-600">
            <li>Easy to use platform with quick bookings</li>
            <li>Wide range of buses and routes to choose from</li>
            <li>Affordable and transparent ticket prices</li>
            <li>Real-time bus tracking and secure payments</li>
            <li>24/7 customer support for all your needs</li>
          </ul>
        </div>
      </div>

      {/* Our Vision Section */}
      <div className="flex flex-col items-center md:flex-row gap-8 md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FaEye className="text-Darkgreen" />{" "}
            <span className="text-4xl">Our Vision</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            We envision a world where booking bus travel is seamless, reliable,
            and enjoyable for everyone. We’re constantly improving our platform
            and exploring new features to bring you the best experience.
          </p>
        </div>
        <img
          src={vision}
          alt="Our Vision"
          className="w-full md:w-1/2 rounded-md shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        />
      </div>
    </div>
  );
}

export default About;
