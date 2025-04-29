import React, { useState } from "react";
import axios from "axios";
import { CheckOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { apiURL } from "../../../Constants/constant";
import { useSelector } from "react-redux";
// import "./getpage.css";
function EnquiryForm({ isOpen, closeModal, destination }) {
  //   const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1); // Manage pages
  const today = new Date();
  const reducerState = useSelector((state) => state);
  const userLoggedIn = reducerState?.logIn?.loginData?.data?.result;
  const { keyword } = useParams();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 5); // Add 5 days to the current date

  const [formData, setFormData] = useState({
    destination: "",
    departureCity: "",
    name: userLoggedIn?.username || "",
    email: userLoggedIn?.email || "",
    phone: userLoggedIn?.phone?.mobile_number || "",
    consent: true,
    travelDate: "",
    adult: "",
    child: "",
    msg: "",
    budget: "",
    agreeToTerms: true, // Checkbox state
  });

  const [errors, setErrors] = useState({}); // Validation errors
  const [submittedData, setSubmittedData] = useState(null);

  const formatTravelDate = (date) => {
    const options = { year: "numeric", month: "short" }; // Format as Dec, 2024
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the error as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation for Page 1
  const validatePage1 = () => {
    const newErrors = {};
    if (!formData.destination) newErrors.destination = "Enter Destination";

    if (!formData.name) newErrors.name = "Enter your Name";
    if (!formData.phone) newErrors.phone = "Enter Phone Number";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms =
        "You must accept the User Agreement and Privacy Policy.";
    return newErrors;
  };

  // Validation for Page 2
  const validatePage2 = () => {
    const newErrors = {};
    if (!formData.travelDate) newErrors.travelDate = "Enter Travel Date";

    return newErrors;
  };

  // Handle form submission for Page 1 (callback request)
  // Handle form submission for Page 1 (callback request)
  const handleGetCallback = async (e) => {
    e.preventDefault();
    const validationErrors = validatePage1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Make API call for callback request
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/user/callBackRequests/createCallBackRequest`,
        {
          destination: formData.destination,
          departureCity: formData.departureCity,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,

          consent: formData.consent,
        }
      );

      if (response.status === 200) {
        setPage(2); // Move to Page 2 if API call is successful
      }
    } catch (err) {
      console.error("Failed to request callback", err);
    }
  };

  const handleSubmitPage2 = async (e) => {
    e.preventDefault();
    const validationErrors = validatePage2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/user/callBackRequests/createCallBackRequest`,
        formData
      );

      if (response.status === 200) {
        setSubmittedData({
          name: formData.name,
          destination: formData.destination,
          travelDate: formData.travelDate,
          phone: formData.phone,
        });
        setPage(3);
      }
    } catch (err) {
      console.error("Failed to submit request", err);
    }
  };

  return (
    <div className="fixed right-0 z-50 flex items-center p-2 space-x-2 bg-[#FFF2D1] text-[#0A0908] bottom-44 rounded-s-2xl">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 space-y-4 bg-white rounded-lg">
            <button
              onClick={() => {
                // setIsOpen(false);
                closeModal();
                setPage(1); // Reset to Page 1
                setErrors({}); // Clear errors
              }}
              className="absolute text-2xl text-gray-600 top-2 right-2 hover:text-black"
            >
              &times;
            </button>

            {page === 1 && (
              <>
                <h2 className="text-xl font-semibold text-center mt-0">
                  Need Assistance?
                </h2>
                <form onSubmit={handleGetCallback} className="space-y-4 ">
                  {/* Row 1 */}

                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          for="email"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          {" "}
                          Destination <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                        {errors.destination && (
                          <p className="text-sm text-red-500">
                            {errors.destination}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Departure City
                        </label>
                        <input
                          type="text"
                          name="departureCity"
                          value={formData.departureCity}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Email Id
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>
                    </div>
                  </div>
                  {/* Checkbox for Agreement */}
                  <div className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mr-2 rounded-sm  focus:ring-0"
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link
                        to="/termAndCondition"
                        className="text-[#4f46e5] no-underline"
                      >
                        Term & Condition
                      </Link>{" "}
                      &{" "}
                      <Link
                        to="/privacypolicy"
                        className=" text-[#4f46e5] no-underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </div>
                  {errors.isAgreed && (
                    <p className="text-sm text-red-500">{errors.isAgreed}</p>
                  )}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={!formData.agreeToTerms} // Button disabled until checkbox is ticked
                      className={`px-4 py-2 text-white text-base rounded-full ${
                        formData.agreeToTerms
                          ? "bg-primary-6000 hover:bg-primary-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Get a Callback
                    </button>
                  </div>
                </form>
              </>
            )}

            {page === 2 && (
              <>
                <h2 className="text-xl font-semibold text-center mt-0">
                  Trip Details
                </h2>
                <form onSubmit={handleSubmitPage2} className="space-y-4">
                  <div>
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Travel Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="travelDate"
                          value={formData.travelDate}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                          min={minDate.toISOString().split("T")[0]} // Set minimum selectable date
                        />
                        {errors.travelDate && (
                          <p className="text-sm text-red-500">
                            {errors.travelDate}
                          </p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Budget
                        </label>
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Adults
                        </label>
                        <input
                          type="text"
                          name="adult"
                          value={formData.adult}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Children
                        </label>
                        <input
                          type="text"
                          name="child"
                          value={formData.child}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 ">
                          Message
                        </label>
                        <textarea
                          name="msg"
                          value={formData.msg}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white text-base rounded-full bg-primary-6000 hover:bg-primary-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}

            {page === 3 && submittedData && (
              <div className="space-y-4 text-left relative">
                {/* <div className="absolute w-96 h-[200px] rounded-full bg-primary-6000 "></div> */}
                <div className=" text-center">
                  <h2 className="text-xl font-semibold text-black-600">
                    Thank You! <strong>{submittedData.name}</strong>
                  </h2>
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm text-gray-900">
                    Our Holiday Expert will shortly reach out to you with our
                    best quotations on <strong>{submittedData.phone}</strong>.
                  </p>
                </div>
                <div className="p-2.5 rounded-md  gap-6 border w-full">
                  <p className=" mb-2.5 text-center pb-1.5 text-lg font-semibold">
                    Request Received
                  </p>
                  <div class="flex relative overflow-x-auto  sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                      <tbody>
                        <tr class="border-b border-gray-200 ">
                          <td class="px-2 py-3 text-center border-r font-medium text-gray-900">
                            {submittedData.name}{" "}
                          </td>
                          <td class="px-2 py-3 text-center font-medium text-gray-900">
                            {submittedData.destination}
                          </td>
                        </tr>
                        <tr class="">
                          <td class="px-2 py-3 text-center border-r font-medium text-gray-900">
                            {formatTravelDate(submittedData.travelDate)}
                          </td>
                          <td class="px-2 py-3 text-center font-medium text-gray-900">
                            {submittedData.phone}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EnquiryForm;
