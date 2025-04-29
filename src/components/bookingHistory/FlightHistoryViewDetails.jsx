import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, Printer } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { findAirlineByCode } from "../../utility/flightUtility/BookwarperUtility";

dayjs.extend(utc);
dayjs.extend(timezone);

const FlightHistoryViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();
  const flight = location.state?.flight;

  useEffect(() => {
    if (!flight) {
      navigate("/bookinghistory");
    }
  }, [flight, navigate]);
  console.log("Flight Details:", flight);

  const handlePrint = useReactToPrint({ contentRef: componentRef });

  const TicketCard = React.memo(() => {
    if (!flight) return null;

    const airlineDetails = flight.airlineDetails?.[0] || {};
    const departureUTC = dayjs.utc(airlineDetails.Origin?.DepTime);
    const arrivalUTC = dayjs.utc(airlineDetails.Destination?.ArrTime);

    const departureTime = departureUTC.local();
    const arrivalTime = arrivalUTC.local();
    const flightDuration = dayjs.duration(arrivalTime.diff(departureTime));

    const formattedDate = departureTime.format("MMM D, YYYY");
    const formattedDeparture = departureTime.format("h:mm A");
    const formattedArrival = arrivalTime.format("h:mm A");
    const formattedDuration = `${flightDuration.hours()}h ${flightDuration.minutes()}m`;

    return (
      <div className="w-full p-6 space-y-6">
        {/* Header Section */}
        <div className="border-b pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                Flight Ticket
              </h1>
              <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                <span>
                  Booking Date: {dayjs(flight.createdAt).format("MMM D, YYYY")}
                </span>
                <span className="hidden md:block">•</span>
                <span>PNR: {flight.pnr || "--"}</span>
                <span className="hidden md:block">•</span>
                <span>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      flight.isHold ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {flight.pnr
                      ? flight.isHold
                        ? "On Hold"
                        : "Confirmed"
                      : "Failed"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Departure</p>
            <p className="text-xl font-semibold text-gray-900">
              {flight.origin || "--"}
              <span className="block text-sm text-gray-600">
                {formattedDeparture} - {formattedDate}
              </span>
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Arrival</p>
            <p className="text-xl font-semibold text-gray-900">
              {flight.destination || "--"}
              <span className="block text-sm text-gray-600">
                {formattedArrival}
              </span>
            </p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 mb-1">Flight Details</p>
            <p className="font-semibold text-gray-900">
              {findAirlineByCode(airlineDetails.Airline?.AirlineCode)
                ?.airlineName || "--"}
            </p>
            <p className="text-sm text-gray-600">
              {airlineDetails.Airline?.AirlineCode}-
              {airlineDetails.Airline?.FlightNumber}
              <span className="block">Duration: {formattedDuration}</span>
            </p>
          </div>
        </div>

        {/* Passenger Details Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
            Passenger Details
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {flight.passengerDetails?.map((passenger, index) => {
              const hasPersonalInfo =
                passenger.title || passenger.firstName || passenger.lastName;
              const hasGenderOrDOB = passenger.gender || passenger.DateOfBirth;
              const hasPassport = passenger.passportNo;
              const hasContact = passenger.email || passenger.ContactNo;
              const hasAddress = passenger.addressLine1 || passenger.city;
              const hasTicketInfo =
                passenger.TicketNumber || passenger.class || passenger.seat;

              return (
                <div
                  key={index}
                  className="bg-white border p-6 rounded-lg shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Personal Information */}
                    {hasPersonalInfo && (
                      <div className="space-y-2">
                        {hasPersonalInfo && (
                          <h4 className="text-lg font-semibold text-gray-900">
                            {[
                              passenger.title,
                              passenger.firstName,
                              passenger.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </h4>
                        )}

                        {hasGenderOrDOB && (
                          <div className="text-sm text-gray-600">
                            {passenger.gender === "1" && "Male"}
                            {passenger.gender === "2" && "Female"}
                            {passenger.DateOfBirth && (
                              <>
                                {passenger.gender && " • "}
                                DOB:{" "}
                                {dayjs(passenger.DateOfBirth).isValid()
                                  ? dayjs(passenger.DateOfBirth).format(
                                      "MMM D, YYYY"
                                    )
                                  : "Invalid date"}
                              </>
                            )}
                          </div>
                        )}

                        {hasPassport && (
                          <p className="text-sm mt-2">
                            Passport: {passenger.passportNo}
                            {passenger.passportExpiry &&
                              ` (Expiry: ${passenger.passportExpiry})`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contact Information */}
                    {(hasContact || hasAddress) && (
                      <div className="text-sm">
                        {hasContact && (
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">Contact</p>
                            {passenger.email && (
                              <p className="text-gray-600">{passenger.email}</p>
                            )}
                            {passenger.ContactNo && (
                              <p className="text-gray-600">
                                {passenger.ContactNo}
                              </p>
                            )}
                          </div>
                        )}

                        {hasAddress && (
                          <div className="mt-2">
                            <p className="font-medium text-gray-900">Address</p>
                            <p className="text-gray-600">
                              {[passenger.addressLine1, passenger.city]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ticket Information */}
                  {hasTicketInfo && (
                    <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t">
                      {passenger.TicketNumber && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            Ticket Number
                          </p>
                          <p className="text-indigo-600">
                            {passenger.TicketNumber}
                          </p>
                        </div>
                      )}

                      {(passenger.class || passenger.seat) && (
                        <div className="space-y-1 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Travel Details
                          </p>
                          <p className="text-gray-600">
                            {passenger.class && `${passenger.class} Class`}
                            {passenger.seat &&
                              `${passenger.class ? " • " : ""}Seat ${
                                passenger.seat
                              }`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meal Plans Section */}
        {flight.mealPlans?.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
              Meal Plans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flight.mealPlans.map((meal, index) => (
                <div key={index} className="bg-white border p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {meal.AirlineDescription || meal.Description}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>
                        {meal.Code} • Qty: {meal.Quantity}
                      </p>
                      <p>
                        {meal.Origin}-{meal.Destination}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seat Selection Section */}
        {flight.seatSelections?.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
              Seat Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flight.seatSelections.map((seat, index) => (
                <div key={index} className="bg-white border p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      Seat {seat.RowNo}
                      {seat.SeatNo}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>
                        {seat.CraftType || "Aircraft"} •{" "}
                        {seat.Compartment === "2" ? "Economy" : "Business"}
                      </p>
                      <p>
                        {seat.Origin}-{seat.Destination}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  });

  if (!flight) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/bookinghistory")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back to Bookings
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Printer className="mr-2 h-5 w-5 text-indigo-600" />
            <span className="text-gray-700">Print Ticket</span>
          </button>
        </div>

        {/* Ticket Container */}
        <div
          ref={componentRef}
          className="bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Airline Header */}
          <div className="bg-indigo-900 text-white px-6 py-0">
            <div className="flex items-center space-x-4">
              <img
                // src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg"
                src="/WhiteLogo.png"
                alt="SkyTrails"
                className="h-30 w-40 "
              />
              {/* <div>
                <h1 className="text-2xl font-bold">The SkyTrails</h1>
                <p className="text-sm opacity-90">Electronic Travel Document</p>
              </div> */}
            </div>
          </div>

          <TicketCard />
        </div>
      </div>
    </div>
  );
};

export default FlightHistoryViewDetails;
