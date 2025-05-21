import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tab, RadioGroup, Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import flightNoResult from "../../../images/img/flightnoresult.jpg";

const FlightSearchPage = ({ closeModal, selectedIndex, onFlightSelect }) => {
  const reducerState = useSelector((state) => state);
  const results =
    reducerState?.Itenerary?.flightOnewayData?.data?.data?.Response?.Results;
  const [uniqueResults, setUniqueResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState("price");
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const adultCount = queryParams.get("adult");
  const childCount = queryParams.get("child");
  const infantCount = queryParams.get("infant");

  // Filter options
  const filterOptions = {
    stops: [
      { id: "non-stop", name: "Non Stop", value: "1" },
      { id: "one-stop", name: "One Stop", value: "2" },
    ],
    departureTime: [
      { id: "before6am", name: "Before 6 AM", value: "before6AM" },
      { id: "6am-12pm", name: "6 AM - 12 PM", value: "6AMto12PM" },
      { id: "12pm-6pm", name: "12 PM - 6 PM", value: "12PMto6PM" },
      { id: "after6pm", name: "After 6 PM", value: "after6PM" },
    ],
    airlines: [],
  };

  // Extract unique airlines from results
  useEffect(() => {
    if (results?.[0]) {
      const airlines = new Set();
      results[0].forEach((flight) => {
        if (flight.Segments?.[0]?.[0]?.Airline) {
          airlines.add({
            name: flight.Segments[0][0].Airline.AirlineName,
            code: flight.Segments[0][0].Airline.AirlineCode,
          });
        }
      });
      filterOptions.airlines = Array.from(airlines);

      // Set price range
      const prices = results[0].map((f) => f.Fare?.PublishedFare || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);

      // Set unique results
      const uniqueData = results[0].filter((item, index, array) => {
        const isUnique = !array
          .slice(0, index)
          .some(
            (prevItem) =>
              prevItem.AirlineCode === item.AirlineCode &&
              prevItem.Segments?.[0]?.[prevItem.Segments[0].length - 1]?.Origin
                ?.DepTime ===
                item.Segments?.[0]?.[item.Segments[0].length - 1]?.Origin
                  ?.DepTime
          );
        return isUnique;
      });

      setUniqueResults(uniqueData);
      setFilteredResults(uniqueData);
      setIsLoading(false);
    }
  }, [results]);

  // Apply filters
  useEffect(() => {
    if (uniqueResults.length === 0) return;

    let filtered = [...uniqueResults];

    // Apply selected filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((flight) => {
        const segment = flight.Segments?.[0]?.[0];
        const lastSegment =
          flight.Segments?.[0]?.[flight.Segments[0].length - 1];

        return selectedFilters.every((filter) => {
          const [type, value] = filter.split(":");

          switch (type) {
            case "stop":
              return flight.Segments[0].length === parseInt(value);
            case "flightname":
              return segment?.Airline?.AirlineName === value;
            case "timeDepart":
              const depHour = new Date(segment?.Origin?.DepTime).getHours();
              return checkTimeRange(depHour, value);
            case "timeArrival":
              const arrHour = new Date(
                lastSegment?.Destination?.ArrTime
              ).getHours();
              return checkTimeRange(arrHour, value);
            default:
              return true;
          }
        });
      });
    }

    // Apply price range
    filtered = filtered.filter((flight) => {
      const price = flight.Fare?.PublishedFare || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply sorting
    filtered = sortFlights(filtered, sortOption);

    setFilteredResults(filtered);
  }, [uniqueResults, selectedFilters, priceRange, sortOption]);

  const checkTimeRange = (hour, range) => {
    switch (range) {
      case "before6AM":
        return hour < 6;
      case "6AMto12PM":
        return hour >= 6 && hour < 12;
      case "12PMto6PM":
        return hour >= 12 && hour < 18;
      case "after6PM":
        return hour >= 18;
      default:
        return true;
    }
  };

  const sortFlights = (flights, option) => {
    const sorted = [...flights];
    switch (option) {
      case "price":
        return sorted.sort(
          (a, b) => (a.Fare?.PublishedFare || 0) - (b.Fare?.PublishedFare || 0)
        );
      case "duration":
        return sorted.sort(
          (a, b) =>
            (a.Segments[0][0]?.Duration || 0) -
            (b.Segments[0][0]?.Duration || 0)
        );
      case "departure":
        return sorted.sort(
          (a, b) =>
            new Date(a.Segments[0][0]?.Origin?.DepTime) -
            new Date(b.Segments[0][0]?.Origin?.DepTime)
        );
      case "arrival":
        return sorted.sort(
          (a, b) =>
            new Date(
              a.Segments[0][a.Segments[0].length - 1]?.Destination?.ArrTime
            ) -
            new Date(
              b.Segments[0][b.Segments[0].length - 1]?.Destination?.ArrTime
            )
        );
      default:
        return sorted;
    }
  };

  const handleFilterChange = (filterType, value) => {
    const filterKey = `${filterType}:${value}`;
    setSelectedFilters((prev) => {
      if (prev.includes(filterKey)) {
        return prev.filter((f) => f !== filterKey);
      } else {
        return [...prev, filterKey];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    const prices = uniqueResults.map((f) => f.Fare?.PublishedFare || 0);
    setPriceRange([Math.min(...prices), Math.max(...prices)]);
  };

  const handleFlightSelect = (flight) => {
    onFlightSelect({ payloadOneway: flight });
    closeModal();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateTime) => {
    return dayjs(dateTime).format("h:mm A");
  };

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format("DD MMM, YY");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (
    reducerState?.Itenerary?.flightOnewayData?.data?.data?.Response?.Error
      ?.ErrorCode !== 0
  ) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="max-w-md mx-auto">
          <img
            src={flightNoResult}
            alt="No flights found"
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! No flights found
          </h2>
          <p className="text-gray-600 mb-6">
            There were no flights found for this date & route combination
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Modify Search & Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {selectedFilters.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {selectedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFilters.map((filter) => (
                    <div
                      key={filter}
                      className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <span className="mr-1">{filter.split(":")[1]}</span>
                      <button
                        onClick={() =>
                          handleFilterChange(
                            filter.split(":")[0],
                            filter.split(":")[1]
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="divide-y divide-gray-200">
              {/* Price Range Filter */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="px-2">
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Stops Filter */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Stops
                </h4>
                <RadioGroup
                  value={
                    selectedFilters
                      .find((f) => f.startsWith("stop:"))
                      ?.split(":")[1] || ""
                  }
                >
                  <div className="space-y-2">
                    {filterOptions.stops.map((stop) => (
                      <RadioGroup.Option
                        key={stop.id}
                        value={stop.value}
                        onClick={() => handleFilterChange("stop", stop.value)}
                        className={({ checked }) =>
                          `flex cursor-pointer items-center rounded-lg p-2 ${
                            checked ? "bg-blue-50" : "hover:bg-gray-50"
                          }`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div
                              className={`h-4 w-4 rounded-full border ${
                                checked
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {checked && (
                                <CheckIcon className="h-3 w-3 text-white mx-auto" />
                              )}
                            </div>
                            <RadioGroup.Label
                              as="span"
                              className="ml-3 text-sm text-gray-700"
                            >
                              {stop.name}
                            </RadioGroup.Label>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Departure Time Filter */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Departure Time
                </h4>
                <RadioGroup
                  value={
                    selectedFilters
                      .find((f) => f.startsWith("timeDepart:"))
                      ?.split(":")[1] || ""
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.departureTime.map((time) => (
                      <RadioGroup.Option
                        key={time.id}
                        value={time.value}
                        onClick={() =>
                          handleFilterChange("timeDepart", time.value)
                        }
                        className={({ checked }) =>
                          `flex cursor-pointer items-center rounded-lg p-2 ${
                            checked ? "bg-blue-50" : "hover:bg-gray-50"
                          }`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div
                              className={`h-4 w-4 rounded-full border ${
                                checked
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {checked && (
                                <CheckIcon className="h-3 w-3 text-white mx-auto" />
                              )}
                            </div>
                            <RadioGroup.Label
                              as="span"
                              className="ml-2 text-sm text-gray-700"
                            >
                              {time.name}
                            </RadioGroup.Label>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Airlines Filter */}
              {filterOptions.airlines.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Airlines
                  </h4>
                  <div className="space-y-2">
                    {filterOptions.airlines.map((airline) => (
                      <div key={airline.code} className="flex items-center">
                        <input
                          id={`airline-${airline.code}`}
                          type="checkbox"
                          checked={selectedFilters.includes(
                            `flightname:${airline.name}`
                          )}
                          onChange={() =>
                            handleFilterChange("flightname", airline.name)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`airline-${airline.code}`}
                          className="ml-3 text-sm text-gray-700 flex items-center"
                        >
                          <img
                            src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${airline.code}.png`}
                            alt={airline.name}
                            className="h-5 w-5 mr-2"
                          />
                          {airline.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {filteredResults.length} Flights Found
                  </h3>
                  <p className="text-sm text-gray-500">
                    {
                      uniqueResults[0]?.Segments[0][0]?.Origin?.Airport
                        ?.CityName
                    }{" "}
                    to{" "}
                    {
                      uniqueResults[0]?.Segments[0][
                        uniqueResults[0]?.Segments[0].length - 1
                      ]?.Destination?.Airport?.CityName
                    }
                  </p>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <Listbox value={sortOption} onChange={setSortOption}>
                    <div className="relative">
                      <Listbox.Button className="relative w-40 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <span className="block truncate">
                          {sortOption === "price" && "Price (Low to High)"}
                          {sortOption === "duration" && "Duration (Shortest)"}
                          {sortOption === "departure" && "Departure (Earliest)"}
                          {sortOption === "arrival" && "Arrival (Earliest)"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {[
                            { value: "price", label: "Price (Low to High)" },
                            { value: "duration", label: "Duration (Shortest)" },
                            {
                              value: "departure",
                              label: "Departure (Earliest)",
                            },
                            { value: "arrival", label: "Arrival (Earliest)" },
                          ].map((option) => (
                            <Listbox.Option
                              key={option.value}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active
                                    ? "bg-blue-100 text-blue-900"
                                    : "text-gray-900"
                                }`
                              }
                              value={option.value}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>

            {/* Flight Cards */}
            <div className="divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((flight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Airline Info */}
                      <div className="flex items-center md:w-1/5">
                        <img
                          src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${flight.ValidatingAirline}.png`}
                          alt={flight.Segments[0][0]?.Airline?.AirlineName}
                          className="h-10 w-10 mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {flight.Segments[0][0]?.Airline?.AirlineName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {flight.Segments[0][0]?.Airline?.AirlineCode}
                            {flight.Segments[0][0]?.Airline?.FlightNumber}
                          </p>
                        </div>
                      </div>

                      {/* Flight Times */}
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-semibold text-gray-900">
                            {formatTime(flight.Segments[0][0]?.Origin?.DepTime)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.Segments[0][0]?.Origin?.Airport?.CityCode}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(flight.Segments[0][0]?.Origin?.DepTime)}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">
                            {flight.Segments[0].length === 1
                              ? "Non Stop"
                              : `${flight.Segments[0].length - 1} stop${
                                  flight.Segments[0].length > 2 ? "s" : ""
                                }`}
                          </div>
                          <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="bg-white px-2 text-xs text-gray-500">
                                {formatDuration(
                                  flight.Segments[0][0]?.Duration
                                )}
                              </span>
                            </div>
                          </div>
                          {flight.Segments[0].length > 1 && (
                            <div className="text-xs text-gray-400">
                              Via{" "}
                              {
                                flight.Segments[0][0]?.Destination?.Airport
                                  ?.CityName
                              }
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-semibold text-gray-900">
                            {formatTime(
                              flight.Segments[0][flight.Segments[0].length - 1]
                                ?.Destination?.ArrTime
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {
                              flight.Segments[0][flight.Segments[0].length - 1]
                                ?.Destination?.Airport?.CityCode
                            }
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(
                              flight.Segments[0][flight.Segments[0].length - 1]
                                ?.Destination?.ArrTime
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price and Select Button */}
                      <div className="flex flex-col items-end justify-between md:w-1/5">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ₹
                            {(flight.Fare?.PublishedFare || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.Segments[0][0]?.NoOfSeatAvailable || 0}{" "}
                            seats left
                          </div>
                        </div>
                        <button
                          onClick={() => handleFlightSelect(flight)}
                          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                        >
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Special Offer */}
                    {flight.AirlineRemark && (
                      <div className="mt-3 bg-blue-50 text-blue-700 text-sm p-2 rounded-lg">
                        {flight.AirlineRemark}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <img
                    src={flightNoResult}
                    alt="No results"
                    className="mx-auto h-40 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900">
                    No flights match your filters
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
