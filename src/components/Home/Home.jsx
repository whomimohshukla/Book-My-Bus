import React from "react";
import Highlight from "../../Utls/Highlight";
import CodeBlocks from "../../Utls/CardBlocks";
import CTAButton from "../../Utls/Home/Button";
import BusSearch2 from "../../Utls/Home/BusSearch2";

function Home() {
  return (
    <div>
      {/* Code Section 1  */}
      <div className="relative font-poppins text-grayText flex ml-18 mt-44 w-auto flex-row justify-around gap-8 text-white">
        <div className=" flex flex-col ml--1 gap-4">
          <Highlight
            text={"Welcome to Book My Bus!"}
            className="ml-96"
          ></Highlight>
          {/* <Highlight text={"Explore. Book. Travel."}></Highlight> */}
          <p className="text-3xl font-semibold">Explore. Book. Travel.</p>
          <p className="text-2xl font-medium">
            Get started today and enjoy the ride!
          </p>
          <div className=" w-44 ">
            <CTAButton active="true" linkto="/getTicket">
              GET TICKETS NOW
            </CTAButton>
          </div>
        </div>
        <div>
          <BusSearch2></BusSearch2>
        </div>
      </div>

      <div className="text-center mt-52 font-poppins text-grayText">
        <h1 className="text-4xl font-bold text-gray-800">
          Get Your Tickets in Just 3 Simple Steps!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover why choosing our bus service is the best decision for your
          travel needs.<br></br> With just a few clicks, you can secure your
          journey with ease!
        </p>

        <div className="mt-16 flex justify-around">
          <div className="flex flex-col items-center">
            <div className="bg-lightgreen  p-6 shadow-lg">
              <h2 className="text-2xl font-bold">1. Search Buses</h2>
              <p className="text-gray-600">
                Find the best routes and timings for your journey.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-lightgreen  p-6 shadow-lg">
              <h2 className="text-2xl font-bold">2. Choose Your Ticket</h2>
              <p className="text-gray-600">
                Select your preferred bus and seat.
              </p>
              
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-lightgreen  p-6 shadow-lg">
              <h2 className="text-2xl font-bold">3. Secure Payment</h2>
              <p className="text-gray-600">
                Make your payment securely and confirm your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
