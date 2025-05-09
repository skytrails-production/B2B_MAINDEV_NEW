import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ReckeckPayment from "../flightSearchForm/reviewDetails/ReckeckPayment";

import {
  fareQuateRuleAirsel,
  fareQuateRuleAirselErrorCheck,
  findPrice,
  findSeatMealBaggagePrice,
  flightSeatMap,
} from "../../../utility/flightUtility/BookwarperUtility";

import { swalModal } from "../../../utility/swal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearAllFlightBookNew,
  fetchFlightBookRequestOneway,
  fetchFlightBookRequestReturn,
} from "../../../Redux/newFlightBook/actionNewFlightBook";

import ReviewTravellerFlight from "../flightSearchForm/reviewDetails/ReviewTravellerFlight";

import {
  flightSeatRequestOnward,
  flightSeatRequestReturn,
} from "../../../Redux/AirlineSeatMapNew/actionAirlineSeatMap";
import AirSeatMapModal from "../flightSearchForm/reviewDetails/AirSeatMapModal";

import {
  fetchFlightQuotesAireselRequestOneway,
  fetchFlightQuotesAireselRequestReturn,
} from "../../../Redux/FareQuoteRuleAirsel/actionFlightQuoteRuleAirsel";
import { PassengersAction } from "../../../Redux/Passengers/passenger";
import { standardizeFlightFareResponse } from "../../../utility/flightUtility/standardizeFlightResponse";
import ContinueBtn from "../flightSearchForm/reviewDetails/ContinueBtn";
import FlightDetailBookWraper from "../../../components/BookWraperFlight/FlightDetailBookWraper";
import BookWrapperSummary from "../../../components/BookWraperFlight/BookWrapperSummary";
import PaxComponent from "../../../components/BookWraperFlight/PaxComponent";
import { apiURL } from "../../../Constants/constant";
import { FaPlane } from "react-icons/fa";

const FlightItineraryLoader = ({
  message = "Securing your flight details...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-700">
      <div className="relative w-96 max-w-[90%] p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
        {/* Animated Plane Path */}
        <div className="absolute top-12 left-0 right-0">
          <div className="relative h-1 bg-white/20 rounded-full mx-8">
            <div className="absolute -top-3 left-0 animate-plane">
              <FaPlane className="text-2xl text-white -rotate-45" />
            </div>
            <div className="absolute h-full w-full border-2 border-dashed border-white/30 rounded-full -top-1" />
          </div>
        </div>

        {/* Pulsing Airline Icon */}
        <div className="flex justify-center mb-12">
          <div className="p-4 bg-white/20 rounded-full animate-pulse">
            <FaPlane className="text-4xl text-white" />
          </div>
        </div>

        {/* Animated Progress */}
        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-white rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          {/* Gradient Text */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-100 to-purple-200 bg-clip-text text-transparent">
              Crafting Your Journey
            </h1>
            <p className="mt-2 text-blue-100/90 font-medium">{message}</p>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 rounded-full animate-progress" />
          </div>

          {/* Status Messages */}
          <div className="flex justify-between text-sm font-medium text-blue-100/80">
            <span>Payment Processing</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Floating Disclaimer */}
      <p className="mt-8 text-center text-white/60 text-sm max-w-md px-4">
        Please keep this window open while we secure your booking. This may take
        a moment.
      </p>
    </div>
  );
};

