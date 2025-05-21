import dayjs from "dayjs";
import React from "react";
import { useSelector } from "react-redux";

const ShowOnewayItenary = ({ flight }) => {
  const reducerState = useSelector((state) => state);

  // Helper functions
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateTime) => {
    return dayjs(dateTime).format("h:mm A");
  };

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format("DD MMM, YY");
  };

  const flightData = flight?.payloadOneway;
  const segments = flightData?.Segments?.[0] || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Flight Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${flightData?.ValidatingAirline}.png`}
            alt={firstSegment?.Airline?.AirlineName}
            className="h-10 w-10 mr-3"
          />
          <div>
            <h3 className="font-medium text-gray-900">
              {firstSegment?.Airline?.AirlineName}
            </h3>
            <p className="text-sm text-gray-500">
              {firstSegment?.Airline?.AirlineCode}
              {firstSegment?.Airline?.FlightNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Departure */}
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">
              {formatTime(firstSegment?.Origin?.DepTime)}
            </div>
            <div className="text-sm text-gray-500">
              {firstSegment?.Origin?.Airport?.CityCode}
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(firstSegment?.Origin?.DepTime)}
            </div>
            <div className="text-sm mt-1 text-gray-600">
              {firstSegment?.Origin?.Airport?.CityName}
            </div>
          </div>

          {/* Flight Duration */}
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-1">
              {segments.length === 1
                ? "Non Stop"
                : `${segments.length - 1} stop${
                    segments.length > 2 ? "s" : ""
                  }`}
            </div>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  {formatDuration(firstSegment?.Duration)}
                </span>
              </div>
            </div>
            {segments.length > 1 && (
              <div className="text-xs text-gray-400">
                Via {firstSegment?.Destination?.Airport?.CityName}
              </div>
            )}
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">
              {formatTime(lastSegment?.Destination?.ArrTime)}
            </div>
            <div className="text-sm text-gray-500">
              {lastSegment?.Destination?.Airport?.CityCode}
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(lastSegment?.Destination?.ArrTime)}
            </div>
            <div className="text-sm mt-1 text-gray-600">
              {lastSegment?.Destination?.Airport?.CityName}
            </div>
          </div>
        </div>

        {/* Flight Segments Details */}
        {segments.length > 1 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Flight Segments
            </h4>
            <div className="space-y-3">
              {segments.map((segment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatTime(segment?.Origin?.DepTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {segment?.Origin?.Airport?.CityCode}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        {formatDuration(segment?.Duration)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatTime(segment?.Destination?.ArrTime)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {segment?.Destination?.Airport?.CityCode}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price and Additional Info */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-4">
          <div className="mb-3 sm:mb-0">
            <div className="text-2xl font-bold text-blue-600">
              ₹{(flightData?.Fare?.PublishedFare || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {firstSegment?.NoOfSeatAvailable || 0} seats left
            </div>
          </div>

          {flightData?.AirlineRemark && flightData?.AirlineRemark !== "--." && (
            <div className="bg-blue-50 text-blue-700 text-sm p-2 rounded-lg">
              {flightData?.AirlineRemark}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowOnewayItenary;
