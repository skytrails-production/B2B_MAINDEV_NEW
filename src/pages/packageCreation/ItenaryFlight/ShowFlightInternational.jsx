import dayjs from "dayjs";
import { Plane, Clock, User, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";

const ShowFlightInternational = ({ flight }) => {
  const reducerState = useSelector((state) => state);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.flightMarkup;

  const grandTotal = (
    Number(flight?.payloadReturnInternational?.Fare?.PublishedFare.toFixed(0)) +
    markUpamount *
      Number(flight?.payloadReturnInternational?.Fare?.PublishedFare.toFixed(0))
  ).toFixed(0);

  const goingSegment = flight?.payloadReturnInternational?.Segments[0];
  const returnSegment =
    flight?.payloadReturnInternational?.Segments[
      flight?.payloadReturnInternational?.Segments?.length - 1
    ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Flight Header */}
      <div className="p-4 border-b border-gray-100 bg-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${flight?.payloadReturnInternational?.ValidatingAirline}.png`}
              alt="airline"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h3 className="font-medium">
                {goingSegment[0]?.Airline?.AirlineName}
              </h3>
              <p className="text-sm text-gray-500">
                {goingSegment[0]?.Airline?.AirlineCode}
                {goingSegment[0]?.Airline?.FlightNumber}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {dayjs(goingSegment[0]?.Origin?.DepTime).format("DD MMM, YY")}
            </p>
            <h3 className="text-xl font-bold text-blue-600">
              ₹
              {Number(
                flight?.payloadReturnInternational?.Fare?.PublishedFare.toFixed(
                  0
                )
              ).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-4">
        {/* Going Flight */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h4 className="font-medium text-gray-700">Going Flight</h4>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {goingSegment[0]?.Origin?.Airport?.CityCode}
              </p>
              <h4 className="font-medium">
                {dayjs(goingSegment[0]?.Origin?.DepTime).format("h:mm A")}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {goingSegment[0]?.Origin?.Airport?.CityName}
              </p>
            </div>
            <div className="flex-1 px-4">
              <div className="relative">
                <div className="h-px bg-gray-300 w-full"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white p-1 rounded-full shadow">
                    <Plane size={16} className="text-blue-500 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-1">
                <p className="text-xs text-gray-500">
                  {goingSegment.length > 1
                    ? `${goingSegment.length - 1} stop via ${
                        goingSegment[0]?.Destination?.Airport?.CityName
                      }`
                    : "Non-stop"}
                </p>
                <p className="text-xs flex items-center justify-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  {`${Math.floor(goingSegment[0]?.Duration / 60)}h ${
                    goingSegment[0]?.Duration % 60
                  }m`}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {
                  goingSegment[goingSegment.length - 1]?.Destination?.Airport
                    ?.CityCode
                }
              </p>
              <h4 className="font-medium">
                {dayjs(
                  goingSegment[goingSegment.length - 1]?.Destination?.ArrTime
                ).format("h:mm A")}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {
                  goingSegment[goingSegment.length - 1]?.Destination?.Airport
                    ?.CityName
                }
              </p>
            </div>
          </div>
        </div>

        {/* Return Flight */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h4 className="font-medium text-gray-700">Return Flight</h4>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {returnSegment[0]?.Origin?.Airport?.CityCode}
              </p>
              <h4 className="font-medium">
                {dayjs(returnSegment[0]?.Origin?.DepTime).format("h:mm A")}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {returnSegment[0]?.Origin?.Airport?.CityName}
              </p>
            </div>
            <div className="flex-1 px-4">
              <div className="relative">
                <div className="h-px bg-gray-300 w-full"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white p-1 rounded-full shadow">
                    <Plane size={16} className="text-blue-500 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-1">
                <p className="text-xs text-gray-500">
                  {returnSegment.length > 1
                    ? `${returnSegment.length - 1} stop via ${
                        returnSegment[0]?.Destination?.Airport?.CityName
                      }`
                    : "Non-stop"}
                </p>
                <p className="text-xs flex items-center justify-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  {`${Math.floor(returnSegment[0]?.Duration / 60)}h ${
                    returnSegment[0]?.Duration % 60
                  }m`}
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {
                  returnSegment[returnSegment.length - 1]?.Destination?.Airport
                    ?.CityCode
                }
              </p>
              <h4 className="font-medium">
                {dayjs(
                  returnSegment[returnSegment.length - 1]?.Destination?.ArrTime
                ).format("h:mm A")}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {
                  returnSegment[returnSegment.length - 1]?.Destination?.Airport
                    ?.CityName
                }
              </p>
            </div>
          </div>
        </div>

        {/* Flight Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User size={14} />
            <span>{goingSegment[0]?.NoOfSeatAvailable} seats left</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Price</p>
            <h3 className="text-lg font-bold text-blue-600">
              ₹{grandTotal.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFlightInternational;
