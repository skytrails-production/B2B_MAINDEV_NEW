import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  findAirlineByCode,
  ticketDetails,
  flightBookErrorCheck,
  saveDB,
  findSeatMealBaggagePrice,
} from "../../utility/flightUtility/BookwarperUtility";
import { useReactToPrint } from "react-to-print";
import { ChevronLeft, Printer } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { subtractWalletRequest } from "../../Redux/Auth/logIn/actionLogin";
import { standardizeFlightFareResponse } from "../../utility/flightUtility/standardizeFlightResponse";

// Memoized TicketCard component
const TicketCard = React.memo(
  ({
    type,
    ticket,
    totalFare,
    markUP,
    combinedAddOnPrice,
    isHold,
    className,
    date,
    dispatch,
  }) => {
    const [hasDispatched, setHasDispatched] = useState(false);

    useEffect(() => {
      if (ticket?.PNR && !hasDispatched) {
        const finalPrice = totalFare + totalFare * markUP + combinedAddOnPrice;
        dispatch(
          subtractWalletRequest({
            balance: isHold ? 100 : finalPrice,
            type: "flight",
            booking_id: ticket.PNR,
          })
        );
        setHasDispatched(true);
      }
    }, [
      ticket?.PNR,
      hasDispatched,
      totalFare,
      markUP,
      combinedAddOnPrice,
      isHold,
      dispatch,
    ]);

    const flightInfo = ticket?.flight || {};
    const {
      arrivalTime,
      departureTime,
      destination,
      flightName,
      flightNumber,
      layover,
      origin,
      terminal1,
    } = flightInfo;

    return (
      <div className="flex flex-wrap z-10 relative pb-4">
        <div className="w-full sm:w-3/4 p-6">
          <h2 className="text-2xl capitalize font-semibold text-indigo-800 mb-2 md:mb-4">
            Flight Ticket {type}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {/* Flight details rendering */}
            <div>
              <p className="text-gray-700">
                <strong>PNR:</strong> {ticket?.PNR || "Loading..."}
              </p>
              <p className="text-gray-700">
                <strong>Flight No:</strong> {flightName}-{flightNumber}
              </p>
              <p className="text-gray-700">
                <strong>Airline:</strong>{" "}
                {findAirlineByCode(flightName)?.airlineName}
              </p>
              <p className={ticket?.PNR ? "text-green-500" : "text-red-500"}>
                <strong className="text-gray-700">Status:</strong>{" "}
                {!ticket?.PNR ? "Failed" : isHold ? "Hold" : "Confirmed"}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <strong>Departure:</strong> {`${origin} - ${departureTime}`}
              </p>
              <p className="text-gray-700">
                <strong>Arrival:</strong> {`${destination} - ${arrivalTime}`}
              </p>
              <p className="text-gray-700">
                <strong>Duration:</strong> {layover}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {date}
              </p>
            </div>
          </div>

          <div className="mt-2 md:mt-6">
            {ticket?.passengers?.map((passenger, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-2 md:py-4"
              >
                <p className="text-gray-700">
                  <strong>Passenger Name:</strong> {passenger?.firstName}{" "}
                  {passenger?.lastName}
                </p>
                <p className="text-gray-700">
                  <strong>Class:</strong> {passenger?.class || className}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full sm:w-1/4 bg-indigo-50 p-2 md:p-6 border-t md:border-t-0 md:border-l border-gray-200">
          <div className="text-center">
            <p className="text-indigo-800 text-lg font-semibold">
              Boarding Pass
            </p>
            <div className="mt-2 md:mt-6">
              <p className="text-sm text-indigo-600">PNR:</p>
              <p className="text-lg font-bold text-indigo-800">
                {ticket?.PNR || "Loading..."}
              </p>
            </div>
            <div className="mt-2 md:mt-6">
              <p className="text-sm text-indigo-600">Boarding Time:</p>
              <p className="text-lg font-bold text-indigo-800">
                {ticket?.boardingTime || ""}
              </p>
            </div>
            <div className="mt-2 md:mt-6">
              <p className="text-sm text-indigo-600">Gate:</p>
              <p className="text-lg font-bold text-indigo-800">
                Terminal {terminal1}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const FlightBookTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const componentRef = useRef();
  const [hasSaved, setHasSaved] = useState(false);

  // Memoized selectors
  const reducerState = useSelector((state) => state);
  const markUP = useSelector(
    (state) => state?.markup?.markUpData?.data?.result?.[0]?.flightMarkup,
    (prev, next) => prev === next
  );
  const Onward = useSelector(
    (state) => state?.returnSelected?.returnSelectedFlight?.onward,
    (prev, next) => prev?.flightId === next?.flightId
  );
  const Return = useSelector(
    (state) => state?.returnSelected?.returnSelectedFlight?.return,
    (prev, next) => prev?.flightId === next?.flightId
  );

  const { isHold } = location.state || false;
  console.log(isHold, "isholddd");
  const {
    date: dDate,
    returnDate: rDate,
    FlightCabinClass: className,
  } = useSelector((state) => state.searchFlight.flightDetails);

  // Passenger counts
  const adult = useMemo(
    () => Number(sessionStorage.getItem("adults") || 0),
    []
  );
  const child = useMemo(
    () => Number(sessionStorage.getItem("childs") || 0),
    []
  );
  const infant = useMemo(
    () => Number(sessionStorage.getItem("infants") || 0),
    []
  );
  const book1 = flightBookErrorCheck("onward");
  const book2 = flightBookErrorCheck("return");

  // Memoized flight fares
  const [FlightFareOnward, FlightFareReturn] = useMemo(() => {
    const onward = Onward
      ? standardizeFlightFareResponse(Onward, adult, child, infant)
      : {};
    const returnData = Return
      ? standardizeFlightFareResponse(Return, adult, child, infant)
      : {};
    return [onward, returnData];
  }, [Onward, Return, adult, child, infant]);

  // Memoized calculations
  const onwardAddOnPrice = useMemo(() => {
    const seatbaggagePrice = findSeatMealBaggagePrice("Onward");
    return (
      (seatbaggagePrice?.seatPrice || 0) +
      (seatbaggagePrice?.mealPrice || 0) +
      (seatbaggagePrice?.baggagePrice || 0)
    );
  }, []);
  const returnAddOnPrice = useMemo(() => {
    const seatbaggagePrice = findSeatMealBaggagePrice("Return");
    return (
      (seatbaggagePrice?.seatPrice || 0) +
      (seatbaggagePrice?.mealPrice || 0) +
      (seatbaggagePrice?.baggagePrice || 0)
    );
  }, []);

  const totalOnward = useMemo(
    () =>
      FlightFareOnward?.Adt?.Total +
      FlightFareOnward?.Chd?.Total +
      FlightFareOnward?.Inf?.Total,
    [FlightFareOnward]
  );

  const totalReturn = useMemo(
    () =>
      FlightFareReturn?.Adt?.Total +
      FlightFareReturn?.Chd?.Total +
      FlightFareReturn?.Inf?.Total,
    [FlightFareReturn]
  );

  // Memoized ticket details
  // const onwardTicket = useMemo(() => ticketDetails("onward"), [Onward]);
  // const returnTicket = useMemo(() => ticketDetails("return"), [Return]);
  const onwardTicket = ticketDetails("onward");
  const returnTicket = ticketDetails("return");
  let onwardTotalAmount = totalOnward + totalOnward * markUP + onwardAddOnPrice;
  let returnTotalAmount = totalReturn + totalReturn * markUP + returnAddOnPrice;
  // Save DB effects
  useEffect(() => {
    if (!Return && !hasSaved && !book1?.loading) {
      saveDB("onward", isHold, onwardTotalAmount);
      setHasSaved(true);
    }
  }, [Return, hasSaved, isHold, book1]);
  console.log(onwardTotalAmount, returnTotalAmount, "onwardTotalAmount");

  useEffect(() => {
    if (Return && !hasSaved && !book1?.loading && !book2?.loading) {
      saveDB("onward", isHold, onwardTotalAmount);
      saveDB("return", isHold, returnTotalAmount);
      setHasSaved(true);
    }
  }, [Return, hasSaved, isHold, book1, book2]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (book1?.loading || (Return && book2?.loading)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
        <div className="flex space-x-4 mb-6">
          <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-100"></div>
          <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-200"></div>
          <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-300"></div>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-6">
          Booking Your Flight...
        </h1>
        <p className="text-gray-100 mt-2">
          Please wait while we process your booking.
        </p>
      </div>
    );
  }
  if (!book1?.loading && (Return ? !book2?.loading : true)) {
    return (
      <div className="bg-gray-100 p-2 md:p-6 min-h-screen">
        <div className="max-w-4xl pt-3 mx-auto w-full flex justify-between items-center text-center rounded-b-lg">
          <button
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer text-base font-semibold text-gray-700"
          >
            <ChevronLeft size={18} className="mr-1" /> Back to Home
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 cursor-pointer text-base font-semibold text-gray-700"
          >
            <Printer size={18} /> Download PDF
          </button>
        </div>
        <div className="bg-gray-100 p-2 md:p-6 min-h-screen flex items-center justify-center">
          <div
            ref={componentRef}
            className="max-w-4xl w-full bg-white shadow-lg rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-md bg-indigo-600 text-white">
              <div className="flex items-center space-x-4">
                <img
                  src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg"
                  alt="Company Logo"
                  className="h-12 w-12 rounded-full"
                />
                <h1 className="hidden md:flex text-2xl font-bold">
                  TheSkyTrails
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-2 bg-white">
              <TicketCard
                type="onward"
                ticket={onwardTicket}
                totalFare={totalOnward}
                markUP={markUP}
                combinedAddOnPrice={onwardAddOnPrice}
                isHold={isHold}
                className={className}
                date={dDate}
                dispatch={dispatch}
              />
              {Return && (
                <TicketCard
                  type="return"
                  ticket={returnTicket}
                  totalFare={totalReturn}
                  markUP={markUP}
                  combinedAddOnPrice={returnAddOnPrice}
                  isHold={isHold}
                  className={className}
                  date={rDate}
                  dispatch={dispatch}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default FlightBookTicket;
