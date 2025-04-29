import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  HotelRoomSelectReqGRN,
  clearHotelRoomSelect,
} from "../../../Redux/HotelGRN/hotel";
import HotelSelectRoomSkeleton from "./Skeletons/HotelSelectRoomSkeleton";
import HotelGalleryCarousel from "./HotelGalleryCarousel";
import Amenities from "./Amenities";
import { swalModal } from "../../../utility/swal";
// import { Button } from "antd";
import { Modal } from "flowbite-react";
import { Baby, BedDouble, MapPin, Utensils } from "lucide-react";
import ModalMap from "./ModalMap";
import BlurredLoader from "../../../components/BlurredLoader";

const HotelBookRoomGRN = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [roomsToShow, setRoomsToShow] = useState(10);
  const [showSelectRoomButton, setShowSelectRoomButton] = useState(true);

  const reducerState = useSelector((state) => state);
  const hotelinfoGRN =
    reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.hotel;
  const hotelGallery =
    reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data?.images
      ?.regular;
  const hotelMainReducer =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const searchId =
    reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.search_id;
  // console.log(hotelinfoGRN, "hotelinfoGRNhotelinfoGRN");

  const rating = hotelinfoGRN?.category;
  const totalStars = 5;

  useEffect(() => {
    dispatch(clearHotelRoomSelect());
  }, []);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.hotelDetails?.status === 200 &&
      reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data
    ) {
      setLoader(false);
    }
  }, [
    reducerState?.hotelSearchResultGRN?.hotelDetails?.status ||
      reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data?.images,
  ]);

  const filterOptions = [];
  const roomTypes = new Set();

  // Populate filter options for main tabs
  const boardingOptions = [
    "Room Only",
    "Bed and Breakfast",
    "Half Board",
    "Full Board",
  ];
  boardingOptions.forEach((type) => {
    if (
      hotelinfoGRN?.rates?.some((rate) =>
        rate?.boarding_details?.includes(type)
      )
    ) {
      filterOptions.push(type);
    }
  });

  // Populate room types for secondary tabs
  hotelinfoGRN?.rates?.forEach((rate) => {
    rate?.rooms.forEach((room) => {
      boardingOptions.forEach((type) => {
        if (rate.boarding_details.includes(type)) {
          const roomType = room?.room_type
            ?.toLowerCase()
            ?.match(
              /standard|deluxe|suite|dormitory|apartment|studio|superior|executive|Villa|Premier Room|Grand Room|classic/i
            )?.[0];
          if (roomType) roomTypes.add(roomType);
        }
      });
    });
  });

  // Default filter selections
  useEffect(() => {
    if (!filterType && filterOptions.length > 0) {
      setFilterType(filterOptions[0]);
    }
    if (!roomTypeFilter && roomTypes.size > 0) {
      setRoomTypeFilter(Array.from(roomTypes)[0]);
    }
  }, [filterOptions, roomTypes]);

  // Reset roomsToShow when filters change
  useEffect(() => {
    setRoomsToShow(10);
  }, [filterType, roomTypeFilter]);

  // Initial room selection effect
  useEffect(() => {
    if (
      hotelinfoGRN?.rates?.length > 0 &&
      !selectedRoom && // Ensure this runs only if no room is selected
      !filterType // Ensure it doesn't override the user's filterType
    ) {
      const firstBoardingOption = filterOptions[0]; // Get the first filter option
      setFilterType(firstBoardingOption);

      const ratesForFirstBoardingOption = hotelinfoGRN.rates.filter((rate) =>
        rate?.boarding_details?.includes(firstBoardingOption)
      );

      // Get the first room type under the first boarding option
      if (ratesForFirstBoardingOption.length > 0) {
        const firstRoomType =
          ratesForFirstBoardingOption[0]?.rooms[0]?.room_type
            ?.toLowerCase()
            ?.match(
              /standard|deluxe|suite|dormitory|apartment|studio|superior|executive|classic/i
            )?.[0];
        if (firstRoomType) {
          setRoomTypeFilter(firstRoomType);

          const initialRoom = ratesForFirstBoardingOption.find((rate) =>
            rate.rooms.some((room) =>
              room.room_type?.toLowerCase()?.includes(firstRoomType)
            )
          );
          setSelectedRoom(initialRoom);
        }
      }
    }
  }, [hotelinfoGRN, filterOptions, selectedRoom, filterType]);

  // Update selected room when filterType or roomTypeFilter changes
  useEffect(() => {
    if (filterType && roomTypeFilter) {
      const matchingRooms = hotelinfoGRN?.rates?.filter(
        (rate) =>
          rate?.boarding_details?.includes(filterType) &&
          rate?.rooms.some((room) =>
            room?.room_type?.toLowerCase()?.includes(roomTypeFilter)
          )
      );

      if (matchingRooms && matchingRooms.length > 0) {
        const firstMatchingRoom = matchingRooms[0];
        setSelectedRoom(firstMatchingRoom); // Automatically select the first room in the filtered list
        setSelectedRoomIndex(0); // Reset the index to the first room
      } else {
        setSelectedRoom(null); // Reset if no matching room is found
      }
    }
  }, [filterType, roomTypeFilter, hotelinfoGRN]);

  const handleRoomSelection = (index, room) => {
    setSelectedRoomIndex(index);
    setSelectedRoom(room);
    setShowSelectRoomButton(false);
  };

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.errors
        ?.length > 0
    ) {
      swalModal("hotel", "room not found", false);
      navigate("/st-hotel/hotelresult");
    }
  }, [reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.errors]);

  useEffect(() => {
    if (
      !reducerState?.hotelSearchResultGRN?.hotelDetails.length > 0 &&
      !reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels
        ?.length > 0
    ) {
      swalModal("hotel", "Session Expired", false);
      navigate("/st-hotel");
    }
  }, [
    reducerState?.hotelSearchResultGRN?.hotelDetails,
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels,
  ]);

  const handleClickSaveRoom = () => {
    const payload = {
      data: {
        rate_key: selectedRoom?.rate_key,
        group_code: selectedRoom?.group_code,
      },
      searchID: searchId,
    };
    dispatch(HotelRoomSelectReqGRN(payload));
    navigate("/st-hotel/hotelresult/selectroom/guestDetails");
  };

  const renderRooms = (rooms) =>
    rooms.slice(0, roomsToShow).map((item, index) => (
      <div
        onClick={() => handleRoomSelection(index, item)}
        className="p-3 mb-3 rounded-md bg-white border shadow-sm cursor-pointer"
      >
        <div className="flex pb-2 flex-row items-center justify-between">
          <div className="px-3 border-r">
            <input
              className={`checkbox_input rounded-full w-6 h-6`}
              type="checkbox"
              checked={selectedRoomIndex === index}
              onChange={() => handleRoomSelection(index, item)}
            />
          </div>
          <div className="w-full px-3 border-r">
            {item?.rooms?.slice(0, 1)?.map((room, e) => (
              <div key={e}>
                <p className="">{room?.description}</p>
                <p className="">{room?.room_type}</p>
              </div>
            ))}
          </div>
          <div className="px-3 flex  flex-col items-end w-48">
            <p className="text-md text-purple font-semibold">₹ {item?.price}</p>
            <p className="text-sm text-gray-800 font-semibold">Select Room</p>
          </div>
        </div>

        <div className="px-3 flex flex-row justify-start items-center gap-2 pt-2 border-t">
          {item?.boarding_details?.[0] === "Room Only" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              <BedDouble className="h-6 w-6 text-purple" />
              Room Only
            </div>
          )}
          {item?.boarding_details?.[0] === "Bed and Breakfast" && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              <Utensils className="h-6 w-6 text-purple" />
              Free Breakfast
            </div>
          )}
          {item?.cancellation_policy && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              Refundable (Cancel Before{" "}
              {dayjs(item?.cancellation_policy?.cancel_by_date).format(
                "DD MMM, YY"
              )}
              )
            </div>
          )}
          {item?.non_refundable && (
            <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
              Non Refundable
            </div>
          )}
        </div>
      </div>
    ));

  const handleShowMore = () => {
    const rooms = hotelinfoGRN?.rates?.filter(
      (rate) =>
        rate?.boarding_details?.includes(filterType) &&
        rate?.rooms.some((room) =>
          room?.room_type?.toLowerCase()?.includes(roomTypeFilter)
        )
    );
    if (roomsToShow < rooms?.length) {
      setRoomsToShow((prev) => prev + 10);
    }
  };
  const mapUrl = `https://maps.google.com/maps?q=${
    hotelinfoGRN?.geolocation?.latitude ?? 0
  },${hotelinfoGRN?.geolocation?.longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <>
      {loader ? (
        <BlurredLoader textData={"Searching best rooms for you !"} />
      ) : (
        <div className="py-4 bg-indigo-50">
          <div className="container">
            <div className="row">
              <HotelGalleryCarousel data={hotelGallery} />
            </div>
            <div className="row gy-4 mt-2">
              <div className="col-lg-8">
                <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                  {hotelinfoGRN?.name}
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
                    <p className="text-start">{hotelinfoGRN?.address}</p>
                  </div>

                  <div className="flex flex-row justify-start gap-3  flex-wrap">
                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                      <BedDouble className="h-6 w-6 text-purple" />{" "}
                      {hotelMainReducer?.no_of_rooms} Room
                    </div>

                    <ModalMap mapUrl={mapUrl} />

                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                      <i class="fa-regular fa-user text-purple text-lg"></i>
                      {hotelMainReducer?.no_of_adults} Adult
                    </div>

                    {hotelMainReducer?.no_of_children > 0 && (
                      <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                        <Baby className="h-6 w-6 text-purple" />
                        {hotelMainReducer?.no_of_children} child
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <Amenities />
                </div>

                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Select Room
                </h2>
                {/* Main Filter Tabs */}

                <div
                  id="roomSelectionBox"
                  className="flex justify-start space-x-4 pb-4 rounded-md  overflow-auto sm:overflow-hidden sm:overflow-x-scroll"
                >
                  {filterOptions.map((type) => (
                    <button
                      key={type}
                      className={`bg-white relative px-[1.8rem] py-2 font-semibold text-sm md:text-md lg:text-md xl:text-md ${
                        filterType === type
                          ? "  text-indigo-700 shadow-md border-2 border-indigo-700 rounded-md"
                          : "text-gray-500 border-2 rounded-md"
                      }`}
                      onClick={() => setFilterType(type)}
                    >
                      {type}
                      {filterType === type ? (
                        <div className="absolute top-0 right-0 px-2 font-thin text-xs bg-primary-6000 text-white rounded-es-md">
                          <i class="fa-solid fa-check"></i>{" "}
                        </div>
                      ) : (
                        ""
                      )}
                    </button>
                  ))}
                </div>

                {/* Secondary Room Type Tabs */}
                <div
                  className="flex justify-start space-x-4 mb-4 p-2 rounded-md bg-gray-200 overflow-hidden overflow-x-scroll"
                  id="roomTypeSelectionBox"
                >
                  {Array.from(roomTypes).map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-2 font-semibold text-sm ${
                        roomTypeFilter === type
                          ? "bg-primary-6000 hover:bg-primary-700 text-white rounded-md"
                          : "text-black"
                      }`}
                      onClick={() => setRoomTypeFilter(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Render Rooms */}
                {renderRooms(
                  hotelinfoGRN?.rates?.filter(
                    (rate) =>
                      rate?.boarding_details?.includes(filterType) &&
                      rate?.rooms.some((room) =>
                        room?.room_type?.toLowerCase()?.includes(roomTypeFilter)
                      )
                  )
                )}

                {roomsToShow <
                  hotelinfoGRN?.rates?.filter(
                    (rate) =>
                      rate?.boarding_details?.includes(filterType) &&
                      rate?.rooms.some((room) =>
                        room?.room_type?.toLowerCase()?.includes(roomTypeFilter)
                      )
                  ).length && (
                  <button
                    className="mt-2 mb-2 py-2 bg-transparent font-semibold text-gray-800 rounded-md"
                    onClick={handleShowMore}
                  >
                    Show More Rooms
                  </button>
                )}
              </div>

              <div className="col-lg-4 ">
                <div className=" top-24 rounded-md shadow-sm border overflow-y-scroll p-7 bg-white sticky">
                  <div className=" flex flex-col w-full border rounded-md">
                    <div className=" flex flex-row justify-center items-center">
                      <div className="p-3 w-full border-b flex flex-col gap-2 justify-center items-center">
                        <p className="text-sm  text-gray-500 mb-0">Check-In</p>
                        <p className="text-sm font-semibold text-gray-600 mb-0">
                          {dayjs(hotelMainReducer?.checkin).format(
                            "DD MMM, YY"
                          )}
                        </p>
                        <p className="text-sm font-semibold text-gray-600 mb-0">
                          {dayjs(hotelMainReducer?.checkin).format("dddd")}
                        </p>
                      </div>

                      <div className="p-3 w-full border-b flex flex-col gap-2 justify-center items-center">
                        <p className="text-sm text-gray-500 mb-0">Check-Out</p>
                        <p className="text-sm font-semibold text-gray-600 mb-0">
                          {dayjs(hotelMainReducer?.checkout).format(
                            "DD MMM, YY"
                          )}
                        </p>
                        <p className="text-sm font-semibold text-gray-600 mb-0">
                          {dayjs(hotelMainReducer?.checkout).format("dddd")}
                        </p>
                      </div>
                    </div>
                    <div className=" flex flex-row justify-center items-center p-2">
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {hotelMainReducer?.no_of_rooms} Room
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {", "}
                        {hotelMainReducer?.no_of_adults} Adult{" "}
                        {hotelMainReducer?.no_of_children > 0
                          ? `${hotelMainReducer?.no_of_children} Child`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="">
                    <div className=" flex flex-row justify-between mt-2 text-gray-600">
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        {" "}
                        {hotelMainReducer?.no_of_rooms} room{" "}
                        {hotelMainReducer?.no_of_rooms > 1 ? "s" : ""} x{" "}
                        {hotelMainReducer?.no_of_nights} nights{" "}
                        {hotelMainReducer?.no_of_nights > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        ₹ {selectedRoom?.price}
                      </p>
                    </div>
                    {/* <div className=" flex flex-row justify-between mt-2 text-gray-600">
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        ₹{" "}
                        {(
                          selectedRoom?.price / hotelMainReducer?.no_of_rooms
                        ).toFixed(0)}{" "}
                        x {hotelMainReducer?.no_of_rooms} rooms
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        ₹ {selectedRoom?.price}
                      </p>
                    </div> */}
                  </div>
                  <hr className="border-gray-300" />

                  <div className="">
                    <div className=" flex flex-row justify-between mt-2 text-gray-600">
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        Total Before Taxes
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mb-0">
                        ₹ {selectedRoom?.price}
                      </p>
                    </div>
                  </div>

                  <div className=" flex flex-row gap-2 mt-2">
                    {showSelectRoomButton && (
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
                    )}

                    <button
                      className="bg-primary-6000 py-2 rounded-md text-sm flex-grow text-white "
                      onClick={handleClickSaveRoom}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HotelBookRoomGRN;
