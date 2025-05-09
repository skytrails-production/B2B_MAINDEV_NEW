import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PriceSummaryGRN(props) {
  const { onFinalAmountChange } = props;

  const reducerState = useSelector((state) => state);

  const hotelinfoGRN = reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel;
  const commnetRate = hotelinfoGRN?.rate?.rate_comments?.MandatoryTax;
  const hotelMainReducer =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;

  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup *
    Number(hotelinfoGRN?.rate?.price);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const discountValueObj = selectedCoupon?.discountPercentage?.filter(
    (item, index) => {
      return item?.name == "HOTELS" || item?.name == "FORALL";
    }
  );

  const totalPriceCalculator = () => {
    let finalAmount = 0;
    let discountAmount = 0;
    const publishedFare = hotelinfoGRN?.rate?.price;
    if (selectedCoupon !== null) {
      let discountamount = 0;
      if (publishedFare <= discountValueObj?.[0].value?.min[0]) {
        discountamount = discountValueObj?.[0].value?.min[1];
      } else if (publishedFare >= discountValueObj?.[0].value?.max[0]) {
        discountamount = Number(discountValueObj?.[0].value?.max[1]);
      }

      if (discountValueObj?.[0].type == "PERCENTAGE") {
        finalAmount =
          Number(publishedFare) +
          Number(markUpamount) -
          Number(publishedFare) * Number(discountamount * 0.01);
        discountAmount = publishedFare * (discountamount * 0.01);
      } else if (discountValueObj?.[0].type == "AMOUNT") {
        finalAmount =
          Number(publishedFare) + Number(markUpamount) - Number(discountamount);
        discountAmount = Number(discountamount);
      }
    } else {
      finalAmount =
        finalAmount + Number(hotelinfoGRN?.rate?.price) + Number(markUpamount);
    }
    // return { amountGenerator: { finalAmount, discountAmount } };
    return { finalAmount, discountAmount };
  };
  const { finalAmount, discountAmount } = totalPriceCalculator();

  useEffect(() => {
    if (typeof onFinalAmountChange === "function") {
      onFinalAmountChange(finalAmount);
    } else {
      console.error("onFinalAmountChange is not a function:");
    }
  }, [finalAmount]);

  return (
    <>
      <div className="top-24 rounded-md shadow-sm border-1 border-gray-300 overflow-y-scroll p-7 sticky">
        <div className=" flex flex-col w-full border-1 border-gray-300 rounded-md">
          <div className=" flex flex-row justify-center items-center">
            <div className="p-3 w-full border-b border-gray-300 flex flex-col gap-2 justify-center items-center">
              <p className="text-sm  text-gray-800 mb-0">Check-In</p>
              <p className="text-sm font-semibold text-gray-800 mb-0">
                {dayjs(hotelMainReducer?.checkin).format("DD MMM, YY")}
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-0">
                {dayjs(hotelMainReducer?.checkin).format("dddd")}
              </p>
            </div>

            <div className="p-3 w-full border-b border-gray-300 flex flex-col gap-2 justify-center items-center">
              <p className="text-sm text-gray-800 mb-0">Check-Out</p>
              <p className="text-sm font-semibold text-gray-800 mb-0">
                {dayjs(hotelMainReducer?.checkout).format("DD MMM, YY")}
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-0">
                {dayjs(hotelMainReducer?.checkout).format("dddd")}
              </p>
            </div>
          </div>
          <div className=" flex flex-row justify-center items-center p-2">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              {hotelMainReducer?.no_of_rooms} Room
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-0">
              {", "}
              {hotelMainReducer?.no_of_adults} Adult{" "}
              {hotelMainReducer?.no_of_children > 0
                ? `${hotelMainReducer?.no_of_children} Child`
                : ""}
            </p>
          </div>
        </div>

        <div className="">
          <div className=" flex flex-row justify-between mt-2 text-gray-800">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              {" "}
              {hotelMainReducer?.no_of_rooms} room{" "}
              {hotelMainReducer?.no_of_rooms > 1 ? "s" : ""} x{" "}
              {hotelMainReducer?.no_of_nights} nights{" "}
              {hotelMainReducer?.no_of_nights > 1 ? "s" : ""}
            </p>

            <p className="text-sm font-semibold text-gray-800 mb-0">
              ₹ {hotelinfoGRN?.rate?.price}
            </p>
          </div>
          {/* <div className=" flex flex-row justify-between mt-2 text-gray-300">
            <p className="text-sm font-semibold text-gray-300 mb-0">
              ₹{" "}
              {(
                hotelinfoGRN?.rate?.price / hotelMainReducer?.no_of_rooms
              ).toFixed(0)}{" "}
              x {hotelMainReducer?.no_of_rooms} rooms
            </p>
            <p className="text-sm font-semibold text-gray-300 mb-0">
              ₹ {hotelinfoGRN?.rate?.price}
            </p>
          </div> */}
        </div>

        <hr />

        <div className="">
          <div className=" flex flex-row justify-between mt-2 text-gray-800">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              Other Tax
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-0">
              ₹ {Number(markUpamount).toFixed(0)}
            </p>
          </div>
          <div className=" flex flex-row justify-between mt-2 text-gray-800">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              Grand Total
            </p>
            <p className="text-md font-bold text-gray-800 mb-0">
              ₹ {Number(finalAmount).toFixed(0)}
            </p>
          </div>
        </div>

        {/* <div className="sideBarPriceBox">
          <div>
            <h6>Other Tax</h6>
            <p>₹ {Number(markUpamount).toFixed(0)}</p>
          </div>
          <div>
            <h6>Grand Total</h6>
            <p className="grTotal">₹ {Number(finalAmount).toFixed(0)}</p>
          </div>
        </div> */}
      </div>
    </>
  );
}
