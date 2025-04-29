import React from "react";
import FlightDetailsBookWraperCard from "./FlightDetailsBookWraperCard";
import { useSelector } from "react-redux";

const FlightDetailBookWraper = () => {
  const reducerState = useSelector((state) => state);

  const selectedFlight = reducerState.returnSelected?.returnSelectedFlight;
  // console.log(selectedFlight, "selected flight in the fdbw");

  return (
    <div className="py-2  shadow-sm bg-white border-1 border-white ">
      <FlightDetailsBookWraperCard
        type={"Departure"}
        flight={selectedFlight?.onward}
      />

      {selectedFlight?.return && (
        <div className="flex items-center relative my-2">
          <div className=" rounded-r-full bg-indigo-50 border-r border-gray-300 absolute -left-[1px] w-3 h-6"></div>

          <div className="border-t-2 border-gray-400 w-full border-dashed"></div>
          <div className=" rounded-l-full bg-indigo-50 border-l border-gray-300 absolute -right-[1px] w-3 h-6"></div>
        </div>
      )}
      {selectedFlight?.return && (
        <FlightDetailsBookWraperCard
          type={"Return"}
          flight={selectedFlight?.return}
        />
      )}
    </div>
  );
};

export default FlightDetailBookWraper;
