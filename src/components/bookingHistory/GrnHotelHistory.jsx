import React, { useState, useEffect } from "react";
import { apiURL } from "../../Constants/constant";
import axios from "axios";
import dayjs from "dayjs";
import hotelFilter from "../../images/hotelFilter.png";
// import { SpinnerCircular } from "spinners-react";
import SecureStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import { Modal } from "flowbite-react";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import NoBookings from "./NoBookings";

const GrnHotelHistory = () => {
  const [hotelBookingData, setHotelBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = SecureStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const crmUserID = reducerState?.logIn?.loginData?.id;

  const getHotelBooking = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${apiURL.baseURL}/skytrails/crmagent/hotelbookings?userId=${crmUserID}`,
        headers: {
          token: token,
        },
      });

      //   console.log("Flight History Response", response);
      if (response.status === 200) {
        // setHotelBookingData([...response.data.tbo, ...response?.data?.grn]);
        console.log("Hotel Booking Data", response);
        setHotelBookingData([...response?.data?.data]);
      } else {
        console.error("Request failed with status code:", response.status);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("An error occurred while fetching Hotel booking:", error);
    }
  };

  const modifiedData = hotelBookingData?.map((item, index) => ({
    hotelName: item?.hotel?.name || item?.hotelName,
    bookingId: item?.booking_id || item?.bookingId,
    checkin: item?.checkin || item?.CheckInDate,
    checkout: item?.checkout || item?.CheckOutDate,
    amount: item?.total || item?.amount,
    rating: item?.hotel?.category || item?.rating,
    address: item?.hotel?.address || item?.address,
    noOfRooms: item?.hotel?.rooms?.length || item?.room,
    bookingStatus: item?.bookingStatus,
    bookingDate: item?.booking_date || item?.createdAt,
    img: item?.hotel?.imageUrl || item?.imageUrl,
    roomName: item?.hotel?.rooms?.[0]?.description || item?.roomName,
    phone: item?.holder?.phone_number || item?.paxes?.[0]?.phoneNo,
    email: item?.holder?.email || item?.paxes?.[0]?.email,
    name: item?.holder?.name || item?.paxes?.[0]?.firstName,
    pan: item?.holder?.pan_number || item?.paxes?.[0]?.panNo,
    hotelLocation:
      `https://maps.google.com/maps?q=${
        item?.hotel?.geolocation?.latitude ?? 0
      },${item?.hotel?.geolocation?.longitude ?? 0}&hl=en&z=14&output=embed` ||
      item?.mapUrl,
    passenger: item?.hotel?.paxes || item?.paxes,
    id: item._id,
  }));

  const sortedData = modifiedData.sort((a, b) => {
    const dateA = dayjs(a.checkin, ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD"], true);
    const dateB = dayjs(b.checkin, ["YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DD"], true);
    return dateB - dateA;
  });

  useEffect(() => {
    getHotelBooking();
  }, [token]);

  const handleSubmitFlightCancelRequest = async (event) => {
    event.preventDefault();

    if (!selectedHotel || !cancellationReason.trim()) {
      return;
    }

    const formData = {
      reason: cancellationReason,
      hotelBookingId: selectedHotel.id,
    };

    setSubmitting(true);

    try {
      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/grn/user/cancel/createCancelRequest`,
        data: formData,
        headers: {
          token: token,
        },
      });

      if (response.status === 200) {
        // alert("Cancellation request submitted successfully!");
        setShowModal(false);
      } else {
        console.error("Failed to submit cancellation request:", response);
      }
    } catch (error) {
      console.error("Error sending data to the server:", error);
    } finally {
      setSubmitting(false);
      setShowModal(false);
      setCancellationReason("");
      setSelectedHotel(null);
    }
  };

  const currentDate = new Date();

  if (loading) return <Loader serviceType="hotel" />;

  const handleNavigate = (item) => {
    sessionStorage.setItem("hotelPdfData", JSON.stringify(item));
    navigate("/bookinghistory/hotelPdf");
  };

  const openModal = (hotel) => {
    setSelectedHotel(hotel);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCancellationReason("");
    setSelectedHotel(null);
  };

  return (
    <>
      {hotelBookingData?.length == 0 && !loading ? (
        <NoBookings serviceType="hotel" />
      ) : (
        <>
          {sortedData?.map((item, index) => {
            const departureTime = new Date(item?.checkin);
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
              <>
                <div className=" bg-white border mb-3 rounded-md">
                  <div className="flex flex-col md:flex-row justify-between bg-indigo-100 p-3">
                    <div className="flex flex-col gap-2 justify-start items-start">
                      <h2 className="text-base mb-0 xl:text-xl font-semibold">
                        {item?.hotelName}
                      </h2>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{status}</p>
                        <p>|</p>
                        <p className="font-medium">
                          {" "}
                          No of Rooms : {"  "} {item?.noOfRooms}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          Status : {"  "} {item?.bookingStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-start items-start">
                      <p className="font-semibold">{item?.name}</p>
                      <p className="font-medium">
                        Booking ID : {item?.bookingId}
                      </p>
                      <p className="font-medium">
                        Booking Date :{" "}
                        {dayjs(item?.bookingDate).format("DD MMM, YY")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center p-3">
                    <div className="flex flex-1 flex-row md:flex-row justify-between items-start w-full">
                      <div className="flex flex-col gap-2 justify-start items-start">
                        <p className="font-semibold">Check In</p>
                        <p className="font-medium">
                          {dayjs(item?.checkin).format("DD MMM, YY")}
                          {"  "}
                          {dayjs(item?.checkin).format("hh:mm A")}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 justify-start items-start">
                        <p className="font-semibold">Check Out</p>
                        <p className="font-medium">
                          {dayjs(item?.checkout).format("DD MMM, YY")}
                          {"  "}
                          {dayjs(item?.checkout).format("hh:mm A")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 items-end">
                      <p className="font-semibold ">₹{item?.amount}</p>
                      <div className="flex flex-row gap-2 items-center">
                        {/* {isWithin24Hours  ? (
                          <div className="historyBottomThreeDisabled">
                            <button className="bg-gray-500 px-3 py-2 rounded-md text-white font-semibold">
                              Cancel Request
                            </button>
                          </div>
                        ) : (
                          <div className="historyBottomThree">
                            <button
                              onClick={() => openModal(item)}
                              className="bg-transparent border-red-600 border-2 px-3 py-2 rounded-md text-red-600 font-semibold"
                            >
                              Cancel Request
                            </button>
                          </div>
                        )} */}

                        <button
                          onClick={() => handleNavigate(item)}
                          className="bg-primary-6000 border-2 border-primary-6000 hover:border-primary-700 hover:bg-primary-700 px-3 py-2 rounded-md text-white font-semibold"
                        >
                          View More Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </>
      )}

      <Modal show={showModal}>
        <Modal.Header>Cancel Request Form</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitFlightCancelRequest}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Booking ID
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                value={selectedHotel?.bookingId || ""}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Reason for Cancellation
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="4"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter your reason here..."
                required
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="bg-transparent border-red-600 border-2 px-3 py-2 rounded-md text-red-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-primary-6000 hover:bg-primary-700"
                }`}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GrnHotelHistory;
