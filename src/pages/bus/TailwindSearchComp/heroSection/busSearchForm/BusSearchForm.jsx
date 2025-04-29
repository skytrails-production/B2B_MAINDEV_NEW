import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BusDateBox from "./BusDateBox";
import { useDispatch, useSelector } from "react-redux";
// import {
//   busSearchAction,
//   clearBusSearchReducer,
// } from "../../../../Redux/busSearch/busSearchAction";

import {
  busSearchAction,
  clearBusSearchReducer,
} from "../../../../../Redux/busSearch/busSearchAction";
import BusLocationInputFrom from "./BusLocationInputFrom";
import BusLocationInputTo from "./BusLocationInputTo";

const BusSearchForm = () => {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departDate, setDepartDate] = useState(null);
  const reducerState = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    dispatch(clearBusSearchReducer());
  }, []);

  const handleFromSelect = (location) => {
    setFromCity(location);
  };
  const handleToSelect = (location) => {
    setToCity(location);
    if (location?.CityId === fromCity?.CityId) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    } else {
      setError(false);
    }
  };

  const handleDateChange = (dates) => {
    setDepartDate(dates.startDate);
  };

  const handleSubmit = async () => {
    sessionStorage.setItem("SessionExpireTime", new Date());

    if (toCity?.CityId === fromCity?.CityId) {
      console.log("bussubmit");
      setShake(true);
      setError(true);

      setTimeout(() => setShake(false), 500);
      return;
    }
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      DateOfJourney: dayjs(departDate).format("YYYY/MM/DD"),
      DestinationId: toCity.CityId,
      OriginId: fromCity.CityId,
    };

    console.log(payload, "clicked");
    sessionStorage.setItem(
      "busOnewayData",
      JSON.stringify([
        {
          CityId: fromCity.CityId,
          CityName: fromCity.CityName,
          __v: fromCity.__v,
          _id: fromCity._id,
        },
        {
          CityId: toCity.CityId,
          CityName: toCity.CityName,
          __v: toCity.__v,
          _id: toCity._id,
        },
        departDate,
      ])
    );

    navigate("/busresult");
    dispatch(busSearchAction(payload));
  };

  const renderForm = () => {
    return (
      <form className="w-full relative container flex rounded-[10px] shadow-xl border-1 border-gray-300  bg-white ">
        <BusLocationInputFrom
          className="flex-1"
          desc="Departure City"
          onLocationSelect={handleFromSelect}
        />
        <div className="self-center h-12 border-r-2 border-slate-300"></div>
        <BusLocationInputTo
          className="flex-1"
          desc="Arrival City"
          onLocationSelect={handleToSelect}
          error={error}
          shake={shake}
        />
        <div className="self-center h-12 border-r-2 border-slate-300"></div>
        <BusDateBox
          className="flex-1"
          onSubmit={handleSubmit}
          onDateChange={handleDateChange}
        />
      </form>
    );
  };

  return renderForm();
};

export default BusSearchForm;
