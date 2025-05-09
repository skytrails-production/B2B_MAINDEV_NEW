import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  amadeusSearchRequest,
  tbo_kafila_SearchRequest,
} from "../../Redux/FlightSearch/Return/return";
import { searchFlight } from "../../Redux/SearchFlight/actionSearchFlight";

import ReturnResultLocationFrom from "./flightSearchForm/onewaySearchForm/ReturnResultLocationFrom";
import ReturnResultLocationTo from "./flightSearchForm/onewaySearchForm/ReturnResultLocationTo";
import RetrunGuestsInput from "./flightSearchForm/onewaySearchForm/RetrunGuestsInput";
import OnewayResultDateBox from "./flightSearchForm/onewaySearchForm/OnewayResultDateBox";
const flightClass = [
  { id: 2, value: "Y", label: "Economy" },
  { id: 3, value: "W", label: "Premium Economy" },
  { id: 4, value: "C", label: "Business" },
  { id: 6, value: "F", label: "First" },
];
const OnewaySearchResultFormDummy = () => {
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const tareekh = queryParams.get("date");
  const [dDate, setdDate] = useState(tareekh);
  const [fromOrigin, setFromOrigin] = useState(from);
  const [toDestination, setToDestination] = useState(to);

  // const rDate = queryParams.get("retrunDate");
  const Adult = queryParams.get("Adult");
  const Child = queryParams.get("Child");
  const Infant = queryParams.get("Infant");
  const Class = queryParams.get("FlightCabinClass");
  const Class1 = JSON.parse(queryParams.get("class")) || flightClassState?.[0];

  useEffect(() => {
    setdDate(queryParams.get("date"));
    // console.log("dfklefkldfklsdfdklsafhdlsahfdshfds");
  }, [queryParams]);

  // console.log(dDate, "d date");
  // console.log(queryParams, from, Class, Class1, "queryParams");

  const [fromCity, setFromCity] = useState(from);
  const [toCity, setToCity] = useState(to);
  const [departDate, setDepartDate] = useState(dDate);
  // const [returnDate, setReturnDate] = useState(rDate);
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const [adult, setAdult] = useState(Adult);
  const [child, setChild] = useState(Child);
  const [infant, setInfant] = useState(Infant);
  const [flightClassState, setFlightClassState] = useState(Class1);

  // console.log(flightClassState, "flight class state");

  // const [newDepartDateCld, setNewDepartDateCld] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const handleFromSelect = (location) => {
    setFromCity(location);
  };
  const handleToSelect = (location) => {
    setToCity(location);
  };

  const handleDateChange = (dates) => {
    setDepartDate(dayjs(dates.startDate).format("DD MMM, YY"));
    // setReturnDate(dayjs(dates.endDate).format("DD MMM, YY"));
  };
  const handleTravellerClassChange = (travellers, travelClass) => {
    // console.log(travellers, travelClass);
    setAdult(travellers?.adult);
    setChild(travellers?.child);
    setInfant(travellers?.infant);
    setFlightClassState(travelClass);
  };
  const amadeusSearch = async (onwardPayloadParam) => {
    try {
      dispatch(amadeusSearchRequest(onwardPayloadParam));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
  };
  const flightReturnTboAndKafila = async (onWardsPayload) => {
    // const result = {
    //   onWardsFlight: [],
    //   returnFlights: [],
    // };

    try {
      // dispatch(tbo_kafila_SearchRequest(onWardsPayload));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    sessionStorage.setItem("SessionExpireTime", new Date());

    const params = {
      from: fromCity.AirportCode || to,
      to: toCity.AirportCode || from,
      date: departDate,
      // retrunDate: returnDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClassState),
      FlightCabinClass: flightClassState?.label,
    };
    const queryString = new URLSearchParams(params).toString();

    navigate(
      `/flight-details-dummy/one-way/${fromCity}-${toCity}/adt${Adult}-chd${Child}-inf${infant}?${queryString}`
    );
    // navigate("/ReturnResult");
  };
  const handleSubmitt = async () => {
    // console.log(dDate, rDate, "ddateesdfdf");
    sessionStorage.setItem("SessionExpireTime", new Date());
    // console.log(flightClassState, "flightstateclass");
    setFromOrigin(from);
    setToDestination(to);
    setdDate(tareekh);

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

    const searchpy = {
      from: fromCity,
      to: toCity,
      FlightCabinClass: flightClassState?.label,
      date: departDate,
      // returnDate: returnDate,
    };

    dispatch(searchFlight(searchpy));

    amadeusSearch(payload);
    flightReturnTboAndKafila(payload);

    sessionStorage.setItem("adults", adult);
    sessionStorage.setItem("childs", child);
    sessionStorage.setItem("infants", infant);
    const params = {
      from: from,
      to: to,
      date: dDate,
      // retrunDate: rDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClassState),
      FlightCabinClass: flightClassState?.id,
    };
    const queryString = new URLSearchParams(params).toString();

    navigate(
      `/flight-details-dummy/one-way/${from}-${to}/adt${Adult}chd${Child}inf${infant}?${queryString}`
    );
    // navigate("/ReturnResult");
  };
  useEffect(() => {
    // console.log("handlesubmitcall");
    handleSubmitt();
  }, [dDate, fromOrigin, toDestination, adult, child]);
  const renderForm = () => {
    return (
      <form className="w-full relative rounded-[10px]   bg-white/15 shadow-lg backdrop-blur-sm  border-1 border-white/15">
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
          <OnewayResultDateBox
            // selectsRange={dropOffLocationType !== "oneWay"}
            className="flex-1"
            onSubmit={handleSubmit}
            onDateChange={handleDateChange}
            loader={loader}
            hasButtonSubmit={false}
            StartDate={dDate}
            // EndDate={rDate}
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

export default OnewaySearchResultFormDummy;
