import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BedDouble, BusFront, Phone, Plane, TentTree } from "lucide-react";
import AvatarDropdown from "./AvatarDropdown";
// import { FaIdCard } from "react-icons/fa";

const NavbarVisa = ({ className = "" }) => {
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

    if (path === "/") {
      return (
        currentPath === "/" ||
        currentPath === "/flightlist" ||
        currentPath === "/ReturnResult" ||
        currentPath === "/flight/review-details"
      );
    }

    return currentPath.startsWith(path);
  };

  const navigationHandler = (type) => {
    if (type === "flight") {
      navigate("/");
    }
    if (type === "holidays") {
      navigate("/holidayform");
    }
    if (type === "hotel") {
      navigate("/hotelform");
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
      } nc-Header overflow-visible top-5  left-0 right-0 z-40 `}
    >
      <div className={`MainNav2 relative z-10 ${className}`}>
        <div className=" h-20 container flex justify-between shadow-[inset_0px_3px_10px_rgba(255,255,255,0.16)] border-1 border-[rgba(255,255,255,1)] bg-[rgba(0,0,0,0.05)] backdrop-blur-[32px] rounded-[10px]">
          <div
            onClick={() => navigate("/")}
            className="flex flex-grow md:flex-grow-0 md:flex cursor-pointer justify-start space-x-3 sm:space-x-8 lg:space-x-10 "
          >
            <img
              src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg"
              className="w-36 md:w-44 xl:w-36 "
              alt=""
            />
          </div>

          <div className="hidden md:flex justify-center items-center flex-1 space-x-5 sm:space-x-8 lg:space-x-10">
            <ul className="mb-0 p-0 gap-3 flex overflow-x-auto hiddenScrollbar">
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium `}
                onClick={() => navigationHandler("flight")}
              >
                Flight
              </li>
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium `}
                onClick={() => navigationHandler("hotel")}
              >
                Hotels
              </li>
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium `}
                onClick={() => navigationHandler("holidays")}
              >
                {/* {isActive("/holidaypackages") ? holidayActive : holidayInactive}{" "} */}
                Holidays
              </li>
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium `}
                onClick={() => navigationHandler("bus")}
              >
                {/* {isActive("/bus") ? busActive : busInactive}  */}
                Buses
              </li>
              <li
                className={`flex-shrink-0 flex gap-1 py-1 ps-2 sm:pe-2  xl:pe-3 rounded-full items-center cursor-pointer text-[12px] lg:text-[13px] xl:text-lg font-medium ${
                  isActive("/visa") ? " text-orange-500" : " "
                }`}
                onClick={() => navigationHandler("visa")}
              >
                Visa
              </li>
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

export default NavbarVisa;
