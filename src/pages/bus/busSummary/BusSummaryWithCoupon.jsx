import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
//import CouponContainer from "../../../components/Coupon/Couponcontainer";
import dayjs from "dayjs";

function BusSummaryWithCoupon(props) {
  const { onFinalAmountChange, oncouponselect } = props;
  const reducerState = useSelector((state) => state);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.busMarkup;

  const [publishedPrice, setPublishedPrice] = useState(0);
  const [offerPrice, setOfferedPrice] = useState(0);
  const seatData = sessionStorage.getItem("seatData");
  const parsedSeatData = JSON.parse(seatData);
  const seatObject = parsedSeatData?.blockedSeatArray;
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const passengerCount = parsedSeatData?.blockedSeatArray.length;
  const resultIndex = parsedSeatData?.resultIndex;

  const busFullData =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult;

  const selectedBus = busFullData?.BusResults?.find(
    (bus) => bus.ResultIndex === resultIndex
  );

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

  const othertax = Number(markUpamount * published).toFixed(1);

  useEffect(() => {
    setOfferedPrice(offeredPrice);
    setPublishedPrice(published);
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("couponCode");
  }, []);

  // ///////////////////////////coupon functions /////////////////////////////////////////////////////////////

  const discountValueObj = selectedCoupon?.discountPercentage?.filter(
    (item, index) => {
      return item?.name == "BUS" || item?.name == "FORALL";
    }
  );

  const handleCouponChange = (code) => {
    setCouponCode(code);
    setCouponApplied(!!code);
  };

  const handleCouponStatusChange = (status) => {
    setCouponStatus(status);
  };

  const handleCouponDiscountChange = (discount) => {
    setCouponDiscount(discount);
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const handleErrorChange = (errorMessage) => {
    setError(errorMessage);
  };

  const flight = "BUS";

  const totalPriceCalculator = () => {
    let finalAmount = 0;
    let discountAmount = 0;
    const publishedFare = Number(published);
    if (selectedCoupon !== null) {
      let discountamount = 0;
      if (publishedFare <= discountValueObj?.[0].value?.min[0]) {
        discountamount = Number(discountValueObj?.[0].value?.min[1]);
      } else if (publishedFare >= discountValueObj?.[0].value?.max[0]) {
        discountamount = Number(discountValueObj?.[0].value?.max[1]);
      }

      if (discountValueObj?.[0].type == "PERCENTAGE") {
        finalAmount =
          Number(publishedFare) +
          Number(markUpamount) * Number(publishedFare) -
          Number(publishedFare) * Number(discountamount * 0.01);
        discountAmount = Number(publishedFare) * Number(discountamount * 0.01);
      } else if (discountValueObj?.[0].type == "AMOUNT") {
        finalAmount =
          Number(publishedFare) +
          Number(markUpamount) * Number(publishedFare) -
          Number(discountamount);
        discountAmount = Number(discountamount);
      }
    } else {
      finalAmount =
        Number(finalAmount) +
        Number(published) +
        Number(markUpamount) * Number(published);
    }

    return { finalAmount, discountAmount };
  };
  const { finalAmount, discountAmount } = totalPriceCalculator();

  useEffect(() => {
    if (typeof onFinalAmountChange === "function") {
      onFinalAmountChange(finalAmount);
      oncouponselect(couponCode);
    } else {
      console.error(error);
    }
  }, [finalAmount, couponCode]);

  return (
    <>
      <div className="text-black initialBookingData bg-white border-0">
        <div className="checkInCheckOutBox">
          <div className="checkInInnerBoxOne">
            <div>
              <p className="!text-xl !text-gray-700">Boarding</p>
              <h5 className="!text-xl !text-gray-700">
                {dayjs(selectedBus?.DepartureTime).format("DD MMM, YY")}
              </h5>
              <h2 className="!text-xl !text-gray-700">
                {dayjs(selectedBus?.DepartureTime).format("dddd")}
              </h2>
            </div>
            <div>
              <p className="!text-xl !text-gray-700">Dropping</p>
              <h5 className="!text-xl !text-gray-700">
                {dayjs(selectedBus?.ArrivalTime).format("DD MMM, YY")}
              </h5>
              <h2 className="!text-xl !text-gray-700">
                {dayjs(selectedBus?.ArrivalTime).format("dddd")}
              </h2>
            </div>
          </div>
          <div className="checkInInnerBoxTwo">
            <p className="!text-xl !text-gray-700">
              {passengerCount} Passenger
            </p>
          </div>
        </div>

        <div className="sideBarPriceBox">
          <div>
            <h6 className="!text-xl !text-gray-700">Published Fare</h6>
            <p className="!text-xl !text-gray-700">₹ {publishedPrice}</p>
          </div>
          <div>
            <h6 className="!text-xl !text-gray-700">Other Tax</h6>
            <p className="!text-xl !text-gray-700">
              ₹ {Number(othertax).toFixed(0)}
            </p>
          </div>

          {discountAmount > 0 && (
            <div>
              <h6 className="!text-xl !text-gray-700">Discount Amount:</h6>
              <p className="!text-xl !text-gray-700">
                ₹ {Number(discountAmount).toFixed(2)}{" "}
              </p>
            </div>
          )}
        </div>

        <hr />

        <div className="sideBarPriceBox">
          <div>
            <h6 className="!text-xl !text-gray-700">Grand Total</h6>
            <p className="!text-xl !text-gray-700">
              ₹ {Number(finalAmount).toFixed(0)}
            </p>
          </div>
        </div>

        {/* <div className="sideBarButtonsHotel">
                    <Button type="primary" onClick={onSeatBlock} disabled={!isDisabled} >Continue</Button>
                </div> */}
        {/* <CouponContainer
                    value={flight}
                    couponCode={couponCode}
                    couponApplied={couponApplied}
                    couponStatus={couponStatus}
                    couponDiscount={couponDiscount}
                    loading={loading}
                    selectedCoupon={selectedCoupon}
                    error={error}
                    onCouponChange={handleCouponChange}
                    onCouponStatusChange={handleCouponStatusChange}
                    onCouponDiscountChange={handleCouponDiscountChange}
                    onLoadingChange={handleLoadingChange}
                    onErrorChange={handleErrorChange}
                    setSelectedCoupon={setSelectedCoupon}
                /> */}
      </div>
    </>
  );
}

export default BusSummaryWithCoupon;
