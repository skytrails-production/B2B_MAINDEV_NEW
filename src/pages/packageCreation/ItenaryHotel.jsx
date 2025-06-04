import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import hotelNotFound from "../../images/hotelNotFound.jpg";
import starsvg from "../../images/star.svg";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";
import dayjs from "dayjs";
import HotelLists from "./HotelLists";
import {
  fetchHotelSelectedRoomRequest,
  setHotelRoomSelectionRequest,
} from "../../Redux/Itenary/itenary";
import { apiURL } from "../../Constants/constant";
import axios from "axios";

// Import amenity icons
import freeWifi from "../hotel/GRMHotel/SVGs/freeWifi.svg";
import freeBreakfast from "../hotel/GRMHotel/SVGs/freeBreakfast.svg";
import freeParking from "../hotel/GRMHotel/SVGs/freeParking.svg";
import drinkingWater from "../hotel/GRMHotel/SVGs/DrinkingWater.svg";
import expressCheckin from "../hotel/GRMHotel/SVGs/expressCheckin.svg";
import welcomeDrink from "../hotel/GRMHotel/SVGs/welcomeDrink.svg";
import freeGym from "../hotel/GRMHotel/SVGs/freeGym.svg";

const ItenaryHotel = () => {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  const hotelRoomnew = reducerState?.Itenerary?.selectedHotelRoom;
  const result = reducerState?.Itenerary?.hotelResultArray || [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup;
  const [selectedHotel, setSelectedHotel] = useState([]);
  const [hotelChangeLoading, setHotelChangeLoading] = useState(false);
  const [roomLoader, setRoomLoader] = useState({});
  const [hotelIndex, setHotelIndex] = useState(0);
  const [isRoomFunctionInvoked, setIsRoomFunctionInvoked] = useState(false);
  const [roomDetails, setRoomDetails] = useState([]);

  // Use only one state for hotels to avoid inconsistency
  const [hotels, setHotels] = useState(
    reducerState?.Itenerary?.selectedHotelRoom || []
  );

  console.log(reducerState?.Itenerary?.selectedHotelRoom);

  useEffect(() => {
    // Update hotels state when Redux state changes
    if (reducerState?.Itenerary?.selectedHotelRoom) {
      setHotels(reducerState?.Itenerary?.selectedHotelRoom);
    }
  }, [reducerState?.Itenerary?.selectedHotelRoom]);

  const parseDate = (dateString) => {
    const [year, month, day] = dateString?.split("-");
    return new Date(year, month - 1, day);
  };

  const getSortedResults = (results) => {
    return [...results].sort((a, b) => {
      const dateA = parseDate(a?.data?.data?.HotelSearchResult?.CheckInDate);
      const dateB = parseDate(b?.data?.data?.HotelSearchResult?.CheckInDate);
      return dateA - dateB;
    });
  };

  const sortedResults = useMemo(() => getSortedResults(result), [result]);

  useEffect(() => {
    if (sortedResults.length > 0) {
      const results = sortedResults
        .map((item) => {
          const hotelList =
            item?.data?.data?.HotelSearchResult?.HotelResults || [];
          const validHotel = hotelList.find(
            (hotel) => hotel?.HotelName?.trim() !== ""
          );

          if (validHotel) {
            return {
              ...validHotel,
              selectedRoom: null,
            };
          }

          return null;
        })
        .filter((hotel) => hotel !== null);

      setSelectedHotel(results);
      dispatch(fetchHotelSelectedRoomRequest(results));
    }
  }, [sortedResults]);

  const GetRoomFunction = async (item, index) => {
    setRoomLoader((prev) => ({ ...prev, [index]: true }));
    setIsRoomFunctionInvoked(true);
    const payload = {
      ResultIndex: item?.ResultIndex,
      HotelCode: item?.HotelCode,
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      TraceId: sortedResults?.[index]?.data?.data?.HotelSearchResult?.TraceId,
    };

    try {
      const res = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/hotel/room`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res?.data?.data?.GetHotelRoomResult?.HotelRoomsDetails?.length > 0) {
        setRoomDetails(res.data.data.GetHotelRoomResult.HotelRoomsDetails);
        setHotelIndex(index);
        showModal();
      }
    } catch (error) {
      console.error("Error handling room function:", error);
    } finally {
      setRoomLoader((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleRoomSelect = (room) => {
    const updatedHotels = [...hotels];
    updatedHotels[hotelIndex] = {
      ...updatedHotels[hotelIndex],
      selectedRoom: room,
    };
    setHotels(updatedHotels);
    dispatch(fetchHotelSelectedRoomRequest(updatedHotels));
    handleOk();
  };

  const handleHotelClick = (hotelData) => {
    const updatedHotels = [...hotels];
    updatedHotels[hotelIndex] = {
      ...hotelData,
      selectedRoom: updatedHotels[hotelIndex]?.selectedRoom, // Keep the existing room selection
    };
    setHotels(updatedHotels);
    dispatch(fetchHotelSelectedRoomRequest(updatedHotels));
    setHotelChangeLoading(false);
    handleOk2();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  // Amenity rendering function
  const renderAmenity = (inclusion) => {
    const trimmedInclusion = inclusion.trim().toLowerCase();
    const amenityMap = {
      "free wifi": { icon: freeWifi, text: "Free WiFi" },
      "free internet": { icon: freeWifi, text: "Free internet" },
      "free breakfast": { icon: freeBreakfast, text: "Free Breakfast" },
      "free self parking": { icon: freeParking, text: "Free Self Parking" },
      parking: { icon: freeParking, text: "Parking" },
      "free parking": { icon: freeParking, text: "Free Parking" },
      "free valet parking": { icon: freeParking, text: "Free Valet Parking" },
      "drinking water": { icon: drinkingWater, text: "Drinking Water" },
      "express check-in": { icon: expressCheckin, text: "Express Check-in" },
      "welcome drink": { icon: welcomeDrink, text: "Welcome Drink" },
      "free fitness center access": {
        icon: freeGym,
        text: "Free Fitness Center Access",
      },
    };

    const amenity = amenityMap[trimmedInclusion];
    if (!amenity) return null;

    return (
      <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2">
        <img src={amenity.icon} alt={amenity.text} className="h-4 w-4 mr-1" />
        <span className="text-xs text-gray-700">{amenity.text}</span>
      </div>
    );
  };

  return (
    <div className=" mx-auto px-0 py-6">
      {hotels?.map((item, index) => (
        <div key={index} className="mb-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Stays in{" "}
              {
                reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[index]
                  ?.from?.Destination
              }{" "}
              (
              {
                reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[index]
                  ?.night
              }{" "}
              Nights)
            </h3>
          </div>

          <div className="bg-red-50 rounded-xl  overflow-hidden mb-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            {/* Hotel Card */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Hotel Image */}
                <div className="w-full md:w-1/4">
                  <div className="relative rounded-lg overflow-hidden h-48 shadow-md">
                    <img
                      src={
                        item?.HotelPicture ===
                        "https://b2b.tektravels.com/Images/HotelNA.jpg"
                          ? hotelNotFound
                          : item?.HotelPicture
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = hotelNotFound;
                      }}
                      alt={item?.HotelName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white bg-opacity-70 text-white px-2 py-1 rounded-md flex items-center">
                      {Array.from({ length: item?.StarRating }, (_, i) => (
                        <img
                          key={i}
                          src={starsvg}
                          alt="star"
                          className="h-3 w-3 mr-0.5"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hotel Details */}
                <div className="w-full md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">
                        {item?.HotelName}
                      </h4>
                      <p className="text-gray-600 mb-3">{item?.HotelAddress}</p>
                    </div>
                    {item.selectedRoom && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Total Price
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹
                          {(
                            Number(markUpamount) *
                              Number(
                                item.selectedRoom?.Price
                                  ?.PublishedPriceRoundedOff
                              ) +
                            Number(
                              item.selectedRoom?.Price?.PublishedPriceRoundedOff
                            )
                          ).toFixed(0)}
                        </p>
                      </div>
                    )}
                  </div>

                  {item?.HotelLocation && (
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg
                        height="16"
                        viewBox="0 0 32 32"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 text-red-500"
                      >
                        <g id="Pin-2" data-name="Pin">
                          <path
                            fill="currentColor"
                            d="m25.0464 8.4834a10 10 0 0 0 -7.9116-5.4258 11.3644 11.3644 0 0 0 -2.2691 0 10.0027 10.0027 0 0 0 -7.9121 5.4253 10.8062 10.8062 0 0 0 1.481 11.8936l6.7929 8.2588a1 1 0 0 0 1.545 0l6.7929-8.2588a10.8055 10.8055 0 0 0 1.481-11.8931zm-9.0464 8.5166a4 4 0 1 1 4-4 4.0047 4.0047 0 0 1 -4 4z"
                          />
                        </g>
                      </svg>
                      <span>{item?.HotelLocation}</span>
                    </div>
                  )}

                  {/* Selected Room Details */}
                  {item.selectedRoom && (
                    <div className="border-t pt-4 mt-4">
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-800 mb-2">
                          {item.selectedRoom?.RoomTypeName}
                        </h5>

                        {/* Room Policies */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.selectedRoom?.IsPANMandatory && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Pan Required
                            </span>
                          )}
                          {item.selectedRoom?.non_refundable && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Non Refundable
                            </span>
                          )}
                          {item.selectedRoom?.LastCancellationDate && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Refundable (Cancel Before{" "}
                              {dayjs(
                                item.selectedRoom?.LastCancellationDate
                              ).format("DD MMM, YY")}
                              )
                            </span>
                          )}
                        </div>

                        {/* Amenities */}
                        {item.selectedRoom?.Amenity?.[0] && (
                          <div className="flex flex-wrap">
                            {item.selectedRoom?.Amenity[0]
                              .split(",")
                              .map((inclusion, e) => (
                                <React.Fragment key={e}>
                                  {renderAmenity(inclusion)}
                                </React.Fragment>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 border-blue-600"
                  onClick={() => GetRoomFunction(item, index)}
                  loading={roomLoader[index]}
                >
                  {item.selectedRoom ? "Change Room" : "Select Room"}
                </Button>

                <Button
                  type="default"
                  icon={<SyncOutlined />}
                  className="flex items-center bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                  onClick={() => {
                    setHotelChangeLoading(true);
                    setHotelIndex(index);
                    showModal2();
                  }}
                  loading={hotelChangeLoading && hotelIndex === index}
                >
                  Change Hotel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Room Selection Modal */}
      <Modal
        title={<span className="text-xl font-bold">Select Room</span>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={null}
        centered
        className="hotel-room-modal"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {roomDetails.map((room, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-4 hover:border-blue-400 cursor-pointer transition-colors bg-white shadow-sm"
              onClick={() => handleRoomSelect(room)}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {room?.RoomTypeName}
                  </h4>
                  <p className="text-sm text-gray-600">{room?.RatePlanName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Smoking Preference: {room?.SmokingPreference}
                  </p>
                </div>
                <div className="mt-3 md:mt-0 text-right">
                  <p className="text-lg font-bold text-blue-600">
                    ₹
                    {(
                      Number(markUpamount) *
                        Number(room?.Price?.PublishedPriceRoundedOff) +
                      Number(room?.Price?.PublishedPriceRoundedOff)
                    ).toFixed(0)}
                  </p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Hotel Selection Modal */}
      <Modal
        title={<span className="text-xl font-bold">Change Hotel</span>}
        open={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={1200}
        footer={null}
        centered
        className="hotel-selection-modal"
      >
        <div className="p-4">
          <HotelLists
            result={sortedResults[hotelIndex]?.data?.data?.HotelSearchResult}
            onHotelClick={handleHotelClick}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ItenaryHotel;
