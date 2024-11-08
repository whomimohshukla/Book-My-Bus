import React from "react";
import { FaBus, FaTicketAlt, FaLock } from "react-icons/fa";
import Highlight from "../../Utls/Highlight";
import CTAButton from "../../Utls/Home/Button";
import BusSearch2 from "../../Utls/Home/BusSearch2";
import Amenties from "./Amenties";

function Home() {
  return (
    <div className="font-poppins text-grayText text-white mt-28">
      {/* Code Section 1 */}
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
      {/* <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 mb-0">
        <hr className="my-6 w-3/4 mx-auto border-t-2 border-gray-400 rounded-full shadow-lg sm:mx-auto lg:my-8" />
      </div> */}

      {/* Code Section 2 */}
      <div className="text-center mt-20 mb-64 md:mt-40 font-poppins bg-simon p-40 text-black">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
          Get Your Tickets in Just 3 Simple Steps!
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 px-4 md:px-0">
          Discover why choosing our bus service is the best decision for your
          travel needs.
          <br /> With just a few clicks, you can secure your journey with ease!
        </p>

        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
          {/* Step 1: Search Buses */}
          <div className="flex flex-col items-center">
            <div className="bg-lightgreen p-6 shadow-lg rounded-md flex flex-col items-center">
              <FaBus className="text-3xl md:text-4xl text-gray-800 mb-4" />
              <h2 className="text-xl md:text-2xl font-bold">1. Search Buses</h2>
              <p className="text-gray-600 text-sm md:text-base">
                Find the best routes and timings for your journey.
              </p>
            </div>
          </div>

          {/* Step 2: Choose Your Ticket */}
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

          {/* Step 3: Secure Payment */}
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
      <Amenties></Amenties>
    </div>
  );
}

export default Home;
