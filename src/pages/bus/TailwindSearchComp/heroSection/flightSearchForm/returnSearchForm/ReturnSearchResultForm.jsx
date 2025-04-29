import React, { useState, useEffect, Fragment } from "react";

// import FlightLocationFrom from "../FlightLocationFrom";
// import FlightLocationTo from "../FlightLocationTo";
// import ReturnDateBox from "./ReturnDateBox";

import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// import { ipAction, tokenAction } from "../../../../../Redux/IP/actionIp";
// import {
//   returnAction,
//   returnActionClear,
// } from "../../../../../Redux/FlightSearch/Return/return";
// import { swalModal } from "../../../../../utility/swal";
// import { clearbookTicketGDS } from "../../../../../Redux/FlightBook/actionFlightBook";
// import { resetAllFareData } from "../../../../../Redux/FlightFareQuoteRule/actionFlightQuote";
// import { apiURL } from "../../../../../Constants/constant";
// import axios from "axios";
// import {
//   returnActionSearchAmd,
//   returnActionSearchTboKafila,
// } from "../../../../../Redux/FlightSearch/Return/return";
import {
  amadeusSearchRequest,
  tbo_kafila_SearchRequest,
} from "../../../../../Redux/FlightSearch/Return/return";
import { searchFlight } from "../../../../../Redux/SearchFlight/actionSearchFlight";
import RetrunGuestsInput from "./RetrunGuestsInput";
import ReturnResultLocationFrom from "./ReturnResultLocationFrom";
import ReturnResultLocationTo from "./ReturnResultLocationTo";
import ReturnResultDateBox from "./ReturnResultDateBox";
const flightClass = [
  { id: 2, value: "Y", label: "Economy" },
  { id: 3, value: "W", label: "Premium Economy" },
  { id: 4, value: "C", label: "Business" },
  { id: 6, value: "F", label: "First" },
];
const ReturnSearchResultForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const dDate = queryParams.get("date");
  const rDate = queryParams.get("retrunDate");
  const [depDate, setDepDate] = useState(dDate);
  const [retDate, setRetDate] = useState(dDate);
  const Adult = queryParams.get("Adult");
  const Child = queryParams.get("Child");
  const Infant = queryParams.get("Infant");
  const Class = queryParams.get("FlightCabinClass");
  const Class1 = JSON.parse(queryParams.get("class")) || flightClassState?.[0];

  const [fromCity, setFromCity] = useState(from);
  const [toCity, setToCity] = useState(to);
  const [departDate, setDepartDate] = useState(dDate);
  const [returnDate, setReturnDate] = useState(rDate);
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const [adult, setAdult] = useState(Adult);
  const [child, setChild] = useState(Child);
  const [infant, setInfant] = useState(Infant);
  const [flightClassState, setFlightClassState] = useState(Class1);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const handleFromSelect = (location) => {
    setFromCity(location);
  };
  const handleToSelect = (location) => {
    setToCity(location);
  };

  useEffect(() => {
    setDepDate(queryParams.get("date"));
    setRetDate(queryParams.get("retrunDate"));
  }, [queryParams]);

  // console.log(departDate, "depart date");
  // console.log(returnDate, "return date");

  const handleDateChange = (dates) => {
    setDepartDate(dayjs(dates.startDate).format("DD MMM, YY"));
    setReturnDate(dayjs(dates.endDate).format("DD MMM, YY"));
  };

  const handleTravellerClassChange = (travellers, travelClass) => {
    // console.log(travellers, travelClass);
    setAdult(travellers?.adult);
    setChild(travellers?.child);
    setInfant(travellers?.infant);
    setFlightClassState(travelClass);
  };
  const amadeusSearch = async (onwardPayloadParam, returnPayloadParam) => {
    try {
      dispatch(amadeusSearchRequest(onwardPayloadParam, returnPayloadParam));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
  };
  const flightReturnTboAndKafila = async (onWardsPayload, returnPaylods) => {
    const result = {
      onWardsFlight: [],
      returnFlights: [],
    };

    try {
      dispatch(tbo_kafila_SearchRequest(onWardsPayload, returnPaylods));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    sessionStorage.setItem("SessionExpireTime", new Date());

    const params = {
      from: fromCity.AirportCode || from,
      to: toCity.AirportCode || to,
      date: departDate,
      retrunDate: returnDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClassState),
      FlightCabinClass: flightClassState?.label,
    };
    const queryString = new URLSearchParams(params).toString();

    navigate(`/ReturnResult?${queryString}`);
  };
  const handleSubmitt = async () => {
    sessionStorage.setItem("SessionExpireTime", new Date());
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      AdultCount: adult,
      ChildCount: child,
      InfantCount: infant,
      DirectFlight: "false",
      OneStopFlight: "false",
      JourneyType: 1,
      PreferredAirlines: null,
      Segments: [
        {
          Origin: from,
          Destination: to,
          FlightCabinClass: flightClassState?.id || Class,
          PreferredDepartureTime: dDate,
          PreferredArrivalTime: dDate,
        },
      ],
      Sources: null,
      to: to,
      from: from,
      date: dDate,
      cabinClass: flightClassState?.value || Class,
      px: adult,
    };
    const payloadReturn = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      AdultCount: adult,
      ChildCount: child,
      InfantCount: infant,
      DirectFlight: "false",
      OneStopFlight: "false",
      JourneyType: 1,
      PreferredAirlines: null,
      Segments: [
        {
          Destination: fromCity.AirportCode || from,
          Origin: toCity.AirportCode || to,
          FlightCabinClass: flightClassState?.id || Class,
          PreferredDepartureTime: rDate,
          PreferredArrivalTime: rDate,
        },
      ],
      Sources: null,

      from: to,
      to: from,
      date: rDate,
      cabinClass: flightClassState?.value || Class,
      px: adult,
    };
    const searchpy = {
      from: fromCity,
      to: toCity,
      FlightCabinClass: flightClass?.id,
      date: departDate,
      returnDate: returnDate,
    };

    dispatch(searchFlight(searchpy));

    amadeusSearch(payload, payloadReturn);
    flightReturnTboAndKafila(payload, payloadReturn);

    sessionStorage.setItem("adults", adult);
    sessionStorage.setItem("childs", child);
    sessionStorage.setItem("infants", infant);
    const params = {
      from: from,
      to: to,
      date: dDate,
      retrunDate: rDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClassState),
      FlightCabinClass: flightClassState?.id,
    };
    const queryString = new URLSearchParams(params).toString();

    navigate(`/ReturnResult?${queryString}`);
  };
  useEffect(() => {
    handleSubmitt();
  }, [rDate, dDate, from, to, adult, child]);

  const renderForm = () => {
    return (
      // <form className="w-full relative rounded-[10px]   bg-white ">
      <form className="w-full relative rounded-[10px]   bg-white/15 shadow-lg backdrop-blur-sm  border-1 border-white/15 ">
        <div className="flex flex-1 rounded-full">
          <ReturnResultLocationFrom
            placeHolder="Flying from"
            desc="Where do you want to fly from?"
            className="flex-1"
            onLocationSelect={handleFromSelect}
          />
          <div className="self-center border-r border-slate-200  h-8"></div>
          <ReturnResultLocationTo
            placeHolder="Flying to"
            desc="Where you want to fly to?"
            className="flex-1"
            divHideVerticalLineClass=" -inset-x-0.5"
            onLocationSelect={handleToSelect}
          />
          <div className="self-center border-r border-slate-200  h-8"></div>
          <ReturnResultDateBox
            className="flex-1"
            onDateChange={handleDateChange}
            loader={loader}
            hasButtonSubmit={false}
            StartDate={depDate}
            EndDate={retDate}
          />
          <div className="self-center border-r border-slate-200  h-8"></div>
          <RetrunGuestsInput
            onSubmit={handleSubmit}
            onTravellerClassChange={handleTravellerClassChange}
            loader={loader}
            adult={Adult}
            child={Child}
            infant={Infant}
          />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ReturnSearchResultForm;
