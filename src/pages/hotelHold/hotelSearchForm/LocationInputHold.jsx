import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ClearDataButton from "../../../components/ClearDateButton";
import { apiURL } from "../../../Constants/constant";

const LocationInputHold = ({
  autoFocus = false,
  placeHolder = "Location",
  desc = "Where are you going?",
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
    JSON.parse(localStorage.getItem("recentSearchesHotel")) || []
  );

  const [prevValue, setPrevValue] = useState(""); // To temporarily store the previous value

  // Suggested places array (hardcoded)
  const suggestedPlaces = [
    {
      type: "city",
      // cityCode: "124054",
      // cityName: "New Delhi",
      // countryCode: "IN",
      // countryName: "India",

      cityName: "Delhi",
      grnCityCode: "124054",
      grnCountryCode: "IN",
      grnCountryName: "India",
      tboCityCode: 130443,
      tboCountryCode: "IN",
      tboCountryName: "India",
      tbostateProvince: "DELHI",
      tbostateProvinceCode: "DL",
    },
    {
      type: "city",
      cityName: "Mumbai",
      grnCityCode: "103863",
      grnCountryCode: "IN",
      grnCountryName: "India",
      tboCityCode: 144306,
      tboCountryCode: "IN",
      tboCountryName: "India",
      tbostateProvince: "Maharashtra",
      tbostateProvinceCode: "MH",
    },
    {
      type: "city",
      cityName: "Chandigarh",
      grnCityCode: "122959",
      grnCountryCode: "IN",
      grnCountryName: "India",
      tboCityCode: 114107,
      tboCountryCode: "IN",
      tboCountryName: "India",
      tbostateProvince: "Chandigarh",
      tbostateProvinceCode: "CH",
    },
  ];

  useEffect(() => {
    if (recentSearches.length > 0) {
      if (recentSearches?.[0]?.type == "city") {
        const mostRecent = recentSearches?.[0];
        setSelectedLocation(mostRecent);
        setValue(mostRecent.cityName); // Initial display of most recent search
        if (onLocationSelect) {
          onLocationSelect(mostRecent); // Trigger the location select callback
        }
      } else {
        const mostRecent = recentSearches?.[0];
        setSelectedLocation(mostRecent);
        setValue(mostRecent.hotelName); // Initial display of most recent search
        if (onLocationSelect) {
          onLocationSelect(mostRecent); // Trigger the location select callback
        }
      }
    } else {
      const defaultCity = suggestedPlaces?.[0];
      setSelectedLocation(defaultCity);
      setValue(defaultCity.cityName);
      if (onLocationSelect) {
        onLocationSelect(defaultCity); // Trigger the location select callback
      }
    }
  }, []); // Runs only once on mount

  //   useEffect(() => {
  //     setShowPopover(autoFocus);
  //   }, [autoFocus]);

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

  // Debounce utility function
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
          `${apiURL.baseURL}/skyTrails/tboandgrn/citylist?keyword=${keyword}`
        );
        const cityList = response?.data?.data?.cityList.map((city) => ({
          type: "city",
          ...city,
        }));
        const hotelList = response?.data?.data?.hotelList.map((hotel) => ({
          type: "hotel",
          ...hotel,
        }));
        setSearchResults([...cityList, ...hotelList]);
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
    let selectedLocation;
    setSelectedLocation(location);
    if (location.type === "city") {
      selectedLocation = `${location.cityName} (${
        location?.grnCountryName !== null
          ? location?.grnCountryName
          : location?.tboCountryName
      })`;
    } else if (location.type === "hotel") {
      selectedLocation = `${location.hotelName} (${location.countryName})`;
    }

    setValue(selectedLocation);
    setShowPopover(false);

    const updatedRecentSearches = [
      location,
      ...recentSearches.filter(
        (item) =>
          item.cityName !== location.cityName &&
          item.hotelName !== location.hotelName
      ),
    ].slice(0, 5);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "recentSearchesHotel",
      JSON.stringify(updatedRecentSearches)
    );

    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  //   const eventClickOutsideDiv = (event) => {
  //     if (!containerRef.current.contains(event.target)) {
  //       setShowPopover(false);
  //     }
  //   };

  const eventClickOutsideDiv = (event) => {
    if (!containerRef.current.contains(event.target)) {
      setShowPopover(false);
      // Reset input to selected location if no result is selected
      if (selectedLocation) {
        if (selectedLocation?.type == "city") {
          setValue(selectedLocation.cityName);
        } else {
          setValue(selectedLocation.hotelName);
        }
      }
    }
  };

  const renderRecentSearches = () => {
    const uniqueRecentSearches = [...new Set(recentSearches)].slice(0, 2); // 2

    return (
      <>
        {uniqueRecentSearches.length > 0 && (
          <h3 className="block mt-2 sm:mt-0 px-4 sm:px-8 font-semibold text-base sm:text-lg text-neutral-800 ">
            Recent searches
          </h3>
        )}
        <div className="mt-2">
          {uniqueRecentSearches.map((item, index) => (
            <span
              onClick={() => handleSelectLocation(item)}
              key={index}
              className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 lg:py-4 md:py-4 sm:py-3 hover:bg-neutral-100 cursor-pointer"
            >
              <span className="block text-neutral-400">
                <ClockIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              {item?.type == "city" ? (
                <span className="block font-medium text-neutral-700 ">
                  {item?.cityName} (
                  {item?.grnCountryName || item?.tboCountryName})
                </span>
              ) : (
                <span className="block font-medium text-neutral-700 ">
                  {item?.hotelName} ({item?.countryName})
                </span>
              )}
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
                <ClockIcon className="h-4 sm:h-6 w-4 sm:w-6" />
              </span>
              {item?.type == "city" ? (
                <span className="block font-medium text-neutral-700 ">
                  {item?.cityName} (
                  {item?.grnCountryName || item?.tboCountryName})
                </span>
              ) : (
                <span className="block font-medium text-neutral-700 ">
                  {item?.hotelName} ({item?.countryName})
                </span>
              )}
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
            {item?.type == "city" ? (
              <span className="block font-medium text-neutral-700 ">
                {item?.cityName} ({item?.grnCountryName || item?.tboCountryName}
                )
              </span>
            ) : (
              <span className="block font-medium text-neutral-700 ">
                {item?.hotelName} ({item?.countryName})
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <div
      className={`relative flex border-b border-gray-300 md:border-0 ${className}`}
      ref={containerRef}
    >
      <div
        onClick={() => setShowPopover(true)}
        className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left ${
          showPopover ? "" : ""
        }`}
      >
        <div className="text-neutral-300">
          <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow">
          <input
            className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 text-base md:text-2xl font-bold placeholder-neutral-800 truncate`}
            placeholder={placeHolder}
            value={value}
            autoFocus={showPopover}
            onChange={handleChange}
            onFocus={handleFocus} // Clear input when focused
            onBlur={handleBlur} // Restore if nothing is selected
            ref={inputRef}
          />
          <span className="block mt-0.5 text-[0.8rem] text-neutral-400 font-light">
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
    </div>
  );
};

export default LocationInputHold;
