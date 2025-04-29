import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ClearDataButton from "../../../components/ClearDateButton";
// import ClearDataButton from "../ClearDataButton";

const HolidayLocationInput = ({
  autoFocus = false,
  placeHolder = "Location",
  desc = "Where are you going?",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  customPadding,
  onLocationSelect,
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [value, setValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("HolidayrecentSearches")) || []
  );

  const [prevValue, setPrevValue] = useState(""); // To temporarily store the previous value
  const suggestedPlaces = ["Europe", "Turkey", "Tokyo"];

  // Set initial value based on recent searches or default to "New York"
  useEffect(() => {
    if (recentSearches.length > 0) {
      const mostRecent = recentSearches[0];
      setSelectedLocation(mostRecent);
      setValue(mostRecent);
      if (onLocationSelect) {
        onLocationSelect(mostRecent);
      }
    } else {
      const defaultCity = suggestedPlaces?.[0];
      setSelectedLocation(defaultCity);
      setValue(defaultCity);
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

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = async (keyword) => {
    if (keyword.length > 2) {
      try {
        const response = await axios.get(
          `https://back.theskytrails.com/skyTrails/holidaypackage/packagecitylist?keyword=${keyword}`
        );
        const locations = response?.data?.data || [];
        setSearchResults(locations);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    setValue(location);
    setSelectedLocation(location);
    setShowPopover(false);

    const updatedRecentSearches = [
      location,
      ...recentSearches.filter((item) => item !== location),
    ].slice(0, 5);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "HolidayrecentSearches",
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
        setValue(selectedLocation);
      }
    }
  };

  const renderRecentSearches = () => {
    return (
      <>
        {recentSearches.length > 0 && (
          <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 ">
            Recent searches
          </h3>
        )}
        <div className="mt-2">
          {recentSearches.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">{item}</span>
            </span>
          ))}
        </div>
      </>
    );
  };

  const renderSuggestedPlaces = () => {
    return (
      <>
        <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 ">
          Suggested places
        </h3>
        <div className="mt-2">
          {suggestedPlaces.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">{item}</span>
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
            <span className="block font-medium text-neutral-700">{item}</span>
          </span>
        ))}
      </>
    );
  };

  return (
    <div className={`relative flex ${className}`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ ${customPadding} ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "" : ""
        }`}
      >
        <div className="text-neutral-300">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className="block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none text-2xl font-bold placeholder-neutral-800 truncate"
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={handleChange}
            onFocus={handleFocus} // Clear input when focused
            onBlur={handleBlur} // Restore if nothing is selected
            ref={inputRef}
          />
          <span className="block mt-0.5 text-[1rem] text-neutral-400 font-light">
            <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
          </span>
          {value && showPopover && (
            <ClearDataButton onClick={() => setValue("")} />
          )}
        </div>
      </div>

      {showPopover && (
        <div
          className={`h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 bg-white ${divHideVerticalLineClass}`}
        ></div>
      )}

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[500px] bg-white top-full mt-3 py-3 sm:py-6 rounded-3xl shadow-xl max-h-96 overflow-y-auto">
          {searchResults.length > 0
            ? renderSearchResults()
            : renderRecentSearches()}
          {renderSuggestedPlaces()}
        </div>
      )}
    </div>
  );
};

export default HolidayLocationInput;
