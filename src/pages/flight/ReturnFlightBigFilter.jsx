import React, { useState, useRef } from "react";
import { Slider, Checkbox } from "antd";
// import "../../flightResult/flightBigFilter.scss";
// import "../../../NewPackagePages/HolidayPackageSearchResult/packageResultFilter.scss";
import { useSelector } from "react-redux";
import {
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  IconTime,
} from "../../utility/flightUtility/timeSvg";

import { formattedPrice } from "../../utility/utils";
import { findAirlineByCode } from "../../utility/flightUtility/BookwarperUtility";
const svgs = [Icon1, Icon2, Icon3, Icon4];
const ReturnFlightBigFilter = ({
  minPrice,
  maxPrice,
  priceRange,

  stopsAirline,
  handleClearAllFilter,
  handleAirlineChange,
  airlines,
  selectedStops,
  selectedStopsReturn,
  selectedTimes,
  handlePriceChange,
  selectedTimesReturn,
  selectedLandingTimes,
  selectedLandingTimesReturn,
  handleStopChange,
  handleStopChangeRetrun,

  handleCheckboxChange,
  setSelectedTimes,
  setSelectedTimesReturn,
  setSelectedLandingTimes,
  setSelectedLandingTimesReturn,
}) => {
  const StopFilter = ({ handleStopChange, stops, selected }) => {
    // console.log(handleStopChange, stops, selected, "handleStopChange");

    return (
      <div className="PackagetagFilters flight-filter-aireline mt-3">
        <p className="font-semibold text-gray-800">Filter By Stop's</p>
        <>
          {stops &&
            Object?.keys(stops)?.map((key, index) => {
              // console.log(stops, "ffffff");
              const isItem = stops?.[key]?.count > 0;
              const price = stops?.[key]?.minPrice;
              const count = stops?.[key]?.count;

              let itemShow = isItem ? (
                <div
                  key={`${key}-${index}`}
                  className="flex justify-between items-center w-full"
                >
                  <Checkbox
                    value={index}
                    className="flex-1 w-full text-gray-800"
                    checked={selected?.includes(index)}
                    onChange={handleStopChange}
                  >
                    {key == "moreThanOneStop" ? "2+ stops" : key}
                  </Checkbox>
                  <div className=" flex  items-center   gap-1 justify-between p-0 !font-medium">
                    <div className="flex">
                      {/* <p className="text-gray-800 text-nowrap text-sm">₹ </p> */}
                      <p className="!font-medium text-gray-800 !text-sm mb-0">
                        {formattedPrice(price)}
                      </p>
                    </div>
                    <p className="p-0 !text-sm !font-medium text-gray-800 mb-0">{`(${count})`}</p>
                  </div>
                </div>
              ) : null;
              return itemShow;
            })}
        </>
      </div>
    );
  };
  const TimeFilter = ({
    title,
    handleTimeChange,
    selected,
    stateUpdater,
    filterKey,
  }) => {
    console.log(selected, title, "handleTimeChange");
    return (
      <div className="mt-3">
        <h2 className="sidebar-title text-base text-gray-800">{title}</h2>

        <div className="flex flex-row w-full gap-2 flex-wrap">
          {/* <span className="checkmark"></span> */}
          {svgs?.map((SvgComponent, index) => {
            let timeValue = IconTime?.[index]?.value;
            let timeSplit = IconTime?.[index]?.value.split("-");
            let exists = selected.some((item) => {
              return item[0] == timeSplit[0] && item[1] == timeSplit[1];
            });

            return (
              <label
                key={`${title}-${index}`}
                className={`flex flex-1 min-w-[100px] flex-col justify-between items-center gap-2 p-1 border-2 hover:text-primary-700 rounded-lg cursor-pointer transition-all hover:border-primary-6000 group ${
                  exists
                    ? "border-primary-6000 text-primary-6000"
                    : "border-gray-200 text-gray-600"
                }`}
                onClick={(e) => handleTimeChange(e, stateUpdater, filterKey)}
              >
                <input
                  type="checkbox"
                  onChange={(e) => handleTimeChange(e, stateUpdater, filterKey)}
                  value={IconTime?.[index]?.value}
                  name="departTime"
                  checked={exists}
                  className="hidden"
                />
                <span
                  className={`checkedSVG pe-2 transition-all group-hover:text-primary-6000 ${
                    exists ? "text-primary-6000" : "text-gray-800"
                  }`}
                >
                  <SvgComponent />
                </span>
                <span className="text-[12px]">{IconTime?.[index]?.title}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };
  const AirlineFilter = () => {
    const Airlines = stopsAirline?.Airlines;
    return (
      <div className="flight-filter-aireline mt-3">
        <p className=" text-gray-800">Filter By Airlines</p>
        <div className="flight-filter-aireline-item flex flex-col gap-2 ">
          {Airlines &&
            Object?.keys(Airlines)?.map((key, index) => {
              const Price = Airlines?.[key]?.minPrice;

              return (
                <div
                  key={`${key}+${index}`}
                  className="w-full flex-1 flex justify-between items-center"
                >
                  <Checkbox
                    key={`Airlines-${index}`}
                    value={key}
                    className="w-full flex items-center text-gray-800 "
                    checked={airlines.includes(key)}
                    onChange={handleAirlineChange}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "0px",
                        padding: "0px",
                        gap: "5px",
                      }}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${key}.png`}
                        alt="flight"
                        style={{ borderRadius: "8px" }}
                        width={22}
                        height={22}
                      />
                      <p
                        className="text-gray-800 mb-0"
                        style={{
                          margin: "0px !important",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {findAirlineByCode(key)?.airlineName}
                      </p>
                    </div>
                  </Checkbox>
                  <div className=" flex flex-1 items-center w-[70px] min-w-[50px] gap-1">
                    {/* <p className="text-gray-700 text-sm text-nowrap ">₹ </p> */}
                    <p className="flex-1 text-gray-800 mb-0 text-sm ">
                      {formattedPrice(Price)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  return (
    <div className=" max-h-[74vh] overflow-y-scroll  top-28 sticky border-1 border-gray-300 bg-white p-3  ">
      <div className="holidayFilterClear flex justify-between items-center">
        <h5
          className=" text-gray-800 cursor-pointer"
          // onClick={handleClearFilters}
        >
          Flight Filters
        </h5>
        <button
          onClick={() => handleClearAllFilter("All")}
          className="text-primary-6000 hover:text-primary-500 text-sm"
        >
          Clear All
        </button>
      </div>
      <div className="holidayFilterSlider flight-filter-aireline mt-3">
        <p className=" text-gray-800">Filter By Price</p>
        <Slider
          range
          step={400}
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={handlePriceChange}
        />

        <div className="d-flex flex-row justify-content-between align-items-center ">
          <span className="text-gray-800 text-sm font-medium">
            {formattedPrice(minPrice)}
          </span>
          <span className="text-gray-800 text-sm font-medium">
            {formattedPrice(maxPrice)}
          </span>
        </div>
      </div>

      <StopFilter
        handleStopChange={handleStopChange}
        stops={stopsAirline?.JourneyStopes}
        selected={selectedStops}
      />
      <TimeFilter
        title={"Departure Time"}
        // handleTimeChange={handleTimeChange}
        handleTimeChange={handleCheckboxChange}
        selected={selectedTimes}
        stateUpdater={setSelectedTimes}
        filterKey={"selectedTimes"}
      />
      <TimeFilter
        title={"Arrival Time"}
        // handleTimeChange={handleLandingTimeChange}
        handleTimeChange={handleCheckboxChange}
        selected={selectedLandingTimes}
        stateUpdater={setSelectedLandingTimes}
        filterKey={"selectedLandingTimes"}
      />
      <StopFilter
        handleStopChange={handleStopChangeRetrun}
        stops={stopsAirline?.ReturnStopes}
        selected={selectedStopsReturn}
      />

      <TimeFilter
        title={"Departure Time"}
        // handleTimeChange={handleTimeChangeReturn}
        handleTimeChange={handleCheckboxChange}
        selected={selectedTimesReturn}
        stateUpdater={setSelectedTimesReturn}
        filterKey={"selectedTimesReturn"}
      />
      <TimeFilter
        title={"Arrival Time"}
        // handleTimeChange={handleLandingTimeChangeReturn}
        handleTimeChange={handleCheckboxChange}
        selected={selectedLandingTimesReturn}
        stateUpdater={setSelectedLandingTimesReturn}
        filterKey={"selectedLandingTimesReturn"}
      />
      <AirlineFilter />
    </div>
  );
};

export default ReturnFlightBigFilter;
