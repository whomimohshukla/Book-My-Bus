import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[15px] font-semibold px-6 py-2.5 rounded-lg 
        ${
          active
            ? "text-grayWhite bg-Darkgreen hover:bg-LightGreen hover:text-black"
            : "bg-white2 text-Darkgreen border-2 border-Darkgreen hover:bg-Darkgreen hover:text-grayWhite"
        }
        transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
