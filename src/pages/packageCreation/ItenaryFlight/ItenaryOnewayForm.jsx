import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearbookTicketGDS } from "../../../Redux/FlightBook/actionFlightBook";
import { oneWayAction, resetOneWay } from "../../../Redux/FlightSearch/oneWay";
import {
  searchFlight,
  clearSearch,
} from "../../../Redux/SearchFlight/actionSearchFlight";
import { useNavigate } from "react-router-dom";
import { resetAllFareData } from "../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { returnActionClear } from "../../../Redux/FlightSearch/Return/return";
import dayjs from "dayjs";
import ItenaryOnewayResult from "./ItenaryOnewayResult";
import TravelerCounter from "./TravelerCounter";
import { apiURL } from "../../../Constants/constant";
import {
  clearOneWayItenary,
  itenaryOnewayRequest,
} from "../../../Redux/Itenary/itenary";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Initial data
const initialSelectedFromData = {
  AirportCode: "DEL",
  CityCode: "DEL",
  CountryCode: "IN ",
  code: "Indira Gandhi Airport",
  createdAt: "2023-01-30T14:58:34.428Z",
  id: "DEL",
  name: "Delhi",
  updatedAt: "2023-01-30T14:58:34.428Z",
  __v: 0,
  _id: "63d7db1a64266cbf450e07c1",
};

const initialSelectedToData = {
  AirportCode: "BOM",
  CityCode: "BOM",
  CountryCode: "IN ",
  code: "Chhatrapati Shivaji Maharaj International Airport",
  createdAt: "2023-01-30T14:58:34.428Z",
  id: "BOM",
  name: "Mumbai",
  updatedAt: "2023-01-30T14:58:34.428Z",
  __v: 0,
  _id: "63d7db1a64266cbf450e07c2",
};

const ClassItems = [
  { id: 2, value: "Y", label: "Economy" },
  { id: 3, value: "W", label: "Premium Economy" },
  { id: 4, value: "C", label: "Business" },
  { id: 6, value: "F", label: "First" },
];

