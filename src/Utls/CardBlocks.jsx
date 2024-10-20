import React from "react";
import CTAButton from "../Utls/CardBlocks";
// import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({ position, heading, subheading, ctabtn1 }) => {
  console.log(ctabtn1);
  return (
    // left section
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}
    >
      {/* Section 1  */}
      <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
        {heading}

        {/* Sub Heading */}
        <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
          {subheading}
        </div>

        {/* Button Group */}
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
