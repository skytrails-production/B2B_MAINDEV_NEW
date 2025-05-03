import dayjs from "dayjs";
import { Utensils } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  hotelGalleryRequest,
  singleHotelGRN,
} from "../../../Redux/HotelGRN/hotel";
import ModalMap from "./ModalMap";

const HotelResultCardBoxHold = ({ result }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const [showAll, setShowAll] = useState(false);
  const image = result?.images?.url || result?.HotelPicture;
  const rating = result?.category || result?.StarRating;
  const totalStars = 5;
  const longitude = result?.Longitude || result?.geolocation?.longitude;
  const latitude = result?.Latitude || result?.geolocation?.latitude;
  const hotelTitle = result?.name || result?.HotelName;
  const hotelAddress = result?.address || result?.HotelAddress;
  const hotelPrice =
    result?.min_rate?.price || result?.Price?.PublishedPriceRoundedOff;

  //   const facilities =
  //     result?.facilities?.split(";")?.map((item) => item.trim()) || [];
  //   const initialDisplayCount = 10;
  //   const facilitiesToShow = showAll
  //     ? facilities
  //     : facilities.slice(0, initialDisplayCount);

  const handleClick = (item) => {
    // console.log(item, "item");
    if (item?.name) {
      const payload = {
        data: {
          rate_key: item?.min_rate?.rate_key,
          group_code: item?.min_rate?.group_code,
        },
        searchID: item?.search_id,
        hotel_code: item?.hotel_code,
      };

      const galleryPayload = {
        hotel_id: item?.hotel_code,
      };
      dispatch(hotelGalleryRequest(galleryPayload));
      dispatch(singleHotelGRN(payload));
      navigate("/st-hotel/hotelresult/selectroom");
    } else {
      sessionStorage.setItem("ResultIndex", item?.ResultIndex);
      sessionStorage.setItem("HotelCode", item?.HotelCode);
      navigate("/st-hotel/hotelresult/HotelBooknow");
    }
  };

  const mapUrl = `https://maps.google.com/maps?q=${latitude ?? 0},${
    longitude ?? 0
  }&hl=en&z=14&output=embed`;

  return (
    <div className={`max-w-3xl mx-auto bg-white shadow-sm p-4 relative`}>
      {/* Left Section: Image */}

      {result?.featureHotel && (
        <div className="absolute z-0 top-0 right-0 flex flex-start gap-2 mb-2">
          <div className="flex flex-row">
            <div className="relative bg-orange-500 rounded-bl-xl rounded-tr-md text-white text-[12px] pe-3 ps-3 py-1 overflow-hidden">
              <span>Featured Hotel</span>
              <div className="absolute inset-0   bg-gradient-to-r from-transparent via-white to-transparent opacity-75 blur-md z-10 animate-slide"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <div className="w-1/2">
          <div className="relative">
            <img
              src={image}
              alt="no image"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Right Section: Content */}
        <div className="w-1/2 pl-4">
          {/* {result?.name && <p>grn</p>} */}

          <ModalMap mapUrl={mapUrl} />
          <div className="flex items-center my-2">
            <div className="flex">
              {Array.from({ length: totalStars }).map((_, index) => (
                <i
                  key={index}
                  className={`fa-solid fa-star ${
                    index < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                ></i>
              ))}
            </div>
          </div>
          {result?.min_rate?.boarding_details?.[0] !== "Room Only" && (
            <div className="flex my-2">
              <p className="text-[13px] flex items-center gap-1 text-gray-600 font-semibold rounded-md">
                <Utensils size={16} /> Breakfast Included
              </p>
            </div>
          )}
          {result?.min_rate?.cancellation_policy?.cancel_by_date && (
            <div className="flex">
              <p className="text-[13px] text-green-700 font-semibold rounded-md">
                {`cancellation till ${dayjs(
                  result?.min_rate?.cancellation_policy?.cancel_by_date
                ).format("DD MMM")}`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className=" mt-2 mb-1">
        <h2 className="text-base mb-0 border-b pb-2 font-semibold text-gray-800 truncate">
          {hotelTitle}
        </h2>
      </div>

      <div className="">
        <p
          title={hotelAddress}
          className="text-[12px] my-2 font-semibold text-gray-600 truncate"
        >
          {hotelAddress}
        </p>
      </div>

      <div className="flex flex-col-reverse border border-gray-300 bg-purple-100 rounded-md p-2 gap-2 flex-grow w-full justify-between items-end ">
        <div className="flex flex-row w-full gap-2 items-center justify-between">
          <button
            onClick={() => handleClick(result)}
            type="button"
            class="text-gray-100 border w-full border-gray-300 bg-primary-6000 hover:bg-primary-700 focus:outline-none font-medium rounded-lg text-sm transition-all py-2 text-center inline-flex items-center justify-center group"
          >
            View Hotel Details
            <i class="fa-solid fa-arrow-right-long transition-all  ms-3"></i>
          </button>
        </div>
        <div className="flex flex-col items-end w-full">
          <div className="flex flex-col items-end mb-2">
            <div>
              <span className="text-[12px] font-semibold text-gray-600">
                Starts from
              </span>{" "}
              <span className="text-lg mr-2 text-gray-500 line-through decoration-gray-500 ms-2">
                ₹{(hotelPrice * 1.2).toFixed(0)}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                ₹{hotelPrice}
              </span>{" "}
            </div>
            <p className="text-[12px] font-semibold text-gray-600">
              Per Room + Other taxes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelResultCardBoxHold;
