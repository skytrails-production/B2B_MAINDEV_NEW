import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../shared/Heading";

const AllOffers = ({ className = "" }) => {
  const navigate = useNavigate();
  const localData = sessionStorage.getItem("advertise");
  const localDataArray = JSON.parse(localData);

  const handleClick = (item) => {
    navigate(`/offerDetail?couponType=${item?.addType}&couponId=${item?._id}`);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <div className="custom-container my-5">
        <Heading desc={false} isCenter={true}>
          All Offers
        </Heading>
        <div className="row g-3">
          {localDataArray?.map((data, index) => (
            <div className="col-lg-3" key={index}>
              <div
                className={`nc-CardCategory3 pb-2 flex cursor-pointer flex-col ${className}`}
                onClick={() => handleClick(data)}
              >
                <div
                  className={`h-full p-2 bg-gray-200  shadow-md relative w-full aspect-w-5 aspect-h-3 sm:aspect-h-6 rounded-2xl overflow-hidden group`}
                >
                  <img
                    src={data?.image}
                    className="object-cover w-full h-full rounded-2xl"
                    alt="places"
                  />

                  <h3 className="mt-2 text-[1rem] font-semibold truncate">
                    {data?.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-600">
                    Expiry Date:{dayjs(data?.endDate).format("DD MMM, YY")}
                  </p>

                  {/* <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          <div className="col-lg-4">
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4 ">
              {/* Left Section: Image */}
              <div className="flex">
                <div className="w-1/3">
                  <div className="relative">
                    <img
                      src="https://skytrails.s3.amazonaws.com/randomImages/uploadedFile_1731127873032_holidayOff15%25.jpg"
                      alt="Pattaya"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Right Section: Content */}
                <div className="w-2/3 pl-4">
                  <div className="relative flex flex-start gap-2 mb-2">
                    <div className="flex flex-row">
                      <div className=" border-1 border-green-400 text-green-400 text-[10px] px-2 py-0 rounded-s-sm">
                        GROUP TOUR
                      </div>
                      <div className=" bg-green-400 text-white text-[10px] px-2 py-0 rounded-e-sm">
                        ASTL
                      </div>
                    </div>
                    <div className="border-1 border-green-400 text-green-400 text-[10px] px-2 py-0 rounded-sm">
                      Family
                    </div>
                  </div>
                  <h2 className="text-base mb-2 font-semibold text-gray-800">
                    Highlights of Thailand
                  </h2>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star text-gray-300"></i>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      (36 Reviews)
                    </span>
                  </div>

                  <div className="flex justify-between mb-2">
                    {/* Tooltip for 1 Country 2 Cities */}

                    {/* Tooltip for All Inclusive */}
                    <div className="text-sm text-gray-800">
                      <p className="relative group">
                        <span className="text-blue-500 cursor-pointer">
                          All Inclusive
                        </span>
                        {/* Tooltip */}
                        <div className="absolute hidden top-full mt-1 z-50 group-hover:block w-52 bg-gray-200 text-gray-800 text-xs rounded-lg shadow-lg p-2">
                          <ul className="ps-0 grid grid-cols-2 gap-2">
                            <li className="flex items-center">
                              <span className="material-icons text-sm mr-1">
                                flight
                              </span>
                              Flight
                            </li>
                            <li className="flex items-center">
                              <span className="material-icons text-sm mr-1">
                                hotel
                              </span>
                              Hotel
                            </li>
                            <li className="flex items-center">
                              <span className="material-icons text-sm mr-1">
                                dir
                              </span>
                              Bus
                            </li>
                            <li className="flex items-center">
                              <span className="material-icons text-sm mr-1">
                                restaurant
                              </span>
                              Meals
                            </li>
                          </ul>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start gap-3 border-b-[1px] border-gray-300">
                <div className="flex flex-col items-start my-2">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Days
                  </span>
                  <p className="text-[13px] text-gray-900 font-semibold">6</p>
                </div>
                <div className="flex flex-col items-start my-2">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Destinations
                  </span>
                  <div className="text-[12px] text-gray-800">
                    <p className="relative group">
                      <span className="text-blue-500 cursor-pointer">
                        1 Country 2 Cities
                      </span>

                      <div className="absolute top-full mt-1 hidden group-hover:block w-40 bg-gray-200 text-gray-800 text-xs rounded-lg shadow-lg p-2">
                        <p>Thailand:</p>
                        <ul className="list-disc pl-4">
                          <li>Pattaya</li>
                          <li>Bangkok</li>
                        </ul>
                      </div>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start my-2">
                  <span className="text-[12px] font-semibold text-gray-600">
                    Destinations
                  </span>
                  <div className="text-[12px] text-gray-800">
                    <p className="relative group">
                      <span className="text-blue-500 cursor-pointer">
                        5 Dates from 6 Cities
                      </span>

                      <div className="absolute top-full mt-1 hidden group-hover:block w-40 bg-gray-200 text-gray-800 text-xs rounded-lg shadow-lg p-2">
                        <p>Thailand:</p>
                        <ul className="list-disc pl-4">
                          <li>Pattaya</li>
                          <li>Bangkok</li>
                        </ul>
                      </div>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col items-start my-2 truncate">
                  <span className="text-[12px] font-semibold text-green-600">
                    Tour Highlights
                  </span>
                  <p className="text-[13px] text-gray-900">
                    Pattaya Tower Speed Shuttle/ Sky Shuttle/ Tower Jumping,
                    Pattaya
                  </p>
                </div>
              </div>

              <div className="flex flex-row border border-gray-300 bg-purple-100 rounded-md p-2 gap-2 flex-grow w-full justify-between items-end ">
                <div>
                  <button
                    type="button"
                    class="text-gray-900 w-full border border-gray-300 bg-white hover:bg-gray-200 focus:ring focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
                  >
                    <i class="fa-regular fa-heart me-2"></i>
                    Wishlist
                  </button>
                </div>
                <div className="flex flex-col items-end w-full">
                  <div className="flex flex-col items-end mb-2">
                    <div>
                      <span className="text-[12px] font-semibold text-gray-600">
                        Starts from
                      </span>{" "}
                      <span className="text-lg font-semibold text-gray-900">
                        ₹75,000
                      </span>
                    </div>
                    <p className="text-[12px] font-semibold text-gray-600">
                      per person on twin sharing
                    </p>
                  </div>
                  <button
                    type="button"
                    class="text-gray-100 border w-full border-gray-300 bg-primary-6000 hover:bg-primary-700 focus:outline-none font-medium rounded-lg text-sm transition-all py-2 text-center inline-flex items-center justify-center group"
                  >
                    View Tour Details
                    <i class="fa-solid fa-arrow-right-long transition-all  ms-3"></i>
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-row items-center justify-center w-full font-semibold text-sm cursor-pointer">
                <i class="fa-regular fa-comments me-2"></i>
                <p className="underline">Talk to Our Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllOffers;
