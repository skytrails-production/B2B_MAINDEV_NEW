import { ClockIcon, MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";


const FLightToMobile = ({
    placeHolder = "Location",
    onLocationSelect,
}) => {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const [value, setValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem("FlightRecentSearchesFrom")) || []
    );

    const suggestedPlaces = [
        {
            _id: "668278a9909eb1823ba94034",
            name: "New Delhi",
            AirportCode: "DEL",
            CityCode: "DEL",
            CountryCode: "IN",
            CountryName: "India",
            code: "Indira Gandhi Airport",
            state: "Delhi"
        },
        {
            _id: "668278aa909eb1823ba94368",
            name: "Chandigarh",
            AirportCode: "IXC",
            CityCode: "IXC",
            CountryCode: "IN",
            CountryName: "India",
            code: "Shaheed Bhagat Singh International Airport",
            state: "Punjab"
        }
    ];

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
                    `https://back.theskytrails.com/skyTrails/city/searchCityData?keyword=${keyword}`
                );
                const locations = response?.data?.data?.map(item => ({
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
        // setShowPopover(false);

        const updatedRecentSearches = [
            location,
            ...recentSearches.filter((item) => item._id !== location._id)
        ].slice(0, 5);

        setRecentSearches(updatedRecentSearches);
        localStorage.setItem("FlightRecentSearchesFrom", JSON.stringify(updatedRecentSearches));

        if (onLocationSelect) {
            onLocationSelect(location);
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
                <div className="mt-2">
                    {uniqueRecentSearches.map((item, index) => (
                        <span
                            onClick={() => handleSelectLocation(item)}
                            key={index}
                            className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 cursor-pointer"
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
                            className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 cursor-pointer"
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
                        className="flex px-4 sm:px-8 items-center space-x-3 sm:space-x-4 py-4 hover:bg-neutral-100 cursor-pointer"
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
        <div ref={containerRef}>
            <div className="p-5" >
            <span className="block font-semibold text-xl sm:text-2xl">
                    Location
                </span>

                <div className="relative mt-5">
                    <input
                        className={`block w-full bg-transparent border border-1 focus:ring-0 p-2 rounded-md  focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-semibold placeholder-neutral-800 truncate`}
                        placeholder={placeHolder}
                        value={value}
                        onChange={handleChange}
                        ref={inputRef}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-neutral-700 " />
                    </span>
                </div>
                <div className="mt-7">
                    {value ? renderSearchResults() : (
                        <>
                            {renderRecentSearches()}
                            {renderSuggestedPlaces()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FLightToMobile;
