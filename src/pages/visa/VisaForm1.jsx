import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { apiURL } from "../../Constants/constant";
import Authentic from "../Auth/Authentic";
import { useSelector } from "react-redux";
import { motion } from "motion/react";

const VisaForm1 = () => {
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("visaToken");

  const crmUserID = String(reducerState?.logIn?.loginData?.id);
  console.log("CRM User ID:", crmUserID);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sex: "",
    phone: "",
    country: null,
    state: null,
    city: null,
    pin: "",
    userId: crmUserID,
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (authenticUser === 200) {
      handleModalClose();
    }
  }, [authenticUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("jrunnnns");
    // if (authenticUser !== 200) {
    //   // console.log("jrunnnns");
    //   setIsLoginModalOpen(true);
    //   return;
    // }

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !Object.values(formData).every(
          (value) => value !== "" && value !== null
        )
      ) {
        throw new Error("Please fill all required fields");
      }

      // Create applicant payload
      const applicantPayload = {
        access_token: token,
        applicant: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          sex: formData.sex,
          phone: formData.phone,
          userId: crmUserID,
          address: {
            country: formData.country?.label,
            state: formData.state?.label,
            city: formData.city?.label,
            pin: formData.pin,
          },
        },
      };

      sessionStorage.setItem("visaClient", JSON.stringify(applicantPayload));

      // Create applicant
      const applicantResponse = await axios.post(
        `${apiURL.baseURL}/api/skyTrails/createApplicant`,
        applicantPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!applicantResponse.data?.response?.applicantUid) {
        throw new Error("Failed to create applicant");
      }

      const subjectToken = applicantResponse.data.response.applicantUid;
      sessionStorage.setItem("appUid", subjectToken);

      // Token exchange payload
      const exchangePayload = {
        subject_token: token,
        requested_subject: subjectToken,
      };

      // Exchange token
      const exchangeResponse = await axios.post(
        `${apiURL.baseURL}/api/skyTrails/getTokenExchange`,
        exchangePayload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!exchangeResponse.data?.response?.access_token) {
        throw new Error("Token exchange failed");
      }

      sessionStorage.setItem(
        "tokExchng",
        exchangeResponse.data.response.access_token
      );
      navigate("/visa/userdetails/visadetails");
    } catch (error) {
      setError(error.message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized country options
  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  // State options based on selected country
  const stateOptions = State.getStatesOfCountry(formData.country?.value).map(
    (s) => ({
      value: s.isoCode,
      label: s.name,
    })
  );

  // City options based on selected state
  const cityOptions = City.getCitiesOfState(
    formData.country?.value,
    formData.state?.value
  ).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <div className="relative isolate px-6 py-14 lg:px-8">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white relative rounded-lg shadow-xl max-w-5xl mx-auto px-4 p-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Applicant Information
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.sex}
              onChange={(e) =>
                setFormData({ ...formData, sex: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <Select
              options={countryOptions}
              value={formData.country}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  country: selected,
                  state: null,
                  city: null,
                })
              }
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Select
              options={stateOptions}
              value={formData.state}
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  state: selected,
                  city: null,
                })
              }
              isDisabled={!formData.country}
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <Select
              options={cityOptions}
              value={formData.city}
              onChange={(selected) =>
                setFormData({ ...formData, city: selected })
              }
              isDisabled={!formData.state}
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              value={formData.pin}
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </motion.form>

      <Authentic
        isOpen={isLoginModalOpen}
        onClose={handleModalClose}
        // isLogoutOpen={logoutModalVisible}
        // onLogoutClose={closeLogoutModal}
      />
    </div>
  );
};

export default VisaForm1;
