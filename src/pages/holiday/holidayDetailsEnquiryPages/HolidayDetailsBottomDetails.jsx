import React, { useEffect } from "react";
import "./holidetailsbottomdetails.scss";
import { BedDouble, BookImage, Car, Plane } from "lucide-react";
import HolidayDetTabsSection from "./HolidayDetTabsSection";

const HolidayDetailsBottomDetails = ({
  packageData,
  setIsOpen,
  filterType,
  setFilterType,
}) => {
  // Step 1: Aggregate days for each location

  // Generate filterOptions dynamically based on the data

  const filterOptions = [];
  if (
    packageData?.packageAmount?.some(
      (cat) => cat.packageCategory === "Standard"
    )
  ) {
    filterOptions.push("Standard");
    // setFilterType("Standard");
  }
  if (
    packageData?.packageAmount?.some((cat) => cat.packageCategory === "Deluxe")
  ) {
    filterOptions.push("Deluxe");
    // setFilterType("Deluxe");
  }
  if (
    packageData?.packageAmount?.some((cat) => cat.packageCategory === "Luxury")
  ) {
    filterOptions.push("Luxury");
    // setFilterType("Luxury");
  }

  useEffect(() => {
    // Set the initial filterType only if it is not already set
    if (!filterType) {
      setFilterType(filterOptions?.[0]);
    }
  }, [filterOptions, filterType, setFilterType]);

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const locationCounts =
    packageData?.detailed_ltinerary?.reduce((acc, item) => {
      if (item?.title) {
        acc[item.title.toLowerCase()] =
          (acc[item.title.toLowerCase()] || 0) + 1;
      }
      return acc;
    }, {}) || {};

  const locationData = Object.entries(locationCounts).map(([title, count]) => ({
    title,
    count,
  }));

  const inclusionComponents = {
    hotel: (
      <div className="flex flex-row items-center gap-2">
        <BedDouble className="h-6 w-6 text-purple" />
        <p className="font-semibold text-sm md:text-base">Stay Included</p>
      </div>
    ),
    flight: (
      <div className="flex flex-row items-center gap-2">
        <Plane className="h-6 w-6 text-purple" />

        <p className="font-semibold text-sm md:text-base">Flight Included</p>
      </div>
    ),
    breakfast: (
      <div className="flex flex-row items-center gap-2">
        <BookImage className="h-6 w-6 text-purple" />
        <p className="font-semibold text-sm md:text-base">Breakfast Included</p>
      </div>
    ),
    cab: (
      <div className="flex flex-row items-center gap-2">
        <Car className="h-6 w-6 text-purple" />
        <p className="font-semibold text-sm md:text-base">Transfer Included</p>
      </div>
    ),
  };

  // Filter and render inclusions
  const renderedInclusions = packageData?.inclusions
    ?.filter((item) => Object.values(item)[0] === "true")
    .map((item, index) => {
      const key = Object.keys(item)[0];
      return inclusionComponents[key] ? (
        <React.Fragment key={index}>{inclusionComponents[key]}</React.Fragment>
      ) : null;
    });

  return (
    <>
      <h1 className="text-xl md:text-2xl lg:text-2xl xl:text-2xl font-bold text-gray-900">
        {packageData?.title}
      </h1>

      <div className="flex flex-row mt-4 gap-3 items-center">
        <div>
          <span className="px-2 py-2 text-sm rounded-2xl bg-primary-6000 text-white font-semibold  uppercase">
            {packageData?.days}D/{packageData?.days - 1}N
          </span>
        </div>
        <div className="flex flex-row flex-wrap">
          {locationData.map((location, index) => (
            <div
              key={index}
              className="flex flex-row items-center gap-2 border-r border-gray-300 px-3"
            >
              <p className="text-3xl font-bold text-gray-500">
                {location.count}
              </p>
              <div className="flex flex-col items-start gap-1 text-[10px] leading-none">
                <span>Days in</span>
                <span className="text-black font-semibold">
                  {location.title.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-3 flex flex-row mt-4 justify-between gap-y-3 md:gap-y-0 lg:gap-y-0 xl:gap-y-0 flex-wrap border-y border-gray-300">
        {renderedInclusions}
      </div>

      <div className="flex flex-col mt-4">
        <h2 class="mb-2 text-lg font-semibold text-gray-900 ">Stay Category</h2>
        <div className="flex justify-start space-x-4 pb-4 rounded-md  overflow-auto sm:overflow-hidden sm:overflow-x-scroll">
          {filterOptions.map((type) => (
            <button
              key={type}
              className={`relative px-[1.8rem] py-2 font-semibold text-sm md:text-md lg:text-md xl:text-md ${
                filterType === type
                  ? "  text-indigo-700 shadow-md border-2 border-indigo-700 rounded-md"
                  : "text-gray-500 border-2 rounded-md"
              }`}
              onClick={() => handleFilterClick(type)}
            >
              {type}
              {filterType === type ? (
                <div className="absolute top-0 right-0 px-2 font-thin text-xs bg-primary-6000 text-white rounded-es-md">
                  <i class="fa-solid fa-check"></i>{" "}
                </div>
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col mt-4">
        <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
          Trip Highlights
        </h2>
        <ul class="space-y-1 ps-3 text-gray-700 text-sm list-disc ">
          {packageData?.packageHighLight?.map((item, index) => (
            <li key={index} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <HolidayDetTabsSection
        packageData={packageData}
        setIsOpen={setIsOpen}
        stayType={filterType}
      />
    </>
  );
};

export default HolidayDetailsBottomDetails;