// City Search Input Component
const CitySearchInput = ({ initialData, placeholder, onItemSelect }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialData);
  const [cities, setCities] = useState([initialData]);
  const timeoutRef = useRef(null);

  const fetchCities = async (searchQuery) => {
    try {
      const response = await axios.get(
        `${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${searchQuery}`
      );
      return response.data.data.map((item) => ({
        ...item,
        value: item._id,
        cityCode: item.CityCode,
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  };

  useEffect(() => {
    if (query === "") {
      setCities([initialData]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const results = await fetchCities(query);
      setCities(results.length ? results : [initialData]);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSelect = (city) => {
    setSelected(city);
    onItemSelect(city);
    setQuery("");
  };

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
          <Combobox.Button className="w-full text-left">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(city) => city?.name || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
          </Combobox.Button>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
            {cities.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              cities.map((city) => (
                <Combobox.Option
                  key={city._id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={city}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {city.name} ({city.CityCode})
                      </span>
                      <span
                        className={`block truncate text-xs ${
                          active ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {city.code}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-blue-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
      <div className="mt-1 text-xs text-gray-500">{selected?.code}</div>
    </Combobox>
  );
};

// Date Picker Component
const DatePickerInput = ({ value, onChange, placeholder }) => {
  const [date, setDate] = useState(value ? dayjs(value) : dayjs());
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
    setIsOpen(false);
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2 px-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {date.format("DD MMM, YY")}
        <span className="block text-xs text-gray-500">
          {date.format("dddd")}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => handleDateChange(date.subtract(1, "day"))}
              className="p-1 rounded hover:bg-gray-100"
            >
              &lt;
            </button>
            <span className="font-medium">{date.format("MMMM YYYY")}</span>
            <button
              onClick={() => handleDateChange(date.add(1, "day"))}
              className="p-1 rounded hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: date.startOf("month").day() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-8"></div>
            ))}
            {Array.from({ length: date.daysInMonth() }).map((_, i) => {
              const day = i + 1;
              const currentDate = date.date(day);
              const isDisabled = disablePastDates(currentDate);
              const isSelected = currentDate.isSame(date, "day");

              return (
                <button
                  key={day}
                  onClick={() => !isDisabled && handleDateChange(currentDate)}
                  disabled={isDisabled}
                  className={`h-8 w-8 rounded-full text-sm flex items-center justify-center ${
                    isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Traveler & Class Dropdown Component
const TravelerClassDropdown = ({
  adultCount,
  childCount,
  infantCount,
  activeClassId,
  flightClass,
  onAdultChange,
  onChildChange,
  onInfantChange,
  onClassChange,
}) => {
  return (
    <Listbox value={activeClassId} onChange={onClassChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
          <span className="block truncate">
            {adultCount + childCount + infantCount} Traveller
          </span>
          <span className="block text-xs text-gray-500">
            {ClassItems.find((c) => c.id === activeClassId)?.label}
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
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            <div className="p-3 space-y-4">
              <div className="space-y-2">
                <TravelerCounter
                  label="Adults "
                  count={adultCount}
                  onIncrement={() => onAdultChange(1)}
                  onDecrement={() => onAdultChange(-1)}
                />
                <TravelerCounter
                  label="Children "
                  count={childCount}
                  onIncrement={() => onChildChange(1)}
                  onDecrement={() => onChildChange(-1)}
                />
                <TravelerCounter
                  label="Infants"
                  count={infantCount}
                  onIncrement={() => onInfantChange(1)}
                  onDecrement={() => onInfantChange(-1)}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Travel Class
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {ClassItems.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      value={item.id}
                      className={({ active }) =>
                        `cursor-pointer select-none py-2 px-3 rounded-lg border text-sm text-center ${
                          active ? "bg-blue-100" : ""
                        } ${
                          activeClassId === item.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`
                      }
                    >
                      {item.label}
                    </Listbox.Option>
                  ))}
                </div>
              </div>
            </div>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

function ItenaryOnewayForm({ closeModal, selectedIndex, onFlightSelect }) {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);

  // State
  const [loader, setLoader] = useState(false);
  const [activeClassId, setActiveClassId] = useState(2);
  const [flightClass, setFlightClass] = useState("Y");
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [adultCount, setAdultCount] = useState(1);
  const [selectedFrom, setSelectedFrom] = useState(initialSelectedFromData);
  const [selectedTo, setSelectedTo] = useState(initialSelectedToData);
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [onewayResultCame, setOnewayResultCame] = useState(false);

  // Initialize
  useEffect(() => {
    dispatch(clearbookTicketGDS());
    dispatch(resetAllFareData());
    dispatch(returnActionClear());
    dispatch(clearSearch());
    dispatch(resetOneWay());
    dispatch(clearOneWayItenary());
  }, [dispatch]);

  // Handle traveler count changes
  const handleTravelerCountChange = (category, value) => {
    if (category === "adult") {
      const newAdultCount = Math.min(Math.max(1, adultCount + value), 9);
      const maxAllowedChild = Math.max(0, 9 - newAdultCount);
      const newChildCount = Math.min(childCount, maxAllowedChild);
      const newInfantCount = Math.min(infantCount, newAdultCount);

      setAdultCount(newAdultCount);
      setChildCount(newChildCount);
      setInfantCount(newInfantCount);
    } else if (category === "child") {
      const newChildCount = Math.min(
        Math.max(0, childCount + value),
        9 - adultCount
      );
      setChildCount(newChildCount);
    } else if (category === "infant") {
      const newInfantCount = Math.min(
        Math.max(0, infantCount + value),
        adultCount
      );
      setInfantCount(newInfantCount);
    }
  };

  // Handle form submission
  const handleOnewaySubmit = (event) => {
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
      JourneyType: 1,
      PreferredAirlines: null,
      Segments: [
        {
          Origin: selectedFrom.AirportCode,
          Destination: selectedTo.AirportCode,
          FlightCabinClass: activeClassId,
          PreferredDepartureTime: departureDate.format("DD MMM, YY"),
          PreferredArrivalTime: departureDate.format("DD MMM, YY"),
        },
      ],
      Sources: null,
      to: selectedTo.AirportCode,
      from: selectedFrom.AirportCode,
      date: departureDate.format("DD MMM, YY"),
      cabinClass: flightClass,
      px: adultCount,
    };

    dispatch(itenaryOnewayRequest(payload));
  };

  // Handle loading states
  useEffect(() => {
    if (!reducerState?.Itenerary?.flightOnewayData.length > 0) {
      setOnewayResultCame(false);
    }
  }, [reducerState?.Itenerary?.flightOnewayData]);

  useEffect(() => {
    if (reducerState?.Itenerary?.isLoading == false) {
      setLoader(false);
      setOnewayResultCame(true);
    }
  }, [reducerState?.Itenerary?.isLoading]);

  return (
    <div className=" mx-auto py-4">
      {/* Search Form */}
      <div className="bg-white rounded-xl  p-6 mb-8">
        <form onSubmit={handleOnewaySubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* From Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <CitySearchInput
                initialData={initialSelectedFromData}
                placeholder="Search city or airport"
                onItemSelect={setSelectedFrom}
              />
            </div>

            {/* To Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <CitySearchInput
                initialData={initialSelectedToData}
                placeholder="Search city or airport"
                onItemSelect={setSelectedTo}
              />
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure
              </label>
              <DatePickerInput
                value={departureDate}
                onChange={setDepartureDate}
                placeholder="Select date"
              />
            </div>

            {/* Traveler & Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traveller & Class
              </label>
              <TravelerClassDropdown
                adultCount={adultCount}
                childCount={childCount}
                infantCount={infantCount}
                activeClassId={activeClassId}
                flightClass={flightClass}
                onAdultChange={(val) => handleTravelerCountChange("adult", val)}
                onChildChange={(val) => handleTravelerCountChange("child", val)}
                onInfantChange={(val) =>
                  handleTravelerCountChange("infant", val)
                }
                onClassChange={(id) => {
                  setActiveClassId(id);
                  setFlightClass(
                    ClassItems.find((c) => c.id === id)?.value || "Y"
                  );
                }}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-200"
            >
              Search Flights
            </button>
          </div>
        </form>
      </div>

      {/* Loading or Results */}
      {loader ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Searching for the best flights...
          </h3>
          <p className="text-gray-500 mt-1">
            Please wait while we find the perfect options for you
          </p>
        </div>
      ) : (
        onewayResultCame && (
          <ItenaryOnewayResult
            onFlightSelect={onFlightSelect}
            selectedIndex={selectedIndex}
            closeModal={closeModal}
          />
        )
      )}
    </div>
  );
}

export default ItenaryOnewayForm;
