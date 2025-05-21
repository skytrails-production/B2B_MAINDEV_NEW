import React, { useEffect, useState } from "react";
import hotelNotFound from "../../images/hotelNotFound.jpg";
import starsvg from "../../images/star.svg";
import starBlank from "../../images/starBlank.svg";
import hotelFilter from "../../images/hotelFilter.png";
import { useSelector } from "react-redux";
import {
  ArrowBigRightDashIcon,
  FilterIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

export default function HotelLists({ result, onHotelClick }) {
  const [data, setData] = useState(result);
  const reducerState = useSelector((state) => state);
  const [sortOption, setSortOption] = useState("lowToHigh");
  const [searchInput, setSearchInput] = useState("");
  const [priceRangeValue, setPriceRangeValue] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState(null);

  useEffect(() => {
    setData(result);
  }, [result]);

  const maxPrice = result?.HotelResults?.reduce((max, hotel) => {
    return Math.max(max, hotel?.Price?.PublishedPriceRoundedOff || 0);
  }, 0);
  const minPrice = result?.HotelResults?.reduce((min, hotel) => {
    return Math.min(min, hotel?.Price?.PublishedPriceRoundedOff || Infinity);
  }, Infinity);

  useEffect(() => {
    setPriceRangeValue(maxPrice + 5001);
  }, [maxPrice]);

  const handleClick = (hotelData) => {
    if (onHotelClick) {
      onHotelClick(hotelData);
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRangeValue(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSearchInput("");
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

  const sortedAndFilteredResults = data?.HotelResults?.filter((item) => {
    const hotelName = item?.HotelName?.toLowerCase();
    const hotelAddress = item?.HotelLocation?.toLowerCase();
    const starRating = item?.StarRating;
    const location = item?.HotelLocation;

    const categoryFilters = selectedCategory?.map((category) => {
      const [groupName, value] = category.split(":");
      switch (groupName) {
        case "star":
          return starRating === parseInt(value);
        case "location":
          return location === value;
        default:
          return false;
      }
    });

    const priceInRange = item?.Price?.PublishedPrice <= priceRangeValue;
    const searchFilter =
      hotelName?.includes(searchInput?.toLowerCase()) ||
      hotelAddress?.includes(searchInput?.toLowerCase());

    return (
      categoryFilters?.every((filter) => filter) &&
      searchFilter &&
      priceInRange &&
      !hotelName == ""
    );
  })?.sort((a, b) =>
    sortOption === "lowToHigh"
      ? a?.Price?.PublishedPriceRoundedOff - b?.Price?.PublishedPriceRoundedOff
      : b?.Price?.PublishedPriceRoundedOff - a?.Price?.PublishedPriceRoundedOff
  );

  const handleShowMore = () => {
    setDisplayCount(displayCount === 6 ? result?.HotelResults?.length : 6);
  };

  const handelClearOne = (item) => {
    let select = selectedCategory.filter((item1) => item1 !== item);
    setSelectedCategory(select);
  };

  const toggleFilterSection = (section) => {
    setActiveFilterSection(activeFilterSection === section ? null : section);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-500 text-white py-6 rounded-xl">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Best Hotels for you in{" "}
              {
                reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[0]?.from
                  ?.Destination
              }
            </h1>
            <p className="text-lg">
              Showing {sortedAndFilteredResults?.length} Results
            </p>

            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Name or location"
                  className="w-full px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <button className="absolute right-3 top-3 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                {selectedCategory.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory([])}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Active filters */}
              {selectedCategory.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handelClearOne(item)}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                      >
                        {item.split(":")[1]}
                        <XIcon className="ml-1 h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort by price */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>

              {/* Price range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min={minPrice + 1}
                    max={maxPrice + 5001}
                    value={priceRangeValue}
                    onChange={handlePriceRangeChange}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>₹{minPrice}</span>
                  <span>₹{priceRangeValue}</span>
                </div>
              </div>

              {/* Star rating */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Star Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => {
                    const itemCount = result?.HotelResults?.filter(
                      (item) => item.StarRating === rating
                    ).length;

                    return (
                      <label
                        key={rating}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onChange={handleRadioChange}
                            value={rating}
                            name="star"
                            checked={selectedCategory.includes(
                              `star:${rating}`
                            )}
                          />
                          <div className="ml-2 flex">
                            {[...Array(rating)].map((_, i) => (
                              <img
                                key={i}
                                src={starsvg}
                                alt="star"
                                className="h-4 w-4"
                              />
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                              <img
                                key={i}
                                src={starBlank}
                                alt="blank star"
                                className="h-4 w-4"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({itemCount})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Locality</h3>
                <div className="space-y-2">
                  {[
                    ...new Set(
                      result?.HotelResults?.filter(
                        (item) =>
                          item?.HotelLocation !== null &&
                          item?.HotelLocation !== ""
                      )?.map((item) => item?.HotelLocation)
                    ),
                  ]
                    .slice(0, displayCount)
                    .map((location, index) => {
                      const locationCount = result?.HotelResults?.filter(
                        (item) => item.HotelLocation === location
                      ).length;

                      return (
                        <label
                          key={index}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              onChange={handleRadioChange}
                              value={location}
                              name="location"
                              checked={selectedCategory.includes(
                                `location:${location}`
                              )}
                            />
                            <span className="ml-2 text-gray-700">
                              {location}
                            </span>
                          </div>
                          <span className="text-gray-500 text-sm">
                            ({locationCount})
                          </span>
                        </label>
                      );
                    })}

                  {result?.HotelResults?.length > 6 && (
                    <button
                      onClick={handleShowMore}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                    >
                      {displayCount === 6 ? (
                        <>
                          Show more
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Show less
                          <ChevronUpIcon className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FilterIcon className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </button>
          </div>

          {/* Mobile Filters Sidebar */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-screen">
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  onClick={() => setMobileFiltersOpen(false)}
                ></div>
                <div className="relative bg-white w-5/6 max-w-sm ml-auto h-screen overflow-y-auto">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Filters
                      </h2>
                      <button onClick={() => setMobileFiltersOpen(false)}>
                        <XIcon className="h-6 w-6 text-gray-500" />
                      </button>
                    </div>

                    {/* Active filters */}
                    {selectedCategory.length > 0 && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-700">
                            Active filters
                          </h3>
                          <button
                            onClick={() => setSelectedCategory([])}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCategory.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => handelClearOne(item)}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                            >
                              {item.split(":")[1]}
                              <XIcon className="ml-1 h-4 w-4" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sort by price */}
                    <div className="mb-6 border-b pb-4">
                      <button
                        onClick={() => toggleFilterSection("sort")}
                        className="flex justify-between items-center w-full"
                      >
                        <h3 className="font-medium text-gray-700">Sort By</h3>
                        {activeFilterSection === "sort" ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {activeFilterSection === "sort" && (
                        <div className="mt-3">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={sortOption}
                            onChange={handleSortChange}
                          >
                            <option value="lowToHigh">
                              Price: Low to High
                            </option>
                            <option value="highToLow">
                              Price: High to Low
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Price range */}
                    <div className="mb-6 border-b pb-4">
                      <button
                        onClick={() => toggleFilterSection("price")}
                        className="flex justify-between items-center w-full"
                      >
                        <h3 className="font-medium text-gray-700">
                          Price Range
                        </h3>
                        {activeFilterSection === "price" ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {activeFilterSection === "price" && (
                        <div className="mt-3 px-2">
                          <input
                            type="range"
                            min={minPrice + 1}
                            max={maxPrice + 5001}
                            value={priceRangeValue}
                            onChange={handlePriceRangeChange}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>₹{minPrice}</span>
                            <span>₹{priceRangeValue}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Star rating */}
                    <div className="mb-6 border-b pb-4">
                      <button
                        onClick={() => toggleFilterSection("rating")}
                        className="flex justify-between items-center w-full"
                      >
                        <h3 className="font-medium text-gray-700">
                          Star Rating
                        </h3>
                        {activeFilterSection === "rating" ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {activeFilterSection === "rating" && (
                        <div className="mt-3 space-y-2">
                          {[5, 4, 3].map((rating) => {
                            const itemCount = result?.HotelResults?.filter(
                              (item) => item.StarRating === rating
                            ).length;

                            return (
                              <label
                                key={rating}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    onChange={handleRadioChange}
                                    value={rating}
                                    name="star"
                                    checked={selectedCategory.includes(
                                      `star:${rating}`
                                    )}
                                  />
                                  <div className="ml-2 flex">
                                    {[...Array(rating)].map((_, i) => (
                                      <img
                                        key={i}
                                        src={starsvg}
                                        alt="star"
                                        className="h-4 w-4"
                                      />
                                    ))}
                                    {[...Array(5 - rating)].map((_, i) => (
                                      <img
                                        key={i}
                                        src={starBlank}
                                        alt="blank star"
                                        className="h-4 w-4"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  ({itemCount})
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="mb-6">
                      <button
                        onClick={() => toggleFilterSection("location")}
                        className="flex justify-between items-center w-full"
                      >
                        <h3 className="font-medium text-gray-700">Locality</h3>
                        {activeFilterSection === "location" ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {activeFilterSection === "location" && (
                        <div className="mt-3 space-y-2">
                          {[
                            ...new Set(
                              result?.HotelResults?.filter(
                                (item) =>
                                  item?.HotelLocation !== null &&
                                  item?.HotelLocation !== ""
                              )?.map((item) => item?.HotelLocation)
                            ),
                          ]
                            .slice(0, displayCount)
                            .map((location, index) => {
                              const locationCount =
                                result?.HotelResults?.filter(
                                  (item) => item.HotelLocation === location
                                ).length;

                              return (
                                <label
                                  key={index}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      onChange={handleRadioChange}
                                      value={location}
                                      name="location"
                                      checked={selectedCategory.includes(
                                        `location:${location}`
                                      )}
                                    />
                                    <span className="ml-2 text-gray-700">
                                      {location}
                                    </span>
                                  </div>
                                  <span className="text-gray-500 text-sm">
                                    ({locationCount})
                                  </span>
                                </label>
                              );
                            })}

                          {result?.HotelResults?.length > 6 && (
                            <button
                              onClick={handleShowMore}
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                            >
                              {displayCount === 6 ? (
                                <>
                                  Show more
                                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Show less
                                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hotel Results */}
          <div className="w-full md:w-3/4">
            {sortedAndFilteredResults && sortedAndFilteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedAndFilteredResults?.map((result, index) => (
                  <div
                    key={index}
                    onClick={(e) => handleClick(result)}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={
                          result?.HotelPicture ===
                          "https://b2b.tektravels.com/Images/HotelNA.jpg"
                            ? hotelNotFound
                            : result?.HotelPicture
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = hotelNotFound;
                        }}
                        alt={result?.HotelName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md flex items-center">
                        {[...Array(result?.StarRating)].map((_, i) => (
                          <img
                            key={i}
                            src={starsvg}
                            alt="star"
                            className="h-3 w-3"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {result?.HotelName}
                      </h3>

                      {result?.HotelLocation && (
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <svg
                            height="16"
                            viewBox="0 0 32 32"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 text-blue-500"
                          >
                            <g id="Pin-2" data-name="Pin">
                              <path
                                fill="currentColor"
                                d="m25.0464 8.4834a10 10 0 0 0 -7.9116-5.4258 11.3644 11.3644 0 0 0 -2.2691 0 10.0027 10.0027 0 0 0 -7.9121 5.4253 10.8062 10.8062 0 0 0 1.481 11.8936l6.7929 8.2588a1 1 0 0 0 1.545 0l6.7929-8.2588a10.8055 10.8055 0 0 0 1.481-11.8931zm-9.0464 8.5166a4 4 0 1 1 4-4 4.0047 4.0047 0 0 1 -4 4z"
                              ></path>
                            </g>
                          </svg>
                          {result?.HotelLocation}
                        </div>
                      )}

                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {result?.HotelAddress}
                      </p>

                      <div className="flex justify-between items-center border-t pt-3">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-xl font-bold text-blue-600">
                            ₹{result?.Price?.PublishedPriceRoundedOff}
                          </p>
                        </div>
                        <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                          Select
                          <ArrowBigRightDashIcon className="ml-1 h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <img
                  src={hotelFilter}
                  alt="No results"
                  className="mx-auto h-40 mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No hotels found
                </h2>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search for a different location
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory([]);
                    setSearchInput("");
                    setPriceRangeValue(maxPrice + 5001);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
