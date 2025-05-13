import React, { useState, Fragment, useEffect } from "react";
import FlightDateBox from "./FlightDateBox";
import FlightLocationFrom from "../FlightLocationFrom";
import FlightLocationTo from "../FlightLocationTo";
import { useNavigate } from "react-router-dom";

// import {
//   searchFlight,
//   clearSearch,
// } from "../../../../../Redux/SearchFlight/actionSearchFlight";
// import { resetAllFareData } from "../../../../../Redux/FlightFareQuoteRule/actionFlightQuote";
// import { returnActionClear } from "../../../../../Redux/FlightSearch/Return/return";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { clearbookTicketGDS } from "../../../../Redux/FlightBook/actionFlightBook";
import { resetOneWay } from "../../../../Redux/FlightSearch/oneWay";
import {
  searchaAirportListReq,
  searchFlightListReq,
} from "../../../../Redux/FlightList/actionFlightList";
import {
  clearSearch,
  searchFlight,
} from "../../../../Redux/SearchFlight/actionSearchFlight";
import { resetAllFareData } from "../../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { returnActionClear } from "../../../../Redux/FlightSearch/Return/return";

const OnewaySearchForm = ({ adult, child, infant, flightClass }) => {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departDate, setDepartDate] = useState(null);
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const [newDepartDateCld, setNewDepartDateCld] = useState("");
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  let isDummy = sessionStorage.getItem("isDummy");

  let storedSearches =
    JSON.parse(localStorage.getItem("homeRecentSearch")) || [];

  useEffect(() => {
    dispatch(clearbookTicketGDS());
    dispatch(resetAllFareData());
    dispatch(returnActionClear());
    dispatch(clearSearch());
    dispatch(resetOneWay());
    dispatch(clearbookTicketGDS());
    dispatch(resetAllFareData());
    dispatch(searchFlightListReq());
    dispatch(searchaAirportListReq());
  }, []);

  const handleFromSelect = (location) => {
    setFromCity(location);
  };
  const handleToSelect = (location) => {
    setToCity(location);
  };

  const handleDateChange = (dates) => {
    setDepartDate(dayjs(dates.startDate).format("DD MMM, YY"));
    setNewDepartDateCld(dayjs(dates.startDate).format("DD MMM, YY"));
  };

  const totalCount = adult + child + infant;

  const handleSubmit = async () => {
    if (toCity.AirportCode === fromCity.AirportCode) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    sessionStorage.setItem("SessionExpireTime", new Date());

    const searchpy = {
      from: fromCity,
      to: toCity,
      FlightCabinClass: flightClass.value,
      date: departDate,
      // returnDate: returnDate,
    };

    dispatch(searchFlight(searchpy));

    sessionStorage.setItem("adults", adult);
    sessionStorage.setItem("childs", child);
    sessionStorage.setItem("infants", infant);
    const params = {
      from: fromCity.AirportCode,
      to: toCity.AirportCode,

      date: departDate,
      // retrunDate: returnDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClass),
      FlightCabinClass: flightClass.value,
    };
    const recentSearchesData = {
      from: fromCity.AirportCode,
      to: toCity.AirportCode,

      date: departDate,
      // retrunDate: returnDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClass),
      FlightCabinClass: flightClass.value,
      fromDetails: fromCity,
      toDetails: toCity,
    };

    const isDuplicate = storedSearches.some(
      (search) =>
        search.date === recentSearchesData.date &&
        search.from === recentSearchesData.from &&
        search.to === recentSearchesData.to
    );
    if (!isDuplicate) {
      storedSearches.push(recentSearchesData);
      if (storedSearches.length > 5) {
        storedSearches.shift();
      }
      localStorage.setItem("homeRecentSearch", JSON.stringify(storedSearches));
    }
    const queryString = new URLSearchParams(params).toString();
    // if (isDummy) {
    //   navigate(
    //     `/flight-details-dummy/one-way/:city/:passengers/?${queryString}`
    //   );
    // } else {
    navigate(`/flight-details/one-way/:city/:passengers/?${queryString}`);
    // navigate(`/flight-details/one-way/:city/:passengers/?${queryString}`);
    // }

    // dispatch(returnAction(payload));
  };
  console.log(typeof isDummy, "isDummyisDummyisDummyisDummyisDummyisDummy");

  const [error, setError] = useState(false);
  useEffect(() => {
    if (toCity?.AirportCode == fromCity?.AirportCode && toCity && fromCity) {
      setError(true);
      return;
    } else {
      setError(false);
      return;
    }
  }, [toCity, fromCity]);

  const renderForm = () => {
    return (
      <form className="w-full relative rounded-[10px]   ">
        {/* <div className="flex flex-1 rounded-full"> */}
        <div className="flex flex-1 rounded-full flex-col  md:flex-row">
          <FlightLocationFrom
            placeHolder="Flying from"
            desc="Where do you want to fly from?"
            className="flex-1"
            onLocationSelect={handleFromSelect}
          />
          {/* <div className="self-center border-r-2 border-slate-300  h-12"></div> */}
          <div className="self-center border-r-2 border-slate-300 hidden md:flex h-12"></div>
          <FlightLocationTo
            placeHolder="Flying to"
            desc="Where you want to fly to?"
            className="flex-1"
            divHideVerticalLineClass=" -inset-x-0.5"
            onLocationSelect={handleToSelect}
            error={error}
            shake={shake}
          />
          <div className="self-center border-r-2 border-slate-300 hidden md:flex h-12"></div>
          <FlightDateBox
            // selectsRange={dropOffLocationType !== "oneWay"}
            className="flex-1"
            onSubmit={handleSubmit}
            onDateChange={handleDateChange}
          />
        </div>
        {/* {error && <div>origin destination cat be same</div>} */}
      </form>
    );
  };

  return renderForm();
};

export default OnewaySearchForm;
