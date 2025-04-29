import React, { useCallback, useEffect, useState, useRef } from "react";
import OnewayFlightResult from "./OnewayFlightResult";

// import ReturnFlightSleletonBig from "./ReturnFlightSleletonBig";
// import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OnewaySearchResultform from "./OnewaySearchResultform";
// import { clearAllFareQuotesRuleAirsel } from "../../../../Redux/FareQuoteRuleAirsel/actionFlightQuoteRuleAirsel";
import { clearAllFareQuotesRuleAirsel } from "../../../src/Redux/FareQuoteRuleAirsel/actionFlightQuoteRuleAirsel";

import OnewayFlightBigFilter from "./OnewayFlightBigFilter";

import FlightSearchRightSkeleton from "./skeleton-loader/FlightSearchRightSkeleton";
import FlightSearchLeftSkeleton from "./skeleton-loader/FlightSearchLeftSkeleton";

const ResultOnewayMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [loaderFilter, setLoaderFilter] = useState(false);
  const reducerState = useSelector((state) => state);
  const [airlineCodes, setAirlineCodes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(1200);
  const [durationRange, setDurationRange] = useState([0, 1200]);
  const [stopsAirline, setStopsAirline] = useState(null);
  const [standardizedFlights1, setStandardizedFlights1] = useState(
    reducerState?.return?.returnData?.[0]?.journeyFlight || []
  );
  const [airlines, setAirlines] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedStopsReturn, setSelectedStopsRetrun] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedTimesReturn, setSelectedTimesReturn] = useState([]);
  const [selectedLandingTimes, setSelectedLandingTimes] = useState([]);
  const [selectedLandingTimesReturn, setSelectedLandingTimesReturn] = useState(
    []
  );
  const debounceTimer = useRef(null);

  const [jornyFlights, setJornyFlights] = useState([]);
  //   const [retrunFlights, setReturnFlights] = useState([]);

  const calculatePriceRange = (data) => {
    let min = Infinity;
    let max = -Infinity;
    let minDur = Infinity;
    let maxDur = -Infinity;
    let stopes = {
      nonStop: { count: 0, minPrice: Infinity },
      oneStop: { count: 0, minPrice: Infinity },
      moreThanOneStop: { count: 0, minPrice: Infinity },
    };

    let Airlines = {};
    const findStopes = (flight, stopes) => {
      if (flight.stopes == 0) {
        let count = stopes.nonStop.count + 1;
        let flightPrice = flight.price;
        let stopPrice = stopes.nonStop.minPrice;
        let stopMinPrice = Math.min(stopPrice, flightPrice);
        stopes.nonStop = { count: count, minPrice: stopMinPrice };
      } else if (flight.stopes == 1) {
        let count = stopes.oneStop.count + 1;
        let flightPrice = flight.price;
        let stopPrice = stopes.oneStop.minPrice;
        let stopMinPrice = Math.min(stopPrice, flightPrice);
        stopes.oneStop = { count: count, minPrice: stopMinPrice };
      } else {
        let count = stopes.moreThanOneStop.count + 1;
        let flightPrice = flight.price;
        let stopPrice = stopes.moreThanOneStop.minPrice;
        let stopMinPrice = Math.min(stopPrice, flightPrice);
        stopes.moreThanOneStop = { count: count, minPrice: stopMinPrice };
      }
    };
    const findAireLine = (flight, Airlines, price) => {
      let flightName = flight?.flightName;
      if (!Airlines[flightName]) {
        Airlines[flightName] = { count: 0, minPrice: Infinity };
      }
      Airlines[flightName].count++;
      Airlines[flightName].minPrice = Math.min(
        Airlines[flightName].minPrice,
        price
      );
    };
    standardizedFlights1?.forEach((flight) => {
      let price = flight?.price;
      let dur = flight?.layover;
      min = Math.min(min, price);
      max = Math.max(max, price);
      findStopes(flight, stopes);
      findAireLine(flight, Airlines, price);
    });

    let newStopsAirline = {
      JourneyStopes: stopes,
      //   ReturnStopes: stopesReturn,
      Airlines: Airlines,
    };
    setMinPrice(min);
    setMaxPrice(max);
    setPriceRange([min, max]);
    setMinDuration(minDur);
    setMaxDuration(maxDur);
    setDurationRange([minDur, maxDur]);
    setStopsAirline(newStopsAirline);
  };
  const handleFilter = useCallback(
    (
      selectedCodes,
      selectedStops,
      priceRange,
      selectedTimes,
      selectedArrivalTimes,
      durationRange,
      selectedStopsReturn,
      selectedTimesReturn,
      selectedArrivalTimesReturn,
      airlineCodes
    ) => {
      if (Array.isArray(standardizedFlights1)) {
        const filteredJorny = standardizedFlights1?.filter((flight) => {
          let airCode = flight?.flightName;
          let stops = flight?.stopes;
          let price = flight?.price;

          const matchprice =
            !priceRange ||
            (price >= priceRange?.[0] && price <= priceRange?.[1]);

          const matchStops =
            selectedStops?.length === 0 || selectedStops?.includes(stops);

          const matchAirline =
            airlineCodes?.length === 0 || airlineCodes?.includes(airCode);

          const matchTime =
            selectedTimes?.length === 0 ||
            selectedTimes?.some((timeRange) => {
              const [startHour, endHour] = timeRange;
              const flightHour = parseInt(
                flight?.departureTime?.split(":")[0],
                10
              );
              return flightHour >= startHour && flightHour <= endHour;
            });
          const matchArrivalTime =
            selectedArrivalTimes?.length === 0 ||
            selectedArrivalTimes?.some((timeRange) => {
              const [startHour, endHour] = timeRange;
              const flightHour = parseInt(
                flight?.arrivalTime?.split(":")[0],
                10
              );
              return flightHour >= startHour && flightHour <= endHour;
            });
          // console.log(matchTime, "matchTime");
          return (
            matchprice &&
            matchStops &&
            matchTime &&
            matchArrivalTime &&
            matchAirline
          );
        });

        setJornyFlights([...filteredJorny]);
        // setReturnFlights([...filteredReturn]);
      }
    },
    [standardizedFlights1]
  );
  const handleCheckboxChange = (event, stateUpdater, filterKey) => {
    const { value, checked } = event.target;
    console.log(value, checked, "valueChecked");
    const timeRange = value.split("-").map((v) => parseInt(v, 10));

    stateUpdater((prev) => {
      const updatedValues = checked
        ? [...prev, timeRange]
        : prev.filter((range) => range.join("-") !== value);
      applyFilter({ filterKey, updatedValues });
      return updatedValues;
    });
  };
  const handleAirlineChange = (event) => {
    const { value, checked } = event.target;
    // console.log(value, checked, "valueChecked");
    const airlineValue = value;
    let updateAirline;
    setAirlines((prev) => {
      updateAirline = checked
        ? [...prev, airlineValue]
        : prev.filter((air) => air !== airlineValue);
      applyFilter({ filterKey: "airlines", updatedValues: updateAirline });

      return updateAirline;
    }); // 300ms delay (adjust as needed)
  };
  const handlePriceChange = (value) => {
    // Update the price range state
    setPriceRange(value);

    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set a new timer to delay the filter function
    debounceTimer.current = setTimeout(() => {
      applyFilter({ filterKey: "priceRange", updatedValues: value });
    }, 300); // 300ms delay (adjust as needed)
  };
  const handleStopChange = (event) => {
    const { value, checked } = event.target;
    const stopValue = parseInt(value, 10);
    setSelectedStops((prev) => {
      const updateStop = checked
        ? [...prev, stopValue]
        : prev.filter((stop) => stop !== stopValue);
      applyFilter({
        filterKey: "selectedStops",
        updatedValues: updateStop,
      });
      return updateStop;
    });
  };

  const applyFilter = ({ filterKey, updatedValues }) => {
    handleFilter(
      [],
      filterKey === "selectedStops" ? updatedValues : selectedStops,
      filterKey === "priceRange" ? priceRange : priceRange,
      filterKey === "selectedTimes" ? updatedValues : selectedTimes,
      filterKey === "selectedLandingTimes"
        ? updatedValues
        : selectedLandingTimes,
      [],
      filterKey === "selectedStopsReturn" ? updatedValues : selectedStopsReturn,
      filterKey === "selectedTimesReturn" ? updatedValues : selectedTimesReturn,
      filterKey === "selectedLandingTimesReturn"
        ? updatedValues
        : selectedLandingTimesReturn,
      filterKey === "airlines" ? updatedValues : airlines
    );
  };
  const activeFilterLabels = {
    selectedStops: {
      isApplied: selectedStops.length > 0 ? true : false,
      title: "Stops",
    },
    selectedStopsReturn: {
      isApplied: selectedStopsReturn.length > 0 ? true : false,
      title: "Return Stops",
    },
    selectedTimes: {
      isApplied: selectedTimes.length > 0 ? true : false,
      title: "Departure Time",
    },
    selectedTimesReturn: {
      isApplied: selectedTimesReturn.length > 0 ? true : false,
      title: "Return Departure Time",
    },
    selectedLandingTimes: {
      isApplied: selectedLandingTimes.length > 0 ? true : false,
      title: "Arrival Time",
    },
    selectedLandingTimesReturn: {
      isApplied: selectedLandingTimesReturn.length > 0 ? true : false,
      title: "Return Arrival Time",
    },
    airlines: {
      isApplied: airlines.length > 0 ? true : false,
      title: "Airlines",
    },
    priceRange: {
      isApplied: true,
      title: "Price Range",
    },
  };
  const handleClearAllFilter = (filterKey) => {
    console.log(filterKey, "filterKey");

    handleFilter(
      [],
      ["All", "selectedStops"].includes(filterKey) ? [] : selectedStops,
      ["All", "priceRange"].includes(filterKey)
        ? [minPrice, maxPrice]
        : priceRange,
      ["All", "selectedTimes"].includes(filterKey) ? [] : selectedTimes,
      ["All", "selectedLandingTimes"].includes(filterKey)
        ? []
        : selectedLandingTimes,
      [],
      ["All", "selectedStopsReturn"].includes(filterKey)
        ? []
        : selectedStopsReturn,
      ["All", "selectedTimesReturn"].includes(filterKey)
        ? []
        : selectedTimesReturn,
      ["All", "selectedLandingTimesReturn"].includes(filterKey)
        ? []
        : selectedLandingTimesReturn,
      ["All", "airlines"].includes(filterKey) ? [] : airlines
    );

    if (["All", "airlines"].includes(filterKey)) setAirlines([]);
    if (["All", "selectedStops"].includes(filterKey)) setSelectedStops([]);
    if (["All", "selectedStopsReturn"].includes(filterKey))
      setSelectedStopsRetrun([]);
    if (["All", "selectedTimes"].includes(filterKey)) setSelectedTimes([]);
    if (["All", "selectedTimesReturn"].includes(filterKey))
      setSelectedTimesReturn([]);
    if (["All", "selectedLandingTimes"].includes(filterKey))
      setSelectedLandingTimes([]);
    if (["All", "selectedLandingTimesReturn"].includes(filterKey))
      setSelectedLandingTimesReturn([]);
    if (["All", "priceRange"].includes(filterKey))
      setPriceRange([minPrice, maxPrice]);

    // console.log("clear all filters");
  };
  useEffect(() => {
    if (!reducerState?.return?.isLoadingFilter) {
      setLoaderFilter(false);
      // calculatePriceRange();
      setStandardizedFlights1(
        reducerState?.return?.returnData?.[0]?.journeyFlight || []
      );
      //   setStandardizedFlights2(
      //     reducerState?.return?.returnData?.[0]?.returnFlight || []
      //   );
      setJornyFlights(
        reducerState?.return?.returnData?.[0]?.journeyFlight || []
      );
      //   setReturnFlights(
      //     reducerState?.return?.returnData?.[0]?.returnFlight || []
      //   );
    } else {
      setLoaderFilter(true);
    }

    if (!reducerState?.return?.isLoading) {
      setLoader(false);
      setStandardizedFlights1(
        reducerState?.return?.returnData?.[0]?.journeyFlight || []
      );
      //   setStandardizedFlights2(
      //     reducerState?.return?.returnData?.[0]?.returnFlight || []
      //   );
      if (reducerState?.return?.isLoadingFilter) {
        setJornyFlights(reducerState?.return?.returnData?.journeyFlight || []);
        // setReturnFlights(reducerState?.return?.returnData?.returnFlight || []);
      }
    } else {
      setLoader(true);
    }
  }, [reducerState?.return?.returnData, reducerState?.return]);
  useEffect(() => {
    // console.log(reducerState, "reducer state in thee result oneway main");
    calculatePriceRange();
    if (
      standardizedFlights1?.length > 0
      // && loaderFilter
    ) {
      setJornyFlights(standardizedFlights1);
      //   setReturnFlights(standardizedFlights2);
      // console.log(loaderFilter, standardizedFlights1, "standardizedFlightsdd");
    }
  }, [standardizedFlights1]);
  useEffect(() => {
    dispatch(clearAllFareQuotesRuleAirsel());
  }, []);

  return (
    <div className="bg-indigo-50 pb-4">
      {/* <div className="flightMainOneWayDiv visibleBig "> */}
      <div className=" sticky top-0 left-0 z-40 hidden md:flex  w-full z-3 bg-gradient-to-b from-primary-6000 via-primary-6000 to-primary-6000">
        {/* <Oneway2 /> */}
        <div className="container p-2 flex justify-center items-center">
          <OnewaySearchResultform />
        </div>
      </div>
      {/* </div> */}
      <div className=" visibleSmall stickyHotelDetails">
        <section className="border-t border-gray-500">
          <div className="container ">
            <div className="smallHotelEditBox">
              <div className="smallHotelEditDetails">
                <p>
                  {/* {`${flightDetails?.from?.name}-${flightDetails?.to?.name}`} */}
                </p>
                <span>
                  {/* {formattedDate} |{travller == 1 ? "Room" : "Rooms"} |{" "}
                  {travller} Guests */}
                </span>
              </div>
              <div
                onClick={() => {
                  navigate("/");
                }}
              >
                {/* <EditOutlined /> */}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="container mt-3 flex w-full  ">
        {true && (
          <div className=" w-full flex flex-col   md:flex-row gap-2  ">
            <div className="col-lg-3 visibleBig p-0 w-full  md:w-3/12 ">
              {!loaderFilter &&
              minPrice !== Infinity &&
              maxPrice !== -Infinity ? (
                <OnewayFlightBigFilter
                  airlineCodes={airlineCodes}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  priceRange={priceRange}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  durationRange={durationRange}
                  selectedStops={selectedStops}
                  selectedStopsReturn={selectedStopsReturn}
                  selectedTimes={selectedTimes}
                  selectedTimesReturn={selectedTimesReturn}
                  selectedLandingTimes={selectedLandingTimes}
                  handleCheckboxChange={handleCheckboxChange}
                  onFilter={handleFilter}
                  airlines={airlines}
                  stopsAirline={stopsAirline}
                  handleAirlineChange={handleAirlineChange}
                  handlePriceChange={handlePriceChange}
                  handleStopChange={handleStopChange}
                  setSelectedTimes={setSelectedTimes}
                  setSelectedLandingTimes={setSelectedLandingTimes}
                />
              ) : (
                <FlightSearchLeftSkeleton />
              )}
            </div>

            <div className="col-lg-9 w-full  ">
              {!loader ? (
                <OnewayFlightResult
                  jornyFlights={jornyFlights}
                  //   retrunFlights={retrunFlights}
                  handleClearAllFilter={handleClearAllFilter}
                  activeFilterLabels={activeFilterLabels}
                />
              ) : (
                <FlightSearchRightSkeleton />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultOnewayMain;
