import React, { useEffect, useState } from "react";
import Select from "react-select";
import VisaDate from "./VisaDate";
import dayjs from "dayjs";
import { apiURL } from "../../Constants/constant";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { swalModal } from "../../utility/swal";
import SecureStorage from "react-secure-storage";
import { country } from "./CountryList";
import PayButton from "../../utility/PayButton";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import VisaDateTo from "./VisaDateTo";
import { subtractWalletRequest } from "../../Redux/Auth/logIn/actionLogin";

const VisaForm = () => {
  let cashfree;
  const initializeSDK = async () => {
    cashfree = await load({
      mode: "sandbox",
      // mode: "production",
    });
  };
  initializeSDK();

  const [apiCountries, setApiCountries] = useState([]);
  const [departDate, setDepartDate] = useState(null);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [loaderPayment, setLoaderPayment] = useState(false);
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const crmUserID = reducerState?.logIn?.loginData?.id;
  sessionStorage.setItem("SessionExpireTime", new Date());
  const agentName =
    reducerState?.logIn?.loginData?.first_name +
    " " +
    reducerState?.logIn?.loginData?.last_name;
  const agentId = reducerState?.logIn?.loginData?.id;
  const finalAmount = 199;
  console.log(departDate, "deparfejffksdafas ");

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

  const countryOption = country.map((country) => ({
    value: country,
    label: country.name,
  }));

  const apiCountryOptions = apiCountries.map((country) => ({
    visaCategories: country?.visaCategories,
    value: country,
    label: country.country,
  }));

  useEffect(() => {
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
    depCountyName: payload?.travelingFrom?.value?.name,
    arrCountyName: payload?.travelingTo?.label,
    fromDate: departDate,
    toDate: arrivalDate,
    visaType: payload?.visaCategory,
    applicantUid: applicantUId,
    bearerToken: bearer_token,
    visaCategory: payload?.visaCategory,
    sourceCountry: payload?.travelingFrom?.value?.code,
    destinationCountry: payload?.travelingTo?.value?.alpha3Code,
    agentName: agentName,
    agentId: agentId,
    contactNumber: "",
    fee: {
      processingFee: 100,
      platformFee: 999,
    },
  };

  const savetodb = async () => {
    const res = await axios.post(
      `${apiURL.baseURL}/skyTrails/api/visa/applyForAiVisa`,
      historyPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

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
        fromDate: dayjs(departDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        toDate: dayjs(arrivalDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
        sourceCountry: payload.travelingFrom.value.code,
        destinationCountry: payload.travelingTo.value.alpha3Code,
        bearerToken: bearer_token,
      };

      const response = await axios.get(
        `${apiURL.baseURL}/api/skyTrails/createRedirectURL`,
        { params },
        {
          headers: {
            "X-Access-Key": "theskytrails2025",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode === 200) {
        dispatch(
          subtractWalletRequest({
            balance: finalAmount,
            type: "visa",
            booking_id: "visa" + new Date(),
          })
        );

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
      sessionStorage.setItem("SessionExpireTime", new Date());
      handlePayNow();
      console.log("payment sucessfully completed");
    }
  }, [loaderPayment]);

  return (
    <div className="relative isolate px-6 py-14 lg:px-8 min-h-screen">
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[url('https://ai.theskytrails.com/assets/background1-CtdDjmcE.png')] bg-[length:200%_200%] bg-[left_70%_top_50%] bg-no-repeat flex items-center justify-center isolate px-6 pt-14 lg:px-8"></div>

      <div className="mx-auto max-w-6xl  relative z-10">
        <motion.div
          className="w-full h-full px-[96px] py-[70px] bg-[rgba(213,213,213,0.1)] backdrop-blur-[42px] border border-white rounded-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Visa Application Form
            </h2>
            <p className="mt-2 text-orange-600">
              Complete your visa application details
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

          <div className="space-y-6">
            {/* Passport Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What country is your passport from?
              </label>
              <Select
                options={countryOption}
                value={payload.passportCountry}
                onChange={(selected) =>
                  setPayload({ ...payload, passportCountry: selected })
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

            {/* Traveling From/To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traveling From
                </label>
                <Select
                  options={countryOption}
                  value={payload.travelingFrom}
                  onChange={(selected) => {
                    setPayload({ ...payload, travelingFrom: selected });
                  }}
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
            </div>

            {/* Visa Categories */}
            {payload.travelingTo?.value?.visaCategories && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Visa Category
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {payload.travelingTo.value.visaCategories.map((category) => (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={() =>
                        setPayload({ ...payload, visaCategory: category })
                      }
                      className={`py-3 px-4 rounded-lg border ${
                        payload.visaCategory === category
                          ? "border-orange-500 bg-orange-200 text-orange-600"
                          : " border-1 border-[rgba(255,255,255,1)] bg-[rgba(255,255,255,0.4)] backdrop-blur-[32px] rounded-[10px]"
                      } transition-colors`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Payment Button */}
            <div className="pt-4" onClick={() => savetodb()}>
              {/* <PayButton
                className={`w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-orange-400 hover:to-amber-400 transition-all font-medium ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                phone={storedData?.applicant?.phone}
                ticketPrice={1}
                email={storedData?.applicant?.email}
                productinfo="ticket"
                bookingType="VISA"
                buttonText={isProcessing ? "Processing..." : "Pay Now"}
                setPaymentLoading={(state) => {}}
                setLoaderPayment1={(state) => {}}
                setLoaderPayment={(state) => {
                  setLoaderPayment(state);
                }}
                setLoadingButton={(state) => {}}
              /> */}

              <PayButton
                className={`w-full bg-orange-500 text-white py-3 px-4 rounded-md transition-colors font-medium ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
                phone={storedData?.applicant?.phone}
                ticketPrice={finalAmount}
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisaForm;
