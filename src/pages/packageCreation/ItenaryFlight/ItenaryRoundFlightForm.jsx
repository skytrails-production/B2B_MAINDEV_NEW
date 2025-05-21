import * as React from "react";
import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecureStorage from "react-secure-storage";
import dayjs from "dayjs";
import { apiURL } from "../../../Constants/constant";
import { ipAction, tokenAction } from "../../../Redux/IP/actionIp";

import {
  returnActionClearPackCreation,
  returnActionPackCreation,
} from "../../../Redux/FlightSearch/returnPackCreation/returnPackCreation";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ItenaryRoundFlightResult from "./ItenaryRoundFlightResult";
import ItenaryRoundFlightResultInternational from "./ItenaryRoundFlightResultInternational";

// From Search Input Component
const FromSearchInput = ({ onItemSelect, placeholder }) => {
  const reducerState = useSelector((state) => state);
  const initialSelectedFromData =
    reducerState?.Itenerary?.flightfromData?.data?.[0];
  const [fromData, setFromData] = useState([]);
  const [searchValue, setSearchValue] = useState(
    initialSelectedFromData?.name || ""
  );
  const [selectedItem, setSelectedItem] = useState(
    initialSelectedFromData || null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialSelectedFromData) {
      setFromData([
        {
          value: initialSelectedFromData._id,
          name: initialSelectedFromData.name,
          code: initialSelectedFromData.code,
          cityCode: initialSelectedFromData.CityCode,
          item: initialSelectedFromData,
        },
      ]);
    }
  }, [initialSelectedFromData]);

  const fetchFromCity = (value) => {
    axios
      .get(`${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${value}`)
      .then((response) => {
        const { data } = response.data;
        const result = data.map((item) => ({
          value: item._id,
          name: item.name,
          code: item.code,
          cityCode: item.CityCode,
          item,
        }));
        setFromData(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length > 1) {
      fetchFromCity(value);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchValue(item.name);
    setIsOpen(false);
    onItemSelect(item);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        From
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
          {fromData.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          ) : (
            fromData.map((item) => (
              <div
                key={item.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectItem(item.item)}
              >
                <div className="font-medium">
                  {item.name} ({item.cityCode})
                </div>
                <div className="text-sm text-gray-500">{item.code}</div>
              </div>
            ))
          )}
        </div>
      )}
      {selectedItem && (
        <p className="text-xs text-gray-500 mt-1">{selectedItem.code}</p>
      )}
    </div>
  );
};

// To Search Input Component
const ToSearchInput = ({ onItemSelect, placeholder }) => {
  const reducerState = useSelector((state) => state);
  const initialSelectedToData =
    reducerState?.Itenerary?.flighttoData?.data?.[0];
  const [toData, setToData] = useState([]);
  const [searchValue, setSearchValue] = useState(
    initialSelectedToData?.name || ""
  );
  const [selectedItem, setSelectedItem] = useState(
    initialSelectedToData || null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialSelectedToData) {
      setToData([
        {
          value: initialSelectedToData._id,
          name: initialSelectedToData.name,
          code: initialSelectedToData.code,
          cityCode: initialSelectedToData.CityCode,
          item: initialSelectedToData,
        },
      ]);
    }
  }, [initialSelectedToData]);

  const fetchToCity = (value) => {
    axios
      .get(`${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${value}`)
      .then((response) => {
        const { data } = response.data;
        const result = data.map((item) => ({
          value: item._id,
          name: item.name,
          code: item.code,
          cityCode: item.CityCode,
          item,
        }));
        setToData(result);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length > 1) {
      fetchToCity(value);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchValue(item.name);
    setIsOpen(false);
    onItemSelect(item);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
          {toData.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          ) : (
            toData.map((item) => (
              <div
                key={item.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectItem(item.item)}
              >
                <div className="font-medium">
                  {item.name} ({item.cityCode})
                </div>
                <div className="text-sm text-gray-500">{item.code}</div>
              </div>
            ))
          )}
        </div>
      )}
      {selectedItem && (
        <p className="text-xs text-gray-500 mt-1">{selectedItem.code}</p>
      )}
    </div>
  );
};

