import React, { useEffect, useState, useMemo } from "react";
import { Checkbox, Slider, Radio, Input } from "antd";

import {
  before6Am,
  twelvePmto6pm,
  after6Pm,
  ac,
  nonac,
  sleeper,
  seater,
  sixamto12pm,
} from "./busFilterIcons";

const { Group: CheckboxGroup } = Checkbox;

const BusFilterBig = ({ onFilter, busData }) => {
  const [busType, setBusType] = useState([]);
  const [departureTime, setDepartureTime] = useState([]);
  const [arrivalTime, setArrivalTime] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortPrice, setSortPrice] = useState(null);
  const [travelName, setTravelName] = useState([]);
  const [searchTravel, setSearchTravel] = useState("");
  const [boardingLocation, setBoardingLocation] = useState([]);
  const [searchBoarding, setSearchBoarding] = useState("");
  const [droppingLocation, setDroppingLocation] = useState([]);
  const [searchDropping, setSearchDropping] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [debouncedSearchTravel, setDebouncedSearchTravel] =
    useState(searchTravel);

  const calculatePriceRange = () => {
    const min = Math.min(
      ...busData.map((bus) => bus.BusPrice.PublishedPriceRoundedOff)
    );
    const max = Math.max(
      ...busData.map((bus) => bus.BusPrice.PublishedPriceRoundedOff)
    );
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
  };

  useEffect(() => {
    calculatePriceRange();
  }, []);

  const handleBusTypeChange = (e) => {
    const value = e.target.value;
    setBusType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      busType: e.target.checked
        ? [...busType, value]
        : busType.filter((item) => item !== value),
    });
  };

  const handleDepartureTimeChange = (e) => {
    const value = e.target.value;
    setDepartureTime((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      departureTime: e.target.checked
        ? [...departureTime, value]
        : departureTime.filter((item) => item !== value),
    });
  };

  const handleArrivalTimeChange = (e) => {
    const value = e.target.value;
    setArrivalTime((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      arrivalTime: e.target.checked
        ? [...arrivalTime, value]
        : arrivalTime.filter((item) => item !== value),
    });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    applyFilters({ priceRange: value });
  };

  const handleSortChange = (e) => {
    setSortPrice(e.target.value);
    applyFilters({ sortPrice: e.target.value });
  };

  const handleTravelNameChange = (e) => {
    const value = e.target.value;
    setTravelName((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      travelName: e.target.checked
        ? [...travelName, value]
        : travelName.filter((item) => item !== value),
    });
  };

  const handleSearchTravelChange = (e) => {
    const value = e.target.value;
    setSearchTravel(value);
    applyFilters({ searchTravel: value });
  };

  const handleBoardingLocationChange = (e) => {
    const value = e.target.value;
    setBoardingLocation((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      boardingLocation: e.target.checked
        ? [...boardingLocation, value]
        : boardingLocation.filter((item) => item !== value),
    });
  };

  const handleSearchBoardingChange = (e) => {
    const value = e.target.value;
    setSearchBoarding(value);
    applyFilters({ searchBoarding: value });
  };

  const handleDroppingLocationChange = (e) => {
    const value = e.target.value;
    setDroppingLocation((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    applyFilters({
      droppingLocation: e.target.checked
        ? [...droppingLocation, value]
        : droppingLocation.filter((item) => item !== value),
    });
  };

  const handleSearchDroppingChange = (e) => {
    const value = e.target.value;
    setSearchDropping(value);
    applyFilters({ searchDropping: value });
  };

  const applyFilters = (newFilters) => {
    const filters = {
      busType,
      departureTime,
      arrivalTime,
      priceRange,
      sortPrice,
      travelName,
      searchTravel,
      boardingLocation,
      searchBoarding,
      droppingLocation,
      searchDropping,
      ...newFilters,
    };
    onFilter(filters);
  };

  // const uniqueTravelNames = [
  //     ...new Set(busData?.map((bus) => bus.TravelName)),
  // ]?.filter((name) => name?.toLowerCase()?.includes(searchTravel?.toLowerCase()));

  // const uniqueBoardingLocations = [
  //     ...new Set(
  //         busData?.flatMap((bus) =>
  //             bus?.BoardingPointsDetails?.map((point) => point?.CityPointLocation)
  //         )
  //     ),
  // ]?.filter((location) =>
  //     location?.toLowerCase()?.includes(searchBoarding?.toLowerCase())
  // );

  // const uniqueDroppingLocations = [
  //     ...new Set(
  //         busData?.flatMap((bus) =>
  //             bus?.DroppingPointsDetails?.map((point) => point?.CityPointLocation)
  //         )
  //     ),
  // ]?.filter((location) =>
  //     location?.toLowerCase()?.includes(searchDropping?.toLowerCase())
  // );

  // const uniqueTravelNames = useMemo(
  //     () =>
  //         [...new Set(busData?.map((bus) => bus.TravelName))]?.filter((name) =>
  //             name?.toLowerCase()?.includes(searchTravel?.toLowerCase())
  //         ),
  //     [busData, searchTravel]
  // );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTravel(searchTravel);
    }, 200);

    // Clean up the timeout if searchTravel changes before the 200ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchTravel]);

  const uniqueTravelNames = useMemo(
    () =>
      [...new Set(busData?.map((bus) => bus.TravelName))]?.filter((name) =>
        name?.toLowerCase()?.includes(debouncedSearchTravel?.toLowerCase())
      ),
    [busData, debouncedSearchTravel]
  );

  const uniqueBoardingLocations = useMemo(
    () =>
      [
        ...new Set(
          busData?.flatMap((bus) =>
            bus?.BoardingPointsDetails?.map((point) => point?.CityPointLocation)
          )
        ),
      ]?.filter((location) =>
        location?.toLowerCase()?.includes(searchBoarding?.toLowerCase())
      ),
    [busData, searchBoarding]
  );

  const uniqueDroppingLocations = useMemo(
    () =>
      [
        ...new Set(
          busData?.flatMap((bus) =>
            bus?.DroppingPointsDetails?.map((point) => point?.CityPointLocation)
          )
        ),
      ]?.filter((location) =>
        location?.toLowerCase()?.includes(searchDropping?.toLowerCase())
      ),
    [busData, searchDropping]
  );

  const clearFilters = () => {
    setBusType([]);
    setDepartureTime([]);
    setArrivalTime([]);
    setPriceRange([0, 5000]);
    setSortPrice(null);
    setTravelName([]);
    setSearchTravel("");
    setBoardingLocation([]);
    setSearchBoarding("");
    setDroppingLocation([]);
    setSearchDropping("");

    // Apply cleared filters
    applyFilters({
      busType: [],
      departureTime: [],
      arrivalTime: [],
      priceRange: [minPrice, maxPrice],
      sortPrice: null,
      travelName: [],
      searchTravel: "",
      boardingLocation: [],
      searchBoarding: "",
      droppingLocation: [],
      searchDropping: "",
    });
  };

  return (
    <div className="border-gray-500 holidayFilterMainBox border-0 shadow-sm bg-white">
      <div className="holidayFilterClear">
        <h5
          style={{ cursor: "pointer", fontSize: "15px", fontWeight: "700" }}
          onClick={clearFilters}
        >
          Clear Filters
        </h5>
      </div>

      <div
        className="flex flex-col justify-start gap-2 my-3 text-gray-700"
        //style={{ background: "#fff" }}
      >
        <p className="">By Bus Type</p>
        <div className="flex flex-row w-full gap-2">
          <label
            className={`flex flex-1 flex-col justify-between items-center gap-2 p-1 border-2 rounded-lg cursor-pointer text-gray-600 transition-all ${
              busType.includes("A/C")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleBusTypeChange}
            onChange={(e) => {
              handleBusTypeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={busType.includes("A/C")}
              //   onChange={handleBusTypeChange}
              value="A/C"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                busType.includes("A/C") ? "text-primary-6000" : "text-gray-600"
              }`}
            >
              {ac}
            </span>
            <span
              className={`text-[12px] ${
                busType.includes("A/C") ? "text-primary-6000" : "text-gray-600"
              } `}
            >
              A/C
            </span>
          </label>
          <label
            className={`flex flex-1 flex-col justify-between items-center gap-2 p-1 border-2 rounded-lg cursor-pointer text-gray-600 transition-all ${
              busType.includes("Non A/C")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleBusTypeChange}
            onChange={(e) => {
              handleBusTypeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={busType.includes("Non A/C")}
              //   onChange={handleBusTypeChange}
              value="Non A/C"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                busType.includes("Non A/C")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {nonac}
            </span>
            <span
              className={`text-[12px] ${
                busType.includes("Non A/C")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              Non A/C
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between items-center gap-2 p-1 text-gray-600 border-2 rounded-lg cursor-pointer transition-all ${
              busType.includes("Sleeper")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleBusTypeChange}
            onChange={(e) => {
              handleBusTypeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={busType.includes("Sleeper")}
              //   onChange={handleBusTypeChange}
              value="Sleeper"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                busType.includes("Sleeper")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {sleeper}
            </span>
            <span
              className={`text-[12px] ${
                busType.includes("Sleeper")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              Sleeper
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              busType.includes("Seater")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleBusTypeChange}
            onChange={(e) => {
              handleBusTypeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={busType.includes("Seater")}
              //   onChange={handleBusTypeChange}
              value="Seater"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                busType.includes("Seater")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {seater}
            </span>
            <span
              className={`text-[12px] ${
                busType.includes("Seater")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              Seater
            </span>
          </label>
        </div>
      </div>

      {/* Departure Time Filter */}

      <div
        className="flex flex-col justify-start gap-2 my-3"
        //style={{ background: "#fff" }}
      >
        <p className="text-gray-600">Departure Time</p>
        <div className="flex flex-row w-full gap-2">
          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              departureTime.includes("before6am")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleDepartureTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={departureTime.includes("before6am")}
              //   onChange={handleDepartureTimeChange}
              value="before6am"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                departureTime.includes("before6am")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {before6Am}
            </span>
            <span
              className={`text-[12px] ${
                departureTime.includes("before6am")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              Before <br /> 6 AM
            </span>
          </label>
          <label
            className={`flex flex-1 flex-col justify-between  text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              departureTime.includes("6amTo12pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleDepartureTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={departureTime.includes("6amTo12pm")}
              //   onChange={handleDepartureTimeChange}
              value="6amTo12pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                departureTime.includes("6amTo12pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {sixamto12pm}
            </span>
            <span
              className={`text-[12px] ${
                departureTime.includes("6amTo12pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              6 AM <br /> - 6 PM
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              departureTime.includes("12pmTo6pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleDepartureTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={departureTime.includes("12pmTo6pm")}
              //   onChange={handleDepartureTimeChange}
              value="12pmTo6pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                departureTime.includes("12pmTo6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {twelvePmto6pm}
            </span>
            <span
              className={`text-[12px] ${
                departureTime.includes("12pmTo6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              12 PM <br /> - 6 PM
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              departureTime.includes("after6pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleDepartureTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={departureTime.includes("after6pm")}
              //   onChange={handleDepartureTimeChange}
              value="after6pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                departureTime.includes("after6pm")
                  ? "text-primary-700"
                  : "text-gray-600"
              }`}
            >
              {after6Pm}
            </span>
            <span
              className={`text-[12px] ${
                departureTime.includes("after6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              After <br /> 6 PM
            </span>
          </label>
        </div>
      </div>

      {/* Arrival Time Filter */}

      <div
        className="flex flex-col justify-start gap-2 my-3 text-gray-600"
        // style={{ background: "#fff" }}
      >
        <p className="">Departure Time</p>
        <div className="flex flex-row w-full gap-2">
          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              arrivalTime.includes("before6am")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleArrivalTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={arrivalTime.includes("before6am")}
              //   onChange={handleDepartureTimeChange}
              value="before6am"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                arrivalTime.includes("before6am")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {before6Am}
            </span>
            <span
              className={`text-[12px] ${
                busType.includes("before6am")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              Before <br /> 6 AM
            </span>
          </label>
          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              arrivalTime.includes("6amTo12pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleArrivalTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={departureTime.includes("6amTo12pm")}
              //   onChange={handleDepartureTimeChange}
              value="6amTo12pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                arrivalTime.includes("6amTo12pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {sixamto12pm}
            </span>
            <span
              className={`text-[12px] ${
                arrivalTime.includes("6amTo12pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              6 AM <br /> - 6 PM
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              arrivalTime.includes("12pmTo6pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleArrivalTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={arrivalTime.includes("12pmTo6pm")}
              //   onChange={handleDepartureTimeChange}
              value="12pmTo6pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                arrivalTime.includes("12pmTo6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {twelvePmto6pm}
            </span>
            <span
              className={`text-[12px] ${
                arrivalTime.includes("12pmTo6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              12 PM <br /> - 6 PM
            </span>
          </label>

          <label
            className={`flex flex-1 flex-col justify-between text-gray-600 items-center gap-2 p-1 border-2 rounded-lg cursor-pointer transition-all ${
              arrivalTime.includes("after6pm")
                ? "border-indigo-600 text-indigo-600"
                : "border-gray-200 text-gray-600"
            }`}
            // onClick={handleDepartureTimeChange}
            onChange={(e) => {
              handleArrivalTimeChange(e);
            }}
          >
            <input
              type="checkbox"
              checked={arrivalTime.includes("after6pm")}
              //   onChange={handleDepartureTimeChange}
              value="after6pm"
              className="hidden"
            />
            <span
              className={`checkedSVG pe-2 transition-all ${
                arrivalTime.includes("after6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              }`}
            >
              {after6Pm}
            </span>
            <span
              className={`text-[12px] ${
                arrivalTime.includes("after6pm")
                  ? "text-primary-6000"
                  : "text-gray-600"
              } `}
            >
              After <br /> 6 PM
            </span>
          </label>
        </div>
      </div>

      {/* Price Range Filter */}

      <div className="text-gray-600 holidayFilterSlider">
        <p>Filter By Price</p>
        <Slider
          range
          defaultValue={[minPrice, maxPrice]}
          min={minPrice}
          max={maxPrice}
          onChange={handlePriceChange}
        />

        <div className="flex-row d-flex justify-content-between align-items-center ">
          <span style={{ fontWeight: "600", fontSize: "13px" }}>
            ₹ {priceRange?.[0]}
          </span>
          <span style={{ fontWeight: "600", fontSize: "13px" }}>
            ₹ {priceRange?.[1]}
          </span>
        </div>
      </div>

      {/* Travel Name Filter */}

      <div className="text-gray-600 PackagetagFilters">
        <p className="">Travel Name</p>
        <div className="bustravelNameBox">
          <Input
            placeholder="Search Travel Name"
            className="border-gray-300 rounded-md"
            value={searchTravel}
            onChange={handleSearchTravelChange}
          />
          <div>
            {uniqueTravelNames.map((name) => (
              <Checkbox
                key={name}
                checked={travelName.includes(name)}
                onChange={handleTravelNameChange}
                value={name}
              >
                {name}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>

      {/* Boarding Location Filter */}

      <div
        className="p-2 rounded-lg PackagetagFilters"
        style={{ background: "#fff" }}
      >
        <p className="">Boarding Location</p>
        <div className="bustravelNameBox">
          <Input
            placeholder="Search Travel Name"
            className="border-gray-300 rounded-md"
            value={searchBoarding}
            onChange={handleSearchBoardingChange}
          />
          <div className="">
            {uniqueBoardingLocations.map((location) => (
              <Checkbox
                key={location}
                checked={boardingLocation.includes(location)}
                onChange={handleBoardingLocationChange}
                value={location}
              >
                {location}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>

      {/* Dropping Location Filter */}

      <div
        className="p-2 rounded-lg PackagetagFilters"
        style={{ background: "#fff" }}
      >
        <p className="">Dropping Location</p>
        <div className="bustravelNameBox">
          <Input
            placeholder="Search Travel Name"
            className="border-gray-300 rounded-md"
            value={searchDropping}
            onChange={handleSearchDroppingChange}
          />
          <div>
            {uniqueDroppingLocations.map((location) => (
              <Checkbox
                key={location}
                checked={droppingLocation.includes(location)}
                onChange={handleDroppingLocationChange}
                value={location}
              >
                {location}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusFilterBig;
