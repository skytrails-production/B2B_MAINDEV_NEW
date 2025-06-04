import { Divider } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useSelector } from "react-redux";
import { Plane, Clock, ArrowRight, Circle } from "lucide-react";

const ShowFlightDomestic = ({ flight }) => {
  const reducerState = useSelector((state) => state);
  const domesticFLight = flight?.[0];

  const renderFlightSegment = (flightData, isReturn = false) => {
    const segments = isReturn
      ? flightData?.payloadReturn?.Segments[0]
      : flightData?.payloadGoing?.Segments[0];
    const fare = isReturn
      ? flightData?.payloadReturn?.Fare
      : flightData?.payloadGoing?.Fare;
    const airline = segments?.[0]?.Airline;
    const validatingAirline = isReturn
      ? flightData?.payloadReturn?.ValidatingAirline
      : flightData?.payloadGoing?.ValidatingAirline;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="p-4">
          {/* Flight Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${validatingAirline}.png`}
                alt="flight"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {airline?.AirlineName}
                </h3>
                <p className="text-sm text-gray-500">
                  {airline?.AirlineCode}
                  {airline?.FlightNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">
                ₹{fare?.PublishedFare.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* Departure */}
            <div className="col-span-3">
              <p className="text-xl font-semibold">
                {dayjs(segments?.[0]?.Origin?.DepTime).format("h:mm A")}
              </p>
              <p className="text-sm text-gray-500">
                {dayjs(segments?.[0]?.Origin?.DepTime).format("DD MMM, YY")}
              </p>
              <p className="text-sm font-medium">
                {segments?.[0]?.Origin?.Airport?.CityName} (
                {segments?.[0]?.Origin?.Airport?.CityCode})
              </p>
            </div>

            {/* Duration */}
            <div className="col-span-6 flex flex-col items-center">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-white px-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {`${Math.floor(segments?.[0]?.Duration / 60)}h ${
                        segments?.[0]?.Duration % 60
                      }m`}
                      {segments?.length > 1 && (
                        <span className="ml-2">
                          +{" "}
                          {`${Math.floor(segments?.[1]?.Duration / 60)}h ${
                            segments?.[1]?.Duration % 60
                          }m`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {segments?.length > 1
                  ? `${segments.length - 1} stop via ${
                      segments?.[0]?.Destination?.Airport?.CityName
                    }`
                  : "Non-stop"}
              </div>
              <div className="mt-1 text-xs text-blue-500">
                {segments?.[0]?.NoOfSeatAvailable} seats left
              </div>
            </div>

            {/* Arrival */}
            <div className="col-span-3 text-right">
              <p className="text-xl font-semibold">
                {dayjs(
                  segments?.[segments.length - 1]?.Destination?.ArrTime
                ).format("h:mm A")}
              </p>
              <p className="text-sm text-gray-500">
                {dayjs(
                  segments?.[segments.length - 1]?.Destination?.ArrTime
                ).format("DD MMM, YY")}
              </p>
              <p className="text-sm font-medium">
                {
                  segments?.[segments.length - 1]?.Destination?.Airport
                    ?.CityName
                }{" "}
                (
                {
                  segments?.[segments.length - 1]?.Destination?.Airport
                    ?.CityCode
                }
                )
              </p>
            </div>
          </div>

          {/* Flight Route */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex-1">
              <p>{segments?.[0]?.Origin?.Airport?.AirportName}</p>
            </div>
            <div className="px-2">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex-1 text-right">
              <p>
                {
                  segments?.[segments.length - 1]?.Destination?.Airport
                    ?.AirportName
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Outbound Flight
        </h2>
        {renderFlightSegment(domesticFLight)}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Return Flight
        </h2>
        {renderFlightSegment(domesticFLight, true)}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total Price</h3>
            <p className="text-sm text-gray-500">For round trip</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              ₹
              {(
                Number(domesticFLight?.payloadGoing?.Fare?.PublishedFare) +
                Number(domesticFLight?.payloadReturn?.Fare?.PublishedFare)
              ).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFlightDomestic;
