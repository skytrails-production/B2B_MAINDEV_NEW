import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearHotelBlockRoom,
  hotelBlockRoomAction,
  hotelRoomAction,
  hotelSearchInfoAction,
} from "../../../../../Redux/Hotel/hotel";
import { swalModal } from "../../../../../utility/swal";
import HotelSelectRoomSkeleton from "../../Skeletons/HotelSelectRoomSkeleton";
import HotelGallery from "../HotelGallery";
import { Baby, BedDouble, MapPin, Utensils } from "lucide-react";
import TboAmenities from "../TboAmenities";
import RoomComponent from "./RoomComponent";
import dayjs from "dayjs";
import ModalMap from "../../ModalMap";

const HotelSelectroomMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const [loader, setLoader] = useState(false);
  const ResultIndex = sessionStorage.getItem("ResultIndex");
  const HotelCode = sessionStorage.getItem("HotelCode");

  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;
  const result =
    reducerState?.hotelSearchResult?.ticketData?.data?.data?.HotelSearchResult;
  const grnHotelData =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const rating = hotelInfo?.HotelDetails?.StarRating;
  const totalStars = 5;

  const hotelRoom =
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult;

  const [disabledOption, setDisabledOption] = useState(
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult
      ?.RoomCombinations?.RoomCombination[0]?.RoomIndex
  );

  useEffect(() => {
    dispatch(clearHotelBlockRoom());
  }, []);
  useEffect(() => {
    if (ResultIndex === null || HotelCode === null) {
      swalModal("hotel", "room not found", false);
      navigate("/st-hotel/hotelresult");
    }
  }, []);

  const roomRef = useRef();

  const triggerChildHandleClick = () => {
    if (roomRef.current) {
      roomRef.current.handleClick(); // Call the child's handleClick method
    }
  };

  useEffect(() => {
    const payload = {
      ResultIndex: ResultIndex,
      HotelCode: HotelCode,
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      TraceId:
        reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.TraceId,
    };

    dispatch(hotelSearchInfoAction(payload));
    dispatch(hotelRoomAction(payload));
  }, []);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult?.Error
        ?.ErrorCode !== 0 &&
      reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult?.Error
        ?.ErrorCode !== undefined
    ) {
      swalModal(
        "hotel",
        reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult?.Error
          ?.ErrorMessage,
        false
      );
      navigate("/st-hotel/hotelresult");
    } else if (
      reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult?.Error
        ?.ErrorCode !== 0 &&
      reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult?.Error
        ?.ErrorCode !== undefined
    ) {
      swalModal(
        "hotel",
        reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult?.Error
          ?.ErrorMessage,
        false
      );
      navigate("/st-hotel/hotelresult");
    }
  }, [
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult?.Error
      ?.ErrorCode,
    reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult?.Error
      ?.ErrorCode,
  ]);

  useEffect(() => {
    if (reducerState?.hotelSearchResult?.isLoadingHotelRoom == true) {
      setLoader(true);
    }
  }, [reducerState?.hotelSearchResult?.isLoadingHotelRoom]);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult
        ?.HotelRoomsDetails?.length >= 0
    ) {
      setLoader(false);
    }
  }, [
    reducerState?.hotelSearchResult?.hotelRoom?.GetHotelRoomResult
      ?.HotelRoomsDetails,
  ]);
  useEffect(() => {
    if (
      reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult?.Error
        ?.ErrorCode === 0
    ) {
      setLoader(false);

      navigate("/st-hotel/hotelresult/HotelBooknow/Reviewbooking");
    } else if (
      reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult?.Error
        ?.ErrorCode !== 0 &&
      reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult?.Error
        ?.ErrorCode !== undefined
    ) {
      swalModal(
        "hotel",
        reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult?.Error
          ?.ErrorMessage,
        false
      );
      navigate("/st-hotel");
    }
  }, [reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult]);

  // room showing and selection logic here

  const [chosenRooms, setChosenRooms] = useState([]);

  const handleChosenRoomsUpdate = (rooms) => {
    setChosenRooms(rooms);
  };

  if (loader || reducerState?.hotelSearchResult?.isLoadingBlockRoom) {
    return <HotelSelectRoomSkeleton />;
  }

  let totalAdults = 0;
  let totalChildren = 0;

  grnHotelData?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  const calculateNoOfNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate the difference in time
    const diffTime = Math.abs(checkOut - checkIn);

    // Convert time difference to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const noOfNights = calculateNoOfNights(
    grnHotelData?.CheckInDate,
    grnHotelData?.CheckOutDate
  );

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelInfo?.HotelDetails?.Latitude ?? 0
  },${hotelInfo?.HotelDetails?.Longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <>
      {/* <div className="mainimgHotelSearch"></div> */}
      <div className="my-4 bg-white">
        <div className="container hotelBookRoomMain">
          {hotelInfo?.HotelDetails?.Images?.length > 4 && (
            <div className="row">
              <HotelGallery data={hotelInfo?.HotelDetails?.Images} />
            </div>
          )}

          <div className="row gy-4 mt-2">
            <div className="col-lg-8">
              <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                {hotelInfo?.HotelDetails?.HotelName}
              </h1>

              <div className="py-3 flex flex-col mt-4 justify-start gap-3  flex-wrap border-y border-gray-300">
                <div className="flex flex-row items-center gap-2">
                  {Array.from({ length: totalStars }).map((_, index) => (
                    <i
                      key={index}
                      className={`fa-solid fa-star ${
                        index < rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                </div>

                <div>
                  <p className="text-start">
                    {hotelInfo?.HotelDetails?.Address}
                  </p>
                </div>

                <div className="flex flex-row justify-start gap-3  flex-wrap">
                  <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                    <BedDouble className="h-6 w-6 text-purple" />{" "}
                    {grnHotelData?.RoomGuests?.length} Room
                  </div>

                  {/* <div className="flex flex-row items-center gap-2">
                    <a
                      className="no-underline text-gray-700 flex flex-row items-center gap-1 font-semibold text-[14px]"
                      href={`https://www.google.com/maps?q=${hotelInfo?.HotelDetails?.Latitude},${hotelInfo?.HotelDetails?.Longitude}`}
                      target="_blank"
                    >
                      <MapPin className="h-6 w-6 text-purple" /> see on map
                    </a>
                  </div> */}
                  <ModalMap mapUrl={mapUrl} />
                  <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                    <i class="fa-regular fa-user text-purple text-lg"></i>
                    {totalAdults} Adult
                  </div>

                  {totalChildren > 0 && (
                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                      <Baby className="h-6 w-6 text-purple" />
                      {totalChildren} child
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <TboAmenities />
              </div>

              {/* <div>
                {hotelRoom?.RoomCombinations?.RoomCombination.map(
                  (item1, index1) => {
                    return (
                      <div className="">
                        {item1?.RoomIndex?.map((item2, index2) => {
                          if (index2 == 0) {
                            return (
                              <div className="roomCompo" key={index2}>
                                {roomComponent(
                                  item2,
                                  item1?.RoomIndex,
                                  index2,
                                  index1
                                )}
                              </div>
                            );
                          }
                        })}
                      </div>
                    );
                  }
                )}
              </div> */}

              <div>
                <RoomComponent
                  onChosenRoomsUpdate={handleChosenRoomsUpdate}
                  ref={roomRef}
                />
              </div>
            </div>

            <div className="col-lg-4 ">
              <div className=" top-24 rounded-md shadow-sm border overflow-y-scroll p-7 sticky">
                <div className=" flex flex-col w-full border rounded-md">
                  <div className=" flex flex-row justify-center items-center">
                    <div className="p-3 w-full border-b flex flex-col gap-2 justify-center items-center">
                      <p className="text-sm  text-gray-500 mb-0">Check-In</p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {dayjs(grnHotelData?.CheckInDate).format("DD MMM, YY")}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {dayjs(grnHotelData?.CheckInDate).format("dddd")}
                      </p>
                    </div>

                    <div className="p-3 w-full border-b flex flex-col gap-2 justify-center items-center">
                      <p className="text-sm text-gray-500 mb-0">Check-Out</p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {dayjs(grnHotelData?.CheckOutDate).format("DD MMM, YY")}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {dayjs(grnHotelData?.CheckOutDate).format("dddd")}
                      </p>
                    </div>
                  </div>
                  <div className=" flex flex-row justify-center items-center p-2">
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      {grnHotelData?.RoomGuests?.length} Room
                    </p>
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      {", "}
                      {totalAdults} Adult{" "}
                      {totalChildren > 0 ? `${totalChildren} Child` : ""}
                    </p>
                  </div>
                </div>

                <div className="">
                  <div className=" flex flex-row justify-between mt-2 text-gray-600">
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      ₹{" "}
                      {(
                        chosenRooms
                          .reduce(
                            (total, room) =>
                              total + room.Price.PublishedPriceRoundedOff,
                            0
                          )
                          .toFixed(0) / grnHotelData?.NoOfRooms
                      ).toFixed(0)}{" "}
                      x {grnHotelData?.NoOfRooms} rooms
                    </p>
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      ₹{" "}
                      {chosenRooms
                        .reduce(
                          (total, room) =>
                            total + room.Price.PublishedPriceRoundedOff,
                          0
                        )
                        .toFixed(0)}
                    </p>
                  </div>
                  <div className=" flex flex-row justify-between mt-2 text-gray-600">
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      ₹{" "}
                      {(
                        chosenRooms.reduce(
                          (total, room) =>
                            total + room.Price.PublishedPriceRoundedOff,
                          0
                        ) / noOfNights
                      ).toFixed(0)}{" "}
                      x {noOfNights} nights
                    </p>
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      ₹{" "}
                      {chosenRooms
                        .reduce(
                          (total, room) =>
                            total + room.Price.PublishedPriceRoundedOff,
                          0
                        )
                        .toFixed(0)}
                    </p>
                  </div>
                </div>
                <hr />

                <div className="">
                  <div className=" flex flex-row justify-between mt-2 text-gray-600">
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      Total Before Taxes
                    </p>
                    <p className="text-sm font-semibold text-gray-600 mb-0">
                      ₹{" "}
                      {chosenRooms
                        .reduce(
                          (total, room) =>
                            total + room.Price.PublishedPriceRoundedOff,
                          0
                        )
                        .toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className=" flex flex-row gap-2 mt-2">
                  {/* {showSelectRoomButton && (
                                  <button
                                    className="bg-primary-6000 py-2 rounded-md text-sm  flex-grow text-white "
                                    type="primary"
                                    onClick={() => {
                                      const element =
                                        document.getElementById("roomSelectionBox");
                                      if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                      }
                                    }}
                                  >
                                    Change Room
                                  </button>
                                )} */}

                  <button
                    className="bg-primary-6000 py-2 rounded-md text-sm flex-grow text-white "
                    onClick={triggerChildHandleClick}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelSelectroomMain;
