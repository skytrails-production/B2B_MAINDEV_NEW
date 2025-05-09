import React, { useState, useEffect, Fragment } from "react";

import FlightLocationFrom from "../FlightLocationFrom";
import FlightLocationTo from "../FlightLocationTo";
import ReturnDateBox from "./ReturnDateBox";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { ipAction, tokenAction } from "../../../../Redux/IP/actionIp";
import {
  returnAction,
  returnActionClear,
} from "../../../../Redux/FlightSearch/Return/return";
import { swalModal } from "../../../../utility/swal";
import { clearbookTicketGDS } from "../../../../Redux/FlightBook/actionFlightBook";
import { resetAllFareData } from "../../../../Redux/FlightFareQuoteRule/actionFlightQuote";
// import { apiURL } from "../../../../Constants/constant";
import axios from "axios";
import {
  returnActionSearchAmd,
  returnActionSearchTboKafila,
} from "../../../../Redux/FlightSearch/Return/return";
import {
  amadeusSearchRequest,
  tbo_kafila_SearchRequest,
} from "../../../../Redux/FlightSearch/Return/return";
import { searchFlight } from "../../../../Redux/SearchFlight/actionSearchFlight";
import ReturnDepartDate from "./ReturnDepartDate";
import ReturnEndDate from "./ReturnEndDate";
const ReturnSearchForm = ({ adult, child, infant, flightClass }) => {
  // console.log(flightClass, "flightclass");
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const [newDepartDateCld, setNewDepartDateCld] = useState("");
  const [loader, setLoader] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleFromSelect = (location) => {
    setFromCity(location);
  };
  const handleToSelect = (location) => {
    setToCity(location);
  };

  useEffect(() => {
    dispatch(returnActionClear());
    dispatch(returnActionClear());
    dispatch(ipAction());
    dispatch(clearbookTicketGDS());
    dispatch(resetAllFareData());
  }, []);

  useEffect(() => {
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    dispatch(tokenAction(payload));
  }, [reducerState?.ip?.ipData]);

  useEffect(() => {
    if (reducerState?.return?.isLoading === true) {
      setLoader(true);
    }
  }, [reducerState?.return?.isLoading]);

  const returnResults =
    reducerState?.return?.returnData?.data?.data?.Response?.Results;

  useEffect(() => {
    if (returnResults) {
      // if (returnResults[1] !== undefined) {
      //   navigate(`/ReturnResult`);
      // } else {
      //   navigate("/ReturnResultInternational");
      // }
      navigate(`/ReturnResult`);
    }
    if (returnResults) {
      setLoader(false);
    }
  }, [reducerState?.return?.returnData?.data?.data?.Response?.Results]);

  useEffect(() => {
    if (
      reducerState?.return?.returnData?.data?.data?.Response?.Error
        ?.ErrorCode !== 0 &&
      reducerState?.return?.returnData?.data?.data?.Response?.Error
        ?.ErrorCode !== undefined
    ) {
      // navigate("/return")
      dispatch(returnActionClear());
      swalModal(
        "flight",
        reducerState?.return?.returnData?.data?.data?.Response?.Error
          ?.ErrorMessage,
        false
      );
      setLoader(false);
    }
  }, [
    reducerState?.return?.returnData?.data?.data?.Response?.Error?.ErrorCode,
  ]);

  const handleStartDateChange = (dates) => {
    setDepartDate(dayjs(dates.startDate).format("DD MMM, YY"));
  };
  const handleEndDateChange = (dates) => {
    setReturnDate(dayjs(dates.startDate).format("DD MMM, YY"));
  };

  const totalCount = adult + child + infant;
  const amadeusSearch = async (onwardPayloadParam, returnPayloadParam) => {
    // console.log(onwardPayloadParam, returnPayloadParam, "hello");
    // setVisible(true);
    try {
      // const [
      //   onwardResult,
      //   returnResult,
      //   onwardResultCombined,
      //   returnResultCombined,
      // ] = await Promise.allSettled([
      //   axios.post(
      //     `${apiURL.baseURL}/skytrails/api/combined/AMADEUSPriceSort`,
      //     onwardPayloadParam
      //   ),
      //   axios.post(
      //     `${apiURL.baseURL}/skytrails/api/combined/AMADEUSPriceSort`,
      //     returnPayloadParam
      //   ),
      // ]);
      // if (
      //   onwardResult.status === "fulfilled" &&
      //   returnResult.status === "fulfilled"
      // ) {
      //   const fliterroundData = {
      //     journeyFlight: onwardResult?.value?.data?.result,
      //     returnFlight: returnResult?.value?.data?.result,
      //   };
      //   dispatch(setroundData(fliterroundData));
      //   setResponseSuccess(true);
      //   navigation.navigate("RoundSearchFlight", {
      //     passengerCount: adultCount + childCount + infantCount,
      //     origin: selectedOption1,
      //     destination: selectedOption2,
      //     journeyDate: selectedStartDate,
      //     returnDate: selectedEndDate,
      //     adultCount: adultCount,
      //     childCount: childCount,
      //     infantCount: infantCount,
      //     countryCode: countryCode,
      //     countryCode2: countryCode2,
      //     responseSuccess: responseSuccess,
      //   });
      //   console.log(onwardResult);
      //   setVisible(false);
      // }
      dispatch(amadeusSearchRequest(onwardPayloadParam, returnPayloadParam));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
  };
  const [error, setError] = useState(false);

  const flightReturnTboAndKafila = async (
    onWardsPayload,
    returnPaylods
    // handleSuccessResponse
  ) => {
    // console.log(onWardsPayload, returnPaylods, "kag");
    // console.log("triggeredCombinedResponse");
    const result = {
      onWardsFlight: [],
      returnFlights: [],
    };

    try {
      // const [onwardResult, returnResult] = await Promise.allSettled([
      //   axios.post(
      //     `${apiURL.baseURL}/skytrails/api/combine/combineApiRes`,
      //     onWardsPayload
      //   ),
      //   axios.post(
      //     `${apiURL.baseURL}/skytrails/api/combine/combineApiRes`,
      //     returnPaylods
      //   ),
      // ]);
      // if (
      //   onwardResult.status === "fulfilled" &&
      //   returnResult.status === "fulfilled"
      // ) {
      //   // setResult((previousResult)=>{
      //   console.log(onwardResult, "onwardResultonwardResult");
      //   //  return {...previousResult,onWardsFlight:onwardResult,returnFlights:returnResult}
      //   // })
      //   const flightTraceId = {
      //     onwards: {
      //       tbo: onwardResult?.value?.data?.result?.tvoTraceId,
      //       kafilaParam: onwardResult?.value?.data?.result?.Param,
      //     },
      //     return: {
      //       tbo: returnResult?.value?.data?.result?.tvoTraceId,
      //       kafilaParam: returnResult?.value?.data?.result?.Param,
      //     },
      //   };
      //   const updatedResponse = {
      //     ...result,
      //     onWardsFlight: onwardResult?.value?.data?.result?.sortedFinalRes,
      //     returnFlights: returnResult?.value?.data?.result?.sortedFinalRes,
      //   };
      //   console.log(onwardResult, returnResult, "successfulResponseCombined");
      //   handleSuccessResponse(updatedResponse, flightTraceId);
      // } else {
      //   console.log(onwardResult);
      // }
      // dispatch(setroundData(fliterroundData));
      dispatch(tbo_kafila_SearchRequest(onWardsPayload, returnPaylods));
    } catch (error) {
      console.error("Unexpected error:", error);
      throw error;
    }
    // console.log(result, "ResultsCombined");
  };
  const handleSubmit = async () => {
    if (toCity.AirportCode === fromCity.AirportCode) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    sessionStorage.setItem("SessionExpireTime", new Date());
    // console.log(returnDate, departDate, "returnDate departdate");

    // const payload = {
    //   EndUserIp: reducerState?.ip?.ipData,
    //   TokenId: reducerState?.ip?.tokenData,
    //   AdultCount: adult,
    //   ChildCount: child,
    //   InfantCount: infant,
    //   DirectFlight: "false",
    //   OneStopFlight: "false",
    //   JourneyType: "2",
    //   PreferredAirlines: null,
    //   Segments: [
    //     {
    //       Origin: fromCity.AirportCode,
    //       Destination: toCity.AirportCode,
    //       FlightCabinClass: flightClass?.id,
    //       PreferredDepartureTime: departDate,
    //       PreferredArrivalTime: departDate,
    //     },
    //     {
    //       Origin: toCity.AirportCode,
    //       Destination: fromCity.AirportCode,
    //       FlightCabinClass: flightClass?.id,
    //       PreferredDepartureTime: returnDate,
    //       PreferredArrivalTime: returnDate,
    //     },
    //   ],
    //   Sources: null,
    // };
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
          Origin: fromCity.AirportCode,
          Destination: toCity.AirportCode,
          FlightCabinClass: flightClass?.id,
          PreferredDepartureTime: departDate,
          PreferredArrivalTime: departDate,
        },
      ],
      Sources: null,
      to: toCity.AirportCode,
      from: fromCity.AirportCode,
      date: departDate,
      cabinClass: flightClass?.value,
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
          Destination: fromCity.AirportCode,
          Origin: toCity.AirportCode,
          FlightCabinClass: flightClass?.id,
          PreferredDepartureTime: returnDate,
          PreferredArrivalTime: returnDate,
        },
      ],
      Sources: null,

      from: toCity.AirportCode,
      to: fromCity.AirportCode,
      date: returnDate,
      cabinClass: flightClass?.value,
      px: adult,
    };
    const searchpy = {
      from: fromCity,
      to: toCity,
      FlightCabinClass: flightClass?.label,
      date: departDate,
      returnDate: returnDate,
    };

    dispatch(searchFlight(searchpy));

    // console.log(apiURL, "apiurl");
    // const data = await axios.post(
    //   `${apiURL.baseURL}/skytrails/api/combined/AMADEUSPriceSort`,
    //   payload
    // );
    //abhi k liye kiya hai
    // amadeusSearch(payload, payloadReturn);
    // flightReturnTboAndKafila(payload, payloadReturn);

    sessionStorage.setItem("adults", adult);
    sessionStorage.setItem("childs", child);
    sessionStorage.setItem("infants", infant);
    const params = {
      from: fromCity.AirportCode,
      to: toCity.AirportCode,

      date: departDate,
      retrunDate: returnDate,
      Adult: adult,
      Child: child,
      Infant: infant,
      class: JSON.stringify(flightClass),
      FlightCabinClass: flightClass?.label || flightClass,
    };
    const queryString = new URLSearchParams(params).toString();
    let isDummy = sessionStorage.getItem("isDummy");
    console.log(isDummy, "isDummy");
    // if (isDummy == "true") {
    //   navigate(
    //     `/flight-details-dummy/round-trip/${fromCity.AirportCode}-${toCity.AirportCode}/adt${adult}chd${child}inf${infant}?${queryString}`
    //   );
    // } else {
    navigate(
      `/flight-details/round-trip/${fromCity.AirportCode}-${toCity.AirportCode}/adt${adult}chd${child}inf${infant}?${queryString}`
    );
    // }

    // dispatch(returnAction(payload));
  };
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
        <div className="flex flex-1 rounded-full flex-col  md:flex-row">
          <FlightLocationFrom
            placeHolder="Flying from"
            desc="Where do you want to fly from?"
            className="flex-1"
            onLocationSelect={handleFromSelect}
          />
          <div className="self-center border-r-2 border-gray-300 hidden md:flex h-12"></div>
          <FlightLocationTo
            placeHolder="Flying to"
            desc="Where you want to fly to?"
            className="flex-1"
            divHideVerticalLineClass=" -inset-x-0.5"
            onLocationSelect={handleToSelect}
            error={error}
            shake={shake}
          />
          <div className="self-center border-r-2 border-gray-300 hidden md:flex h-12"></div>
          {/* <ReturnDateBox
            // selectsRange={dropOffLocationType !== "oneWay"}
            className="flex-1"
            onSubmit={handleSubmit}
            onDateChange={handleDateChange}
            loader={loader}
          /> */}
          <ReturnDepartDate
            // selectsRange={dropOffLocationType !== "oneWay"}
            className="flex-1"
            // onSubmit={handleSubmit}
            onStartDateChange={handleStartDateChange}
          />
          <div className="self-center border-r-2 border-slate-300 hidden md:flex h-12"></div>
          <ReturnEndDate
            // selectsRange={dropOffLocationType !== "oneWay"}
            className="flex-1"
            onSubmit={handleSubmit}
            onEndDateChange={handleEndDateChange}
            minDateEnd={departDate}
          />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ReturnSearchForm;
