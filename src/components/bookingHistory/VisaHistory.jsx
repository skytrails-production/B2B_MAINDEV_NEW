import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import SecureStorage from "react-secure-storage";
import { useSelector } from "react-redux";
import { apiURL } from "../../Constants/constant";
import Loader from "./Loader";
import NoBookings from "./NoBookings";
import {
  FiUser,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiInfo,
  FiArrowRight,
} from "react-icons/fi";

const VisaHistory = () => {
  const [visaBookingData, setVisaBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const reducerState = useSelector((state) => state);
  const crmUserID = reducerState?.logIn?.loginData?.id;

  const getVisaBooking = async () => {
    try {
      const response = await axios.get(
        `${
          apiURL.baseURL
        }/skyTrails/api/visa/getVisaApplicationByUser?userId=${String(
          crmUserID
        )}`
      );

      if (response.status === 200) {
        const sortedData = response.data.result.sort(
          (a, b) =>
            dayjs(b.fromDate, "DD-MM-YYYY").unix() -
            dayjs(a.fromDate, "DD-MM-YYYY").unix()
        );
        setVisaBookingData(sortedData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching visa applications:", error);
    }
  };
  console.log(visaBookingData, "visaBookingData");

  useEffect(() => {
    getVisaBooking();
  }, []);

  const handleCancel = (visa) => {
    setSelectedVisa(visa);
    setCancelModalVisible(true);
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) return;

    try {
      setCancelLoading(true);
      // Add your cancel API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setCancelModalVisible(false);
      await getVisaBooking();
    } catch (error) {
      console.error("Error cancelling visa application:", error);
    } finally {
      setCancelLoading(false);
      setCancelReason("");
    }
  };

  const statusStyles = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700",
    ACTIVE: "bg-indigo-100 text-indigo-700",
  };

  if (loading) return <Loader serviceType="visa" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {visaBookingData?.length === 0 ? (
        <NoBookings serviceType="visa" />
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {visaBookingData.map((visa, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Header Section */}
              <div className="p-4 bg-indigo-50 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {visa.depCountyName} → {visa.arrCountyName}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {visa.visaType} Visa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[visa.bookingStatus]
                      }`}
                    >
                      {visa.bookingStatus}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[visa.paymentStatus]
                      }`}
                    >
                      Payment: {visa.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiUser className="w-5 h-5 shrink-0" />
                    <h3 className="font-medium text-gray-900">
                      Applicant Details
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-semibold text-gray-900">
                      {visa.firstName} {visa.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{visa.email}</p>
                    <p className="text-sm text-gray-600">
                      {visa.mobileNumber?.phone}
                    </p>
                    {visa.sex && (
                      <p className="text-sm text-gray-600">
                        Gender: {visa.sex === "M" ? "Male" : "Female"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Visa Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiCalendar className="w-5 h-5 shrink-0" />
                    <h3 className="font-medium text-gray-900">Travel Dates</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          From
                        </p>
                        <p className="text-sm text-gray-600">
                          {dayjs(visa.fromDate, "DD-MM-YYYY").format(
                            "DD MMM YYYY"
                          )}
                        </p>
                      </div>
                      <FiArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">To</p>
                        <p className="text-sm text-gray-600">
                          {dayjs(visa.toDate, "DD-MM-YYYY").format(
                            "DD MMM YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg">
                      <FiCreditCard className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-semibold">
                        ₹
                        {(
                          parseInt(visa.fee?.processingFee) +
                          parseInt(visa.fee?.platformFee)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiMapPin className="w-5 h-5 shrink-0" />
                    <h3 className="font-medium text-gray-900">Address</h3>
                  </div>
                  <div className="text-sm space-y-1.5">
                    <p className="text-gray-900 font-medium">
                      {visa.address?.city}
                    </p>
                    <p className="text-gray-600">
                      {visa.address?.state}, {visa.address?.country}
                    </p>
                    <p className="text-gray-600">PIN: {visa.address?.pin}</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiInfo className="w-4 h-4" />
                    <span>
                      Applied on {dayjs(visa.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                  {/* <div className="flex gap-2 w-full md:w-auto">
                    {visa.bookingStatus === "PENDING" && (
                      <button
                        onClick={() => handleCancel(visa)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full md:w-auto"
                      >
                        Cancel Application
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(visa)}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors w-full md:w-auto"
                    >
                      View Details
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold">Cancel Visa Application</span>
        }
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={null}
        centered
        className="[&_.ant-modal-header]:border-b [&_.ant-modal-header]:bg-indigo-50 [&_.ant-modal-title]:flex-1"
      >
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <p className="font-medium text-gray-900">
              {selectedVisa?.firstName} {selectedVisa?.lastName}
            </p>
            <div className="mt-1 text-sm text-gray-600">
              <p>Application ID: {selectedVisa?._id}</p>
              <p>
                {selectedVisa?.depCountyName} → {selectedVisa?.arrCountyName}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">
              Reason for Cancellation
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Please specify your reason..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setCancelModalVisible(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleCancelSubmit}
              disabled={cancelLoading}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLoading ? (
                <Spin
                  indicator={<LoadingOutlined spin className="text-white" />}
                />
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisaHistory;
