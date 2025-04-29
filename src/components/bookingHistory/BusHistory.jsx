import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  FaBus,
  FaPlane,
  FaHotel,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import busFilter from "../../images/busFilter.png";
import SecureStorage from "react-secure-storage";
import { useSelector } from "react-redux";
import { apiURL } from "../../Constants/constant";
import Loader from "./Loader";
import NoBookings from "./NoBookings";

// Modern No-Bookings Component

const BusHistory = () => {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [busBookingData, setBusBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loadingCancelRequest, setLoadingCancelRequest] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const reducerState = useSelector((state) => state);
  const crmUserID = reducerState?.logIn?.loginData?.id;

  const getBusBooking = async () => {
    try {
      const response = await axios.get(
        `${apiURL.baseURL}/skytrails/crmagent/busbookings?userId=${crmUserID}`
      );

      if (response.status === 200) {
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.departureTime) - new Date(a.departureTime)
        );
        setBusBookingData(sortedData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching bus bookings:", error);
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedBooking || loadingCancelRequest) return;

    try {
      setLoadingCancelRequest(true);
      await axios.post(
        `${apiURL.baseURL}/skyTrails/api/user/cancelUserBusBooking`,
        {
          reason,
          busId: selectedBooking?.busId,
          busBookingId: selectedBooking?._id,
          pnr: selectedBooking?.pnr,
        },
        { headers: { token: SecureStorage.getItem("jwtToken") } }
      );
      setOpenCancelModal(false);
      setOpenConfirmationModal(true);
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setLoadingCancelRequest(false);
    }
  };

  useEffect(() => {
    getBusBooking();
  }, []);

  if (loading) return <Loader serviceType="bus" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {busBookingData?.length === 0 ? (
        <NoBookings serviceType="bus" />
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {busBookingData?.map((item, index) => {
            const departureTime = new Date(item.departureTime);
            const status = {
              isCompleted: new Date() > departureTime,
              isToday:
                new Date().toDateString() === departureTime.toDateString(),
              isUpcoming: departureTime > new Date(),
            };

            const statusText = status.isCompleted
              ? "Completed"
              : status.isToday
              ? "Today"
              : "Upcoming";

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Header Section */}
                <div className="p-4 bg-primary-100 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FaBus className="text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {item.travelName}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm text-gray-600">
                      <span>Bus ID: {item.busId}</span>
                      <span>PNR: {item.pnr}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        status.isCompleted
                          ? "bg-gray-100 text-gray-600"
                          : status.isToday
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {statusText}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{item.busType}</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Departure</span>
                    <p className="font-medium">
                      {dayjs(item.departureTime).format("DD MMM, YY hh:mm A")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Arrival</span>
                    <p className="font-medium">
                      {dayjs(item.arrivalTime).format("DD MMM, YY hh:mm A")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Passengers</span>
                    <div className="flex items-center gap-2">
                      <MdAirlineSeatReclineExtra className="text-gray-600" />
                      <span className="font-medium">
                        {item.noOfSeats} Seats
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.passenger?.map((p, i) => (
                        <span
                          key={i}
                          className="text-sm bg-gray-100 px-2 py-1 rounded"
                        >
                          {p.firstName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                {/* <div className="p-4 border-t border-gray-200">
                  {status.isCompleted ? (
                    <button
                      className="w-full p-2 text-sm bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                      disabled
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedBooking(item);
                        setOpenCancelModal(true);
                      }}
                      className="w-full p-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div> */}
              </div>
            );
          })}

          {/* Cancel Booking Modal */}
          <Modal
            title="Cancel Booking"
            open={openCancelModal}
            onCancel={() => setOpenCancelModal(false)}
            footer={[
              <button
                key="cancel"
                onClick={() => setOpenCancelModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>,
              <button
                key="submit"
                onClick={handleCancelRequest}
                loading={loadingCancelRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {loadingCancelRequest
                  ? "Processing..."
                  : "Confirm Cancellation"}
              </button>,
            ]}
          >
            <div className="space-y-4 mt-4">
              <label className="block text-sm font-medium mb-2">
                Reason for cancellation
              </label>
              <input
                type="text"
                required
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your reason..."
              />
            </div>
          </Modal>

          {/* Confirmation Modal */}
          <Modal
            title="Request Submitted"
            open={openConfirmationModal}
            onCancel={() => setOpenConfirmationModal(false)}
            footer={[
              <button
                key="ok"
                onClick={() => setOpenConfirmationModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>,
            ]}
          >
            <div className="text-center p-4">
              <p className="text-gray-600 mb-4">
                Your cancellation request has been received successfully.
              </p>
              <p className="text-sm text-gray-500">
                We'll process your request and notify you via email.
              </p>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default BusHistory;
