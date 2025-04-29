import React, { useState, useEffect } from "react";

import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  hotelActionGRN,
  clearHotelReducerGRN,
  hotelGalleryRequest,
  singleHotelGRN,
} from "../../../../Redux/HotelGRN/hotel";
import { clearHotelReducer } from "../../../../Redux/Hotel/hotel";
import ResultLocation from "./ResultLocation";
import ResultDateRange from "./ResultDateRange";
import ResultGuest from "./ResultGuest";
import { swalModal } from "../../../../utility/swal";

const ResultSearchForm = ({ toggleLoader }) => {
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

  const handleLocationSelect = (location) => {
    setSelectedFrom(location);
  };

  const handleDateChange = (dates) => {
    setCheckinDate(dates.startDate);
    setCheckoutDate(dates.endDate);
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
    toggleLoader();
    setIsLoading(true);
    dispatch(clearHotelReducerGRN());
    dispatch(clearHotelReducer());
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
          checkin: checkinDate,
          checkout: checkoutDate,
          rooms: rooms,
          nationality: "IN",
        },
      ])
    );

    if (selectedFrom.hotelName) {
      setIsSIngleHotelSerched(true);
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
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
      };

      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      dispatch(hotelActionGRN(payload));
      navigate("/st-hotel/hotelresult");
    }
  };

  const renderForm = () => {
    return (
      <form className="w-full relative rounded-[10px]   bg-white/15 shadow-lg backdrop-blur-sm  border-1 border-white/15 ">
        <div className="flex flex-1 rounded-full">
          <ResultLocation
            className="flex-[1.5]"
            onLocationSelect={handleLocationSelect}
            customPadding="p-3"
          />
          <div className="self-center border-r-2 border-slate-300  h-12"></div>
          <ResultDateRange className="flex-1" onDateChange={handleDateChange} />
          <div className="self-center border-r-2 border-slate-300   h-12"></div>
          <ResultGuest
            className="flex-1"
            onSubmit={handleSubmit}
            loader={isLoading}
            onRoomDataChange={handleRoomDataChange}
            customPadding="p-3"
          />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ResultSearchForm;
