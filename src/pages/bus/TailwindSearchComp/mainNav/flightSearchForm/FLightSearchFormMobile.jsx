import React, { useState } from "react";
import OnewayformMobile from "./onewayMobile/OnewayformMobile";
import ReturnFormMobile from "./returnMobile/ReturnFormMobile";

const FlightSearchFormMobile = () => {

  const [flightType, setFlightType] = useState("oneway"); 


  const renderFlightTypeButtons = () => {
    return (
      <div className=" py-5 flex items-center flex-wrap flex-row border-b border-neutral-100 ">
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
            flightType === "oneway"
              ? "bg-black text-white shadow-black/10 shadow-lg"
              : "border border-neutral-300 "
          }`}
          onClick={() => setFlightType("oneway")}
        >
          Oneway
        </div>
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
            flightType === "return"
              ? "bg-black text-white shadow-black/10 shadow-lg"
              : "border border-neutral-300 "
          }`}
          onClick={() => setFlightType("return")}
        >
          Return
        </div>
      </div>
    );
  };



  return (
    <form className="w-full relative mt-8 rounded-[40px] xl:rounded-[49px] rounded-t-2xl xl:rounded-t-3xl shadow-xl  bg-white">
      {renderFlightTypeButtons()} 
      
      {flightType === "oneway" ? <OnewayformMobile /> : <ReturnFormMobile />}
      
    </form>
  );
};

export default FlightSearchFormMobile;
