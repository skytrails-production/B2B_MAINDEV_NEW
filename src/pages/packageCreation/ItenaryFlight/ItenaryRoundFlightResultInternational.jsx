import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  Plane,
  Clock,
  Sun,
  Moon,
  SunMoon,
  Sunrise,
  Sunset,
  Filter,
  X,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Luggage,
  User,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  quoteAction,
  resetAllFareData,
  ruleAction,
} from "../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { clearPassengersReducer } from "../../../Redux/Passengers/passenger";

const variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const ItenaryRoundFlightResultInternational = ({
  closeModal,
  selectedIndex,
  onFlightSelect,
  result,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.flightMarkup;
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);
  const [priceRangeValue, setPriceRangeValue] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({
    stops: true,
    price: true,
    departureGoing: true,
    arrivalGoing: true,
    departureReturn: true,
    arrivalReturn: true,
    airlines: true,
  });

  let statusRule = reducerState?.flightFare?.isLoadingRuleDone || false;
  let statusQuote = reducerState?.flightFare?.isLoadingQuoteDone || false;

  useEffect(() => {
    dispatch(resetAllFareData());
    dispatch(clearPassengersReducer());
  }, []);

  const maxPrice = result?.[0]?.reduce((max, item) => {
    return Math.max(max, item?.Fare?.PublishedFare || 0);
  }, 0);
  const minPrice = result?.[0]?.reduce((min, item) => {
    return Math.min(min, item?.Fare?.PublishedFare || Infinity);
  }, Infinity);

  const handlePriceRangeChange = (event) => {
    setPriceRangeValue(event.target.value);
  };

  useEffect(() => {
    setPriceRangeValue(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    if (statusQuote && statusRule) {
      setLoading(false);
    }
  }, [statusQuote, statusRule]);

  const handleFLightSelectForBook = (item) => {
    const newPayload = {
      payloadReturnInternational: item,
    };
    onFlightSelect(newPayload);
    closeModal();
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    const radioGroupName = event.target.name;

    if (selectedValue === "All") {
      setSelectedCategory([]);
      document.querySelectorAll('input[type="checkbox"]').forEach((radio) => {
        radio.checked = false;
      });
      return;
    }

    setSelectedCategory((prevSelectedCategory) => {
      let updatedCategory = [...prevSelectedCategory];
      const isValueSelected = updatedCategory.some(
        (category) => category === `${radioGroupName}:${selectedValue}`
      );
      updatedCategory = isValueSelected
        ? updatedCategory.filter(
            (category) => category !== `${radioGroupName}:${selectedValue}`
          )
        : [
            ...updatedCategory.filter(
              (category) => !category.startsWith(`${radioGroupName}:`)
            ),
            `${radioGroupName}:${selectedValue}`,
          ];

      return updatedCategory;
    });
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    if (!result) {
      navigate("/itenaryresult");
    }
  }, []);

  if (!result) {
    return null;
  }

  const filteredData = result[0]?.filter((item) => {
    const segmentLength = item?.Segments?.[0].length;
    const depTime = new Date(item?.Segments?.[0][0]?.Origin?.DepTime);
    const hour = depTime.getHours();
    const ArrTime = new Date(
      item?.Segments?.[0][segmentLength - 1]?.Destination?.ArrTime
    );
    const hourArr = ArrTime.getHours();
    const airlineName = item?.Segments?.[0][0]?.Airline?.AirlineName;
    const depTimeReturn = new Date(
      item?.Segments?.[item?.Segments?.length - 1][0]?.Origin?.DepTime
    );
    const hourReturn = depTimeReturn.getHours();
    const ArrTimeReturn = new Date(
      item?.Segments?.[item?.Segments?.length - 1][
        segmentLength - 1
      ]?.Destination?.ArrTime
    );
    const hourArrReturn = ArrTimeReturn.getHours();

    const categoryFilters = selectedCategory.map((category) => {
      const [groupName, value] = category.split(":");
      switch (groupName) {
        case "stop":
          switch (value) {
            case "1":
              return segmentLength === 1;
            case "2":
              return segmentLength === 2;
          }

        case "flightname":
          return airlineName === value;

        case "timeDepart":
          switch (value) {
            case "before6AM":
              return hour < 6;
            case "6AMto12PM":
              return hour >= 6 && hour < 12;
            case "12PMto6PM":
              return hour >= 12 && hour < 18;
            case "after6PM":
              return hour >= 18;
          }

        case "timeArrival":
          switch (value) {
            case "ARRbefore6AM":
              return hourArr < 6;
            case "ARR6AMto12PM":
              return hourArr >= 6 && hourArr < 12;
            case "ARR12PMto6PM":
              return hourArr >= 12 && hourArr < 18;
            case "ARRafter6PM":
              return hourArr >= 18;
          }
        case "timeDepartReturn":
          switch (value) {
            case "before6AMReturn":
              return hourReturn < 6;
            case "6AMto12PMReturn":
              return hourReturn >= 6 && hourReturn < 12;
            case "12PMto6PMReturn":
              return hourReturn >= 12 && hourReturn < 18;
            case "after6PMReturn":
              return hourReturn >= 18;
          }

        case "timeArrivalReturn":
          switch (value) {
            case "ARRbefore6AMReturn":
              return hourArrReturn < 6;
            case "ARR6AMto12PMReturn":
              return hourArrReturn >= 6 && hourArrReturn < 12;
            case "ARR12PMto6PMReturn":
              return hourArrReturn >= 12 && hourArrReturn < 18;
            case "ARRafter6PMReturn":
              return hourArrReturn >= 18;
          }

        default:
          return false;
      }
    });
    const priceInRange = item?.Fare?.PublishedFare <= priceRangeValue;
    return categoryFilters.every((filter) => filter) && priceInRange;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const arrSegmentLength = result?.[0]?.[0]?.Segments?.[0]?.length;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-fluid mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter size={18} /> Filters
                  </h2>
                  {selectedCategory.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategory([]);
                        document
                          .querySelectorAll('input[type="checkbox"]')
                          .forEach((radio) => {
                            radio.checked = false;
                          });
                      }}
                      className="text-sm flex items-center gap-1 hover:underline"
                    >
                      <X size={14} /> Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-6">
                {/* Stops Filter */}
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilterSection("stops")}
                  >
                    <h3 className="font-medium text-gray-700">Stops</h3>
                    {expandedFilters.stops ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </div>
                  {expandedFilters.stops && (
                    <div className="space-y-2 pl-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value="1"
                          name="stop"
                          checked={selectedCategory.includes("stop:1")}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-2">
                          <Plane size={16} className="text-blue-500" />
                          Non-stop
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value="2"
                          name="stop"
                          checked={selectedCategory.includes("stop:2")}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-500" />
                          One stop
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilterSection("price")}
                  >
                    <h3 className="font-medium text-gray-700">Price Range</h3>
                    {expandedFilters.price ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </div>
                  {expandedFilters.price && (
                    <div className="pl-2">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step="1000"
                        value={priceRangeValue}
                        onChange={handlePriceRangeChange}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>₹{minPrice.toLocaleString()}</span>
                        <span>₹{priceRangeValue.toLocaleString()}</span>
                        <span>₹{maxPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Going Flight Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-600 border-b border-blue-100 pb-2">
                    Going Flight
                  </h3>

                  {/* Departure Time */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection("departureGoing")}
                    >
                      <h3 className="font-medium text-gray-700">
                        Departure from{" "}
                        {result.length > 0 &&
                          result?.[0][0]?.Segments?.[0][0]?.Origin?.Airport
                            ?.CityName}
                      </h3>
                      {expandedFilters.departureGoing ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>
                    {expandedFilters.departureGoing && (
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="before6AM"
                            name="timeDepart"
                            checked={selectedCategory.includes(
                              "timeDepart:before6AM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Moon size={14} className="text-blue-500" />
                            Before 6 AM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="6AMto12PM"
                            name="timeDepart"
                            checked={selectedCategory.includes(
                              "timeDepart:6AMto12PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunrise size={14} className="text-blue-500" />6 AM
                            - 12 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="12PMto6PM"
                            name="timeDepart"
                            checked={selectedCategory.includes(
                              "timeDepart:12PMto6PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sun size={14} className="text-blue-500" />
                            12 PM - 6 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="after6PM"
                            name="timeDepart"
                            checked={selectedCategory.includes(
                              "timeDepart:after6PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunset size={14} className="text-blue-500" />
                            After 6 PM
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Arrival Time */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection("arrivalGoing")}
                    >
                      <h3 className="font-medium text-gray-700">
                        Arrival at{" "}
                        {result.length > 0 &&
                          result?.[0][0]?.Segments?.[0][arrSegmentLength - 1]
                            ?.Destination?.Airport?.CityName}
                      </h3>
                      {expandedFilters.arrivalGoing ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>
                    {expandedFilters.arrivalGoing && (
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARRbefore6AM"
                            name="timeArrival"
                            checked={selectedCategory.includes(
                              "timeArrival:ARRbefore6AM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Moon size={14} className="text-blue-500" />
                            Before 6 AM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARR6AMto12PM"
                            name="timeArrival"
                            checked={selectedCategory.includes(
                              "timeArrival:ARR6AMto12PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunrise size={14} className="text-blue-500" />6 AM
                            - 12 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARR12PMto6PM"
                            name="timeArrival"
                            checked={selectedCategory.includes(
                              "timeArrival:ARR12PMto6PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sun size={14} className="text-blue-500" />
                            12 PM - 6 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARRafter6PM"
                            name="timeArrival"
                            checked={selectedCategory.includes(
                              "timeArrival:ARRafter6PM"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunset size={14} className="text-blue-500" />
                            After 6 PM
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Flight Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-600 border-b border-blue-100 pb-2">
                    Return Flight
                  </h3>

                  {/* Departure Time */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection("departureReturn")}
                    >
                      <h3 className="font-medium text-gray-700">
                        Departure from{" "}
                        {result.length > 0 &&
                          result?.[0][0]?.Segments?.[
                            result?.[0][0]?.Segments?.length - 1
                          ][0]?.Origin?.Airport?.CityName}
                      </h3>
                      {expandedFilters.departureReturn ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>
                    {expandedFilters.departureReturn && (
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="before6AMReturn"
                            name="timeDepartReturn"
                            checked={selectedCategory.includes(
                              "timeDepartReturn:before6AMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Moon size={14} className="text-blue-500" />
                            Before 6 AM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="6AMto12PMReturn"
                            name="timeDepartReturn"
                            checked={selectedCategory.includes(
                              "timeDepartReturn:6AMto12PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunrise size={14} className="text-blue-500" />6 AM
                            - 12 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="12PMto6PMReturn"
                            name="timeDepartReturn"
                            checked={selectedCategory.includes(
                              "timeDepartReturn:12PMto6PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sun size={14} className="text-blue-500" />
                            12 PM - 6 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="after6PMReturn"
                            name="timeDepartReturn"
                            checked={selectedCategory.includes(
                              "timeDepartReturn:after6PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunset size={14} className="text-blue-500" />
                            After 6 PM
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Arrival Time */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFilterSection("arrivalReturn")}
                    >
                      <h3 className="font-medium text-gray-700">
                        Arrival at{" "}
                        {result.length > 0 &&
                          result?.[0][0]?.Segments?.[
                            result?.[0][0]?.Segments?.length - 1
                          ][arrSegmentLength - 1]?.Destination?.Airport
                            ?.CityName}
                      </h3>
                      {expandedFilters.arrivalReturn ? (
                        <ChevronUp size={18} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-500" />
                      )}
                    </div>
                    {expandedFilters.arrivalReturn && (
                      <div className="grid grid-cols-2 gap-2 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARRbefore6AMReturn"
                            name="timeArrivalReturn"
                            checked={selectedCategory.includes(
                              "timeArrivalReturn:ARRbefore6AMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Moon size={14} className="text-blue-500" />
                            Before 6 AM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARR6AMto12PMReturn"
                            name="timeArrivalReturn"
                            checked={selectedCategory.includes(
                              "timeArrivalReturn:ARR6AMto12PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunrise size={14} className="text-blue-500" />6 AM
                            - 12 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARR12PMto6PMReturn"
                            name="timeArrivalReturn"
                            checked={selectedCategory.includes(
                              "timeArrivalReturn:ARR12PMto6PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sun size={14} className="text-blue-500" />
                            12 PM - 6 PM
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value="ARRafter6PMReturn"
                            name="timeArrivalReturn"
                            checked={selectedCategory.includes(
                              "timeArrivalReturn:ARRafter6PMReturn"
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-1 text-sm">
                            <Sunset size={14} className="text-blue-500" />
                            After 6 PM
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Airlines Filter */}
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFilterSection("airlines")}
                  >
                    <h3 className="font-medium text-gray-700">Airlines</h3>
                    {expandedFilters.airlines ? (
                      <ChevronUp size={18} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-500" />
                    )}
                  </div>
                  {expandedFilters.airlines && (
                    <div className="space-y-2 pl-2 max-h-60 overflow-y-auto">
                      {[
                        ...new Set(
                          result[0]?.map(
                            (item) =>
                              `${item?.Segments[0][0]?.Airline?.AirlineName}, ${item?.Segments[0][0]?.Airline?.AirlineCode}`
                          )
                        ),
                      ].map((airline, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            onChange={handleRadioChange}
                            value={airline.split(",")[0]}
                            name="flightname"
                            checked={selectedCategory.includes(
                              `flightname:${airline.split(",")[0]}`
                            )}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="flex items-center gap-2">
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${airline
                                .split(",")[1]
                                .trim()}.png`}
                              alt="flight"
                              className="w-6 h-6 object-contain"
                            />
                            {airline.split(",")[0]}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="w-full lg:w-3/4">
            {filteredData.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No flights found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.map((item, index) => {
                  const isSelected = selectedFlightIndex === index;
                  const goingSegment = item?.Segments[0];
                  const returnSegment =
                    item?.Segments[item?.Segments?.length - 1];

                  return (
                    <motion.div
                      key={index}
                      variants={variants}
                      initial="initial"
                      whileInView="animate"
                    >
                      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Flight Header */}
                        <div className="p-4 border-b border-gray-100 bg-blue-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.ValidatingAirline}.png`}
                                alt="airline"
                                className="w-8 h-8 object-contain"
                              />
                              <div>
                                <h3 className="font-medium">
                                  {goingSegment[0]?.Airline?.AirlineName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {goingSegment[0]?.Airline?.AirlineCode}
                                  {goingSegment[0]?.Airline?.FlightNumber}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {dayjs(goingSegment[0]?.Origin?.DepTime).format(
                                  "DD MMM, YY"
                                )}
                              </p>
                              <h3 className="text-xl font-bold text-blue-600">
                                ₹{item?.Fare?.PublishedFare.toLocaleString()}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Flight Details */}
                        <div className="p-4">
                          {/* Going Flight */}
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <h4 className="font-medium text-gray-700">
                                Going Flight
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="text-sm text-gray-500">
                                  {goingSegment[0]?.Origin?.Airport?.CityCode}
                                </p>
                                <h4 className="font-medium">
                                  {dayjs(
                                    goingSegment[0]?.Origin?.DepTime
                                  ).format("h:mm A")}
                                </h4>
                              </div>
                              <div className="flex-1 px-4">
                                <div className="relative">
                                  <div className="h-px bg-gray-300 w-full"></div>
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="bg-white p-1 rounded-full shadow">
                                      <Plane
                                        size={16}
                                        className="text-blue-500 rotate-90"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center mt-1">
                                  <p className="text-xs text-gray-500">
                                    {goingSegment.length > 1
                                      ? `${goingSegment.length - 1} stop via ${
                                          goingSegment[0]?.Destination?.Airport
                                            ?.CityName
                                        }`
                                      : "Non-stop"}
                                  </p>
                                  <p className="text-xs">
                                    {`${Math.floor(
                                      goingSegment[0]?.Duration / 60
                                    )}h ${goingSegment[0]?.Duration % 60}m`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">
                                  {
                                    goingSegment[goingSegment.length - 1]
                                      ?.Destination?.Airport?.CityCode
                                  }
                                </p>
                                <h4 className="font-medium">
                                  {dayjs(
                                    goingSegment[goingSegment.length - 1]
                                      ?.Destination?.ArrTime
                                  ).format("h:mm A")}
                                </h4>
                              </div>
                            </div>
                          </div>

                          {/* Return Flight */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <h4 className="font-medium text-gray-700">
                                Return Flight
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <p className="text-sm text-gray-500">
                                  {returnSegment[0]?.Origin?.Airport?.CityCode}
                                </p>
                                <h4 className="font-medium">
                                  {dayjs(
                                    returnSegment[0]?.Origin?.DepTime
                                  ).format("h:mm A")}
                                </h4>
                              </div>
                              <div className="flex-1 px-4">
                                <div className="relative">
                                  <div className="h-px bg-gray-300 w-full"></div>
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="bg-white p-1 rounded-full shadow">
                                      <Plane
                                        size={16}
                                        className="text-blue-500 rotate-90"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center mt-1">
                                  <p className="text-xs text-gray-500">
                                    {returnSegment.length > 1
                                      ? `${returnSegment.length - 1} stop via ${
                                          returnSegment[0]?.Destination?.Airport
                                            ?.CityName
                                        }`
                                      : "Non-stop"}
                                  </p>
                                  <p className="text-xs">
                                    {`${Math.floor(
                                      returnSegment[0]?.Duration / 60
                                    )}h ${returnSegment[0]?.Duration % 60}m`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-500">
                                  {
                                    returnSegment[returnSegment.length - 1]
                                      ?.Destination?.Airport?.CityCode
                                  }
                                </p>
                                <h4 className="font-medium">
                                  {dayjs(
                                    returnSegment[returnSegment.length - 1]
                                      ?.Destination?.ArrTime
                                  ).format("h:mm A")}
                                </h4>
                              </div>
                            </div>
                          </div>

                          {/* Flight Footer */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <User size={14} />
                              <span>
                                {goingSegment[0]?.NoOfSeatAvailable} seats left
                              </span>
                            </div>
                            <button
                              onClick={() => handleFLightSelectForBook(item)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                              Select Flight <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItenaryRoundFlightResultInternational;
