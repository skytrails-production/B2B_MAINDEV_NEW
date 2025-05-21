import * as React from "react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Accordion } from "flowbite-react";
import Modal from "@mui/material/Modal";
import dayjs from "dayjs";
import { hotelBookRoomActionGRN } from "../../../../Redux/HotelGRN/hotel";
// import { apiURL } from "../../Constants/constant";
import axios from "axios";
// import { swalModal } from "../../utility/swal";
import { checkSearchTime } from "../../../../utility/utils";
import flightPaymentLoding from "../../../../images/loading/loading-ban.gif";
import SecureStorage from "react-secure-storage";
import freeWifi from "../holdGuestDetails/SVGs/freeWifi.svg";
import freeBreakfast from "../holdGuestDetails/SVGs/freeBreakfast.svg";
import freeParking from "../holdGuestDetails/SVGs/freeParking.svg";
import drinkingWater from "../holdGuestDetails/SVGs/DrinkingWater.svg";
import expressCheckin from "../holdGuestDetails/SVGs/expressCheckin.svg";
import welcomeDrink from "../holdGuestDetails/SVGs/welcomeDrink.svg";
import freeGym from "../holdGuestDetails/SVGs/freeGym.svg";

// import "./bookingreviewGRN.scss";
import { Baby, BedDouble, MapPin } from "lucide-react";

