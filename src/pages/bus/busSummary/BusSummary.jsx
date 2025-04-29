import { Button } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { colors } from "../../../colors";

const BusSummary = ({ onSeatBlock, isDisabled }) => {
  const reducerState = useSelector((state) => state);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.busMarkup;
  const [publishedPrice, setPublishedPrice] = useState(0);
  const [offerPrice, setOfferedPrice] = useState(0);
  const seatData = sessionStorage.getItem("seatData");
  const parsedSeatData = JSON.parse(seatData);
  const seatObject = parsedSeatData?.blockedSeatArray;

  const published = seatObject.reduce(function (
    accumulator,
    currentValue,
    currentIndex,
    array
  ) {
    return accumulator + currentValue?.Price?.PublishedPriceRoundedOff;
  },
  0);

  const offeredPrice = seatObject.reduce(
    (accumulator, currentValue, currentIndex, array) => {
      return accumulator + currentValue?.Price?.OfferedPrice;
    },
    0
  );

  const passengerCount = parsedSeatData?.blockedSeatArray.length;
  const resultIndex = parsedSeatData?.resultIndex;

  const busFullData =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult;

  const selectedBus = busFullData?.BusResults?.find(
    (bus) => bus.ResultIndex === resultIndex
  );

  const othertax = (markUpamount * published).toFixed(1);

  useEffect(() => {
    setOfferedPrice(offeredPrice);
    setPublishedPrice(published);
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("couponCode");
  }, []);

  return (
    <>
      <div className="text-gray-700 bg-white initialBookingData border-1">
        <div className="checkInCheckOutBox">
          <div className="checkInInnerBoxOne">
            <div>
              <p className="!text-gray-700 !text-2xl ">Boarding</p>
              <h5 className=" !text-gray-700 !text-xl">
                {dayjs(selectedBus?.DepartureTime).format("DD MMM, YY")}
              </h5>

              <h2 className=" !text-gray-600 !text-lg">
                {dayjs(selectedBus?.DepartureTime).format("dddd")}
              </h2>
            </div>
            <div>
              <p className="!text-gray-700 !text-2xl ">Dropping</p>
              <h5 className="!text-gray-700 !text-xl ">
                {dayjs(selectedBus?.ArrivalTime).format("DD MMM, YY")}
              </h5>
              <h2 className="!text-gray-600 !text-lg ">
                {dayjs(selectedBus?.ArrivalTime).format("dddd")}
              </h2>
            </div>
          </div>
          <div className="checkInInnerBoxTwo !font-montserrat !text-2xl">
            <p>{passengerCount} Passenger</p>
          </div>
        </div>

        <div className="sideBarPriceBox">
          <div>
            <h6 className=" !text-xl">Published Fare</h6>
            <p className=" !text-xl text-black">₹ {publishedPrice}</p>
          </div>
          <div>
            <h6 className="!text-xl">Other Tax</h6>
            <p className=" !text-xl">₹ {Number(othertax).toFixed(0)}</p>
          </div>
        </div>
        <hr />

        <div className="sideBarPriceBox">
          <div>
            <h6 className=" !text-2xl">Grand Total</h6>
            <p className=" !text-2xl !font-semibold">
              ₹ {(Number(published) + Number(othertax)).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="sideBarButtonsHotel">
          <button
            onClick={onSeatBlock}
            disabled={!isDisabled}
            className={` ${colors.primary6000} hover:${colors.primary700} w-full py-2 mt-4 !text-lg font-medium text-white rounded-lg bg font-montserrat  hover:text-white`}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default BusSummary;
