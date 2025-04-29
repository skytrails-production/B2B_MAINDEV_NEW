import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaLongArrowAltRight,
  FaUserFriends,
  FaPlaneDeparture,
} from "react-icons/fa";

import { apiURL } from "../../Constants/constant";
import axios from "axios";
import dayjs from "dayjs";
import flightFilter from "../../images/flightFilter.png";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SecureStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import NoBookings from "./NoBookings";
import Loader from "./Loader";


const FlightHistory = () => {
  const [flightBookingData, setFlightBookingData] = useState([]);
  const reducerState = useSelector((state) => state);

  const [loading, setLoading] = useState(true);

  const crmUserID = reducerState?.logIn?.loginData?.id;
  const [cancelLoading, setCancelLoading] = useState(false);

  const [responseMessage, setResponseMessage] = useState(false);
  const navigation = useNavigate();


  const [cancellationCharges, setCancellationCharges] = useState([]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    // bgcolor: "background.paper",
    boxShadow: 10,
  };

  const [loadingCancelRequest, setLoadingCancelRequest] = useState(false);

  const [openModalChange, setOpenModalChange] = useState(false);
  const handleModalOpenChange = () => {
    setLoadingCancelRequest(false);
    setOpenModalChange(true);
  };
  const handleModalCloseChange = () => setOpenModalChange(false);
  const [reason, setReason] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);

  const [airports, setAireport] = useState(
    reducerState?.flightList?.aireportList
  );

  function findAirportByCode(code) {
    if (airports) {
      const data = airports?.find((airport) => airport?.AirportCode === code);
      return data;

    } else {
      return;
    }

  }

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // change flight request

  // cancel flight request

  const [openModalCancelRequest, setOpenModalCancelRequest] = useState(false);

  const handleModalOpenCancelRequest = () => setOpenModalCancelRequest(true);
  const handleModalCloseCancelRequest = () => setOpenModalCancelRequest(false);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const handleModalOpenConfirmation = () => setOpenConfirmationModal(true);
  const handleModalCloseConfirmation = () => setOpenConfirmationModal(false);

  // cancel flight request

  const token = SecureStorage.getItem("jwtToken");

  // fetch api data

  // console.log(flightBookingData, "flight booking")
  // console.log(token, "flight booking")

  const getFlightBooking = async () => {
    try {
      const response = await axios({
        method: "GET",

        url: `${apiURL.baseURL}/skytrails/crmagent/flightbookings?userId=${crmUserID}`,

        headers: {
          token: token,
        },
      });

      // console.log(response)
      if (response?.status === 200) {

        // console.log("response 200", response);
        const sortedData = response?.data?.data.sort((a, b) => {

          const departureA = new Date(
            a.airlineDetails[0]?.Origin?.DepTime
          ).getTime();
          // console.log(departureA,"departureAdepartureA");
          const departureB = new Date(
            b.airlineDetails[0]?.Origin?.DepTime
          ).getTime();
          const currentDate = new Date().getTime();

          const diffA = departureA - currentDate;
          const diffB = departureB - currentDate;

          if (diffA >= 0 && diffB < 0) {
            return -1;
          } else if (diffA < 0 && diffB >= 0) {
            return 1;
          } else {
            return Math.abs(diffA) - Math.abs(diffB);
          }
        });

        // console.log(sortedData,"responseresponseresponseresponse")
        setFlightBookingData(sortedData);
        // console.log('Flight History Response', response);
      } else {
        // console.log("response else")
        console.error("Request failed with status code:", response.status);
      }
      setLoading(false);
    } catch (error) {
      // console.log("response catch");
      console.error("An error occurred while fetching flight booking:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlightBooking();
  }, [token, loading]);

  // change request flight

  // console.log(selectedFlight, "selected flight");

  const handleSubmitFlightChange = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const selectedReason = document.querySelector("input[type=radio]:checked");
    const selectedCheckboxValue = selectedReason ? selectedReason.value : null;

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      contactNumber: selectedFlight?.passengerDetails[0]?.ContactNo,
      changerequest: selectedCheckboxValue,
      // amount: Number(selectedFlight?.totalAmount),
      pnr: selectedFlight?.pnr,
    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/user/changeUserFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalChange(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoadingCancelRequest(false); // Reset loading state regardless of success or failure
    }
  };


  const handleSubmitamdFlightChange = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const selectedReason = document.querySelector("input[type=radio]:checked");
    const selectedCheckboxValue = selectedReason ? selectedReason.value : null;

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      contactNumber: selectedFlight?.passengerDetails[0]?.ContactNo,
      changerequest: selectedCheckboxValue,
      // amount: Number(selectedFlight?.totalAmount),
      pnr: selectedFlight?.pnr,
    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/amadeus/user/changeUserFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalChange(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoadingCancelRequest(false); // Reset loading state regardless of success or failure
    }
  };


  // ///////////////////////////////////kafila////////////////////////////////////////
  const handleSubmitkafilaFlightChange = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const selectedReason = document.querySelector("input[type=radio]:checked");
    const selectedCheckboxValue = selectedReason ? selectedReason.value : null;

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      contactNumber: selectedFlight?.passengerDetails[0]?.ContactNo,
      changerequest: selectedCheckboxValue,

      pnr: selectedFlight?.pnr,
    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/user/kafila/changeKafilaFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalChange(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoadingCancelRequest(false); // Reset loading state regardless of success or failure
    }
  };


  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // change request flight

  // cancel flight request33333333333333333333333

  const handleSubmitFlightCancelRequest = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      pnr: selectedFlight?.pnr,

      cancellationPartyType: "TBO",

    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/user/cancelUserFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalCancelRequest(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);


    } finally {
      setLoadingCancelRequest(false); // Reset loading state regardless of success or failure
    }
  };


  const handleSubmitFlightAmdCancelRequest = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      pnr: selectedFlight?.pnr,

      cancellationPartyType: "AMADEUS",

    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/amadeus/user/amadeusCancelUserFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalCancelRequest(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoadingCancelRequest(false);
    }
  };


  const handleSubmitFlightkafilaCancelRequest = async (event) => {
    event.preventDefault();

    if (!selectedFlight || loadingCancelRequest) {
      return;
    }

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.bookingId,
      flightBookingId: selectedFlight?._id,
      pnr: selectedFlight?.pnr,

    };

    try {
      setLoadingCancelRequest(true);

      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/user/kafila/cancelKafilaFlightBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalCancelRequest(false);
      setResponseMessage(response.data.responseMessage);
      setTimeout(() => {
        handleModalOpenConfirmation();
      }, 1000);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setLoadingCancelRequest(false);
    }
  };


  const currentDate = new Date();

  // if (loading) {
  //   return (
  //     <div
  //       className="loaderBoxChangeReq"
  //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  //     >
  //       {/* <SpinnerCircular size={30} style={{ color: "#d90429" }} /> */}
  //       {/* mukesh */}
  //     </div>
  //   );
  // }


  //cancelFlight22222222222222222222222
  const getCancellationCharges = async (item) => {
    try {
      // setCancelLoading(true);

      setCancelLoading((prevState) => ({
        ...prevState,
        [item._id]: true,
      }));
      const requestData = {
        BookingId: item?.bookingId,
        RequestType: "1",
        BookingMode: "5",
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
      };

      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/flight/getcancellationcharges`,
        requestData
      );
      // setCancelLoading(false);
      setCancelLoading((prevState) => ({
        ...prevState,
        [item._id]: false,
      }));
      if (response.data.ErrorCode) {
        handleModalOpenCancelRequest();
        setCancellationCharges(response.data.ErrorCode.ErrorMessage);
      } else {
        handleModalOpenCancelRequest();
        setCancellationCharges(response.data);
      }

      // console.log("Cancellation charges:", response.data);
    } catch (error) {
      console.error("Error fetching cancellation charges:", error);
    }
  };

  const hanldeViewDetails = (item) => {
    navigation("/flight/history/details", {
      state: { flight: item },
    });
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "8px",
    p: 2,
  };
  if (loading) return <Loader serviceType="flight" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {flightBookingData?.length === 0 && !loading ? (
        <NoBookings serviceType="flight" />
      ) : (
        <div className="max-w-6xl mx-auto space-y-4">
          {flightBookingData?.map((item, index) => {
            // ... [Keep existing time calculations and status logic]

            const departureTime = new Date(
              item?.airlineDetails[0]?.Origin?.DepTime
            );
            const timeDifference =
              departureTime.getTime() - currentDate.getTime();
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            const isCompleted = currentDate > departureTime;
            const isToday =
              currentDate.toDateString() === departureTime.toDateString();
            const isUpcoming = departureTime > currentDate;
            const isWithin24Hours = hoursDifference <= 24;

            let status = "";
            if (isCompleted) {
              status = "Completed";
            } else if (isToday) {
              status = "Today";
            } else if (isUpcoming) {
              status = "Upcoming";
            }

            return (

              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Flight Header */}
                <div className="p-4 bg-primary-100 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-800">
                        {item?.airlineDetails[0]?.Origin?.CityName ||
                          findAirportByCode(
                            item?.airlineDetails[0]?.Origin?.AirportCode
                          )?.name}
                      </span>
                      <FaLongArrowAltRight className="text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {item?.airlineDetails[item.airlineDetails?.length - 1]
                          ?.Destination?.CityName ||
                          findAirportByCode(
                            item.airlineDetails[item.airlineDetails?.length - 1]
                              ?.Destination?.AirportCode
                          )?.name}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      <span>Booking ID: {item?.bookingId}</span>
                      <span>PNR: {item?.pnr}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        status === "Completed"
                          ? "bg-gray-100 text-gray-600"
                          : status === "Today"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {status}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">
                      {item?.oneWay ? "One Way" : "Return Flight"}
                    </span>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Departure</span>
                    <div>
                      <p className="font-medium">
                        {dayjs(item.airlineDetails[0]?.Origin?.DepTime).format(
                          "DD MMM, YY hh:mm A"
                        )}
                      </p>
                      <p className="text-blue-800">
                        {item.airlineDetails[0]?.Origin?.AirportCode} -
                        {item.airlineDetails[0]?.Origin?.CityName ||
                          findAirportByCode(
                            item.airlineDetails[0]?.Origin?.AirportCode
                          )?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Arrival</span>
                    <div>
                      <p className="font-medium">
                        {dayjs(
                          item.airlineDetails[item.airlineDetails?.length - 1]
                            ?.Destination?.ArrTime
                        ).format("DD MMM, YY hh:mm A")}
                      </p>
                      <p className="text-blue-800">
                        {
                          item.airlineDetails[item.airlineDetails?.length - 1]
                            ?.Destination?.AirportCode
                        }{" "}
                        -
                        {item.airlineDetails[item.airlineDetails?.length - 1]
                          ?.Destination?.CityName ||
                          findAirportByCode(
                            item.airlineDetails[item.airlineDetails?.length - 1]
                              ?.Destination?.AirportCode
                          )?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">
                      Flight Details
                    </span>
                    <div className="flex items-center gap-2">
                      <FaPlaneDeparture className="text-gray-600" />
                      <span className="font-medium">
                        {item.airlineDetails[0]?.Airline?.AirlineName}{" "}
                        {item.airlineDetails[0]?.Airline?.FlightNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <FaUserFriends className="text-gray-600" />
                      {item.passengerDetails?.map((passenger, index) => (
                        <span
                          key={index}
                          className="text-sm bg-gray-100 px-2 py-1 rounded"
                        >
                          {passenger.firstName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {isWithin24Hours && false ? (
                      <>
                        <button
                          disabled
                          className="w-full p-2 text-sm bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                        >
                          Change Request
                        </button>
                        <button
                          disabled
                          className="w-full p-2 text-sm bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                        >
                          Cancel Request
                        </button>
                      </>
                    ) : (
                      <>
                        {/* <button

                          onClick={() => {
                            handleModalOpenChange();
                            setSelectedFlight(item);
                          }}

                          className="w-full p-2 text-sm bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"

                        >
                          Change Request
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFlight(item);

                            if (
                              !item?.isAmadeusBooking &&
                              !item?.isKafilaBooking
                            ) {

                              getCancellationCharges(item);
                            } else {
                              handleModalOpenCancelRequest();
                            }
                          }}

                          className="w-full p-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          {cancelLoading[item._id]
                            ? "Processing..."
                            : "Cancel Request"}
                        </button> */}
                        <button
                          onClick={() => hanldeViewDetails(item)}
                          // className="w-full p-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          className="w-full p-2 text-sm bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                        >
                          View Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Change Request Modal */}
          <Modal open={openModalChange} onClose={handleModalCloseChange}>
            <Box sx={modalStyle}>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold">Change Request</h3>
                  {selectedFlight && (
                    <p className="text-sm text-gray-600">
                      PNR: {selectedFlight.pnr}
                    </p>
                  )}
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason
                    </label>
                    <input
                      type="text"
                      onChange={handleReasonChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Select Reason
                    </label>
                    {[
                      "Change in Travel Plans",
                      "Travel Advisory",
                      "Documentation Issues",
                      "Medical Reasons",
                      "Other",
                    ].map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={reason}
                          className="form-radio text-blue-600"
                        />
                        <span className="text-sm">{reason}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={handleModalCloseChange}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>

          {/* Cancel Request Modal */}
          <Modal
            open={openModalCancelRequest}
            onClose={handleModalCloseCancelRequest}
          >
            <Box sx={modalStyle}>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold">Cancel Request</h3>
                  {selectedFlight && (
                    <p className="text-sm text-gray-600">
                      PNR: {selectedFlight.pnr}
                    </p>
                  )}
                </div>

                {/* Cancellation Charges Display */}
                {!selectedFlight?.isAmadeusBooking &&
                  !selectedFlight?.isKafilaBooking && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">
                          Cancellation Charges:
                        </span>
                        <span>
                          {cancellationCharges?.data?.Response
                            ?.CancellationCharge || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Refund Amount:</span>
                        <span>
                          {cancellationCharges?.data?.Response
                            ?.CancelChargeDetails?.[0]?.RefundAmount || "N/A"}
                        </span>
                      </div>
                    </div>
                  )}

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason
                    </label>
                    <input
                      type="text"
                      onChange={handleReasonChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={handleModalCloseCancelRequest}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            open={openConfirmationModal}
            onClose={handleModalCloseConfirmation}
          >
            <Box sx={modalStyle}>
              <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Request Submitted
                </h3>
                <p className="text-gray-600 mb-6">{responseMessage}</p>
                <button
                  onClick={handleModalCloseConfirmation}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};


export default FlightHistory;
