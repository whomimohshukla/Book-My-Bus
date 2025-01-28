import React from "react";

function Highlight({ text }) {
  console.log(text);
  // <span className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
  //   {subheading}
  // </span>
  return (
    <div>
      <span className=" text-simon font-extrabold text-4xl">{text}</span>
    </div>
  );
}

export default Highlight;
