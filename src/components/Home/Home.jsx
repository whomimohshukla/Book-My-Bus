import React from "react";
import Highlight from "../../Utls/Highlight";
import CodeBlocks from "../../Utls/CardBlocks";
import CTAButton from "../../Utls/Home/Button";

function Home() {
  return (
    <div>
      {/* Code Section 1  */}
      <div className="relative flex ml-20 mt-32 w-auto flex-col justify-evenly gap-8 text-white">
        <div className=" flex flex-col gap-4">
          <Highlight
            text={"Welcome to Book My Bus!"}
            className="ml-96"
          ></Highlight>
          {/* <Highlight text={"Explore. Book. Travel."}></Highlight> */}
          <p className="text-3xl font-semibold">Explore. Book. Travel.</p>
          <p className="text-2xl font-medium">Get started today and enjoy the ride!</p>
          <div className=" w-40 py-17 px--1 mt-6 ">
            <CTAButton active="true" linkto="/getTicket">
              GET TICKET NOW
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
