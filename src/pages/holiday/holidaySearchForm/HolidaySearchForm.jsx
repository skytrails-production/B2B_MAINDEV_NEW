import React, { useEffect, useState } from "react";
import HolidayLocationInput from "./HolidayLocationInput";
// import HolidayDateRange from "./HolidayDateRange";
import HolidayGuestInput from "./HolidayGuestInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearHolidayReducer } from "../../../Redux/OnePackageSearchResult/actionOneSearchPackage";

const HolidaySearchForm = () => {
  const [travellers, setTravellers] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRoomDataChange = (roomsData) => {
    setTravellers(roomsData);
  };

  const handleLocationSelect = (location) => {
    setSelectedFrom(location);
  };

  useEffect(() => {
    dispatch(clearHolidayReducer());
  }, []);

  // console.log(reducerState, "reducer state");

  const handleDateChange = (dates) => {
    setCheckinDate(dates.startDate);
    setCheckoutDate(dates.endDate);
  };

  const handleSubmit = async () => {
    if (selectedFrom) {
      navigate(`/holidaypackages/cities/${selectedFrom}`);
    }
  };

  const renderForm = () => {
    return (
      <form className="relative flex items-center justify-center rounded-[10px] border-1 border-gray-300 shadow-xl bg-white w-full md:w-1/2 mx-auto">
        <HolidayLocationInput
          className="flex-[1.5]"
          onLocationSelect={handleLocationSelect}
          customPadding="nc-hero-field-padding"
        />
        {/* <div className="self-center h-12 border-r-2 border-slate-300"></div>
        <HolidayDateRange className="flex-1" onDateChange={handleDateChange} />
        <div className="self-center h-12 border-r-2 border-slate-300"></div> */}

        <HolidayGuestInput
          className="flex-1"
          onSubmit={handleSubmit}
          onRoomDataChange={handleRoomDataChange}
        />
      </form>
    );
  };

  return renderForm();
};

export default HolidaySearchForm;
