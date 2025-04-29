import React, { useEffect, useState } from "react";
import TboAmenities from "../TboAmenities";
import HotelGallery from "../HotelGallery";
import { Baby, BedDouble, MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
// import { apiURL } from "../../../../Constants/constant";
import TboPriceSummary from "./TboPriceSummary";
import SecureStorage from "react-secure-storage";

import flightPaymentLoding from "../../../../../images/loading/loading-ban.gif";
import { checkSearchTime } from "../../../../../utility/utils";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { swalModal } from "../../../../../utility/swal";
import { hotelBookRoomAction } from "../../../../../Redux/Hotel/hotel";
import ModalMap from "../../ModalMap";
// import { load } from "@cashfreepayments/cashfree-js";
import { apiURL } from "../../../../../Constants/constant";
import { subtractWalletRequest } from "../../../../../Redux/Auth/logIn/actionLogin";

const TboBookingHotel = ({ toggleState }) => {
  const reducerState = useSelector((state) => state);
  // const apiUrlPayment = `${apiURL.baseURL}/skyTrails/api/transaction/easebussPayment`;
  let cashfree;
  // var initializeSDK = async function () {
  //   cashfree = await load({
  //     mode: "production",
  //     // mode: "sandbox",
  //   });
  // };
  // initializeSDK();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const grnHotelData =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const hotelRoomDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails?.[0];

  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;
  const rating = hotelInfo?.HotelDetails?.StarRating;
  const totalStars = 5;

  const [refundTxnId, setRefundTxnId] = useState(null);

  const hotelBlockDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult;
  const hotelDetails = hotelBlockDetails?.HotelRoomsDetails;

  let totalAdults = 0;
  let totalChildren = 0;

  grnHotelData?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  const passenger = reducerState?.passengers?.passengersData;

  //   for payment
  const bookingId =
    reducerState?.hotelSearchResult?.bookRoom?.BookResult?.BookingId;
  const resultIndex = sessionStorage.getItem("ResultIndex");
  const hotelCode = sessionStorage.getItem("HotelCode");

  const [loaderPayment1, setLoaderPayment1] = useState(false);
  const [loaderPayment, setLoaderPayment] = useState(false);
  const [isDisableScroll, setIsDisableScroll] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

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
      reducerState?.hotelSearchResult?.bookRoom?.BookResult?.Error?.ErrorCode ==
      0
    ) {
      console.log(
        reducerState?.hotelSearchResult?.bookRoom?.BookResult,
        "reducerState?.hotelSearchResult?.bookRoom?.BookResult"
      );
      setLoaderPayment(false);
      couponconfirmation3();
      dispatch(
        subtractWalletRequest({
          balance: finalAmount,
          type: "HOTEL",
          booking_id: "1234rrr",
        })
      );
      navigate(
        "/st-hotel/hotelresult/HotelBooknow/Reviewbooking/GuestDetail/ticket",
        {
          state: { finalamount: finalAmount },
        }
      );
      return;
    } else if (
      reducerState?.hotelSearchResult?.bookRoom?.BookResult?.Error
        ?.ErrorCode !== 0 &&
      reducerState?.hotelSearchResult?.bookRoom?.BookResult?.Error
        ?.ErrorCode !== undefined
    ) {
      // refundAmount();
      setLoadingButton(false);
      swalModal(
        "py",
        "Booking Issue - Your refund will be processed within 7 working days. We apologize for any inconvenience caused.",
        true
      );
    }
  }, [reducerState?.hotelSearchResult?.bookRoom?.BookResult]);

  useEffect(() => {
    if (loaderPayment == true) {
      handleClickBooking();
    }
  }, [loaderPayment]);

  //   function generateMixedString() {
  //     const fixedText = "skyTrails_";
  //     const currentTime = Date.now().toString(); //add current time
  //     return fixedText + currentTime;
  //   }

  //   const mixedString = generateMixedString();

  //   const clientNationality = JSON.parse(
  //     sessionStorage.getItem("clientNationality")
  //   );

  const handleClickBooking = async () => {
    const payload = {
      ResultIndex: resultIndex,
      HotelCode: hotelCode,
      HotelName: hotelBlockDetails?.HotelName,
      GuestNationality: "IN",
      NoOfRooms: hotelDetails?.length,
      ClientReferenceNo: 0,
      IsVoucherBooking: true,
      IspackageFare: true,
      HotelRoomsDetails: hotelDetails?.map((item, hotelIndex) => {
        return {
          RoomIndex: item?.RoomIndex,
          RoomTypeCode: item?.RoomTypeCode,
          RoomTypeName: item?.RoomTypeName,
          RatePlanCode: item?.RatePlanCode,
          BedTypeCode: null,
          SmokingPreference: 0,
          Supplements: null,
          Price: item?.Price,
          HotelPassenger: passenger
            .map((itemPassenger, index) => {
              if (itemPassenger?.roomIndex === hotelIndex) {
                return {
                  ...itemPassenger,
                  Email: apiURL.flightEmail,
                  Phoneno: apiURL.phoneNo,
                };
              } // If the condition is not met, return the original item
            })
            .filter(Boolean),
        };
      }),

      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      TraceId:
        reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.TraceId,
    };
    // console.log(payload)

    const hotelDetailsPayload = {
      BookingId: await bookingId,
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
    };
    // console.log(payload, "payload");

    dispatch(hotelBookRoomAction([payload, hotelDetailsPayload]));
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
        phone: passenger?.[0]?.Phoneno,
        amount: Number(finalAmount).toFixed(0),
        // amount: 1,
        email: passenger?.[0]?.Email,
        productinfo: "ticket",
        bookingType: "HOTELS",
      };
      try {
        console.log("Cashfree Started");
        const response = await axios({
          method: "post",
          url: `${apiURL.baseURL}/skyTrails/api/transaction/makeCashfreePayment`,
          data: cashpayload,
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });
        console.log("Cashfree Response", response);
        if (response.status === 200) {
          const data = response.data.result;
          console.log("Cashfree Response 1", data);
          console.log("Cashfree Session ID", data.payment_session_id);
          console.log("Cashfree Order ID", data.order_id);
          // paymentLoader(false);
          orderId1 = response.data.result.order_id;
          doPayment(response.data.result.payment_session_id);
          // proceedPayment(data.result.access, "prod", data.result.key);
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
      // paymentSessionId:
      //   "session_F3qfjRlZhVXsIHEI57e2gBkYGmusQLYttDc2frS-yf-HduxICMtjm18F-5wLXlcPHBKJxudeJpZxUtcZBpZRDuKfMpG8HPmGV48uwz3jJi10mYn75eN9KplhWwpaymentpayment",
      paymentSessionId: sessionID,
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        // console.log(
        //   "User has closed the popup or there is some payment error, Check for Payment Status"
        // );
        swalModal("hotel", "Some error occured !", false);
        sessionStorage.removeItem("couponCode");
        toggleState(false);
        console.log(result.error);
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
  //   for payment

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelInfo?.HotelDetails?.Latitude ?? 0
  },${hotelInfo?.HotelDetails?.Longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <div>
      <div className="p-6 z-10 relative min-h-screen">
        <div className="container hotelBookRoomMain">
          {hotelInfo?.HotelDetails?.Images?.length > 4 && (
            <div className="row">
              <HotelGallery data={hotelInfo?.HotelDetails?.Images} />
            </div>
          )}

          <div className="row gy-4 mt-2">
            <div className="col-lg-8">
              <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-800">
                {hotelInfo?.HotelDetails?.HotelName}
              </h1>

              <div className="py-3 flex flex-col mt-4 justify-start gap-3  flex-wrap border-y border-gray-500">
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
                  <p className="text-start text-gray-800">
                    {hotelInfo?.HotelDetails?.Address}
                  </p>
                </div>

                <div className="flex flex-row justify-start gap-3  flex-wrap">
                  <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                    <BedDouble className="h-6 w-6 text-purple" />{" "}
                    {grnHotelData?.RoomGuests?.length} Room
                  </div>

                  <ModalMap mapUrl={mapUrl} />

                  <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                    <i class="fa-regular fa-user text-purple text-lg"></i>
                    {totalAdults} Adult
                  </div>

                  {grnHotelData?.no_of_children > 0 && (
                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                      <Baby className="h-6 w-6 text-purple" />
                      {totalChildren} child
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-12 mt-3 mb-2">
                <div className="border-b pb-3 border-gray-500">
                  <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                    {" "}
                    Room Type : {hotelRoomDetails?.RoomTypeName}
                  </h2>

                  <div className="roomNameAndCategory">
                    <div className="othInc">
                      {hotelRoomDetails?.IsPANMandatory && (
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
                            <p className="text-sm text-gray-800">
                              Pan Required
                            </p>
                          </div>
                        </div>
                      )}

                      {hotelRoomDetails?.LastCancellationDate && (
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
                            <p className="panDesign3 text-gray-800">
                              Refundable (Cancel Before{" "}
                              {dayjs(
                                hotelRoomDetails?.LastCancellationDate
                              ).format("DD MMM, YY")}
                              )
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mt-3">
                <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                  Your Booking Details will be sent to
                </h2>

                <div className="flex flex-row ">
                  <div className="flex flex-col items-start flex-1">
                    <p className="font-medium text-gray-800">Phone No : </p>
                    <p className="text-gray-800">{passenger?.[0]?.Phoneno}</p>
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <p className="font-medium text-gray-800">Email: </p>
                    <p className="text-gray-800">{passenger?.[0]?.Email}</p>
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
                    <div>
                      <div className="">
                        <div className="row g-3 mb-3">
                          <div className="flex flex-row ">
                            <div className="flex flex-col items-start flex-1">
                              <p className="font-medium text-gray-800">
                                Name:{" "}
                              </p>
                              <p className="text-gray-800">
                                {item?.Title?.toUpperCase()}{" "}
                                {item?.FirstName?.toUpperCase()}{" "}
                                {item?.LastName?.toUpperCase()}
                              </p>
                            </div>
                            {index === 0 && item?.PaxType && (
                              <div className="flex flex-col items-start flex-1">
                                <p className="font-medium text-gray-800">
                                  PAN:{" "}
                                </p>
                                <p className="text-gray-800">
                                  {index === 0 && <span>{item?.PAN}</span>}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* {Array.isArray(item?.children) &&
                        item?.children.length > 0 &&
                        item?.children?.map((i, childIndex) => (
                          <div className="mb-3">
                            <div className="flex flex-col items-start flex-1">
                              <p className="font-medium text-gray-700">
                                Child {childIndex + 1}
                              </p>
                              <p>
                                {i?.Title?.toUpperCase()}{" "}
                                {i?.FirstName?.toUpperCase()}{" "}
                                {i?.LastName?.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        ))} */}
                    </div>
                  );
                })}
              </div>

              <div className="row">
                <TboAmenities />
              </div>
            </div>

            <div className="col-lg-4 ">
              <TboPriceSummary
                onFinalAmountChange={handleFinalAmountChange}
                oncouponselect={handlecouponChange}
                payButton={handlePayment}
                // payButton={handleClickBooking}
                loadingPayButton={paymentLoading}
                isPaymentSucessButton={loadingButton}
                setLoaderPayment={(state) => {
                  setLoaderPayment(state);
                }}
                setLoaderPayment1={(state) => {
                  setLoaderPayment1(state);
                }}
                setLoadingButton={(state) => {
                  setLoadingButton(state);
                }}
              />
            </div>
          </div>

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
    </div>
  );
};

export default TboBookingHotel;
