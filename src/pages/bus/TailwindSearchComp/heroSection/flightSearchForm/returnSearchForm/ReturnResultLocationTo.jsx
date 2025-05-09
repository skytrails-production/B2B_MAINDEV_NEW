import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ClearDataButton from "../../ClearDataButton";
import { PlaneLanding } from "lucide-react";
import { apiURL } from "../../../../../../Constants/constant";

const ReturnResultLocationTo = ({
  autoFocus = false,
  placeHolder = "Location",
  desc,
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  onLocationSelect,
  error,
  shake,
}) => {
  // console.log("error: " + error, shake);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [value, setValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("FlightRecentSearchesTo")) || []
  );

  const [prevValue, setPrevValue] = useState(""); // To temporarily store the previous value

  const suggestedPlaces = [
    {
      _id: "668278aa909eb1823ba94368",
      name: "Chandigarh",
      AirportCode: "IXC",
      CityCode: "IXC",
      CountryCode: "IN",
      CountryName: "India",
      code: "Shaheed Bhagat Singh International Airport",
      state: "Punjab",
    },
    {
      _id: "668278a9909eb1823ba94034",
      name: "New Delhi",
      AirportCode: "DEL",
      CityCode: "DEL",
      CountryCode: "IN",
      CountryName: "India",
      code: "Indira Gandhi Airport",
      state: "Delhi",
    },
  ];

  useEffect(() => {
    if (recentSearches.length > 0) {
      const mostRecent = recentSearches?.[0];
      setSelectedLocation(mostRecent);
      setValue(mostRecent.name);
      if (onLocationSelect) {
        onLocationSelect(mostRecent);
      }
    } else {
      const defaultCity = suggestedPlaces?.[0];
      setSelectedLocation(defaultCity);
      setValue(defaultCity.name);
      if (onLocationSelect) {
        onLocationSelect(defaultCity);
      }
    }
  }, []);

  useEffect(() => {
    if (showPopover) {
      document.addEventListener("click", eventClickOutsideDiv);
    } else {
      document.removeEventListener("click", eventClickOutsideDiv);
    }
    return () => {
      document.removeEventListener("click", eventClickOutsideDiv);
    };
  }, [showPopover]);

  useEffect(() => {
    if (showPopover && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopover]);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Search function using the flight API response
  const handleSearch = async (keyword) => {
    if (keyword.length > 2) {
      try {
        const response = await axios.get(
          `${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${keyword}`
        );
        const locations =
          response?.data?.data?.map((item) => ({
            _id: item._id,
            name: item.name,
            CityCode: item.CityCode,
            CountryCode: item.CountryCode,
            CountryName: item.CountryName,
            AirportCode: item.AirportCode,
            code: item.code,
            state: item.state,
          })) || [];
        setSearchResults(locations);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    }
  };

  const debouncedSearch = debounce(handleSearch, 500);

  const handleFocus = () => {
    setPrevValue(value); // Store the current value before clearing
    setValue(""); // Clear the input value on focus
  };

  const handleBlur = () => {
    if (!selectedLocation) {
      setValue(prevValue); // Restore the previous value if no new location is selected
    }
  };

  const handleChange = (e) => {
    const keyword = e.currentTarget.value;
    setValue(keyword);
    if (keyword.length > 0) {
      debouncedSearch(keyword);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (location) => {
    setValue(location.name);
    setSelectedLocation(location);
    setShowPopover(false);

    const updatedRecentSearches = [
      location,
      ...recentSearches.filter((item) => item._id !== location._id),
    ].slice(0, 5);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "FlightRecentSearchesTo",
      JSON.stringify(updatedRecentSearches)
    );

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const eventClickOutsideDiv = (event) => {
    if (!containerRef.current.contains(event.target)) {
      setShowPopover(false);
      if (selectedLocation) {
        setValue(selectedLocation.name);
      }
    }
  };

  const renderRecentSearches = () => {
    const uniqueRecentSearches = [...new Set(recentSearches)].slice(0, 2);
    return (
      <>
        {uniqueRecentSearches.length > 0 && (
          <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800">
            Recent searches
          </h3>
        )}
        <div className="mt-2 relative">
          {uniqueRecentSearches.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3  hover:bg-neutral-100 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">
                {item.name} ({item.AirportCode}), {item.CountryName}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderSuggestedPlaces = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800">
          Suggested places
        </h3>
        <div className="mt-2">
          {suggestedPlaces.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3  hover:bg-neutral-100 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">
                {item.name} ({item.AirportCode}), {item.CountryName}
              </span>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderSearchResults = () => {
    return (
      <>
        {searchResults.map((item, index) => (
          <span
            onClick={() => handleSelectLocation(item)}
            key={index}
            className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100 cursor-pointer"
          >
            <span className="block text-neutral-400">
              <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
            </span>
            <span className="block font-medium text-neutral-700">
              {item.name} ({item.AirportCode}), {item.CountryName}
            </span>
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ p-3 ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused" : ""
        }`}
      >
        <div className="text-neutral-300">
          <PlaneLanding className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent text-gray-100 placeholder:text-gray-100 border-none focus:ring-0 p-0 focus:outline-none text-xl md:text-xl lg:text-xl xl:text-xl font-bold placeholder-neutral-800 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={handleChange}
            onFocus={handleFocus} // Clear input when focused
            onBlur={handleBlur} // Restore if nothing is selected
            ref={inputRef}
          />
          <span className="block mt-0.5 text-[0.8rem] text-gray-100 font-medium">
            <span className="line-clamp-1 ">
              {!!value ? placeHolder : desc}
            </span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => setValue("")} />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-transparent ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            renderSearchResults()
          ) : (
            <>
              {renderRecentSearches()}
              {renderSuggestedPlaces()}
            </>
          )}
        </div>
      )}
      {error && (
        <div className=" bottom-[-10px] left-10 absolute text-red-500 text-[11px] bg-[#ffeaee] px-2 py-1 border-0 rounded-sm inline-block  leading-[15px] whitespace-nowrap transition-all duration-500 capitalize w-auto m-0 font-medium">
          <div className={`${shake ? "animate-shake" : ""}`}>
            <span className={`${shake ? "animate-shake" : ""}`}>
              From & To airports cannot be the same
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnResultLocationTo;
