import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import CouponContainer from "../../components/Coupon/Couponcontainer";
import dayjs from "dayjs";
import { Button } from "antd";
import PayButton from "../../../../utility/PayButton";

function HoldPriceSummaryGRNcoupon(props) {
  const {
    onFinalAmountChange,
    oncouponselect,
    payButton,
    loadingPayButton,
    isPaymentSucessButton,
    setLoaderPayment,
  } = props;

  const reducerState = useSelector((state) => state);

  const hotelinfoGRN = reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel;
  const commnetRate = hotelinfoGRN?.rate?.rate_comments?.MandatoryTax;
  const hotelMainReducer =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const markUpamount =
    Number(reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup) *
    Number(hotelinfoGRN?.rate?.price);

  const [showApplyButton, setShowApplyButton] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [selectedCoupon, setSelectedCoupon] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  let email = reducerState?.passengers?.passengersData?.[0]?.adults?.[0]?.Email;
  let Phoneno =
    reducerState?.passengers?.passengersData?.[0]?.adults?.[0]?.Phoneno;
  const discountValueObj = selectedCoupon?.discountPercentage?.filter(
    (item, index) => {
      return item?.name == "HOTELS" || item?.name == "FORALL";
    }
  );

  // console.log("discountValueObj", discountValueObj,discountValueObj?.[0].value);

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

  const flight = "HOTELS";

  const totalPriceCalculator = () => {
    let finalAmount = 0;
    let discountAmount = 0;

    const publishedFare = Number(hotelinfoGRN?.rate?.price);
    if (selectedCoupon !== null) {
      let discountamount = 0;
      if (publishedFare <= discountValueObj?.[0].value?.min[0]) {
        discountamount = Number(discountValueObj?.[0].value?.min[1]);
      } else if (
        Number(publishedFare) >= Number(discountValueObj?.[0].value?.max[0])
      ) {
        discountamount = Number(discountValueObj?.[0].value?.max[1]);
      }

      if (discountValueObj?.[0].type == "PERCENTAGE") {
        finalAmount =
          Number(publishedFare) +
          Number(markUpamount) -
          Number(publishedFare) * Number(discountamount * 0.01);
        discountAmount = Number(publishedFare) * Number(discountamount * 0.01);
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

  // console.log("finalAmount",finalAmount,discountAmount);

  // console.log("couponvalue",selectedCoupon.couponCode);
  useEffect(() => {
    if (typeof onFinalAmountChange === "function") {
      onFinalAmountChange(finalAmount);
      oncouponselect(couponCode);
    } else {
      console.error("onFinalAmountChange is not a function:");
    }
  }, [finalAmount, couponCode]);
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
              ₹{" "}
              {(
                hotelinfoGRN?.rate?.price / hotelMainReducer?.no_of_nights
              ).toFixed(0)}{" "}
              x {hotelMainReducer?.no_of_nights} nights
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-0">
              ₹ {hotelinfoGRN?.rate?.price}
            </p>
          </div>
          <div className=" flex flex-row justify-between mt-2 text-gray-800">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              ₹{" "}
              {(
                hotelinfoGRN?.rate?.price / hotelMainReducer?.no_of_rooms
              ).toFixed(0)}{" "}
              x {hotelMainReducer?.no_of_rooms} rooms
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-0">
              ₹ {hotelinfoGRN?.rate?.price}
            </p>
          </div>
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

          {discountAmount > 0 && (
            <div className=" flex flex-row justify-between mt-2 text-gray-800">
              <p className="text-sm font-semibold text-gray-800 mb-0">
                Discount Amount
              </p>
              <p className="text-md font-semibold text-gray-800 mb-0">
                ₹ {Number(discountAmount).toFixed(2)}
              </p>
            </div>
          )}
          {commnetRate && (
            <div className=" flex flex-row justify-between mt-2 text-gray-800">
              <p className="text-sm font-semibold text-gray-800 mb-0">
                Discount Amount
              </p>
              <p className="text-md font-semibold text-gray-800 mb-0">
                ₹ {commnetRate}
              </p>
            </div>
          )}

          <div className=" flex flex-row justify-between mt-2 text-gray-800">
            <p className="text-sm font-semibold text-gray-800 mb-0">
              Grand Total
            </p>
            <p className="text-md font-semibold text-gray-800 mb-0">
              ₹ {Number(finalAmount).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="sideBarPriceBox">
          <PayButton
            phone={Phoneno}
            email={email}
            // ticketPrice={Number(finalAmount).toFixed(0)}
            ticketPrice={200}
            bookingType="HOTEL" // or "BUS" or "HOTEL"
            buttonText="Pay Now"
            // setPaymentLoading={(state) => {
            //   setPaymentLoading(state);
            // }}
            setPaymentLoading={loadingPayButton}
            setLoaderPayment1={(state) => {
              // setLoaderPayment1(state);
              console.log(state, "setLoaderPayment1");
            }}
            // setLoaderPayment={(state) => {
            //   setLoaderPayment(state);
            // }}
            // setLoaderPayment={isPaymentSucessButton}
            setLoaderPayment={setLoaderPayment}
            setLoadingButton={(state) => {
              // setLoadingButton(state);
              console.log(state, "setLoadingButton");
            }}
            className="bg-primary-700 border-primary-700 font-semibold px-6 py-2 rounded-md hover:!bg-primary-6000 w-full"
          />
          {/* <button
            className="bg-primary-6000 py-2 w-full mt-2 rounded-md text-sm flex-grow text-white "
            onClick={payButton}
          >
            {isPaymentSucessButton ? (
              <svg
                aria-hidden="true"
                role="status"
                class="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              "Pay Now"
            )}
          </button> */}
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
      </div>
    </>
  );
}

export default HoldPriceSummaryGRNcoupon;
