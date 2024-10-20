import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[11px] sm:text-[15px] font-medium px-5 py-2 rounded-md shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] ${
          active ? " text-grayWhite bg-Darkgreen " : "bg-lightgreen"
        } hover:shadow-none hover:scale-95 transition-all duration-200 `}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