// import { load } from "@cashfreepayments/cashfree-js";
import { swalModal } from "../../../../utility/swal";
import { apiURL } from "../../../../Constants/constant";
import { subtractWalletRequest } from "../../../../Redux/Auth/logIn/actionLogin";
import HoldModalMap from "../../SearchResult/HoldModalMap";
import HoldHotelGalleryCarousel from "../../holdSelectRoom/HoldHotelGalleryCarousel";
import HoldPriceSummaryGRNcoupon from "./HoldPriceSummaryGRNcoupon";
const HoldBookingReviewGRN = ({
  toggleState,
  setCouponAmountFun,
  couponAmount,
}) => {
  // const apiUrlPayment = `${apiURL.baseURL}/skyTrails/api/transaction/easebussPayment`;
  let cashfree;
  // var initializeSDK = async function () {
  //   cashfree = await load({
  //     mode: "sandbox",
  //     // mode: "production",
  //   });
  // };
  // initializeSDK();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  let bookingStatus =
    reducerState?.hotelSearchResult?.bookRoom?.BookResult?.Status || false;
  const [loaderPayment1, setLoaderPayment1] = useState(false);
  const [loaderPayment, setLoaderPayment] = useState(false);
  const hotelinfoGRN = reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel;
  const hotelMainReducer =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const passenger = reducerState?.passengers?.passengersData;
  const [isDisableScroll, setIsDisableScroll] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [refundTxnId, setRefundTxnId] = useState(null);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup *
    Number(hotelinfoGRN?.rate?.price);

  const hotelGallery =
    reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data?.images
      ?.regular;

  const rating = hotelinfoGRN?.category;
  const totalStars = 5;

  const couponconfirmation3 = async () => {
    try {
      const token = SecureStorage.getItem("jwtToken");
      const response = await axios.get(
        `${apiURL.baseURL}/skyTrails/api/coupons/couponApplied/${couponvalue}`,

        {
          headers: {
            token: token,
          },
        }
      );
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    if (reducerState?.hotelSearchResultGRN?.bookRoom?.status === "confirmed") {
      setLoaderPayment(false);
      couponconfirmation3();
      dispatch(
        subtractWalletRequest({
          balance: finalAmount,
          type: "HOTLE",
          booking_id: "ssaf",
        })
      );

      navigate("/hotelhold/hotelresult/selectroom/guestDetails/review/ticket", {
        state: { finalamount: finalAmount },
      });
      return;
    }
  }, [reducerState?.hotelSearchResultGRN?.bookRoom?.status]);

  const refundAmount = async () => {
    try {
      const token = SecureStorage.getItem("jwtToken");
      const payload = {
        // refund_amount: 1,
        refund_amount: Number(finalAmount).toFixed(2),

        txnId: refundTxnId,
      };

      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/api/transaction/refundPolicy`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
    } catch (error) {
      console.warn(error);
    }
    // finally {
    //   // saveDb();
    //   // datasaveTodb(jsonSavePnrData, sesstioResultIndex, reducerState, finalAmount, arrTimeISO1, depTimeISO1);
    // }
  };

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.bookRoom?.errors?.[0]?.code &&
      reducerState?.hotelSearchResultGRN?.bookRoom?.errors?.[0]?.code !== 0
    ) {
      refundAmount();
      setLoadingButton(false);
      swalModal(
        "py",
        "Booking Issue - Your refund will be processed within 7 working days. We apologize for any inconvenience caused.",
        true
      );
    }
    if (
      reducerState?.hotelSearchResultGRN?.bookRoom?.errors?.[0]?.code == 2112
    ) {
      refundAmount();
      setLoadingButton(false);
      swalModal("py", "Your Name is not Matched with PAN Number", true);
    }
  }, [reducerState?.hotelSearchResultGRN?.bookRoom]);

  // console.log(reducerState, "reducer state");

  useEffect(() => {
    if (loaderPayment == true) {
      handleClickBooking();
    }
  }, [loaderPayment]);

  function generateMixedString() {
    const fixedText = "skyTrails_";
    const currentTime = Date.now().toString(); //add current time
    return fixedText + currentTime;
  }

  const mixedString = generateMixedString();

  const clientNationality = JSON.parse(
    sessionStorage.getItem("clientNationality")
  );

  const handleClickBooking = async () => {
    const payload = {
      search_id:
        reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.search_id,
      hotel_code: hotelinfoGRN?.hotel_code,
      city_code: hotelinfoGRN?.city_code,
      group_code: hotelinfoGRN?.rate?.group_code,
      checkout: hotelMainReducer?.checkout,
      checkin: hotelMainReducer?.checkin,
      booking_comments: "Test booking",
      payment_type: "AT_WEB",
      agent_reference: mixedString,
      booking_items: [
        {
          room_code: hotelinfoGRN?.rate?.room_code,
          rate_key: hotelinfoGRN?.rate?.rate_key,
          rooms: passenger.map((item, index) => ({
            room_reference: hotelinfoGRN?.rate?.rooms?.[index]?.room_reference,
            paxes: [
              ...item.adults.map((adult) => ({
                title: adult.Title,
                name: adult.FirstName,
                surname: adult.LastName,
                type: "AD",
              })),
              ...item.children.map((child) => ({
                title: child.Title,
                name: child.FirstName,
                surname: child.LastName,
                type: "CH",
                age: child.age,
              })),
            ],
          })),
        },
      ],
      holder: {
        title: passenger?.[0]?.adults?.[0]?.Title,
        name: passenger?.[0]?.adults?.[0]?.FirstName,
        surname: passenger?.[0]?.adults?.[0]?.LastName,
        email: passenger?.[0]?.adults?.[0]?.Email,
        phone_number: passenger?.[0]?.adults?.[0]?.Phoneno,
        client_nationality: clientNationality,
        pan_number: passenger?.[0]?.adults?.[0]?.PAN,
      },
    };

    dispatch(hotelBookRoomActionGRN(payload));
  };

  useEffect(() => {
    if (isDisableScroll) {
      document.body.classList.add("disableTrue");
      document.body.classList.remove("disableFalse");
    } else {
      document.body.classList.remove("disableTrue");
      document.body.classList.add("disableFalse");
    }
    return () => {
      document.body.classList.add("disableFalse");

      document.body.classList.remove("disableTrue");
    };
  }, [isDisableScroll]);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [finalAmount, setFinalAmount] = useState(0);
  const [couponvalue, setCouponValue] = useState("");

  const handleFinalAmountChange = (amount) => {
    setFinalAmount(amount);
  };

  const handlecouponChange = (code) => {
    setCouponValue(code);
  };

  let orderId1 = "";

  const handlePayment = async () => {
    setPaymentLoading(true);
    // setIsDisableScroll(true);
    setLoaderPayment1(true);

    if (!checkSearchTime()) {
      navigate("/st-hotel");
      return;
    } else {
      const token = SecureStorage?.getItem("jwtToken");
      sessionStorage.setItem("ammo", Number(finalAmount).toFixed(0));
      const cashpayload = {
        phone: passenger?.[0]?.adults?.[0]?.Phoneno,
        amount: Number(finalAmount).toFixed(0),
        // amount: 1,
        email: passenger?.[0]?.adults?.[0]?.Email,
        productinfo: "ticket",
        bookingType: "HOTELS",
      };

      try {
        // console.log("Cashfree Started");
        const response = await axios({
          method: "post",
          url: `${apiURL.baseURL}/skyTrails/api/transaction/makeCashfreePayment`,
          data: cashpayload,
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        // console.log("Cashfree Response", response);
        if (response.status === 200) {
          // const data = response.data.result;
          // console.log("Cashfree Response 1", data);
          // console.log("Cashfree Session ID", data.payment_session_id);
          // console.log("Cashfree Order ID", data.order_id);
          // paymentLoader(false);
          orderId1 = response.data.result.order_id;

          doPayment(response.data.result.payment_session_id);
          console.log("API call successful:", orderId1);
        } else {
          console.error("API call failed with status:", response.status);
          console.error("Error details:", response.data); // Use 'response.data' for error details
        }
      } catch (error) {
        // Handle network errors or exceptions
        console.error("API call failed with an exception:", error);
      } finally {
        setPaymentLoading(false);
        setLoaderPayment1(false);
      }
    }
  };

  const doPayment = async (sessionID) => {
    let checkoutOptions = {
      paymentSessionId: sessionID,
      // paymentSessionId:
      //   "session_F3qfjRlZhVXsIHEI57e2gBkYGmusQLYttDc2frS-yf-HduxICMtjm18F-5wLXlcPHBKJxudeJpZxUtcZBpZRDuKfMpG8HPmGV48uwz3jJi10mYn75eN9KplhWwpaymentpayment",
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        // console.log(
        //   "User has closed the popup or there is some payment error, Check for Payment Status"
        // );
        // console.log(result.error);
        swalModal("hotel", "Some error occured !", false);
        sessionStorage.removeItem("couponCode");
        toggleState(false);
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails.paymentMessage);
        setLoaderPayment(true);
        setLoadingButton(true);
      }
    });
  };

  // const proceedPayment = (accessKey, env, key) => {
  //   const easebuzzCheckout = new window.EasebuzzCheckout(key, env);
  //   const options = {
  //     access_key: `${accessKey}`,
  //     onResponse: async (response) => {
  //       if (response.status === "success") {
  //         try {
  //           const easeBuzzPayId = response.easepayid;
  //           setRefundTxnId(response.easepayid);
  //           const verifyResponse = await axios.post(
  //             `${apiURL.baseURL}/skyTrails/api/transaction/paymentSuccess?merchantTransactionId=${response.txnid}`,
  //             { easeBuzzPayId: easeBuzzPayId }
  //           );
  //           setLoaderPayment(true);
  //           setLoadingButton(true);
  //           // couponconfirmation3();
  //           // couponconfirmation3();
  //         } catch (error) {
  //           console.error("Error verifying payment:", error);
  //           // Handle error
  //         }
  //       } else {
  //         try {
  //           const verifyResponse = await axios.post(
  //             `${apiURL.baseURL}/skyTrails/api/transaction/paymentFailure?merchantTransactionId=${response.txnid}`
  //           );
  //           swalModal("hotel", verifyResponse.data.responseMessage, false);

  //           sessionStorage.removeItem("couponCode");
  //           toggleState(false);
  //           // setCouponAmountFun(null);
  //         } catch (error) {
  //           console.error("Error verifying payment:", error);
  //           // Handle error
  //         } finally {
  //           setIsDisableScroll(false);
  //         }
  //       }
  //     },
  //     theme: "#123456",
  //   };

  //   easebuzzCheckout.initiatePayment(options);
  // };

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelinfoGRN?.geolocation?.latitude ?? 0
  },${hotelinfoGRN?.geolocation?.longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <>
      <div className="py-4 z-10 relative">
        <div className="container bookingReviewMain">
          <div className="row">
            <HoldHotelGalleryCarousel data={hotelGallery} />
          </div>
          <div className="row mt-4">
            <div className="col-lg-8">
              <div className="row">
                <div className="mb-2 col-lg-12">
                  <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-800">
                    {hotelinfoGRN?.name}
                  </h1>

                  <div className="py-3 flex flex-col mt-4 justify-start gap-3  flex-wrap border-y border-gray-300">
                    <div className="flex flex-row items-center gap-2">
                      {Array.from({ length: totalStars }).map((_, index) => (
                        <i
                          key={index}
                          className={`fa-solid fa-star ${
                            index < rating ? "text-yellow-400" : "text-gray-800"
                          }`}
                        ></i>
                      ))}
                    </div>

                    <div>
                      <p className="text-start ">{hotelinfoGRN?.address}</p>
                    </div>

                    <div className="flex flex-row justify-start gap-3  flex-wrap">
                      <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                        <BedDouble className="h-6 w-6 text-purple" />{" "}
                        {hotelMainReducer?.no_of_rooms} Room
                      </div>

                      <HoldModalMap mapUrl={mapUrl} />

                      <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                        <i class="fa-regular fa-user text-purple text-lg"></i>
                        {hotelMainReducer?.no_of_adults} Adult
                      </div>

                      {hotelMainReducer?.no_of_children > 0 && (
                        <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                          <Baby className="h-6 w-6 text-purple" />
                          {hotelMainReducer?.no_of_children} child
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* room details area  */}

                <div className="col-lg-12 mt-3 mb-2">
                  <div className="border-b pb-3 border-gray-300">
                    <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                      {" "}
                      Room Type : {hotelinfoGRN?.rate?.rooms?.[0]?.description}
                    </h2>
                    <div className="flex flex-row items-center gap-2 justify-start">
                      <p class="mb-2 text-md font-semibold text-gray-800 ">
                        {hotelinfoGRN?.rate?.rooms?.[0]?.room_type}
                      </p>
                      <p className="mb-2 text-md font-semibold text-gray-800">
                        ({hotelinfoGRN?.rate?.boarding_details?.[0]})
                      </p>
                    </div>
                    <div className="roomNameAndCategory">
                      <div className="othInc">
                        {hotelinfoGRN?.rate?.pan_required && (
                          <div className="othIncInner">
                            <div className="flex justify-start items-center gap-2">
                              <svg
                                id="fi_3596091"
                                enable-background="new 0 0 24 24"
                                height="20"
                                viewBox="0 0 24 24"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g>
                                  <path d="m21.5 21h-19c-1.378 0-2.5-1.122-2.5-2.5v-13c0-1.378 1.122-2.5 2.5-2.5h19c1.378 0 2.5 1.122 2.5 2.5v13c0 1.378-1.122 2.5-2.5 2.5zm-19-17c-.827 0-1.5.673-1.5 1.5v13c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-13c0-.827-.673-1.5-1.5-1.5z"></path>
                                </g>
                                <g>
                                  <path d="m7.5 12c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5 2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5zm0-4c-.827 0-1.5.673-1.5 1.5s.673 1.5 1.5 1.5 1.5-.673 1.5-1.5-.673-1.5-1.5-1.5z"></path>
                                </g>
                                <g>
                                  <path d="m11.5 17c-.276 0-.5-.224-.5-.5v-1c0-.827-.673-1.5-1.5-1.5h-4c-.827 0-1.5.673-1.5 1.5v1c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-1c0-1.378 1.122-2.5 2.5-2.5h4c1.378 0 2.5 1.122 2.5 2.5v1c0 .276-.224.5-.5.5z"></path>
                                </g>
                                <g>
                                  <path d="m20.5 9h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                                </g>
                                <g>
                                  <path d="m20.5 13h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                                </g>
                                <g>
                                  <path d="m20.5 17h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                                </g>
                              </svg>
                              <p className="text-sm text-gray-800 mb-0">
                                Pan Required
                              </p>
                            </div>
                          </div>
                        )}
                        {hotelinfoGRN?.rate?.non_refundable && (
                          <div className="othIncInner">
                            <div className="flex justify-start items-center gap-2">
                              <svg
                                id="fi_2610380"
                                enable-background="new 0 0 30 30"
                                height="20"
                                viewBox="0 0 30 30"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="m15 0c-4.00684 0-7.77344 1.56055-10.60645 4.39355s-4.39355 6.6001-4.39355 10.60645 1.56055 7.77344 4.39355 10.60645 6.59961 4.39355 10.60645 4.39355 7.77344-1.56055 10.60645-4.39355 4.39355-6.6001 4.39355-10.60645-1.56055-7.77344-4.39355-10.60645-6.59961-4.39355-10.60645-4.39355zm-9.19238 24.19238c-2.45508-2.45556-3.80762-5.72021-3.80762-9.19238 0-3.13605 1.11255-6.09662 3.13507-8.45087l18.31592 18.31592c-2.35388 2.02283-5.31445 3.13495-8.45099 3.13495-3.47266 0-6.7373-1.35205-9.19238-3.80762zm19.05731-.74151-18.31592-18.31592c2.35388-2.02283 5.31445-3.13495 8.45099-3.13495 3.47266 0 6.7373 1.35205 9.19238 3.80762s3.80762 5.72021 3.80762 9.19238c0 3.13605-1.11255 6.09662-3.13507 8.45087z"
                                  fill="rgb(0,0,0)"
                                ></path>
                              </svg>
                              <p className="text-red-700 text-sm mb-0">
                                Non Refundable
                              </p>
                            </div>
                          </div>
                        )}
                        {hotelinfoGRN?.rate?.cancellation_policy && (
                          <div className="othIncInner">
                            <div className="d-flex justify-content-start align-items-center gap-2">
                              <svg
                                id="fi_7444875"
                                height="20"
                                viewBox="0 0 128 128"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                                data-name="Layer 1"
                              >
                                <path d="m11.59 65.89 11.19 8a2 2 0 0 0 2.79-.47l8-11.19a2 2 0 1 0 -3.27-2.33l-5.18 7.25a41.82 41.82 0 1 1 79.64 6.11 2 2 0 0 0 1.12 2.6 2 2 0 0 0 .74.14 2 2 0 0 0 1.86-1.26 45.82 45.82 0 1 0 -87.31-6.92l-7.26-5.18a2 2 0 1 0 -2.32 3.25z"></path>
                                <path d="m113.08 83.24c-4-4.73-10.56-2.56-14.1-1.4-2.24.74-7.61 3-12.9 5.24a8.26 8.26 0 0 0 -.62-5c-2.86-6.53-9.92-5.28-15.08-4.36a27.61 27.61 0 0 1 -4.84.61 20.2 20.2 0 0 1 -8-1.75 24.66 24.66 0 0 0 -10.37-2 50.57 50.57 0 0 0 -19.76 4.42l-1.12.46c-9.29 3.7-13.29 4.54-13.29 4.54a2 2 0 0 0 -1.55 1.48c-.07.29-1.64 7 2.81 16.43 3.82 8 8.29 11.07 11.36 12.18a2 2 0 0 0 1.91-.31s2.51-2 4.43-3.12c1.27-.77 4.36-1.26 11.92.84a92.12 92.12 0 0 0 21.42 3.07 25 25 0 0 0 8.32-1.14c7.89-3 27.09-13 34.64-17.1 4-2.18 6.18-4.53 6.68-7.19a7 7 0 0 0 -1.86-5.9zm-2.08 5.17c-.25 1.35-1.91 2.92-4.66 4.42-6.34 3.47-26.28 13.92-34.13 16.87-5.51 2.06-19.38.14-27.26-2a37.74 37.74 0 0 0 -9.71-1.7 10.14 10.14 0 0 0 -5.37 1.24c-1.35.82-2.89 1.94-3.86 2.66-3-1.5-5.85-4.9-8.14-9.72a25.11 25.11 0 0 1 -2.68-12.62 121.45 121.45 0 0 0 12.59-4.44l1.15-.47a46.3 46.3 0 0 1 18.32-4.1 20.5 20.5 0 0 1 8.88 1.77 23.77 23.77 0 0 0 9.34 2 32.17 32.17 0 0 0 5.61-.67c5.51-1 9.23-1.37 10.71 2a4.22 4.22 0 0 1 .15 3.35c-.56 1.38-2 2.64-4.26 3.66-2 .84-3.5 1.49-4.16 1.75-4.24 1.66-7.89 1.08-11.42.52l-1.94-.3a2 2 0 0 0 -.54 4c.61.08 1.23.18 1.85.28 3.87.61 8.25 1.3 13.51-.75.61-.24 1.83-.75 3.45-1.45.3-.12.59-.24.87-.37l2.58-1.1c6.51-2.8 15.43-6.64 18.36-7.6 4.65-1.53 7.91-2 9.78.18 1.21 1.42 1.04 2.3.98 2.59z"></path>
                                <path d="m64 33.76v2.65a8.76 8.76 0 0 0 -2 .72 6.31 6.31 0 0 0 -3.47 5.47c-.14 4.39 3.81 5.86 6.69 6.93 3.36 1.25 4.38 1.89 4.23 3.49a2.76 2.76 0 0 1 -1.84 2.45 6.86 6.86 0 0 1 -5.93-.5 2 2 0 0 0 -2.48 3.15 9.34 9.34 0 0 0 4.8 1.73v2.39a2 2 0 1 0 4 0v-2.69a9.82 9.82 0 0 0 1.23-.4 6.75 6.75 0 0 0 4.25-5.74c.48-4.92-3.91-6.55-6.81-7.63-3.11-1.15-4.14-1.75-4.1-3.05a2.34 2.34 0 0 1 1.36-2.07 6.07 6.07 0 0 1 5.74.49 2 2 0 1 0 2.12-3.39 10.6 10.6 0 0 0 -3.79-1.45v-2.55a2 2 0 1 0 -4 0z"></path>
                                <path d="m42 48a24 24 0 1 0 24-24 24 24 0 0 0 -24 24zm44 0a20 20 0 1 1 -20-20 20 20 0 0 1 20 20z"></path>
                              </svg>
                              <p className="panDesign3 text-gray-800 mb-0">
                                Refundable (Cancel Before{" "}
                                {dayjs(
                                  hotelinfoGRN?.rate?.cancellation_policy
                                    ?.cancel_by_date
                                ).format("DD MMM, YY")}
                                )
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        {hotelinfoGRN?.rate?.other_inclusions?.map(
                          (inclusion, e) => (
                            <div className="py-2" key={e}>
                              <div className="d-flex justify-content-start align-items-center gap-2">
                                {inclusion.toLowerCase() == "free wifi" && (
                                  <>
                                    <img src={freeWifi} alt="wifi" />
                                    <p className="panDesign3">Free WiFi</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() == "free internet" && (
                                  <>
                                    <img src={freeWifi} alt="wifi" />
                                    <p className="panDesign3">Free internet</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "free breakfast" && (
                                  <>
                                    <img src={freeBreakfast} alt="wifi" />
                                    <p className="panDesign3">Free Breakfast</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() == "breakfast" && (
                                  <>
                                    <img src={freeBreakfast} alt="wifi" />
                                    <p className="panDesign3">Breakfast</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "continental breakfast" && (
                                  <>
                                    <img src={freeBreakfast} alt="wifi" />

                                    <p className="panDesign3">
                                      Continental breakfast
                                    </p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "free self parking" && (
                                  <>
                                    <img src={freeParking} alt="wifi" />
                                    <p className="panDesign3">
                                      {" "}
                                      Free self parking
                                    </p>
                                  </>
                                )}
                                {inclusion.toLowerCase() == "parking" && (
                                  <>
                                    <img src={freeParking} alt="wifi" />
                                    <p className="panDesign3"> Free Parking</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() == "free parking" && (
                                  <>
                                    <img src={freeParking} alt="wifi" />
                                    <p className="panDesign3"> Free Parking</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "free valet parking" && (
                                  <>
                                    <img src={freeParking} alt="wifi" />

                                    <p className="panDesign3">
                                      {" "}
                                      Free Valet Parking
                                    </p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "drinking water" && (
                                  <>
                                    <img src={drinkingWater} alt="wifi" />
                                    <p className="panDesign3">
                                      {" "}
                                      Drinking water
                                    </p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "express check-in" && (
                                  <>
                                    <img src={expressCheckin} alt="wifi" />
                                    <p className="panDesign3">
                                      {" "}
                                      Express check-in
                                    </p>
                                  </>
                                )}
                                {inclusion.toLowerCase() == "welcome drink" && (
                                  <>
                                    <img src={welcomeDrink} alt="wifi" />
                                    <p className="panDesign3">Welcome drink</p>
                                  </>
                                )}
                                {inclusion.toLowerCase() ==
                                  "free fitness center access" && (
                                  <>
                                    <img src={freeGym} alt="wifi" />
                                    <p className="panDesign3">Free Gym</p>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* guest details sectin  */}

                <div className="col-lg-12 mt-3">
                  <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                    Your Booking Details will be sent to
                  </h2>

                  <div className="flex flex-row ">
                    <div className="flex flex-col items-start flex-1">
                      <p className="font-medium text-gray-800">Phone No : </p>
                      <p className=" text-gray-800">
                        {passenger?.[0]?.adults?.[0]?.Phoneno}
                      </p>
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <p className="font-medium text-gray-800">Email: </p>
                      <p className=" text-gray-800">
                        {passenger?.[0]?.adults?.[0]?.Email}
                      </p>
                    </div>
                  </div>
                </div>
                {/* passenger details  */}

                <div className="col-lg-12 mt-3">
                  <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                    Guest Details
                  </h2>
                  {passenger?.map((item, index) => {
                    return (
                      <div key={index}>
                        {item?.adults.length > 0 &&
                          item?.adults?.map((i, adultIndex) => (
                            <div className="">
                              <div className="row g-3 mb-3">
                                <div className="flex flex-row ">
                                  <div className="flex flex-col items-start flex-1">
                                    <p className="font-medium text-gray-800">
                                      Name:{" "}
                                    </p>
                                    <p className=" text-gray-800">
                                      {i?.Title?.toUpperCase()}{" "}
                                      {i?.FirstName?.toUpperCase()}{" "}
                                      {i?.LastName?.toUpperCase()}
                                    </p>
                                  </div>
                                  {index === 0 && adultIndex == 0 && (
                                    <div className="flex flex-col items-start flex-1">
                                      <p className="font-medium text-gray-800">
                                        PAN:{" "}
                                      </p>
                                      <p className=" text-gray-800">
                                        {index === 0 && <span>{i?.PAN}</span>}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                        {item?.children.length > 0 &&
                          item?.children?.map((i, childIndex) => (
                            <div className="mb-3">
                              <div className="flex flex-col items-start flex-1">
                                <p className="font-medium text-gray-800">
                                  Child {childIndex + 1}
                                </p>
                                <p className=" text-gray-800">
                                  {i?.Title?.toUpperCase()}{" "}
                                  {i?.FirstName?.toUpperCase()}{" "}
                                  {i?.LastName?.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>

                {/* <Amenities /> */}

                <Accordion collapseAll className="divide-none border-0 ">
                  <Accordion.Panel className="mb-2">
                    <Accordion.Title className="mb-2 focus:ring-0 flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-800 border border-gray-200 bg-transparent hover:bg-transparent gap-3 rounded-lg">
                      <div className="flex flex-row gap-2 items-center">
                        <h2 class="mb-0 text-lg font-semibold text-gray-800 ">
                          Property Rules
                        </h2>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content className="p-0">
                      <div className="col-lg-12 mt-3">
                        <div className="flex flex-row ">
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-medium text-gray-800">
                              Check-in Time Began:{" "}
                              {
                                hotelinfoGRN?.rate?.rate_comments
                                  ?.checkin_begin_time
                              }{" "}
                            </p>
                          </div>
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-medium text-gray-800">
                              Check-Out Time:{" "}
                              {hotelinfoGRN?.rate?.rate_comments?.checkout_time}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start flex-1 mt-3">
                          <p className="font-medium text-gray-800">
                            Passenger Comment
                          </p>
                          <p className=" text-gray-800">
                            {hotelinfoGRN?.rate?.rate_comments?.pax_comments}
                          </p>
                        </div>

                        {hotelinfoGRN?.rate?.rate_comments?.remarks !== "" && (
                          <div className="flex flex-col items-start flex-1 mt-3">
                            <p className="font-medium text-gray-800">Remarks</p>
                            <p
                              className=" text-gray-800"
                              dangerouslySetInnerHTML={{
                                __html:
                                  hotelinfoGRN?.rate?.rate_comments?.remarks,
                              }}
                            ></p>
                          </div>
                        )}
                        {hotelinfoGRN?.rate?.rate_comments?.remarks !== "" && (
                          <div className="flex flex-col items-start flex-1 mt-3">
                            <p className="font-medium text-gray-800">
                              Meal Plan
                            </p>
                            <p className=" text-gray-800">
                              {hotelinfoGRN?.rate?.rate_comments?.mealplan}
                            </p>
                          </div>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                </Accordion>

                <Modal open={loaderPayment1} onClose={loaderPayment1}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img src={flightPaymentLoding} alt="" />
                  </div>
                </Modal>
              </div>
            </div>
            <div className="col-lg-4 ">
              <HoldPriceSummaryGRNcoupon
                onFinalAmountChange={handleFinalAmountChange}
                oncouponselect={handlecouponChange}
                // payButton={handleClickBooking}
                payButton={handlePayment}
                loadingPayButton={(state) => {
                  setPaymentLoading(state);
                }}
                isPaymentSucessButton={loadingButton}
                setLoaderPayment={(state) => {
                  setLoaderPayment(state);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HoldBookingReviewGRN;
