import React, { useState, useEffect } from "react";
import { CiAlarmOn } from "react-icons/ci";
import { TiArrowRight } from "react-icons/ti";
import { useLocation } from "react-router-dom";

import {
  findAirlineByCode,
  findAirportByCode,
} from "../../utility/flightUtility/BookwarperUtility";
import { AlarmClock } from "lucide-react";
import {
  FlightDetailsAmadeusResponse,
  FlightDetailsKafilaResponse,
  FlightDetailsTBOResponse,
  standardizeFlightDetailResponse,
  standardizeFlightFareResponse,
  standardizeFlightBaggageResponse,
} from "../../utility/flightUtility/standardizeFlightResponse";
// const Tabs = ["Flight Information", "Fare Details", "Baggage", "Cancellation"];
const Tabs = ["Flight Information", "Fare Details", "Baggage"];

const FlightDetail = ({ item }) => {
  const [flightDetail, setFlightDetail] = useState(null); // Set initial state to null to check later

  useEffect(() => {
    if (item) {
      const data = standardizeFlightDetailResponse(item); // Get standardized data
      setFlightDetail(data); // Update state with data
    }
  }, [item]);

  // Show a loader or placeholder while waiting for the data
  if (!flightDetail) {
    return <div>Loading...</div>;
  }
  // console.log(item, flightDetail, "flightDetailAMD");
  // console.log(item, flightDetail, "flightDetailAMD");
  return (
    <>
      {Array.isArray(flightDetail) &&
        flightDetail?.map((item) => {
          let layover = item?.layover;
          return (
            <>
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex  items-center ">
                  <p className="font-medium text-sm">
                    {findAirportByCode(item?.origin)?.name}
                  </p>
                  <TiArrowRight />
                  <p className="font-medium text-sm">
                    {findAirportByCode(item?.destination)?.name}
                  </p>
                </div>
                <div className="flex w-full justify-between bg-gray-100 rounded-md p-2 border-1 border-gray-200">
                  <div className="flex flex-col justify-center items-left gap-1">
                    <div className="w-[20px] h-[20px]">
                      <img
                        src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.flightName}.png`}
                        width={"20px"}
                        height={"20px"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-wrap">
                        {findAirlineByCode(item?.flightName)?.airlineName}
                      </p>
                      <p className="text-sm">
                        {item?.flightName}-{item?.flightNumber}
                      </p>
                      {/* <p className="text-sm">(ECONOMY)</p> */}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      {item?.departureTime}
                    </p>
                    <p className="text-sm font-semibold">
                      {findAirportByCode(item?.origin)?.name} ({item?.origin})
                    </p>
                    <p className="text-sm">{item?.dateOfDeparture}</p>
                    <p className="text-sm">Terminal-{item?.terminal1}</p>
                  </div>
                  <div className="flex   flex-col gap-2 items-center justify-center">
                    <AlarmClock size={16} className="font-bold  text-black" />
                    <p className="text-sm">{item?.duration || "01h 10m"}</p>
                  </div>
                  <div>
                    <p className="text-gray-700 font-semibold">
                      {item?.arrivalTime}
                    </p>
                    <p className="text-sm font-semibold">
                      {findAirportByCode(item?.destination)?.name}(
                      {item?.destination})
                    </p>
                    <p className="text-sm">{item?.dateOfArrival}</p>
                    <p className="text-sm">Terminal-{item?.terminal2}</p>
                  </div>
                </div>
                {/* <div className="w-full flex justify-between items-center">
                <div className="flex-1  border-t-2 border-dashed"></div>
                <div className="border-2 border-dashed  top-1 flex gap-2 py-1 px-2 rounded-full ">
                  <p className="text-[12px] ">LAYOVER</p>
                  <p className=" text-[12px] text-red-500">1H:40M</p>
                </div>
                <div className="flex-1  border-t-2 border-dashed"></div>
              </div> */}
              </div>
              {layover && (
                <div className="relative flex justify-center items-center mt-2">
                  <p className="text-center bg-white  z-10 rounded-full px-3 py-1 text-gray-400 inline-block font-semibold text-sm shadow-md">
                    {layover?.toLowerCase()} Layover in{" "}
                    {findAirportByCode(item?.destination)?.name}
                  </p>
                  <div className="absolute border-b border-gray-400 w-full -z-0 left-0 "></div>
                </div>
              )}
            </>
          );
        })}
    </>
  );
};
const FareDetails = ({ item }) => {
  const [FlightFare, setFlightFare] = useState([]);
  const location = useLocation();
  const querayParams = new URLSearchParams(location?.search);
  const adult = querayParams.get("Adult");
  const child = querayParams.get("Child");
  const infant = querayParams.get("Infant");
  useEffect(() => {
    if (item) {
      // console.log(item, "itemmmViwedetails");
      const data = standardizeFlightFareResponse(item, adult, child, infant); // Get standardized data
      setFlightFare(data); // Update state with data
    }
  }, [item]);
  if (!FlightFare) {
    return <div>Loading...</div>;
  }
  const totalBase =
    FlightFare?.Adt?.Basic + FlightFare?.Chd?.Basic + FlightFare?.Inf?.Basic;
  const totalTax =
    FlightFare?.Adt?.Taxes + FlightFare?.Chd?.Taxes + FlightFare?.Inf?.Taxes;
  const grandTotal =
    FlightFare?.Adt?.Total + FlightFare?.Chd?.Total + FlightFare?.Inf?.Total;
  return (
    <div className="max-w-md mx-auto py-2  mt-2 rounded-lg ">
      <div className="border-t border-b ">
        {0 < FlightFare?.Adt?.Basic && (
          <div className="flex justify-between text-sm mb-1">
            <span>{adult} x Adult</span>
            <span className="font-medium">₹{FlightFare?.Adt?.Basic}</span>
          </div>
        )}
        {0 < FlightFare?.Chd?.Basic && (
          <div className="flex justify-between text-sm mb-1">
            <span>{child} x Child</span>
            <span className="font-medium">₹{FlightFare?.Chd?.Basic}</span>
          </div>
        )}
        {0 < FlightFare?.Inf?.Basic && (
          <div className="flex justify-between text-sm mb-1">
            <span>{infant} x Infant</span>
            <span className="font-medium">₹{FlightFare?.Inf?.Basic}</span>
          </div>
        )}
        <div className="flex justify-between text-sm mb-1">
          <span>Total (Base Fare)</span>
          <span className="font-medium">₹{totalBase?.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Fee & Surcharges</span>
          <span className="font-medium">+ ₹{totalTax?.toFixed(0)}</span>
        </div>
      </div>
      <div className="flex justify-between text-base font-semibold mt-2">
        <span>Grand Total</span>
        <span className="text-green-600">₹{grandTotal?.toFixed(0)}</span>
      </div>
    </div>
  );
};
const Baggage = ({ item }) => {
  const [FlightBaggage, setFlightBaggage] = useState([]);
  useEffect(() => {
    if (item) {
      const data = standardizeFlightBaggageResponse(item); // Get standardized data
      setFlightBaggage(data); // Update state with data
    }
  }, [item]);
  if (!FlightBaggage) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative overflow-x-auto mt-2 border-1 border-gray-300 sm:rounded-lg">
      <table className="w-full text-sm text-center rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr className="border-b">
            <th className="px-6 py-3">Airline</th>
            <th className="px-6 py-3">Check-in Baggage</th>
            <th className="px-6 py-3">Cabin Baggage</th>
          </tr>
        </thead>
        <tbody>
          {FlightBaggage.map((baggage, index) => (
            <tr className="odd:bg-white  even:bg-gray-50  border-b" key={index}>
              <td className="px-6 py-3">{baggage.Airline}</td>
              <td className="px-6 py-3">{baggage.Baggage}</td>
              <td className="px-6 py-3">{baggage.CabinBaggage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const ViewDetails = ({ item }) => {
  const [selectedTab, setSelectedTab] = useState("Flight Information");
  const onChange = (key) => {
    setSelectedTab(key);
    // console.log(key, selectedTab, "selected tab");
  };

  return (
    <div>
      <div className="flex mt-2 w-full justify-start gap-2 items-center p-1 rounded-md bg-slate-100 text-sm">
        {Tabs?.map((item, index) => {
          return (
            <div
              className={`px-2 py-2 rounded-md font-semibold text-sm ${
                item == selectedTab
                  ? "bg-indigo-700 text-white"
                  : " text-gray-500"
              } `}
              key={index}
              onClick={() => onChange(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
      {"Flight Information" == selectedTab && <FlightDetail item={item} />}
      {"Fare Details" == selectedTab && <FareDetails item={item} />}
      {"Baggage" == selectedTab && <Baggage item={item} />}
    </div>
  );
};

export default ViewDetails;
