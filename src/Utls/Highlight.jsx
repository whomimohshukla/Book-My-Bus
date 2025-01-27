import React from "react";

import { connect } from "react-redux";
function Highlight({ text }) {
  return (
    <div>
      <span className=" text-simon font-extrabold text-4xl">{text}</span>
    </div>
  );
}

export default Highlight;
