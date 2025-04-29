import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { apiURL } from "../../../Constants/constant";
import secureLocalStorage from "react-secure-storage";
import Authentic from "../../Auth/Authentic";
import { Earth, Info, MapPin } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import ShareNow from "./ShareNow";

const PackageResultCard = ({ data, shadoww }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(false);
  const reducerState = useSelector((state) => state);
  const [isOpen, setIsOpen] = useState(false); // Modal visibility state
  const { pathname } = useLocation();
  const openModal = () => setIsOpen(true); // Open modal
  const closeModal = () => setIsOpen(false); // Close modal
  const userId = reducerState?.logIn?.loginData?.data?.result?._id;
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const token = secureLocalStorage.getItem("jwtToken");

  useEffect(() => {
    setWishlist(data?.wishlist?.some((item) => item === userId));
  }, [data?.wishlist]);

  let str = (data?.country || []).slice(0, 2).join(" ");

  // console.log(str, "str", data.country);
  const searchOneHoliday = (id) => {
    navigate(
      `/holidaypackages/packagedetails/${str}${data?.days}days${
        data?.days - 1
      }nights/?packageId=${id}`
    );
  };

  const filteredInclusions = data?.inclusions?.filter((item) => {
    const value = Object.values(item)[0];
    return value === "true" || value === true;
  });

  // console.log(data, "data");

  const addRemoveWishlist = async (packageId) => {
    if (authenticUser !== 200) {
      setIsLoginModalOpen(true);
      return;
    }

    // Hit the API
    setWishlist(!wishlist);
    try {
      const response = await axios.get(
        `${apiURL.baseURL}/skytrails/holidaypackage/wishlist/addorremove/${packageId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error in wishlist operation:", error);
    }
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (authenticUser == 200) {
      handleModalClose();
    }
  }, [authenticUser]);

  // console.log(pathname, "pathname");
  const randomReviews = Math.floor(Math.random() * 100) + 1;
  return (
    <div
      key={data?._id}
      className={`max-w-3xl mx-auto bg-white border relative border-gray-200 ${shadoww} rounded-lg  p-4 `}
    >
      <div className="absolute right-2 top-2 cursor-pointer">
        {/* <ShareNow id={data?._id} /> */}
      </div>
      {/* Left Section: Image */}

      <div className="flex">
        <div className="w-1/3">
          <div className="relative">
            <img
              src={data?.coverImage}
              alt="Pattaya"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right Section: Content */}
        <div className="w-2/3 pl-4">
          <div className="relative flex flex-start gap-2 mb-2">
            <div className="flex flex-row">
              {data?.specialTag?.some((tag) => tag.group === true) && (
                <div className="border-1 border-green-400 text-green-400 text-[10px] px-2 py-0 rounded-s-sm">
                  GROUP TOUR
                </div>
              )}
              {data?.specialTag?.some((tag) => tag.budget === true) && (
                <div className="bg-green-400 text-white text-[10px] px-2 py-0 rounded-e-sm">
                  Budget
                </div>
              )}
            </div>
            {data?.specialTag?.some((tag) => tag.family === true) && (
              <div className="border-1 border-green-400 text-green-400 text-[10px] px-2 py-0 rounded-sm">
                Family
              </div>
            )}
          </div>
          <h2 className="text-base mb-2 font-semibold text-gray-800 truncate">
            {data?.title}
          </h2>
          {/* <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star text-gray-300"></i>
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {" "}
              ({randomReviews} Reviews)
            </span>
          </div> */}

          <div className="flex justify-between mb-2">
            {/* Tooltip for 1 Country 2 Cities */}

            {/* Tooltip for All Inclusive */}
            <div className="text-sm text-gray-800"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-3 border-b-[1px] border-gray-300">
        <div className="flex flex-col items-start my-2">
          <span className="text-[12px] font-semibold text-gray-600">
            Destinations
          </span>
          <div className="text-[12px] text-gray-800">
            <p className="relative group">
              <span className="text-blue-500 cursor-pointer">
                {data?.country?.length}{" "}
                {data?.country?.length > 0 ? "Countries" : "Country"},{" "}
                {data?.destination?.length}{" "}
                {data?.destination?.length > 0 ? "Cities" : "City"}
              </span>

              <div className="absolute top-full mt-1 hidden  group-hover:block w-72 border border-gray-500 bg-gray-100 text-gray-800 text-xs rounded-lg shadow-lg p-2">
                <p className="font-semibold flex items-center gap-2">
                  {" "}
                  <Earth size={15} className=" text-primary-6000" /> Countries
                  You will Visit
                </p>

                <div className="my-2 pl-4">
                  {data?.country?.map((item, index) => (
                    <span
                      key={index}
                      className="text-[15px] font-medium mt-2 pl-1"
                    >
                      {item} {index < data?.country?.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <p className="font-semibold flex items-center gap-2">
                  <MapPin size={15} className=" text-primary-6000" /> Cities You
                  will Visit
                </p>

                <div className="pl-4 my-2">
                  {data?.destination?.map((item, index) => (
                    <span
                      key={index}
                      className="text-[14px] font-medium mt-2 pl-1"
                    >
                      {item?.addMore}{" "}
                      {index < data?.destination?.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start my-2">
          <span className="text-[12px] font-semibold text-gray-600">Days</span>
          <p className="text-[13px] text-gray-900 font-semibold">
            {data?.days}
          </p>
        </div>
        {data?.inclusions?.some((tag) => tag.flight === "true") && (
          <div className="flex flex-col items-start my-2">
            <span className="text-[12px] font-semibold text-gray-600">
              Flight
            </span>
            <p className="text-[13px] text-gray-900 font-semibold">included</p>
          </div>
        )}
        {data?.inclusions?.some((tag) => tag.hotel === "true") && (
          <div className="flex flex-col items-start my-2">
            <span className="text-[12px] font-semibold text-gray-600">
              Hotel
            </span>
            <p className="text-[13px] text-gray-900 font-semibold">included</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-col items-start my-2 truncate">
          <span className="text-[12px] font-semibold text-green-600">
            Tour Highlights
          </span>
          <div className="flex flex-row overflow-hidden gap-2 truncate">
            {data?.packageHighLight?.map((item, index) => (
              <div
                key={index}
                className="text-[13px] text-gray-900 flex items-center gap-1 truncate  flex-row overflow-hidden"
              >
                <div className="w-1 h-1 bg-primary-6000 rounded-full"></div>
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse border border-gray-300 bg-purple-100 rounded-md p-2 gap-2 flex-grow w-full justify-between items-end ">
        <div className="flex flex-row w-full gap-2 items-center justify-between">
          {/* <button
            onClick={() => addRemoveWishlist(data?._id)}
            className="wishlistButton text-gray-900  border border-gray-300 bg-white hover:bg-gray-200 focus:ring focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 18 16"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-transform duration-300 me-2 ${
                wishlist ? "heartbeat" : "scale-100"
              }`}
            >
              <path
                d="M9.01163699,14.9053769 C8.72930024,14.7740736 8.41492611,14.6176996 8.07646224,14.4366167 C7.06926649,13.897753 6.06198912,13.2561336 5.12636931,12.5170512 C2.52930452,10.4655288 1.00308384,8.09476443 1.00000218,5.44184117 C0.997549066,2.99198843 2.92175104,1.01242822 5.28303025,1.01000225 C6.41066623,1.00972036 7.49184369,1.4629765 8.28270844,2.2678673 L8.99827421,2.9961237 L9.71152148,2.26559643 C10.4995294,1.45849728 11.5791258,1.0023831 12.7071151,1.00000055 L12.7060299,1.00000225 C15.0693815,0.997574983 16.9967334,2.97018759 17.0000037,5.421337 C17.0038592,8.07662382 15.4809572,10.4530151 12.8850542,12.5121483 C11.9520963,13.2521931 10.9477036,13.8951276 9.94340074,14.4354976 C9.60619585,14.6169323 9.29297309,14.7736855 9.01163699,14.9053769 Z"
                stroke={wishlist ? "red" : "#2D2D2D"}
                strokeWidth="1"
                fill={wishlist ? "red" : "none"}
              />
            </svg>
            Wishlist
          </button> */}

          <button
            type="button"
            onClick={(e) => searchOneHoliday(data?._id)}
            class="text-gray-100 border w-full border-gray-300 bg-primary-6000 hover:bg-primary-700 focus:outline-none font-medium rounded-lg text-sm transition-all py-2 text-center inline-flex items-center justify-center group"
          >
            View Tour Details
            <i class="fa-solid fa-arrow-right-long transition-all  ms-3"></i>
          </button>
        </div>
        <div className="flex flex-col items-end w-full">
          <div className="flex flex-col items-end mb-2">
            <div>
              <span className="text-[12px] font-semibold text-gray-600">
                Starts from
              </span>{" "}
              {data?.packageAmount?.[0]?.amount && (
                <span className="text-lg mr-2 text-gray-500 line-through decoration-gray-500 ms-2">
                  ₹{(data.packageAmount[0]?.amount * 1.2).toFixed(0)}
                </span>
              )}
              <span className="text-lg font-semibold text-gray-900">
                ₹{data?.packageAmount?.[0]?.amount}
              </span>{" "}
            </div>
            <p className="text-[12px] font-semibold text-gray-600">
              per person on twin sharing
            </p>
          </div>
        </div>
      </div>

      {/* {pathname !== "/holidaypackages" &&
        pathname !== "/st-hotel" &&
        pathname !== "/" &&
        pathname !== "/bus" && (
          <div
            onClick={openModal}
            className="mt-2 flex flex-row items-center justify-center w-full font-semibold text-sm cursor-pointer"
          >
            <i className="fa-regular fa-comments me-2"></i>
            <p className="underline">Talk to Our Expert</p>
          </div>
        )} */}

      <Authentic
        isOpen={isLoginModalOpen}
        onClose={handleModalClose}
        // isLogoutOpen={logoutModalVisible}
        // onLogoutClose={closeLogoutModal}
      />

      {isOpen && (
        <EnquiryForm
          isOpen={isOpen}
          closeModal={closeModal} // Pass the closeModal function as a prop
          destination={"Paris"} // Example prop to pass data (dynamic data can be added here)
        />
      )}
    </div>
  );
};

export default PackageResultCard;
