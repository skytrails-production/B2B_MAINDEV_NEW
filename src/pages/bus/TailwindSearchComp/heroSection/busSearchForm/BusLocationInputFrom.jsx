import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ClearDataButton from "../ClearDataButton";
import { apiURL } from "../../../../../Constants/constant";
const BusLocationInputFrom = ({
  autoFocus = false,
  placeHolder = "Location",
  desc,
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
  onLocationSelect,
}) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [value, setValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPopover, setShowPopover] = useState(autoFocus);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("BusrecentSearchesFrom")) || []
  );

  const [prevValue, setPrevValue] = useState(""); // To temporarily store the previous value

  const suggestedPlaces = [
    { CityId: "230", CityName: "Delhi" },
    { CityId: "7485", CityName: "Hyderabad" },
    { CityId: "5318", CityName: "Lucknow" },
  ];

  // Set the initial value based on recent searches or default to "Delhi"
  useEffect(() => {
    if (recentSearches.length > 0) {
      const mostRecent = recentSearches[0];
      setSelectedLocation(mostRecent);
      setValue(mostRecent.CityName);
      if (onLocationSelect) {
        onLocationSelect(mostRecent);
      }
    } else {
      const defaultCity = suggestedPlaces.find(
        (place) => place.CityName === "Delhi"
      );
      setSelectedLocation(defaultCity);
      setValue(defaultCity.CityName);
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

  const handleSearch = async (keyword) => {
    if (keyword.length > 2) {
      try {
        const response = await axios.get(
          `${apiURL.baseURL}/skyTrails/city/searchCityBusData?keyword=${keyword}`
        );
        const locations =
          response?.data?.data?.map((item) => ({
            CityId: item.CityId,
            CityName: item.CityName,
          })) || [];
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
    setValue(location.CityName);
    setSelectedLocation(location);
    setShowPopover(false);

    const updatedRecentSearches = [
      location,
      ...recentSearches.filter((item) => item.CityId !== location.CityId),
    ].slice(0, 5);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "BusrecentSearchesFrom",
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
        setValue(selectedLocation.CityName);
      }
    }
  };

  const renderRecentSearches = () => {
    const uniqueRecentSearches = [...new Set(recentSearches)].slice(0, 2);
    return (
      <>
        {uniqueRecentSearches.length > 0 && (
          <h3 className="block px-4 mt-2 text-base font-semibold sm:mt-0 sm:px-8 sm:text-lg text-neutral-800 ">
            Recent searches
          </h3>
        )}
        <div className="mt-2">
          {uniqueRecentSearches.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex items-center px-4 space-x-3 cursor-pointer sm:px-8 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="w-4 h-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">
                {item.CityName}
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
        <h3 className="block px-4 mt-2 text-base font-semibold sm:mt-0 sm:px-8 sm:text-lg text-neutral-800 ">
          Suggested places
        </h3>
        <div className="mt-2">
          {suggestedPlaces.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex items-center px-4 space-x-3 cursor-pointer sm:px-8 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100"
            >
              <span className="block text-neutral-400">
                <MapPinIcon className="w-4 h-4 sm:h-6 sm:w-6" />
              </span>
              <span className="block font-medium text-neutral-700">
                {item.CityName}
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
        {searchResults?.map((item, index) => (
          <span
            onClick={() => handleSelectLocation(item)}
            key={index}
            className="flex items-center px-4 space-x-3 cursor-pointer sm:px-8 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100"
          >
            <span className="block text-neutral-400">
              <MapPinIcon className="w-4 h-4 sm:h-6 sm:w-6" />
            </span>
            <span className="block font-medium text-neutral-700">
              {item?.CityName}
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
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "nc-hero-field-focused" : ""
        }`}
      >
        <div className="text-neutral-300">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 text-2xl font-bold placeholder-neutral-800 truncate`}
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
          {searchResults?.length > 0 ? (
            renderSearchResults()
          ) : (
            <>
              {renderRecentSearches()}
              {renderSuggestedPlaces()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BusLocationInputFrom;