const FlightBookWrapperDummy = () => {
  const [sub, setSub] = useState(false);
  const [passengerData, setPassengerData] = useState([]);
  const [V_aliation, set_Validation] = useState(false);
  const [isSeatMapopen, setIsSeatMapOpen] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const navigate = useNavigate();

  const [paymentLoading, setPaymentLoading] = useState(false);

  const dispatch = useDispatch();
  const reducerState = useSelector((state) => {
    return state;
  });
  const passengerRef = useRef();

  const navigation = useNavigate();
  const location = useLocation();
  const { isHold } = location.state || false;
  console.log(isHold, "isHold in book wrapper");
  const fareCode = reducerState?.fareQuoteRuleAirselReducer;
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loaderPayment, setLoaderPayment] = useState(false);
  const [loaderPayment1, setLoaderPayment1] = useState(false);
  const [isDisableScroll, setIsDisableScroll] = useState(false);
  const [refundTxnId, setRefundTxnId] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(null);
  const adult = sessionStorage.getItem("adults");
  const child = sessionStorage.getItem("childs");
  const infant = sessionStorage.getItem("infants");
  const [FlightFareOnward, setFlightFareOnward] = useState([]);
  const [FlightFareReturn, setFlightFareReturn] = useState([]);
  const [airSeatMapModal, SetAirSeatMapModal] = useState(false);
  const [reviewTravellerModal, setReviewTravellerModal] = useState(false);
  const [openSSR, setOpenSSR] = useState(false);

  const markUP =
    reducerState?.markup?.markUpData?.data?.result?.[0]?.flightMarkup;
  // console.log(markUP, "markUp");

  const seatbaggagePrice = findSeatMealBaggagePrice();
  const combinedAddOnPrice =
    (seatbaggagePrice?.seatPrice > 0 ? seatbaggagePrice?.seatPrice : 0) +
    (seatbaggagePrice?.mealPrice > 0 ? seatbaggagePrice?.mealPrice : 0) +
    (seatbaggagePrice?.baggagePrice > 0 ? seatbaggagePrice?.baggagePrice : 0);

  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const farequoteOnward = reducerState?.fareQuoteRuleAirselReducer?.oneway;
  const farequoteReturn = reducerState?.fareQuoteRuleAirselReducer?.return;

  const formRef = useRef(null);

  const handleTravelClickYes = () => {
    setReviewTravellerModal(false);
    // console.log(Onward, "onward97");
    if (
      (Onward?.type == "KAFILA" && Return?.type == "KAFILA") ||
      (!Return && Onward?.type == "KAFILA")
    ) {
      // setIsConfirmationModalOpen(true);
      SetAirSeatMapModal(true);
    } else {
      SetAirSeatMapModal(true);
    }
  };
  const handleSkipToPayment = () => {
    SetAirSeatMapModal(false);
    setIsConfirmationModalOpen(true);
  };

  useEffect(() => {
    if (Onward) {
      const onwardData = standardizeFlightFareResponse(
        Onward,
        adult,
        child,
        infant
      ); // Get standardized data
      setFlightFareOnward(onwardData); // Update state with data
    }
    if (Return) {
      const returnData = standardizeFlightFareResponse(
        Return,
        adult,
        child,
        infant
      ); // Get standardized data

      setFlightFareReturn(returnData); // Update state with data
    }
  }, []);

  const totalOnward =
    FlightFareOnward?.Adt?.Total +
    FlightFareOnward?.Chd?.Total +
    FlightFareOnward?.Inf?.Total;

  const totalReturn =
    FlightFareReturn?.Adt?.Total +
    FlightFareReturn?.Chd?.Total +
    FlightFareReturn?.Inf?.Total;

  const grandTotal = Number(totalOnward + (Return ? totalReturn : 0));
  const newGrandTotal = (grandTotal + grandTotal * markUP)?.toFixed();
  // console.log(grandTotal, "grand total");
  let lastFinalPrice = (
    Number(newGrandTotal) + Number(combinedAddOnPrice)
  )?.toFixed();
  // console.log(lastFinalPrice, "lastFinalPrice");

  const apiUrlPayment = `${apiURL.baseURL}/skyTrails/api/transaction/easebussPayment`;

  const finalPricee = useCallback(async () => {
    if (Return && Onward) {
      const onwardPrice = await findPrice("onward");
      const returnPrice = await findPrice("return");
      return onwardPrice + returnPrice;
    } else if (Onward) {
      const onwardPrice = await findPrice("onward");
      return onwardPrice;
    }
  }, [fareCode]);

  useEffect(() => {
    finalPricee();
  }, [finalPricee]);

  const handleTravelClickOpen = async () => {
    if (authenticUser !== 200 && 1 == 2) {
      setIsLoginModalOpen(true);
    } else {
      try {
        const isValid = await passengerRef.current.validateForm();
        if (!isValid) return;
        const formData = passengerRef.current.getPassengerData();
        // dispatch(setPassengerData(formData));
        const localPassengers = [
          ...(formData.adults?.map((p) => ({ ...p, paxType: 1 })) || []),
          ...(formData.childs?.map((p) => ({ ...p, paxType: 2 })) || []),
          ...(formData.infants?.map((p) => ({ ...p, paxType: 3 })) || []),
        ];
        setPassengerData(localPassengers);

        dispatch(PassengersAction(localPassengers));
        setOpen(true);
        setReviewTravellerModal(true);
      } catch (err) {
        console.log(err, "errror ");
      }
    }
  };
  console.log(reducerState, "reducer state,");
  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };
  const handleConfirmationModalClose = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleBookingProcess = () => {
    dispatch(fetchFlightBookRequestOneway("onward"));
    if (Return) {
      dispatch(fetchFlightBookRequestReturn("return"));
    }
    navigation("/flight-dummy/ticket", {
      state: { isHold: true },
    });
  };
  useEffect(() => {
    dispatch(clearAllFlightBookNew());
  }, []);

  useEffect(() => {
    if (loaderPayment == true) {
      handleBookingProcess();

      console.log("payment sucessfully completed");
    }
  }, [loaderPayment]);
  useState(() => {
    // console.log(Onward, Return, "onwardReturn");
    if (Onward && Return) {
      dispatch(fetchFlightQuotesAireselRequestOneway("onward"));

      dispatch(fetchFlightQuotesAireselRequestReturn("return"));

      // dispatch(flightSeatRequestOnward("onward"));
      // dispatch(flightSeatRequestReturn("return"));
    } else if (Onward) {
      dispatch(fetchFlightQuotesAireselRequestOneway("onward"));
      // dispatch(flightSeatRequestOnward("onward"));
    }
  }, []);

  useEffect(() => {
    const checkErrors = async () => {
      try {
        const onwardError = await fareQuateRuleAirselErrorCheck("onward");

        const returnError =
          Return && (await fareQuateRuleAirselErrorCheck("return"));

        !onwardError?.error &&
          !onwardError?.loading &&
          Object.keys(farequoteOnward).length > 0 &&
          dispatch(flightSeatRequestOnward("onward"));

        Return &&
          !returnError?.error &&
          !returnError?.loading &&
          Object.keys(farequoteReturn).length > 0 &&
          dispatch(flightSeatRequestReturn("return"));

        if (onwardError?.error == true || returnError?.error == true) {
          swalModal("flight", "Selected flight not available", false);
          navigation(-1);
        }
      } catch (error) {
        console.error("Error checking fare quote rules:", error);
      }
    };

    checkErrors();
  }, [fareCode]);

  //   const FlightItineraryLoader = ({
  //     message = "We’re booking your flight...",
  //   }) => {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
  //         <div className="flex space-x-4 mb-6">
  //           <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-100"></div>
  //           <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-200"></div>
  //           <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-300"></div>
  //         </div>

  //         <h1 className="text-3xl font-extrabold text-white mt-6">
  //           Creating Your Itinerary...
  //         </h1>
  //         <p className="text-gray-100 mt-2">
  //           Please wait while we process your request.
  //         </p>
  //       </div>
  //     );
  //   };

  return (
    <>
      {!lastFinalPrice ? (
        // <FlightItineraryLoader />
        <FlightItineraryLoader />
      ) : (
        <div className="z-10 relative pb-6 bg-primary-100">
          <div className="container  flex flex-col sm:flex-row gap-3 pt-3 ">
            <div className="w-full sm:w-8/12">
              <FlightDetailBookWraper />

              <PaxComponent ref={passengerRef} />
              <ContinueBtn
                // valiation={V_aliation}
                // setSub={() => setSub(true)}
                // setReviewTravellerModal={() => setReviewTravellerModal(true)}
                handleTravelClickOpen={handleTravelClickOpen}
                // handleFocus={handleFocusForm}
              />
            </div>
            <BookWrapperSummary widdthh={"w-full sm:w-4/12"} />
            {/* <Authentic isOpen={isLoginModalOpen} onClose={handleModalClose} /> */}
            <ReckeckPayment
              isConfirmationModalOpen={isConfirmationModalOpen}
              handleConfirmationModalClose={handleConfirmationModalClose}
              // handlePayment={handlePayment}
              //   handlePayment={handlePaymentt}
              // handlePayment={handleBookingProcess}
              phone={passengerData?.[0]?.ContactNo}
              email={passengerData?.[0]?.email}
              ticketPrice={100}
              bookingType="FLIGHTS" // or "BUS" or "HOTEL"
              buttonText="Pay Now"
              setPaymentLoading={(state) => {
                setPaymentLoading(state);
              }}
              setLoaderPayment1={(state) => {
                setLoaderPayment1(state);
              }}
              setLoaderPayment={(state) => {
                setLoaderPayment(state);
              }}
              setLoadingButton={(state) => {
                setLoadingButton(state);
              }}
              className="bg-primary-700 border-primary-700 font-semibold px-6 py-2 rounded-md hover:!bg-primary-6000"
            />
            <ReviewTravellerFlight
              passengerData={passengerData}
              isModal={reviewTravellerModal}
              closeModal={() => setReviewTravellerModal(false)}
              closeModalWithYes={() => handleTravelClickYes()}
            />

            <AirSeatMapModal
              passengerData={passengerData}
              isSeatModal={airSeatMapModal}
              closeSeatModal={() => SetAirSeatMapModal(false)}
              handleSkipToPayment={() => handleSkipToPayment()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FlightBookWrapperDummy;
