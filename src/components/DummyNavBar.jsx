import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BedDouble, BusFront, Phone, Plane, TentTree } from "lucide-react";
import AvatarDropdown from "./AvatarDropdown";
// import { FaIdCard } from "react-icons/fa";

const DummyNavbar = ({ className = "" }) => {
  const userData = useSelector((state) => state?.logIn);

  let balance = userData?.wallet?.balance;
  const navigate = useNavigate();
  const location = useLocation();

  const [showSticky, setShowSticky] = useState(true);
  const path = location.pathname;

  useEffect(() => {
    if (
      path === "/flightlist" ||
      path === "/ReturnResult" ||
      path.includes("/st-hotel/hotelresult/hotels-in") ||
      path.includes("/flight-details") ||
      path.includes("/holidayform/")
    ) {
      setShowSticky(false);
    } else {
      setShowSticky(true);
    }
  }, [path]);

  // console.log(path, "path in the main nav");

  const isActive = (path) => {
    const currentPath = location.pathname;

    if (path === "/dummy-flight") {
      return (
        currentPath === "/dummy-flight" ||
        currentPath === "/flightlist" ||
        currentPath === "/ReturnResult" ||
        currentPath === "/flight/review-details"
      );
    }
    console.log(currentPath, "currentPath", path);

    return currentPath.startsWith(path);
  };

  const navigationHandler = (type) => {
    if (type === "flight") {
      navigate("/dummy-flight");
    }
    if (type === "holidays") {
      navigate("/holidayform");
    }
    if (type === "hotel") {
      navigate("/dummy-hotel");
    }
    if (type === "bus") {
      navigate("/bus");
    }
    if (type === "visa") {
      navigate("/visa");
    }
  };

  return (
    <div
      className={`${
        showSticky ? "sticky" : ""
      } nc-Header overflow-visible top-0 w-full left-0 right-0 z-40 nc-header-bg shadow-sm`}
    >
      <div className={`MainNav2 relative z-10 ${className}`}>
        <div className=" h-20 container flex justify-between">
          {/* <div
            onClick={() => navigate("/")}
            className="flex flex-grow md:flex-grow-0 md:flex cursor-pointer justify-start space-x-3 sm:space-x-8 lg:space-x-10 "
          >
            <img
              src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg"
              className="w-36 md:w-44 xl:w-52 "
              alt=""
            />
          </div> */}

          <div className="hidden md:flex justify-between items-center flex-1 space-x-5 sm:space-x-8 lg:space-x-10">
            <ul className="mb-0 p-0 gap-3 flex overflow-x-auto hiddenScrollbar">
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/") ? "bg-indigo-200 " : " bg-gray-100"
                }`}
                onClick={() => navigationHandler("flight")}
              >
                {/* {isActive("/") ? flightActive : flightInactive} */}
                <div className="w-6 h-6 xl:w-8 xl:h-8 shadow-md  flex items-center justify-center rounded-full p-1 xl:p-2 bg-white">
                  <Plane
                    size={18}
                    className={`${
                      isActive("/") ? "text-primary-6000" : "text-black"
                    }`}
                  />
                </div>
                Dummy Flight
              </li>
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/dummy-hotel") ? "bg-indigo-200 " : " bg-gray-100"
                }`}
                onClick={() => navigationHandler("hotel")}
              >
                {/* {isActive("/st-hotel") ? hotelActive : hotelInactive} */}
                <div className="w-8 h-8 flex shadow-md items-center justify-center rounded-full p-2 bg-white">
                  <BedDouble
                    size={18}
                    className={`${
                      isActive("/hotelform")
                        ? "text-primary-6000"
                        : "text-black"
                    }`}
                  />
                </div>
                Dummy Hotels
              </li>
              {/* <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/holidayform") ? "bg-indigo-200 " : " bg-gray-100"
                }`}
                onClick={() => navigationHandler("holidays")}
              >
                
                <div className="w-8 h-8  shadow-md  flex items-center justify-center rounded-full p-2 bg-white">
                  <TentTree
                    className={`${
                      isActive("/holidayform")
                        ? "text-primary-6000"
                        : "text-black"
                    }`}
                    size={18}
                  />
                </div>
                Holidays
              </li> */}
              {/* <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/bus") ? "bg-indigo-200 " : " bg-gray-100"
                }`}
                onClick={() => navigationHandler("bus")}
              >
               
                <div className="w-8 h-8 shadow-md  flex items-center justify-center rounded-full p-2 bg-white">
                  <BusFront
                    size={18}
                    className={`${
                      isActive("/bus") ? "text-primary-6000" : "text-black"
                    }`}
                  />
                </div>
                Buses
              </li> */}
              {/* <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/visa") ? "bg-indigo-200 " : " bg-gray-100"
                }`}
                onClick={() => navigationHandler("visa")}
              >
                <div className="w-8 h-8 shadow-md  flex items-center justify-center rounded-full p-2 bg-white">
                  <i class="fa-regular fa-address-card text-sm"></i>
                </div>
                Visa
              </li> */}
            </ul>
          </div>

          <div className="flex items-center md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 ">
            <div className="pe-8">
              <p className="mb-0 text-gray-800 text-lg font-bold">
                {balance ? "₹" : ""} {balance}
              </p>
            </div>
            <div className="hidden lg:flex space-x-1">
              <AvatarDropdown />
            </div>
            <div className="flex space-x-2 lg:hidden">
              <AvatarDropdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DummyNavbar;