// Date Range Picker Component
const DateRangePicker = ({ onChange, defaultValue, disabledDate }) => {
  const [startDate, setStartDate] = useState(
    defaultValue ? dayjs(defaultValue[0]) : dayjs()
  );
  const [endDate, setEndDate] = useState(
    defaultValue ? dayjs(defaultValue[1]) : dayjs().add(1, "day")
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date.isBefore(startDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
      onChange([startDate, date]);
      setIsOpen(false);
    }
  };

  const isDisabled = (date) => {
    return disabledDate(date);
  };

  const renderCalendar = () => {
    const days = [];
    const startDay = startDate.startOf("month");
    const daysInMonth = startDate.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const date = startDay.add(i, "day");
      const isStart = startDate && date.isSame(startDate, "day");
      const isEnd = endDate && date.isSame(endDate, "day");
      const isRange =
        startDate &&
        endDate &&
        date.isAfter(startDate) &&
        date.isBefore(endDate);
      const disabled = isDisabled(date);

      days.push(
        <button
          key={i}
          disabled={disabled}
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center
            ${disabled ? "text-gray-300 cursor-not-allowed" : ""}
            ${isStart || isEnd ? "bg-blue-600 text-white" : ""}
            ${isRange ? "bg-blue-100" : ""}
            hover:bg-blue-100`}
          onClick={() => !disabled && handleDateSelect(date)}
        >
          {date.date()}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dates
      </label>
      <div
        className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 text-center">
          <div className="text-sm font-medium">
            {startDate.format("DD MMM, YY")}
          </div>
          <div className="text-xs text-gray-500">
            {startDate.format("dddd")}
          </div>
        </div>
        <div className="mx-2 text-gray-400">→</div>
        <div className="flex-1 text-center">
          <div className="text-sm font-medium">
            {endDate ? endDate.format("DD MMM, YY") : "Select end date"}
          </div>
          <div className="text-xs text-gray-500">
            {endDate ? endDate.format("dddd") : ""}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white p-4 rounded-md shadow-lg border border-gray-200">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-xs text-center text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Traveler Dropdown Component
const TravelerDropdown = ({
  adultCount,
  childCount,
  infantCount,
  onAdultChange,
  onChildChange,
  onInfantChange,
  activeClassId,
  onClassChange,
}) => {
  const ClassItems = [
    { id: 1, label: "All" },
    { id: 2, label: "Economy" },
    { id: 3, label: "Premium Economy" },
    { id: 4, label: "Business" },
    { id: 5, label: "Premium Business" },
    { id: 6, label: "First" },
  ];

  return (
    <Menu as="div" className="relative">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Travelers & Class
        </label>
        <Menu.Button className="w-full p-2 border border-gray-300 rounded-md text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <div className="flex justify-between items-center">
            <span>{adultCount + childCount} Traveler(s)</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {ClassItems.find((item) => item.id === activeClassId)?.label}
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Adults (Age 12+ Years)</h3>
                <p className="text-xs text-gray-500">Maximum 9 adults</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={adultCount <= 1}
                  onClick={() => onAdultChange(-1)}
                >
                  -
                </button>
                <span>{adultCount}</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={adultCount >= 9}
                  onClick={() => onAdultChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">
                  Children (Age 2-12 Years)
                </h3>
                <p className="text-xs text-gray-500">
                  Maximum 9 total travelers
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={childCount <= 0}
                  onClick={() => onChildChange(-1)}
                >
                  -
                </button>
                <span>{childCount}</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={childCount >= 9 - adultCount}
                  onClick={() => onChildChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">Infants (Age 0-2 Years)</h3>
                <p className="text-xs text-gray-500">Maximum 1 per adult</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={infantCount <= 0}
                  onClick={() => onInfantChange(-1)}
                >
                  -
                </button>
                <span>{infantCount}</span>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
                  disabled={infantCount >= adultCount || infantCount >= 9}
                  onClick={() => onInfantChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Choose Travel Class</h3>
              <div className="grid grid-cols-3 gap-2">
                {ClassItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`px-2 py-1 text-sm rounded-md border ${
                      item.id === activeClassId
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => onClassChange(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

// Main Component
const ItenaryRoundFlightForm = ({
  closeModal,
  selectedIndex,
  onFlightSelect,
}) => {
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialSelectedFromData =
    reducerState?.Itenerary?.flightfromData?.data?.[0];
  const initialSelectedToData =
    reducerState?.Itenerary?.flighttoData?.data?.[0];
  const [loader, setLoader] = useState(false);

  let totalAdults = 0;
  let totalChildren = 0;

  reducerState?.Itenerary?.itenaryPayload?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  const [adultCount, setAdultCount] = useState(totalAdults);
  const [childCount, setChildCount] = useState(totalChildren);
  const [infantCount, setInfantCount] = useState(0);
  const [activeClassId, setActiveClassId] = useState(2);
  const [selectedFrom, setSelectedFrom] = useState(initialSelectedFromData);
  const [selectedTo, setSelectedTo] = useState(initialSelectedToData);
  const [returnDomestic, setReturnResultDomestic] = useState(false);
  const [returnInternational, setReturnResultInternational] = useState(false);
  const [returnResults, setReturnResults] = useState(null);

  const initialDepartDate =
    reducerState?.Itenerary?.itenaryPayload?.leavingDate;
  let initialReturnDate = null;
  if (initialDepartDate) {
    const departDate = dayjs(initialDepartDate);
    const returnDate = departDate.add(
      Number(
        reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[0]?.night
      ) + 1,
      "day"
    );
    initialReturnDate = returnDate;
  }

  const [dates, setDates] = useState([
    dayjs(initialDepartDate),
    dayjs(initialReturnDate),
  ]);

  const handleFromSelect = (item) => {
    setSelectedFrom(item);
  };

  const handleToSelect = (item) => {
    setSelectedTo(item);
  };

  const handleRangeChange = (newDates) => {
    setDates(newDates);
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  useEffect(() => {
    dispatch(returnActionClearPackCreation());
    dispatch(ipAction());
  }, []);

  useEffect(() => {
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    dispatch(tokenAction(payload));
  }, [reducerState?.ip?.ipData]);

  const returnSearch = async (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/flight/search/return",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  };

  const handleRoundSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      AdultCount: adultCount,
      ChildCount: childCount,
      InfantCount: infantCount,
      DirectFlight: "false",
      OneStopFlight: "false",
      JourneyType: "2",
      PreferredAirlines: null,
      Segments: [
        {
          Origin: selectedFrom.AirportCode,
          Destination: selectedTo.AirportCode,
          FlightCabinClass: activeClassId,
          PreferredDepartureTime: dates[0].format("DD MMM, YY"),
          PreferredArrivalTime: dates[0].format("DD MMM, YY"),
        },
        {
          Origin: selectedTo.AirportCode,
          Destination: selectedFrom.AirportCode,
          FlightCabinClass: activeClassId,
          PreferredDepartureTime: dates[1].format("DD MMM, YY"),
          PreferredArrivalTime: dates[1].format("DD MMM, YY"),
        },
      ],
      Sources: null,
    };

    sessionStorage.setItem("adults", adultCount);
    sessionStorage.setItem("childs", childCount);
    sessionStorage.setItem("infants", infantCount);

    try {
      const response = await returnSearch(payload);
      setReturnResults(response?.data?.data?.Response?.Results);
    } catch (error) {
      console.error("Return flight search failed:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (returnResults) {
      setLoader(false);
      if (returnResults?.[1]) {
        setReturnResultDomestic(true);
        setReturnResultInternational(false);
      } else {
        setReturnResultDomestic(false);
        setReturnResultInternational(true);
      }
    }
  }, [returnResults]);

  const handleAdultChange = (value) => {
    const newAdultCount = Math.min(Math.max(1, adultCount + value), 9);
    const maxAllowedChild = Math.max(0, 9 - newAdultCount);
    const newChildCount = Math.min(childCount, maxAllowedChild);

    setAdultCount(newAdultCount);
    setChildCount(newChildCount);

    const newInfantCount = Math.min(infantCount, newAdultCount);
    setInfantCount(newInfantCount);
  };

  const handleChildChange = (value) => {
    const newChildCount = Math.min(
      Math.max(0, childCount + value),
      9 - adultCount
    );
    setChildCount(newChildCount);
  };

  const handleInfantChange = (value) => {
    const newInfantCount = Math.min(
      Math.max(0, infantCount + value),
      adultCount
    );
    setInfantCount(newInfantCount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* From */}
        <FromSearchInput
          placeholder="City or Airport"
          onItemSelect={handleFromSelect}
        />

        {/* To */}
        <ToSearchInput
          placeholder="City or Airport"
          onItemSelect={handleToSelect}
        />

        {/* Dates */}
        <DateRangePicker
          onChange={handleRangeChange}
          defaultValue={[dayjs(initialDepartDate), dayjs(initialReturnDate)]}
          disabledDate={disablePastDates}
        />

        {/* Travelers & Class */}
        <TravelerDropdown
          adultCount={adultCount}
          childCount={childCount}
          infantCount={infantCount}
          onAdultChange={handleAdultChange}
          onChildChange={handleChildChange}
          onInfantChange={handleInfantChange}
          activeClassId={activeClassId}
          onClassChange={setActiveClassId}
        />
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRoundSubmit}
          disabled={loader}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {loader ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            "Search Flights"
          )}
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-10">
        {loader ? (
          <div className="text-center py-10">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Please Wait we are searching best flights for you!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Searching across multiple airlines to find the best options...
            </p>
          </div>
        ) : (
          <>
            {returnDomestic && (
              <ItenaryRoundFlightResult
                onFlightSelect={onFlightSelect}
                selectedIndex={selectedIndex}
                closeModal={closeModal}
                result={returnResults}
              />
            )}
            {returnInternational && (
              <ItenaryRoundFlightResultInternational
                onFlightSelect={onFlightSelect}
                selectedIndex={selectedIndex}
                closeModal={closeModal}
                result={returnResults}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItenaryRoundFlightForm;
