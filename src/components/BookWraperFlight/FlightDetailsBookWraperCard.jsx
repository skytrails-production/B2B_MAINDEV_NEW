import React, { useState, useEffect } from "react";
import {
  standardizeFlightDetailResponse,
  standardizeFlightFareResponse,
  standardizeFlightBaggageResponse,
} from "../../utility/flightUtility/standardizeFlightResponse";
import {
  findAirlineByCode,
  findAirportByCode,
} from "../../utility/flightUtility/BookwarperUtility";
import { useSelector } from "react-redux";

const FlightDetailsBookWraperCard = ({ type, flight }) => {
  const [flightDetail, setFlightDetail] = useState(null); // Set initial state to null to check later
  const [FlightBaggage, setFlightBaggage] = useState([]);
  const reducerState = useSelector((state) => state?.searchFlight);

  useEffect(() => {
    if (flight) {
      const data = standardizeFlightDetailResponse(flight); // Get standardized data
      const baggage = standardizeFlightBaggageResponse(flight); // Get standardized data
      setFlightDetail(data); // Update state with data
      setFlightBaggage(baggage);
    }
  }, [flight]);

  const FlightDetailsCard = ({ item }) => {
    // console.log(item, "itemmm");
    const {
      arrivalTime,
      dateOfArrival,
      dateOfDeparture,
      departureTime,
      destination,
      duration,
      flightName,
      flightNumber,
      origin,
      terminal1,
      terminal2,
      layover,
      type,
    } = item || {};
    const airportOrigin = findAirportByCode(origin);
    const airportDestination = findAirportByCode(destination);

    // console.log(item, "item in the fdbwc");

    return (
      <>
        <div className="flex flex-col gap-2 bg-white border-white shadow-sm mb-2  border-1 rounded-md p-2 md:p-4">
          <div className="flex justify-between w-full ">
            <div className="flex gap-2">
              <img
                src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${flightName}.png`}
                alt=""
                width="32px"
                height="32px"
                className="object-contain rounded-md"
              />
              <div className="flex flex-col justify-between ">
                <p className="text-sm md:text-lg font-semibold text-gray-700">
                  {findAirlineByCode(flightName)?.airlineName || flightName} |{" "}
                  {flightName} {flightNumber}
                </p>
                {/* <p className="text-xs md:text-sm opacity-75">Airbus A321</p> */}
              </div>
            </div>
            <div className="text-sm md:text-lg">
              {reducerState?.flightDetails?.FlightCabinClass}{" "}
              {/* <span className="font-semibold">| SAVER</span> */}
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <div className="px-2 rounded-sm bg-primary-100 ">
              <p className="text-xs md:text-sm mb-0 text-gray-700">
                Start on{" "}
                <span className=" font-semibold">- {dateOfDeparture}</span>
              </p>
            </div>
            <div className="px-2 rounded-sm bg-primary-50 ">
              <p className="text-xs md:text-sm mb-0 text-gray-700">
                Ends on{" "}
                <span className=" font-semibold">- {dateOfArrival}</span>
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-1 md:gap-2">
            <div>
              <p className="text-xl font-semibold text-gray-700">
                {departureTime}
              </p>
              <p className="text-base font-semibold text-gray-700">{origin}</p>
            </div>
            <div className=" relative w-full flex my-3  flex-col">
              <div className=" w-full  border-e-white absolute border-t-2 border-dashed top-3 "></div>
              <div className=" absolute top-0 left-0 right-0 bg-transparent flex justify-center  px-2">
                <div className="flex flex-col bg-white text-gray-700 px-1">
                  <span className="text-center text-lg font-semibold ">
                    {duration}
                  </span>
                  <span className="text-center text-sm">Duration</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold  text-right text-gray-700">
                {arrivalTime}
              </p>
              <p className="text-base font-semibold text-right text-gray-700">
                {destination}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div>
              <p className="text-md font-semibold mb-0 text-gray-700">
                {airportOrigin?.name || ""}
              </p>
              <p className="text-sm   mb-0 !text-gray-700">
                {airportOrigin?.code || ""}
                {airportOrigin?.CountryName || ""}
              </p>
              <p className="text-sm font-semibold  text-indigo-500 mb-0">
                {terminal1 && `Terminal ${terminal1}`}
              </p>
            </div>

            <div>
              <p className="text-md font-semibold text-right mb-0 text-gray-700">
                {airportDestination?.name}
              </p>
              <p className="text-sm  text-right  mb-0 text-gray-700">
                {airportDestination?.code || ""}{" "}
                {airportDestination?.CountryName || ""}
              </p>
              <p className="text-sm font-semibold  text-indigo-500 text-right mb-0 ">
                {terminal2 && `Terminal ${terminal2}`}
              </p>
            </div>
          </div>
          <div className="w-full border-t-[1px] border-gray-200"></div>
          <div className="flex justify-between items-start md:items-center w-full flex-col md:flex-row gap-2">
            <div
              className="text-xs md:text-sm text-gray-700 flex flex-col justify-start
           md:justify-between md:flex-row w-full  "
            >
              <p>Baggage - {FlightBaggage?.[0]?.Baggage}</p>
              <p>Cabin - {FlightBaggage?.[0]?.CabinBaggage}</p>
            </div>
            {/* <div className="flex items-end w-full md:w-auto justify-end">
            <button className="text-sm md:text-md text-indigo-500 font-semibold text-nowrap">
              View Baggage Details
            </button>
          </div> */}
          </div>
        </div>
        {layover && (
          <div className="relative flex justify-center items-center">
            <p className="text-center bg-primary-6000 mb-0  z-10 rounded-full px-3 py-1 text-gray-100 inline-block font-semibold text-sm shadow-md">
              {layover?.toLowerCase()} Layover in {airportDestination?.name}
            </p>
            <div className="absolute border-b border-gray-400 w-full -z-0 left-0 "></div>
          </div>
        )}
      </>
    );
  };

  // Show a loader or placeholder while waiting for the data
  if (!flightDetail) {
    return <div>Loading...</div>;
  }

  // console.log(flightDetail, "flightDetailAMDd");
  return (
    <div className="flex flex-col gap-2 px-2 md:px-4 py-2">
      <div className="flex flex-col ">
        <div className="flex gap-2 items-center">
          <p className="text-sm  md:text-base bg-primary-700 text-white rounded-md py-1 px-2">
            {type}
          </p>
          <p className="text-sm  md:text-xl font-bold text-gray-700">
            {flight?.origin} - {flight?.destination}
          </p>
        </div>
        <div>
          <p className="text-xs md:text-sm mt-1 opacity-75 text-gray-700">
            {flight?.stopes == 0 ? "Non" : flight?.stopes} Stop | All
            departure/arrival times are in local time
          </p>
        </div>
      </div>
      {flightDetail?.map((item) => {
        return <FlightDetailsCard item={item} />;
      })}
    </div>
  );
};

export default FlightDetailsBookWraperCard;
