import React from "react";
import logo from "../images/logoLoader.png";

const BlurredLoader = ({ textData }) => {
  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-30 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      {/* <img src={logo} className="h-20 mb-4 animate-pulse" alt="" /> */}
      {/* Text */}

      <div className="pulserEffect">
        <img src={logo} alt="Logo" className="h-20 mb-4 " />
      </div>
      <p className="text-black text-lg font-semibold text-center">
        {textData || "Hold on! We are searching for the Hotels for you"}
      </p>
    </div>
  );
};

export default BlurredLoader;
