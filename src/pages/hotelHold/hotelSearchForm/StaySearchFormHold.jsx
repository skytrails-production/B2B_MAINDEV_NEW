import React, { useState, useEffect } from "react";
import LocationInputHold from "./LocationInputHold";
import GuestsInputHold from "./GuestsInputHold";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  hotelActionGRN,
  clearHotelReducerGRN,
  hotelGalleryRequest,
  singleHotelGRN,
  hotelActionGRNFew,
} from "../../../Redux/HotelGRN/hotel";
import { swalModal } from "../../../utility/swal";
import { clearHotelReducer } from "../../../Redux/Hotel/hotel";
import StayStartDateHold from "./StayStartDateHold";
import StayEndDateHold from "./StayEndDateHold";

const StaySearchFormHold = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSingleHotelSearched, setIsSIngleHotelSerched] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);

  const handleRoomDataChange = (roomsData) => {
    setRooms(roomsData);
  };

  // console.log(selectedFrom, "selected from");

  useEffect(() => {
    dispatch(clearHotelReducerGRN());
    dispatch(clearHotelReducer());
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedFrom(location);
    // console.log("Selected Location:", location);
  };

  // const handleDateChange = (dates) => {
  //   setCheckinDate(dates.startDate);
  //   setCheckoutDate(dates.endDate);
  // };

  const handleStartDateChange = (dates) => {
    setCheckinDate(dates.startDate);
  };
  const handleEndDateChange = (dates) => {
    setCheckoutDate(dates.startDate);
  };

  const selectedSingleHotel =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels?.filter(
      (item) => item.hotel_code == selectedFrom?.hotelCode
    );

  // navigate by single hotel

  const handleClick = () => {
    const payload = {
      data: {
        rate_key: selectedSingleHotel?.[0]?.min_rate?.rate_key,
        group_code: selectedSingleHotel?.[0]?.min_rate?.group_code,
      },
      searchID: selectedSingleHotel?.[0]?.search_id,
      hotel_code: selectedSingleHotel?.[0]?.hotel_code,
    };

    const galleryPayload = {
      hotel_id: selectedSingleHotel?.[0]?.hotel_code,
    };
    dispatch(hotelGalleryRequest(galleryPayload));
    dispatch(singleHotelGRN(payload));
    navigate("/st-hotel/hotelresult/selectroom");
  };

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels &&
      isSingleHotelSearched
    ) {
      handleClick();
    }
  }, [reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels]);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.errors?.[0]
        ?.code == "1501"
    ) {
      swalModal("hotel", "No Result Found !");
      setIsLoading(false);
    }
  }, [reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.errors]);

  const handleSubmit = async () => {
    setIsSIngleHotelSerched(true);
    setIsLoading(true);
    sessionStorage.setItem("SessionExpireTime", new Date());
    sessionStorage.setItem("clientNationality", JSON.stringify("IN"));
    sessionStorage.setItem(
      "revisithotel",
      JSON.stringify([
        {
          grnCityCode: selectedFrom.grnCityCode,
          tboCityCode: selectedFrom.tboCityCode,
          cityName: selectedFrom.cityName,
          grnCountryCode: selectedFrom.grnCountryCode,
          tboCountryCode: selectedFrom.tboCountryCode,
          grnCountryName: selectedFrom.grnCountryName,
          tboCountryName: selectedFrom.tboCountryName,
          checkin: checkinDate.toString(),
          checkout: checkoutDate.toString(),
          rooms: rooms,
          nationality: "IN",
        },
      ])
    );

    if (selectedFrom.hotelName) {
      const payload = {
        rooms: rooms,
        rates: "concise",
        hotel_codes: [`${selectedFrom.hotelCode}`],
        currency: "INR",
        client_nationality: "IN",
        checkin: dayjs(checkinDate).format("YYYY-MM-DD"),
        checkout: dayjs(checkoutDate).format("YYYY-MM-DD"),
        cutoff_time: 30000,
        version: "2.0",
      };

      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      dispatch(hotelActionGRN(payload));
    } else {
      const payload = {
        rooms: rooms,
        rates: "concise",
        cityCode: selectedFrom?.grnCityCode,
        currency: "INR",
        client_nationality: "IN",
        checkin: dayjs(checkinDate).format("YYYY-MM-DD"),
        checkout: dayjs(checkoutDate).format("YYYY-MM-DD"),
        cutoff_time: 30000,
        version: "2.0",
        tboCityCode: selectedFrom?.tboCityCode,
        // EndUserIp: reducerState?.ip?.ipData,
        // TokenId: reducerState?.ip?.tokenData,
      };

      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      dispatch(hotelActionGRNFew(payload));
      dispatch(hotelActionGRN(payload));
      navigate(`/st-hotel/hotelresult/hotels-in-${selectedFrom.cityName}`);
    }
  };

  const renderForm = () => {
    return (
      <form className="w-full mx-2 md:mx-0 container relative flex flex-col  md:flex-row rounded-[10px] shadow-xl border-1 border-gray-300  bg-white ">
        <LocationInputHold
          className="flex-[1.5]"
          onLocationSelect={handleLocationSelect}
        />
        <div className="self-center border-r-2 border-slate-300 hidden md:flex h-12"></div>
        {/* <StayDatesRangeInput
          className="flex-1"
          onDateChange={handleDateChange}
        /> */}

        <StayStartDateHold
          className="flex-1"
          onStartDateChange={handleStartDateChange}
        />
        <div className="self-center border-r-2 border-slate-300 hidden md:flex h-12"></div>
        <StayEndDateHold
          className="flex-1"
          onEndDateChange={handleEndDateChange}
          minDateEnd={checkinDate}
        />
        <div className="self-center border-r-2 border-slate-300  hidden md:flex   h-12"></div>
        <GuestsInputHold
          className="flex-1"
          onSubmit={handleSubmit}
          loader={isLoading}
          onRoomDataChange={handleRoomDataChange}
        />
      </form>
    );
  };

  return renderForm();
};

export default StaySearchFormHold;
