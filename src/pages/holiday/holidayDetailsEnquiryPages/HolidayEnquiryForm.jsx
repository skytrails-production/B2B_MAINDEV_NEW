/* global fbq */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import SecureStorage from "react-secure-storage";
import "./holidayenquiryform.scss";

import { DatePicker } from "antd";
import { Button } from "antd";
import { apiURL } from "../../../Constants/constant";
import ConfirmationModal from "./ConfirmationModal";
import Authentic from "../../Auth/Authentic";

const HolidayEnquiryForm = ({ onePackage, filterType }) => {
  const reducerState = useSelector((state) => state);
  const [loading, setLoading] = useState(true);
  const crmUserID = String(reducerState?.logIn?.loginData?.id);
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const token = SecureStorage.getItem("jwtToken");

  const validateForm = (formData) => {
    const errors = {};
    if (formData.fname.length < 4 || formData.fname.length > 26) {
      errors.fname = "Enter valid name";
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Enter Valid Email";
    }
    if (formData.phone.length < 10 || formData.phone.length > 10) {
      errors.phone = "Enter Phone Number";
    }
    if (formData.depCity.length < 2 || formData.depCity.length > 20) {
      errors.depCity = "Enter Correct City";
    }

    return errors;
  };

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({
    fname: "",
    phone: "",
    email: "",
    depCity: "",
    date: "",
  });
  const [formData, setFormData] = useState({
    fname: "",
    phone: "",
    email: "",
    date: "",
    depCity: "",
  });

  const onInputChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdultIncrement = () => {
    setAdults(adults + 1);
  };

  const handleAdultDecrement = () => {
    if (adults > 0) {
      setAdults(adults - 1);
    }
  };

  const handleChildIncrement = () => {
    setChildren(children + 1);
  };

  const handleChildDecrement = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  // date picker
  const dateFormat = "DD MMM, YY";
  const today = dayjs().format(dateFormat);
  const [newDepartDate, setNewDepartDate] = useState(today);

  const handleRangeChange = (date) => {
    if (date) {
      setNewDepartDate(dayjs(date).format(dateFormat));
    } else {
      console.log("");
    }
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };
  // date picker

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (authenticUser === 200) {
      handleModalClose();
    }
  }, [authenticUser]);

  // confirmation modal open close
  const [showConfirmationModalVisible, setShowConfirmationModalVisible] =
    useState(false);

  const showConfirmationModal = () => {
    setShowConfirmationModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModalVisible(false);
  };
  // confirmation modal open close

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    // if (authenticUser !== 200) {
    //   setIsLoginModalOpen(true);
    //   setLoader(false);
    //   return;
    // }

    // console.log(formData, 'formData');

    if (typeof fbq === "function") {
      console.log("clicked");
      fbq("track", "Lead", { currency: "INR", value: 30.0 });
    } else {
      console.warn("Facebook Pixel (fbq) is not loaded.");
    }

    const validationResult = validateForm(formData);
    // console.log(validationResult, 'validationResult');
    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      setLoader(false);
      return;
    }
    const enquiryPayload = {
      userId: crmUserID,
      packageId: onePackage?._id,
      email: formData.email,
      countryCode: "+91",
      fullName: formData.fname,
      phone: formData.phone,
      departureCity: formData.depCity,
      adults: adults,
      child: children,
      noOfPeople: Number(adults) + Number(children),
      departureDate: newDepartDate,
      packageType: "tour",
    };
    await axios({
      method: "post",
      url: `${apiURL.baseURL}/skytrails/crmagent/packageenquiry/create`,
      data: enquiryPayload,
      headers: {
        // token: token,
      },
    })
      .then(function () {
        setFormData({
          email: "",
          fname: "",
          phone: "",
          depCity: "",
        });
        setChildren(0);
        setAdults(1);
        setNewDepartDate(today);
        showConfirmationModal();
        setLoader(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoader(false);
      });
  };

  const packagePrice = onePackage?.packageAmount?.filter(
    (item) => item?.packageCategory?.toLowerCase() === filterType?.toLowerCase()
  );

  return (
    <div className="holidayEnqiryForm sticky top-24 p-3 border border-gray-400 rounded-md overflow-y-scroll">
      <div className="">
        <h5 className="text-base text-gray-600">{onePackage?.title}</h5>
        {/* <div className="mb-3">
          <span className="text-xl font-bold">
            {" "}
            INR {packagePrice?.[0]?.amount}
          </span>
          <span className="text-gray-600 text-md ms-2">Per Adult</span>
        </div> */}
        <div className="mb-3 flex items-center  justify-start">
          {packagePrice?.[0]?.amount && (
            <span className="text-gray-500 mr-2 text-md  line-through decoration-gray-500">
              INR {(packagePrice[0].amount * 1.2).toFixed(0)}
            </span>
          )}
          <span className="text-lg font-bold">
            INR {packagePrice?.[0]?.amount}
          </span>
          <span className="text-gray-600 text-sm font-semibold ms-1">
            Per Adult
          </span>
        </div>
      </div>

      <div className="container">
        <form class="row g-3" onSubmit={onFormSubmit}>
          <div class="col-12">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email ID
            </label>
            <input
              style={{ borderColor: errors.email ? "red" : "lightgray" }}
              type="email"
              id="email"
              name="email"
              className="w-full p-2.5 rounded-md "
              value={formData.email}
              onChange={onInputChangeHandler}
            />
          </div>
          <div class="col-12">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Full Name
            </label>
            <input
              style={{ borderColor: errors.fname ? "red" : "lightgray" }}
              type="text"
              name="fname"
              id="fname"
              className="w-full p-2.5 rounded-md "
              value={formData.fname}
              onChange={onInputChangeHandler}
            />
          </div>
          <div class="col-12">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone No
            </label>
            <input
              style={{ borderColor: errors.phone ? "red" : "lightgray" }}
              type="tel"
              name="phone"
              id="phone"
              className="w-full p-2.5 rounded-md "
              value={formData.phone}
              onChange={onInputChangeHandler}
            />
          </div>
          <div class="col-12">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Departure City
            </label>
            <input
              style={{ borderColor: errors.depCity ? "red" : "lightgray" }}
              type="text"
              name="depCity"
              id="depCity"
              className="w-full p-2.5 rounded-md "
              value={formData.depCity}
              onChange={onInputChangeHandler}
            />
          </div>

          <div class="col-12">
            <div className="datePickEnquiry">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Travel Date
              </label>
              <DatePicker
                onChange={handleRangeChange}
                defaultValue={dayjs(today, dateFormat)}
                format={dateFormat}
                disabledDate={disablePastDates}
                value={dayjs(newDepartDate, dateFormat)}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="humanCount">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Adults
              </label>
              <div className="counter">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAdultDecrement}
                >
                  -
                </button>
                <span className="count">{adults}</span>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAdultIncrement}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="humanCount">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Children
              </label>
              <div className="counter">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleChildDecrement}
                >
                  -
                </button>
                <span className="count">{children}</span>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleChildIncrement}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="col-12 enquiryBotton">
            <Button
              className="w-full bg-primary-6000 text-white p-5 text-lg"
              htmlType="submit"
              loading={loader}
            >
              Send Enquiry
            </Button>
          </div>
        </form>
      </div>

      <Authentic
        isOpen={isLoginModalOpen}
        onClose={handleModalClose}
        // isLogoutOpen={logoutModalVisible}
        // onLogoutClose={closeLogoutModal}
      />

      <ConfirmationModal
        isOpen={showConfirmationModalVisible}
        onClose={closeConfirmationModal}
      />
    </div>
  );
};

export default HolidayEnquiryForm;
