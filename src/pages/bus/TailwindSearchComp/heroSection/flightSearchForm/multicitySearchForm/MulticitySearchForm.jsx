import React, { useState, useEffect } from "react";
import FlightLocationFrom from "../FlightLocationFrom";
import FlightLocationTo from "../FlightLocationTo";
import MulticityDateBox from "./MuticityDateBox";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  multicityAction,
  multicityActionClear,
} from "../../../../../Redux/FlightSearch/Multicity/multicity";
import { clearbookTicketGDS } from "../../../../../Redux/FlightBook/actionFlightBook";
import { resetAllFareData } from "../../../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { tokenAction } from "../../../../../Redux/IP/actionIp";

const MulticitySearchForm = ({ adult, child, infant, flightClass }) => {
  const [trips, setTrips] = useState([
    { from: null, to: null, departureDate: null },
  ]);
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(multicityActionClear());
    dispatch(clearbookTicketGDS());
    dispatch(resetAllFareData());
  }, []);

  useEffect(() => {
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    dispatch(tokenAction(payload));
  }, [reducerState?.ip?.ipData]);

  const handleFromSelect = (location, index) => {
    const updatedTrips = [...trips];
    updatedTrips[index].from = location;
    setTrips(updatedTrips);
  };

  const handleToSelect = (location, index) => {
    const updatedTrips = [...trips];
    updatedTrips[index].to = location;
    setTrips(updatedTrips);
  };

  const handleDateChange = (dates, index) => {
    const updatedTrips = [...trips];
    updatedTrips[index].departureDate = dayjs(dates.startDate).format(
      "DD MMM, YY"
    );
    setTrips(updatedTrips);
  };

  const handleAddTrip = () => {
    if (trips.length < 4) {
      setTrips([...trips, { from: null, to: null, departureDate: null }]);
    }
  };

  const handleDeleteTrip = (index) => {
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      AdultCount: adult,
      ChildCount: child,
      InfantCount: infant,
      JourneyType: "3",
      Segments: trips.map((trip) => ({
        Origin: trip.from?.AirportCode,
        Destination: trip.to?.AirportCode,
        FlightCabinClass: flightClass?.id,
        PreferredDepartureTime: dayjs(trip.departureDate).format("DD MMM, YY"),
      })),
    };

    dispatch(multicityAction(payload));
    navigate("/multicityresult");
  };

  return (
    <form className="w-full relative flex flex-1 rounded-[10px] bg-white">
      <div className="flex flex-1 flex-col  rounded-full">
        {trips.map((trip, index) => (
          <div key={index} className="flex flex-1 ">
            <FlightLocationFrom
              placeHolder="Flying from"
              desc="Where do you want to fly from?"
              className="flex-1"
              onLocationSelect={(location) => handleFromSelect(location, index)}
            />
            <div className="self-center border-r border-slate-200 h-8"></div>
            <FlightLocationTo
              placeHolder="Flying to"
              desc="Where do you want to fly to?"
              className="flex-1"
              onLocationSelect={(location) => handleToSelect(location, index)}
            />
            <div className="self-center border-r border-slate-200 h-8"></div>
            <MulticityDateBox
              className="flex-1"
              onDateChange={(dates) => handleDateChange(dates, index)}
            />

            {index > 0 && (
              <div className="flex justify-center items-center">
                <button
                  type="button"
                  className="ml-4 bg-red-500 h-10 w-10 text-white p-2 rounded-full"
                  onClick={() => handleDeleteTrip(index)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 justify-end">
        <div className="flex justify-end ">
          <button
            type="button"
            className="flex items-center bg-blue-500 text-white p-2 rounded-full"
            onClick={handleAddTrip}
          >
            + Add City
          </button>
        </div>
        {/* md:hidden */}

        <div className="pr-2 xl:pr-4">
          <a
            onClick={handleSubmit}
            type="button"
            // className="h-14 md:h-16 w-full md:w-16 rounded-full bg-primary-6000 hover:bg-primary-700 flex items-center justify-center text-neutral-50 focus:outline-none"
            className="flex items-center bg-primary-6000 no-underline hover:bg-primary-700  p-2 rounded-full text-neutral-50 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="mr-3 no-underline">Search</span>
          </a>
        </div>
      </div>
    </form>
  );
};

export default MulticitySearchForm;
