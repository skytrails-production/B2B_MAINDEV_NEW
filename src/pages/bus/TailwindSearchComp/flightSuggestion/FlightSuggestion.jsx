import React, { useEffect, useState } from "react";
import FlightSuggestCard from "./FlightSuggestCard";
import Heading from "../shared/Heading";
import { useDispatch, useSelector } from "react-redux";
import { flightHotelSuggestListReq } from "../../../Redux/FlightHotelSuggest/actionFlightHotelSuggest";

const FlightSuggestion = ({
  className = "",
  gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  const reducerState = useSelector((state) => state?.flightSuggested);
  const dispatch = useDispatch();
  // console.log(reducerState, "reducer state in the flight suggestion");
  useEffect(() => {
    dispatch(flightHotelSuggestListReq());
  }, []);

  return (
    <div
      className={`nc-SectionGridCategoryBox custom-container mt-16 relative ${className}`}
    >
      <Heading
        desc="Discover great prices for popular destinations"
        isCenter={true}
      >
        Explore Cheapest Flight
      </Heading>
      <div className={`grid ${gridClassName} gap-3 sm:gap-3 md:gap-3`}>
        {reducerState?.flightHotalSuggeated?.flightPayloadResult &&
          reducerState?.flightHotalSuggeated?.flightPayloadResult.map(
            (item, i) => <FlightSuggestCard key={i} data={item} />
          )}
      </div>
    </div>
  );
};

export default FlightSuggestion;
