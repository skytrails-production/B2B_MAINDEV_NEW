import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { apiURL } from "../../Constants/constant";
import Authentic from "../Auth/Authentic";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const VisaForm1 = () => {
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("visaToken");

  const crmUserID = String(reducerState?.logIn?.loginData?.id);

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
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !Object.values(formData).every(
          (value) => value !== "" && value !== null
        )
      ) {
        throw new Error("Please fill all required fields");
      }

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

      const exchangePayload = {
        subject_token: token,
        requested_subject: subjectToken,
      };

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

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = State.getStatesOfCountry(formData.country?.value).map(
    (s) => ({
      value: s.isoCode,
      label: s.name,
    })
  );

  const cityOptions = City.getCitiesOfState(
    formData.country?.value,
    formData.state?.value
  ).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <div className="relative isolate px-6 py-14 lg:px-8 min-h-screen overflow-hidden">
      {/* Orange animated particles */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[url('https://ai.theskytrails.com/assets/background1-CtdDjmcE.png')] bg-[length:200%_200%] bg-[left_70%_top_50%] bg-no-repeat flex items-center justify-center isolate px-6 pt-14 lg:px-8"></div>

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full h-full px-[96px] py-[70px] bg-[rgba(213,213,213,0.1)] backdrop-blur-[42px] border border-white rounded-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Applicant Information
            </h2>
            <p className="mt-2 text-orange-600">
              Please fill in your details to proceed with the visa application
            </p>
          </div>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Enter first name"
                className="text-[16px] font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] outline-none placeholder:text-[rgba(20,24,31,0.5)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Enter last name"
                // w-full h-full px-[96px] py-[70px] bg-[rgba(213,213,213,0.1)] backdrop-blur-[42px] border border-white rounded-[16px]
                // className="w-full  px-4 py-3 focus:border-none transition-all !bg-[rgba(255, 255, 255, 0.2)] border border-white rounded-[10px] backdrop-blur-[42px] "
                className="text-[16px] font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] outline-none placeholder:text-[rgba(20,24,31,0.5)]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="text-[16px] !focus:border-none !focus:outline-none font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] placeholder:text-[rgba(20,24,31,0.5)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.sex}
                onChange={(e) =>
                  setFormData({ ...formData, sex: e.target.value })
                }
                className="text-[16px] font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] outline-none placeholder:text-[rgba(20,24,31,0.5)]"
                required
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone no"
                className="text-[16px] font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] outline-none placeholder:text-[rgba(20,24,31,0.5)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "52px",
                    borderColor: "#d1d5db",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "rgba(20, 24, 31, 0.7)",
                    cursor: "pointer",
                    height: "66px",
                    width: "100%",
                    padding: "20px 28px",
                    boxShadow:
                      "rgba(255, 255, 255, 0.16) 0px 3px 10px 0px inset",
                    border: "1px solid rgba(255, 255, 255, 0.56)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(32px)",
                    borderRadius: " 10px",
                    "&:hover": {
                      borderColor: "#f97316",
                    },
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "52px",
                    borderColor: "#d1d5db",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "rgba(20, 24, 31, 0.7)",
                    cursor: "pointer",
                    height: "66px",
                    width: "100%",
                    padding: "20px 28px",
                    boxShadow:
                      "rgba(255, 255, 255, 0.16) 0px 3px 10px 0px inset",
                    border: "1px solid rgba(255, 255, 255, 0.56)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(32px)",
                    borderRadius: " 10px",
                    "&:hover": {
                      borderColor: "#f97316",
                    },
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "52px",
                    borderColor: "#d1d5db",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "rgba(20, 24, 31, 0.7)",
                    cursor: "pointer",
                    height: "66px",
                    width: "100%",
                    padding: "20px 28px",
                    boxShadow:
                      "rgba(255, 255, 255, 0.16) 0px 3px 10px 0px inset",
                    border: "1px solid rgba(255, 255, 255, 0.56)",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(32px)",
                    borderRadius: " 10px",
                    "&:hover": {
                      borderColor: "#f97316",
                    },
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                value={formData.pin}
                onChange={(e) =>
                  setFormData({ ...formData, pin: e.target.value })
                }
                placeholder="Zip/Postal Code"
                className="text-[16px] font-medium text-[rgba(20,24,31,0.7)] cursor-pointer h-[66px] w-full px-[28px] py-[20px] shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.2)] backdrop-blur-[32px] rounded-[10px] outline-none placeholder:text-[rgba(20,24,31,0.5)]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden rounded-3xl px-8 py-3 text-sm font-semibold text-white shadow-lg bg-[#fd5b00] transition-all min-w-[200px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>

      <Authentic isOpen={isLoginModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default VisaForm1;
