import React, { useCallback } from "react";
import { Checkbox, Input, Slider } from "antd";
import debounce from "lodash/debounce";
import starsvg from "../../../images/star.svg";
import starBlank from "../../../images/starBlank.svg";
// import "../flight/popularfilter.css";
import { ListFilter, Search } from "lucide-react";

const HotelFilterBox = ({
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onSearchTermChange,
  onClearFilters,
  minPrice,
  maxPrice,
  searchTerm,
  selectedCategories,
  priceRange,
  sortBy,
  onLocationChange,
  locations,
  selectedLocations,
}) => {
  const handleCategoryChange = (event) => {
    const value = parseInt(event.target.value, 10);
    const updatedCategories = selectedCategories?.includes(value)
      ? selectedCategories?.filter((category) => category !== value)
      : [...selectedCategories, value];
    onCategoryChange(updatedCategories);
  };

  const handleLocationChange = (event) => {
    const value = event.target.value;
    const updatedLocations = selectedLocations.includes(value)
      ? selectedLocations.filter((location) => location !== value)
      : [...selectedLocations, value];

    onLocationChange(updatedLocations);
  };

  const handlePriceChange = (value) => {
    onPriceChange(value);
  };

  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    onSearchTermChange(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearchTermChange(value);
    }, 300),
    []
  );

  const handleClearFilters = () => {
    onClearFilters();
  };

  return (
    <div className=" bg-white p-3 sticky shadow-md top-28 overflow-y-scroll max-h-[75vh] ">
      <div className="my-3 flex flex-col justify-start gap-2">
        <h5
          style={{ cursor: "pointer", fontSize: "15px", fontWeight: "700" }}
          onClick={handleClearFilters}
        >
          Clear Filters
        </h5>
      </div>

      <div className="relative  my-3 flex flex-col justify-start gap-2">
        {/* <p className="">Search By Name</p> */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search size={14} className="text-gray-700" />
        </div>
        <input
          type="text"
          placeholder="Search Hotel Name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
        />
      </div>

      <div
        className="my-3 flex flex-col justify-start gap-2"
        style={{ background: "#fff" }}
      >
        <p className="">Sort By Price</p>
        <div className="flex flex-row w-full gap-2">
          <label
            className={`flex flex-1 flex-col justify-between items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              sortBy === "highToLow"
                ? "border-primary-6000 text-primary-6000"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={handleSortChange}
          >
            <input
              type="checkbox"
              value="highToLow"
              checked={sortBy === "highToLow"}
              onChange={handleSortChange}
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                sortBy === "highToLow" ? "text-primary-6000" : "text-gray-600"
              }`}
            >
              <ListFilter size={13} />
            </span>
            <span className="text-[12px]">High to Low</span>
          </label>
          <label
            className={`flex flex-1 flex-col justify-between items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              sortBy === "lowToHigh"
                ? "border-primary-6000 text-primary-6000"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={handleSortChange}
          >
            <input
              type="checkbox"
              value="lowToHigh"
              checked={sortBy === "lowToHigh"}
              onChange={handleSortChange}
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                sortBy === "lowToHigh" ? "text-primary-6000" : "text-gray-600"
              }`}
            >
              {/* <ListFilter  /> */}
              <ListFilter size={13} className="transform  rotate-180" />
            </span>
            <span className="text-[12px]">Low to High</span>
          </label>
        </div>
      </div>

      <div className="my-3 flex flex-col justify-start gap-2">
        <p>by star Rating</p>
        <Checkbox
          value="3"
          checked={selectedCategories.includes(3)}
          onChange={handleCategoryChange}
        >
          <div className="flex flex-row gap-1">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index} className="flex flex-row gap-2">
                {index <= 2 ? (
                  <img className="pe-2" src={starsvg} alt="" />
                ) : (
                  <img className="pe-2" src={starBlank} alt="" />
                )}
              </div>
            ))}
          </div>
        </Checkbox>
        <Checkbox
          value="4"
          checked={selectedCategories.includes(4)}
          onChange={handleCategoryChange}
        >
          <div className="flex flex-row gap-1">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index}>
                {index <= 3 ? (
                  <img className="pe-2" src={starsvg} alt="" />
                ) : (
                  <img className="pe-2" src={starBlank} alt="" />
                )}
              </div>
            ))}
          </div>
        </Checkbox>
        <Checkbox
          value="5"
          checked={selectedCategories.includes(5)}
          onChange={handleCategoryChange}
        >
          <div className="flex flex-row gap-1">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index}>
                {index <= 4 ? (
                  <img className="pe-2" src={starsvg} alt="" />
                ) : (
                  <img className="pe-2" src={starBlank} alt="" />
                )}
              </div>
            ))}
          </div>
        </Checkbox>
      </div>

      <div className="my-3 flex flex-col justify-start gap-2">
        <p>Filter By Price</p>
        <Slider
          range
          step={400}
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={handlePriceChange}
        />

        <div className="d-flex flex-row justify-content-between align-items-center ">
          <span style={{ fontWeight: "600", fontSize: "13px" }}>
            ₹ {priceRange?.[0]}
          </span>
          <span style={{ fontWeight: "600", fontSize: "13px" }}>
            ₹ {priceRange?.[1]}
          </span>
        </div>
      </div>

      <div className="my-3 flex flex-col justify-start gap-2">
        <p className="">Filter by Location</p>

        {locations.map((location) => (
          <Checkbox
            key={location}
            value={location}
            checked={selectedLocations.includes(location)}
            onChange={handleLocationChange}
          >
            {location}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default HotelFilterBox;
