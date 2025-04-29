import React, { useState, useEffect } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import "./bookingHistory.css";
import { FaUserFriends } from "react-icons/fa";
import { apiURL } from "../../Constants/constant";
import axios from "axios";
import dayjs from "dayjs";
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { MdOutlineBedroomParent } from "react-icons/md";
import hotelFilter from "../../images/hotelFilter.png";
import { SpinnerCircular } from "spinners-react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SecureStorage from "react-secure-storage";

const HotelHistory = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    // bgcolor: "background.paper",
    boxShadow: 10,
  };

  const [hotelBookingData, setHotelBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reason, setReason] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const token = SecureStorage.getItem("jwtToken");

  // console.log(hotelBookingData, "hotel booking data")

  // fetch api data

  // cancel flight request

  const [openModalCancelRequest, setOpenModalCancelRequest] = useState(false);
  const handleModalOpenCancelRequest = () => setOpenModalCancelRequest(true);
  const handleModalCloseCancelRequest = () => setOpenModalCancelRequest(false);

  // cancel flight request

  // console.log(hotelBookingData, "hotel booking details")
  // console.log(token, "api url")

  const getHotelBooking = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${apiURL.baseURL}/skytrails/api/user/getUserHotelBooking`,
        headers: {
          token: token,
        },
      });

      if (response.status === 200) {
        setHotelBookingData(response.data.result.docs);
        // console.log('Flight History Response', response);
      } else {
        console.error("Request failed with status code:", response.status);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("An error occurred while fetching Hotel booking:", error);
    }
  };

  useEffect(() => {
    getHotelBooking();
  }, [token]);

  // cancel hotel request

  const handleSubmitFlightCancelRequest = async (event) => {
    event.preventDefault();

    if (!selectedFlight) {
      return;
    }

    const formData = {
      reason: reason,
      bookingId: selectedFlight?.hotelId,
      hotelBookingId: selectedFlight?._id,
    };

    try {
      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/user/cancelUserHotelBooking`,
        data: formData,
        headers: {
          token: token,
        },
      });
      setOpenModalCancelRequest(false);
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };

  // cancel hotel request

  const currentDate = new Date();

  if (loading) {
    return (
      <div
        className="loaderBoxChangeReq"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <SpinnerCircular size={30} style={{ color: "#d90429" }} />
        {/* mukesh */}
      </div>
    );
  }

  if (hotelBookingData?.length == 0)
    return (
      <>
        <div className="filteredNotFound">
          <img src={hotelFilter} alt="filter" />
          <h1>No Booking yet</h1>
        </div>
      </>
    );

  return (
    <>
      {hotelBookingData?.length == 0 && !loading ? (
        <>
          <div className="filteredNotFound">
            <img src={hotelFilter} alt="filter" />
            <h1>No Booking yet</h1>
          </div>
        </>
      ) : (
        <>
          {hotelBookingData.map((item, index) => {
            const departureTime = new Date(item?.CheckInDate);
            const timeDifference =
              departureTime.getTime() - currentDate.getTime();
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            const isCompleted = currentDate > departureTime;
            const isToday =
              currentDate.toDateString() === departureTime.toDateString();
            const isUpcoming = departureTime > currentDate;
            const isWithin24Hours = hoursDifference <= 24;

            // console.log(isWithin24Hours, " with in 24 hours")
            // console.log(isUpcoming, " isUpcoming")
            // console.log(isCompleted, " isCompleted")

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
                <div className="row p-0 flightHisOuter">
                  <div className="historyTop">
                    <div>
                      <div className="historyTopLeft">
                        {/* <span>{item?.airlineDetails[0]?.Origin?.CityName}</span>
                                            <FaLongArrowAltRight />
                                            <span>{item?.airlineDetails[item?.airlineDetails.length - 1]?.Destination?.CityName}</span> */}
                        <span>{item?.hotelName}</span>
                      </div>

                      <div className="historyStatus">
                        <span>{status}</span>
                        <p>|</p>

                        <span>
                          {" "}
                          No of People : {"  "} {item?.noOfPeople}
                        </span>
                      </div>
                    </div>
                    <div className="historyTopRight">
                      <p>
                        City : {"  "} {item?.cityName}
                      </p>
                      <span>
                        Hotel ID : {"  "} {item?.hotelId}
                      </span>
                    </div>
                  </div>

                  <div className="historyBottom">
                    <div className="historyBottomOne">
                      <span>Check In</span>
                      {/* <span>15 Jan, 23{"  "} 08:30 AM</span> */}
                      <span>
                        {dayjs(item?.CheckInDate).format("DD MMM, YY")}
                        {"  "}
                        {dayjs(item?.CheckInDate).format("hh:mm A")}
                      </span>
                      {/* <h3>{item?.airlineDetails[0]?.Origin?.AirportCode}-{item?.airlineDetails[0]?.Origin?.CityName}</h3> */}
                    </div>
                    <div className="historyBottomOne">
                      <span>Check Out</span>
                      <span>
                        {dayjs(item?.CheckOutDate).format("DD MMM, YY")}
                        {"  "}
                        {dayjs(item?.CheckOutDate).format("hh:mm A")}
                      </span>
                      {/* <h3>{item?.airlineDetails[item?.airlineDetails.length - 1]?.Destination?.AirportCode}-{item?.airlineDetails[item?.airlineDetails.length - 1]?.Destination?.CityName}</h3> */}
                    </div>
                    <div className="historyBottomTwo">
                      <span>
                        <MdOutlineBedroomParent /> {"  "}
                        {item?.room} Room(s)
                      </span>
                      <span>
                        <FaUserFriends /> {"  "} {item?.name}
                      </span>
                    </div>

                    {isWithin24Hours ? (
                      <div className="historyBottomThreeDisabled">
                        <button>Cancel Request</button>
                      </div>
                    ) : (
                      <div className="historyBottomThree">
                        <button
                          onClick={() => {
                            handleModalOpenCancelRequest();
                            setSelectedFlight(item);
                          }}
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* cancel request  */}

                <Modal
                  open={openModalCancelRequest}
                  onClose={handleModalCloseCancelRequest}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div className="modal-boxChange">
                      <div className="modal-header">
                        <h2>Cancel Request</h2>
                        {selectedFlight && (
                          <p>
                            <span>Hotel ID : </span> {selectedFlight.hotelId}
                          </p>
                        )}
                      </div>
                      <form className="cancelForm">
                        <div className="input-text">
                          <p className="bold" htmlFor="reason">
                            Write Your Valid Reason
                          </p>
                          <input
                            type="text"
                            id="reason"
                            onChange={handleReasonChange}
                          />
                        </div>

                        <div className="historyCancelModal">
                          <button
                            type="button"
                            onClick={handleModalCloseCancelRequest}
                          >
                            Cancel
                          </button>
                          <button
                            className="second"
                            type="submit"
                            onClick={handleSubmitFlightCancelRequest}
                          >
                            Send Request
                          </button>
                        </div>
                      </form>
                    </div>
                  </Box>
                </Modal>
              </>
            );
          })}
        </>
      )}
    </>
  );
};

export default HotelHistory;
