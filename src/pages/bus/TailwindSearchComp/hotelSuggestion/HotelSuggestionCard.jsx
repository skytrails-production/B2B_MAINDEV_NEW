import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { hotelActionGRN } from "../../../Redux/HotelGRN/hotel";

const HotelSuggestionCard = ({ className = "", data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function getNextDayDateIfAfter9PM(val) {
    const currentDate = new Date();
    // if (currentDate.getHours() >= 21) {
    currentDate.setDate(currentDate.getDate() + val);
    // }
    return currentDate;
  }

  const todaydate = getNextDayDateIfAfter9PM(1);
  const nextDate = getNextDayDateIfAfter9PM(2);

  async function searchHotel(event) {
    sessionStorage.setItem("SessionExpireTime", new Date());

    if (event?.hotelCode) {
      let payload = {
        rooms: [
          {
            adults: 1,
            children_ages: [],
          },
        ],
        checkin: dayjs(todaydate).format("YYYY-MM-DD"),
        checkout: dayjs(nextDate).format("YYYY-MM-DD"),
        hotel_codes: [`${event.Location.hotelCode}`],
        client_nationality: "IN",
        currency: "INR",
        cutoff_time: 30000,
        rates: "concise",
        version: "2.0",
      };
      sessionStorage.setItem("grnPayload", JSON.stringify(payload));

      dispatch(hotelActionGRN(payload));
    } else {
      let payload = {
        // ...event,
        rooms: [
          {
            adults: 1,
            children_ages: [],
          },
        ],
        cityCode: event?.grnCityCode || event?.cityCode,
        checkin: dayjs(todaydate).format("YYYY-MM-DD"),
        checkout: dayjs(nextDate).format("YYYY-MM-DD"),
        client_nationality: "IN",
        currency: "INR",
        cutoff_time: 30000,
        rates: "concise",
        version: "2.0",
      };
      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      sessionStorage.setItem(
        "revisithotel",
        JSON.stringify([
          {
            cityCode: event?.grnCityCode || event?.tboCityCode,
            cityName: event?.cityName,
            countryCode: event?.grnCountryCode || event?.tboCountryCode,
            countryName: event?.grnCountryName || event?.tboCountryName,
            checkin: todaydate,
            checkout: nextDate,
            rooms: [
              {
                adults: 1,
                children_ages: [],
              },
            ],
            nationality: "IN",
            client_nationality: "IN",
          },
        ])
      );
      dispatch(hotelActionGRN(payload));
    }

    navigate("/st-hotel/hotelresult");
    // }
  }

  return (
    <div
      onClick={() => searchHotel(data)}
      className={`nc-CardCategoryBox1 cursor-pointer relative flex items-center p-2 sm:p-2 py-6 sm:py-6 [ nc-box-has-hover ] [ nc-dark-box-bg-has-hover ] ${className}`}
    >
      {/* <Badge
                className="absolute right-2 top-2"
                color="gray"
                name={convertNumbThousand(count)}
            /> */}

      <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden">
        <img src={data?.image} alt="" className="object-cover w-full h-full" />
      </div>
      <div className="ml-4 flex-grow overflow-hidden">
        <h2 className="text-base font-medium">
          <span className="line-clamp-1 flex gap-2 items-center">
            {data?.cityName}{" "}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-plane-takeoff"
            >
              <path d="M2 22h20" />
              <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
            </svg>{" "}
            {data.destination} */}
          </span>
        </h2>
        <span className="block mt-2 text-sm text-neutral-500 ">
          {/* {data?.code}-{data?.arrivalCode} */}
          {data?.tag}
        </span>
      </div>
    </div>
  );
};

export default HotelSuggestionCard;
