import React from "react";
import StaySearchForm from "./hotel/hotelSearchForm/StaySearchForm";
import StaySearchFormHold from "./hotelHold/hotelSearchForm/StaySearchFormHold";

const HotelHoldHome = () => {
  return (
    <div>
      <div className="flightMainBox relative py-16 pt-44 flex md:flex justify-center bg-cover bg-top bg-no-repeat">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          //   poster={homeBG}
          loop
          autoPlay
          muted
        >
          Your browser does not support the video tag.
        </video>
        <StaySearchFormHold />
      </div>
    </div>
  );
};

export default HotelHoldHome;
