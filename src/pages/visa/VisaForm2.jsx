import React, { useEffect, useState } from "react";
import Select from "react-select";
import VisaDate from "./VisaDate";
import dayjs from "dayjs";
import { apiURL } from "../../Constants/constant";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { swalModal } from "../../utility/swal";
import SecureStorage from "react-secure-storage";
import { Country } from "country-state-city";

import PayButton from "../../utility/PayButton";
import { useSelector } from "react-redux";

const VisaForm = () => {
  let cashfree;
  const initializeSDK = async () => {
    cashfree = await load({
      mode: "sandbox",
      // mode: "production",
    });
  };
  initializeSDK();

  const [apiCountries, setApiCountries] = useState([]); // For travelingTo dropdown
  const [departDate, setDepartDate] = useState(null);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [loaderPayment, setLoaderPayment] = useState(false);
  const reducerState = useSelector((state) => state);
  const crmUserID = reducerState?.logIn?.loginData?.id;

  const access_token = sessionStorage.getItem("visaToken");
  const bearer_token = sessionStorage.getItem("tokExchng");
  const applicantUId = sessionStorage.getItem("appUid");
  const storedData = JSON.parse(sessionStorage.getItem("visaClient"));

  const [payload, setPayload] = useState({
    passportCountry: null,
    travelingFrom: null,
    travelingTo: null,
    visaCategory: "",
  });

  // Get countries from country-state-city for passport and travelingFrom
  const countryStateCityData = Country.getAllCountries().map((country) => ({
    ...country,
    // Add visaCategories and alpha3Code to match original API structure
    visaCategories: ["Tourist", "Student"], // Default categories
    alpha3Code: country.iso3Code, // Map iso3Code to alpha3Code
  }));

  // Options for passport and travelingFrom
  const countryStateCityOptions = countryStateCityData.map((country) => ({
    value: country,
    label: country.name,
  }));

  // Options for travelingTo (from API)
  const apiCountryOptions = apiCountries.map((country) => ({
    value: country,
    label: country.country,
  }));

  useEffect(() => {
    // Fetch API countries only for travelingTo dropdown
    const fetchApiCountries = async () => {
      try {
        const response = await fetch(
          `${apiURL.baseURL}/api/skyTrails/getCountryList`
        );
        const data = await response.json();
        setApiCountries(data.result);
      } catch (err) {
        console.error("Error fetching API countries:", err);
      }
    };
    fetchApiCountries();
  }, []);

  const handleDateChange = (dates) => {
    setDepartDate(dayjs(dates.startDate).format("DD-MM-YYYY"));
  };

  const handleDateChange2 = (dates) => {
    setArrivalDate(dayjs(dates.startDate).format("DD-MM-YYYY"));
  };

  // skytrails history

  const historyPayload = {
    firstName: storedData?.applicant?.firstName,
    lastName: storedData?.applicant?.lastName,
    email: storedData?.applicant?.email,
    sex: storedData?.applicant?.sex,
    userId: String(crmUserID),
    mobileNumber: {
      phone: storedData?.applicant?.phone,
    },
    address: storedData?.applicant?.address,
    depCountyName: payload?.travelingFrom?.label,
    arrCountyName: payload?.travelingTo?.label,
    fromDate: departDate,
    toDate: arrivalDate,
    visaType: payload?.visaCategory,

    fee: {
      processingFee: 100,
      platformFee: 999,
    },
  };

  const savetodb = async () => {
    const res = await axios.post(
      `${apiURL.baseURL}/skyTrails/api/visa/applyForAiVisa`,
      historyPayload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(res, "response of history");
  };
  // skytrails history

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (
        !payload.passportCountry ||
        !payload.travelingFrom ||
        !payload.travelingTo ||
        !payload.visaCategory ||
        !departDate ||
        !arrivalDate
      ) {
        setError("Please fill all required fields");
        return;
      }

      const params = {
        applicantUid: applicantUId,
        accessToken: access_token,
        visaType: payload.visaCategory,
        visaDuration: 30,
        fromDate: departDate,
        toDate: arrivalDate,
        sourceCountry: payload.travelingFrom.value.alpha3Code, // From country-state-city data
        destinationCountry: payload.travelingTo.value.alpha3Code, // From API data
        bearerToken: bearer_token,
      };

      const response = await axios.get(
        `${apiURL.baseURL}/api/skyTrails/createRedirectURL`,
        { params }
      );

      if (response.data.statusCode === 200) {
        window.location.href = response.data.response;
      } else {
        setError(response.data.responseMessage || "Payment processing failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.responseMessage ||
          err.message ||
          "An error occurred while processing your payment"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Rest of your payment functions remain unchanged
  let orderId1 = "";

  const handlePayment = async () => {
    const token = localStorage?.getItem("jwtToken");

    savetodb();

    const cashpayload = {
      phone: storedData?.applicant?.phone,
      amount: 1,
      email: storedData?.applicant?.email,
      productinfo: "ticket",
      bookingType: "VISA",
    };

    try {
      const response = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/transaction/walletRecharge`,
        data: cashpayload,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (response.status === 200) {
        orderId1 = response.data.result.order_id;
        doPayment(response.data.result.payment_session_id);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const doPayment = async (sessionID) => {
    let checkoutOptions = {
      paymentSessionId: sessionID,
      redirectTarget: "_modal",
    };

    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        swalModal("hotel", "Some error occurred!", false);
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        handlePayNow();
      }
    });
  };
  useEffect(() => {
    if (loaderPayment == true) {
      handlePayNow();

      console.log("payment sucessfully completed");
    }
  }, [loaderPayment]);

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
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
      <div className="bg-white rounded-lg shadow-xl max-w-5xl mx-auto px-4 p-8">
        {/* Passport Country */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Visa Application Form
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What country is your passport from?
          </label>
          <Select
            options={countryStateCityOptions}
            value={payload.passportCountry}
            onChange={(selected) =>
              setPayload({ ...payload, passportCountry: selected })
            }
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Traveling From/To */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traveling From
            </label>
            <Select
              options={countryStateCityOptions}
              value={payload.travelingFrom}
              onChange={(selected) =>
                setPayload({ ...payload, travelingFrom: selected })
              }
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traveling To
            </label>
            <Select
              options={apiCountryOptions}
              value={payload.travelingTo}
              onChange={(selected) =>
                setPayload({ ...payload, travelingTo: selected })
              }
              isSearchable
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Visa Categories */}
        {payload.passportCountry?.value.visaCategories && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Visa Category
            </label>
            <div className="flex gap-4">
              {payload.passportCountry.value.visaCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setPayload({ ...payload, visaCategory: category })
                  }
                  className={`flex-1 py-3 px-4 rounded-md border ${
                    payload.visaCategory === category
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-300"
                  } transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dates and payment button remain unchanged */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <VisaDate className="flex-1" onDateChange={handleDateChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Date
            </label>
            <VisaDate className="flex-1" onDateChange={handleDateChange2} />
          </div>
        </div>

        {/* <button
          // onClick={handlePayNow}
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md transition-colors font-medium ${
            isProcessing
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button> */}
        <div onClick={() => savetodb()}>
          <PayButton
            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md transition-colors font-medium ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
            phone={storedData?.applicant?.phone}
            ticketPrice={1}
            email={storedData?.applicant?.email}
            productinfo="ticket"
            bookingType="VISA"
            buttonText={isProcessing ? "Processing..." : "Pay Now"}
            setPaymentLoading={(state) => {
              // savetodb();
              // setPaymentLoading(state);
            }}
            setLoaderPayment1={(state) => {
              // setLoaderPayment1(state);
            }}
            setLoaderPayment={(state) => {
              setLoaderPayment(state);
            }}
            setLoadingButton={(state) => {
              // setLoadingButton(state);
              // savetodb();
            }}
          />
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default VisaForm;
