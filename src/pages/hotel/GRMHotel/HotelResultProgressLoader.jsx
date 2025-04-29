import React from "react";

const HotelResultProgressLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-2 z-[9999] bg-gray-200">
      <div className="h-full w-0 bg-gradient-to-r from-green-200 via-green-400 to-green-200 bg-[length:200%_100%] animated-loader"></div>
    </div>
  );
};

export default HotelResultProgressLoader;
