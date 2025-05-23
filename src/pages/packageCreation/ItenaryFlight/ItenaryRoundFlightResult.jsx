import React, { useState, useEffect } from "react";
import {
  quoteAction,
  ruleAction,
  quoteActionReturn,
  ruleActionReturn,
  resetAllFareData,
} from "../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Divider from "@mui/material/Divider";
import { swalModal } from "../../../utility/swal";
import { setSelectedFlightRequest } from "../../../Redux/Itenary/itenary";
import {
  Plane,
  Clock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ArrowRight,
  X,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Check,
  CircleDot,
} from "lucide-react";

const ItenaryRoundFlightResult = ({
  closeModal,
  selectedIndex,
  onFlightSelect,
  result,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result?.[0]?.flightMarkup;
  const [loading, setLoading] = useState(false);
  let initialGoFlight;
  let initialReturnFlight;
  let onGoTime;
  let IncomeTime;
  const [ongoFlight, setOngoFlight] = useState(initialGoFlight);
  const [incomeGlight, setIncomeFlight] = useState(initialReturnFlight);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(null);
  const [selectedFlightIndexReturn, setSelectedFlightIndexReturn] =
    useState(null);
  const [goingResult, setGoingResult] = useState([]);
  const [returnResult, setReturnResult] = useState([]);
  const [priceRangeValue, setPriceRangeValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const uniqueData = !result
      ? []
      : result?.[0]?.filter((item, index, array) => {
          const isUnique = !array
            .slice(0, index)
            .some(
              (prevItem) =>
                prevItem.AirlineCode === item.AirlineCode &&
                prevItem.Segments?.[0]?.[prevItem.Segments?.[0].length - 1]
                  ?.Origin?.DepTime ===
                  item.Segments?.[0]?.[item.Segments?.[0].length - 1]?.Origin
                    ?.DepTime
            );
          return isUnique;
        });

    setGoingResult([[...uniqueData]]);
  }, [result]);

  useEffect(() => {
    const uniqueData = !result
      ? []
      : result?.[1]?.filter((item, index, array) => {
          const isUnique = !array
            .slice(0, index)
            .some(
              (prevItem) =>
                prevItem.AirlineCode === item.AirlineCode &&
                prevItem.Segments?.[0]?.[prevItem.Segments?.[0].length - 1]
                  ?.Origin?.DepTime ===
                  item.Segments?.[0]?.[item.Segments?.[0].length - 1]?.Origin
                    ?.DepTime
            );
          return isUnique;
        });

    setReturnResult([[...uniqueData]]);
  }, [result]);

  const maxPrice = result?.[0]?.reduce((max, item) => {
    return Math.max(max, item?.Fare?.PublishedFare || 0);
  }, 0);
  const minPrice = result?.[0]?.reduce((min, item) => {
    return Math.min(min, item?.Fare?.PublishedFare || Infinity);
  }, Infinity);

  useEffect(() => {
    setPriceRangeValue(maxPrice + 1);
  }, [maxPrice]);

  const handlePriceRangeChange = (event) => {
    setPriceRangeValue(event.target.value);
  };

  const handleFlightSelection = (index) => {
    setSelectedFlightIndex(index);
  };

  const handleFlightSelectionReturn = (index) => {
    setSelectedFlightIndexReturn(index);
  };

  if (result !== undefined) {
    initialGoFlight = result?.[0]?.[0];
    initialReturnFlight = result?.[1]?.[0];
    onGoTime = result?.[0]?.[0]?.Segments?.[0]?.[0]?.Destination?.ArrTime;
    IncomeTime = result?.[1]?.[0]?.Segments?.[0]?.[0]?.Destination?.ArrTime;
  }

  useEffect(() => {
    setOngoFlight(initialGoFlight);
    setIncomeFlight(initialReturnFlight);
  }, [initialGoFlight, initialReturnFlight]);

  useEffect(() => {
    sessionStorage.setItem(
      "flightDetailsONGo",
      JSON.stringify(initialGoFlight)
    );
    sessionStorage.setItem(
      "flightDetailsIncome",
      JSON.stringify(initialReturnFlight)
    );
  }, []);

  if (result === undefined) {
    return <div></div>;
  }

  const handleIndexId = (ResultIndex) => {
    setOngoFlight(ResultIndex);
  };

  const handleIndexIdreturn = (ResultIndex) => {
    setIncomeFlight(ResultIndex);
  };

  const handleFareRuleAndQuote = async () => {
    const payloadGoing = ongoFlight;
    const payloadReturn = incomeGlight;
    const newPayload = [
      {
        payloadGoing: payloadGoing,
        payloadReturn: payloadReturn,
      },
    ];

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

  const filteredData = goingResult?.[0]?.filter((item) => {
    const segmentLength = item?.Segments?.[0].length;
    const depTime = new Date(item?.Segments?.[0]?.[0]?.Origin?.DepTime);
    const hour = depTime.getHours();
    const ArrTime = new Date(
      item?.Segments?.[0]?.[segmentLength - 1]?.Destination?.ArrTime
    );
    const hourArr = ArrTime.getHours();
    const airlineName = item?.Segments?.[0]?.[0]?.Airline?.AirlineName;

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

        default:
          return false;
      }
    });
    const priceInRange = item?.Fare?.PublishedFare <= priceRangeValue;
    return categoryFilters.every((filter) => filter) && priceInRange;
  });

  const filteredDatareturn = returnResult?.[0]?.filter((item) => {
    const segmentLength = item?.Segments?.[0]?.length;
    const depTime = new Date(item?.Segments?.[0]?.[0]?.Origin?.DepTime);
    const hour = depTime.getHours();
    const ArrTime = new Date(
      item?.Segments?.[0]?.[segmentLength - 1]?.Destination?.ArrTime
    );
    const hourArr = ArrTime.getHours();
    const airlineName = item?.Segments?.[0]?.[0]?.Airline?.AirlineName;

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

        default:
          return false;
      }
    });
    const priceInRange = item?.Fare?.PublishedFare <= priceRangeValue;
    return categoryFilters.every((filter) => filter) && priceInRange;
  });

  const arrSegmentLength = result?.[0]?.[0]?.Segments?.[0]?.length;

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          <Filter size={20} />
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${
              showFilters ? "block" : "hidden"
            } lg:block bg-white rounded-lg shadow-md p-4 h-fit sticky top-4`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Clear Filter */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={handleRadioChange}
                    value="All"
                    name="test"
                    checked={selectedCategory.includes("test:All")}
                    className="mr-2"
                  />
                  <span
                    className={`${
                      selectedCategory.length > 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    Clear All Filters
                  </span>
                </label>
              </div>

              {/* Stops */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center text-base">
                  <Plane className="mr-2" size={16} /> Suggested for you
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={handleRadioChange}
                      value="1"
                      name="stop"
                      checked={selectedCategory.includes("stop:1")}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-700">Non Stop</span>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={handleRadioChange}
                      value="2"
                      name="stop"
                      checked={selectedCategory.includes("stop:2")}
                      className="mr-2"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-700">One Stop</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center text-base">
                  <span className="mr-2">₹</span> Price Range
                </h3>
                <input
                  type="range"
                  min={minPrice + 1}
                  max={maxPrice + 1}
                  step="1000"
                  value={priceRangeValue}
                  onChange={handlePriceRangeChange}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{minPrice.toFixed(0)}</span>
                  <span>₹{priceRangeValue.toFixed(0)}</span>
                  <span>₹{maxPrice.toFixed(0)}</span>
                </div>
              </div>

              {/* Departure Flight */}
              <div>
                <h3 className="font-semibold text-blue-600 mb-2 text-base">
                  Going Flight
                </h3>

                {/* Departure Times */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sunrise className="mr-2" size={16} />
                    Departure from{" "}
                    {
                      result?.[0]?.[0]?.Segments?.[0]?.[0]?.Origin?.Airport
                        ?.CityName
                    }
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        value: "before6AM",
                        label: "Before 6 AM",
                        icon: <Moon size={16} className="mr-2" />,
                      },
                      {
                        value: "6AMto12PM",
                        label: "6 AM - 12 PM",
                        icon: <Sunrise size={16} className="mr-2" />,
                      },
                      {
                        value: "12PMto6PM",
                        label: "12 PM - 6 PM",
                        icon: <Sun size={16} className="mr-2" />,
                      },
                      {
                        value: "after6PM",
                        label: "After 6 PM",
                        icon: <Sunset size={16} className="mr-2" />,
                      },
                    ].map((time) => (
                      <label
                        key={time.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value={time.value}
                          name="timeDepart"
                          checked={selectedCategory.includes(
                            `timeDepart:${time.value}`
                          )}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {time.icon}
                          <span className="text-gray-700">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Arrival Times */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sunset className="mr-2" size={16} />
                    Arrival at{" "}
                    {
                      result?.[0]?.[0]?.Segments?.[0]?.[arrSegmentLength - 1]
                        ?.Destination?.Airport?.CityName
                    }
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        value: "ARRbefore6AM",
                        label: "Before 6 AM",
                        icon: <Moon size={16} className="mr-2" />,
                      },
                      {
                        value: "ARR6AMto12PM",
                        label: "6 AM - 12 PM",
                        icon: <Sunrise size={16} className="mr-2" />,
                      },
                      {
                        value: "ARR12PMto6PM",
                        label: "12 PM - 6 PM",
                        icon: <Sun size={16} className="mr-2" />,
                      },
                      {
                        value: "ARRafter6PM",
                        label: "After 6 PM",
                        icon: <Sunset size={16} className="mr-2" />,
                      },
                    ].map((time) => (
                      <label
                        key={time.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value={time.value}
                          name="timeArrival"
                          checked={selectedCategory.includes(
                            `timeArrival:${time.value}`
                          )}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {time.icon}
                          <span className="text-gray-700">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Return Flight */}
              <div>
                <h3 className="font-semibold text-blue-600 mb-2 text-base">
                  Return Flight
                </h3>

                {/* Departure Times */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sunrise className="mr-2" size={16} />
                    Departure from{" "}
                    {
                      result?.[1]?.[0]?.Segments?.[0]?.[0]?.Origin?.Airport
                        ?.CityName
                    }
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        value: "before6AM",
                        label: "Before 6 AM",
                        icon: <Moon size={16} className="mr-2" />,
                      },
                      {
                        value: "6AMto12PM",
                        label: "6 AM - 12 PM",
                        icon: <Sunrise size={16} className="mr-2" />,
                      },
                      {
                        value: "12PMto6PM",
                        label: "12 PM - 6 PM",
                        icon: <Sun size={16} className="mr-2" />,
                      },
                      {
                        value: "after6PM",
                        label: "After 6 PM",
                        icon: <Sunset size={16} className="mr-2" />,
                      },
                    ].map((time) => (
                      <label
                        key={time.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value={time.value}
                          name="timeDepart"
                          checked={selectedCategory.includes(
                            `timeDepart:${time.value}`
                          )}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {time.icon}
                          <span className="text-gray-700">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Arrival Times */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Sunset className="mr-2" size={16} />
                    Arrival at{" "}
                    {
                      result?.[1]?.[0]?.Segments?.[0]?.[arrSegmentLength - 1]
                        ?.Destination?.Airport?.CityName
                    }
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        value: "ARRbefore6AM",
                        label: "Before 6 AM",
                        icon: <Moon size={16} className="mr-2" />,
                      },
                      {
                        value: "ARR6AMto12PM",
                        label: "6 AM - 12 PM",
                        icon: <Sunrise size={16} className="mr-2" />,
                      },
                      {
                        value: "ARR12PMto6PM",
                        label: "12 PM - 6 PM",
                        icon: <Sun size={16} className="mr-2" />,
                      },
                      {
                        value: "ARRafter6PM",
                        label: "After 6 PM",
                        icon: <Sunset size={16} className="mr-2" />,
                      },
                    ].map((time) => (
                      <label
                        key={time.value}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          onChange={handleRadioChange}
                          value={time.value}
                          name="timeArrival"
                          checked={selectedCategory.includes(
                            `timeArrival:${time.value}`
                          )}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {time.icon}
                          <span className="text-gray-700">{time.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Airlines */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Plane className="mr-2" size={16} /> Airlines
                </h3>
                <div className="space-y-2">
                  {[
                    ...new Set(
                      result?.[0]?.map(
                        (item) =>
                          `${item?.Segments?.[0]?.[0]?.Airline?.AirlineName}, ${item?.Segments[0][0]?.Airline?.AirlineCode}`
                      )
                    ),
                  ].map((airline, index) => (
                    <label
                      key={index}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        onChange={handleRadioChange}
                        value={airline.split(",")[0]}
                        name="flightname"
                        checked={selectedCategory.includes(
                          `flightname:${airline.split(",")[0]}`
                        )}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        <img
                          src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${airline
                            .split(",")[1]
                            .trim()}.png`}
                          alt="flight"
                          className="w-6 h-6 mr-2"
                        />
                        <span className="text-gray-700">
                          {airline.split(",")[0]}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {/* Departure Flights */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-3">
                  <h2 className="font-bold text-lg flex items-center">
                    <Plane className="mr-2" size={18} /> Departure Flights
                  </h2>
                  <p className="text-sm opacity-90">
                    {
                      result?.[0]?.[0]?.Segments?.[0]?.[0]?.Origin?.Airport
                        ?.CityName
                    }{" "}
                    to{" "}
                    {
                      result?.[0]?.[0]?.Segments?.[0]?.[arrSegmentLength - 1]
                        ?.Destination?.Airport?.CityName
                    }
                  </p>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-12 text-xs font-medium text-gray-500 border-b pb-2 mb-2">
                    <div className="col-span-3">Airline</div>
                    <div className="col-span-3">Departure</div>
                    <div className="col-span-3">Duration</div>
                    <div className="col-span-2">Arrival</div>
                    <div className="col-span-1">Price</div>
                  </div>

                  {filteredData?.map((item, index) => {
                    const isSelected = selectedFlightIndex === index;
                    const duration = `${Math.floor(
                      item?.Segments?.[0]?.[0]?.Duration / 60
                    )}h ${item?.Segments?.[0]?.[0]?.Duration % 60}m`;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          handleIndexId(item);
                          handleFlightSelection(index);
                        }}
                        className={`border rounded-lg mb-2 p-3 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="grid grid-cols-12 items-center">
                          {/* Airline */}
                          <div className="col-span-3 flex items-center flex-col r">
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.ValidatingAirline}.png`}
                              alt="flight"
                              className="w-8 h-8 mr-2"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {item?.Segments?.[0]?.[0]?.Airline?.AirlineName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item?.Segments?.[0]?.[0]?.Airline?.AirlineCode}
                                {
                                  item?.Segments?.[0]?.[0]?.Airline
                                    ?.FlightNumber
                                }
                              </p>
                            </div>
                          </div>

                          {/* Departure */}
                          <div className="col-span-2">
                            <p className="font-medium">
                              {dayjs(
                                item?.Segments?.[0]?.[0]?.Origin?.DepTime
                              ).format("h:mm A")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(
                                item?.Segments?.[0]?.[0]?.Origin?.DepTime
                              ).format("DD MMM")}
                            </p>
                            <p className="text-xs">
                              {
                                item?.Segments?.[0]?.[0]?.Origin?.Airport
                                  ?.CityCode
                              }
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="col-span-3 flex flex-col items-center">
                            <p className="text-sm">{duration}</p>
                            <div className="flex items-center w-full my-1">
                              <div className="border-t border-gray-300 flex-grow"></div>
                              <div className="mx-1 text-xs">
                                {item?.Segments?.[0].length > 1
                                  ? `${item?.Segments?.[0].length - 1} stop`
                                  : "Non-stop"}
                              </div>
                              <div className="border-t border-gray-300 flex-grow"></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {item?.Segments?.[0]?.[0]?.NoOfSeatAvailable}{" "}
                              seats left
                            </p>
                          </div>

                          {/* Arrival */}
                          <div className="col-span-2">
                            <p className="font-medium">
                              {dayjs(
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.ArrTime
                              ).format("h:mm A")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.ArrTime
                              ).format("DD MMM")}
                            </p>
                            <p className="text-xs">
                              {
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.Airport?.CityCode
                              }
                            </p>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-right">
                            <p className="font-bold text-blue-600 text-nowrap">
                              ₹{item?.Fare?.PublishedFare.toFixed(0)}
                            </p>
                            <div className="flex justify-end mt-1">
                              {isSelected ? (
                                <CircleDot
                                  className="text-blue-600"
                                  size={16}
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Return Flights */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-3">
                  <h2 className="font-bold text-lg flex items-center">
                    <Plane className="mr-2" size={18} /> Return Flights
                  </h2>
                  <p className="text-sm opacity-90">
                    {
                      result?.[1]?.[0]?.Segments?.[0]?.[0]?.Origin?.Airport
                        ?.CityName
                    }{" "}
                    to{" "}
                    {
                      result?.[1]?.[0]?.Segments?.[0]?.[arrSegmentLength - 1]
                        ?.Destination?.Airport?.CityName
                    }
                  </p>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-12 text-xs font-medium text-gray-500 border-b pb-2 mb-2">
                    <div className="col-span-3">Airline</div>
                    <div className="col-span-3">Departure</div>
                    <div className="col-span-3">Duration</div>
                    <div className="col-span-2">Arrival</div>
                    <div className="col-span-1">Price</div>
                  </div>

                  {filteredDatareturn?.map((item, index) => {
                    const isSelected = selectedFlightIndexReturn === index;
                    const duration = `${Math.floor(
                      item?.Segments?.[0]?.[0]?.Duration / 60
                    )}h ${item?.Segments?.[0]?.[0]?.Duration % 60}m`;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          handleIndexIdreturn(item);
                          handleFlightSelectionReturn(index);
                        }}
                        className={`border rounded-lg mb-2 p-3 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="grid grid-cols-12 items-center">
                          {/* Airline */}
                          <div className="col-span-3 flex items-center flex-col">
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.ValidatingAirline}.png`}
                              alt="flight"
                              className="w-8 h-8 mr-2"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {item?.Segments?.[0]?.[0]?.Airline?.AirlineName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item?.Segments?.[0]?.[0]?.Airline?.AirlineCode}
                                {
                                  item?.Segments?.[0]?.[0]?.Airline
                                    ?.FlightNumber
                                }
                              </p>
                            </div>
                          </div>

                          {/* Departure */}
                          <div className="col-span-2">
                            <p className="font-medium">
                              {dayjs(
                                item?.Segments?.[0]?.[0]?.Origin?.DepTime
                              ).format("h:mm A")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(
                                item?.Segments?.[0]?.[0]?.Origin?.DepTime
                              ).format("DD MMM")}
                            </p>
                            <p className="text-xs">
                              {
                                item?.Segments?.[0]?.[0]?.Origin?.Airport
                                  ?.CityCode
                              }
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="col-span-3 flex flex-col items-center">
                            <p className="text-sm">{duration}</p>
                            <div className="flex items-center w-full my-1">
                              <div className="border-t border-gray-300 flex-grow"></div>
                              <div className="mx-1 text-xs">
                                {item?.Segments?.[0].length > 1
                                  ? `${item?.Segments?.[0].length - 1} stop`
                                  : "Non-stop"}
                              </div>
                              <div className="border-t border-gray-300 flex-grow"></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {item?.Segments?.[0]?.[0]?.NoOfSeatAvailable}{" "}
                              seats left
                            </p>
                          </div>

                          {/* Arrival */}
                          <div className="col-span-2">
                            <p className="font-medium">
                              {dayjs(
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.ArrTime
                              ).format("h:mm A")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {dayjs(
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.ArrTime
                              ).format("DD MMM")}
                            </p>
                            <p className="text-xs">
                              {
                                item?.Segments?.[0]?.[
                                  item?.Segments?.[0].length - 1
                                ]?.Destination?.Airport?.CityCode
                              }
                            </p>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-right">
                            <p className="font-bold text-blue-600 text-nowrap">
                              ₹{item?.Fare?.PublishedFare.toFixed(0)}
                            </p>
                            <div className="flex justify-end mt-1">
                              {isSelected ? (
                                <CircleDot
                                  className="text-blue-600"
                                  size={16}
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isNaN(
        Number(ongoFlight?.Fare?.PublishedFare) +
          Number(incomeGlight?.Fare?.PublishedFare)
      ) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 py-3">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Departure Flight Summary */}
              <div className="flex-1 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${ongoFlight?.ValidatingAirline}.png`}
                      alt="flight"
                      className="w-8 h-8"
                    />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {ongoFlight?.Segments?.[0]?.[0]?.Airline?.AirlineName}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">
                          {
                            ongoFlight?.Segments?.[0]?.[0]?.Origin?.Airport
                              ?.CityCode
                          }
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                        <span className="text-xs font-medium">
                          {
                            ongoFlight?.Segments?.[0]?.[
                              ongoFlight?.Segments[0].length - 1
                            ]?.Destination?.Airport?.CityCode
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {dayjs(
                        ongoFlight?.Segments?.[0]?.[0]?.Origin?.DepTime
                      ).format("h:mm A")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dayjs(
                        ongoFlight?.Segments?.[0]?.[0]?.Origin?.DepTime
                      ).format("DD MMM")}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-blue-600">
                      ₹{ongoFlight?.Fare?.PublishedFare.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Flight Summary */}
              <div className="flex-1 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${incomeGlight?.ValidatingAirline}.png`}
                      alt="flight"
                      className="w-8 h-8"
                    />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {incomeGlight?.Segments?.[0]?.[0]?.Airline?.AirlineName}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">
                          {
                            incomeGlight?.Segments?.[0]?.[0]?.Origin?.Airport
                              ?.CityCode
                          }
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-500" />
                        <span className="text-xs font-medium">
                          {
                            incomeGlight?.Segments?.[0]?.[
                              incomeGlight?.Segments?.[0].length - 1
                            ]?.Destination?.Airport?.CityCode
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {dayjs(
                        incomeGlight?.Segments?.[0]?.[0]?.Origin?.DepTime
                      ).format("h:mm A")}
                    </p>
                    <p className="text-xs text-gray-600">
                      {dayjs(
                        incomeGlight?.Segments?.[0]?.[0]?.Origin?.DepTime
                      ).format("DD MMM")}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-blue-600">
                      ₹{incomeGlight?.Fare?.PublishedFare.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total and Select Button */}
              <div className="w-full md:w-auto">
                <div className="flex flex-col items-center md:items-end">
                  <p className="text-lg font-bold text-blue-600">
                    ₹
                    {(
                      Number(ongoFlight?.Fare?.PublishedFare) +
                      Number(incomeGlight?.Fare?.PublishedFare)
                    ).toFixed(0)}
                  </p>
                  <button
                    onClick={handleFareRuleAndQuote}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Select Flights
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItenaryRoundFlightResult;
