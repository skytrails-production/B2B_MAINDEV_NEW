import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import userApi from "../../../../../Redux/API/api";
import { Baby, BedDouble, Check, ChevronLeft, Printer } from "lucide-react";
import dayjs from "dayjs";

const TboTicketGeneration = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const reducerState = useSelector((state) => state);
  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;
  const totalAmt = sessionStorage.getItem("ammo");
  const rating = hotelInfo?.HotelDetails?.StarRating;
  const totalStars = 5;
  const hotelcoupon = sessionStorage.getItem("couponCode");
  const passenger = reducerState?.passengers?.passengersData;
  const getBookingDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails;
  const hotelRoomDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails?.[0];
  const hotelDetails =
    reducerState?.hotelSearchResult?.hotelDetails?.data?.data;
  // console.log("reducerState", reducerState, hotelcoupon);

  const totalAmount = getBookingDetails?.reduce((accumulator, item) => {
    return accumulator + item?.Price?.PublishedPriceRoundedOff;
  }, 0);
  // console.log("totalAmount in last page", totalAmount);
  const totalAmountAfterCoupon = getBookingDetails?.reduce(
    (accumulator, item) => {
      return accumulator + item?.Price?.OfferedPriceRoundedOff;
    },
    0
  );

  let totalAdults = 0;
  let totalChildren = 0;

  const grnHotelData =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;

  grnHotelData?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup;
  const grandTotal = totalAmount + markUpamount * totalAmount;

  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setLoading(false), // Hide loader after printing
  });

  const handleDownload = () => {
    setLoading(true);
    handlePrint();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrint]);

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelInfo?.HotelDetails?.Latitude ?? 0
  },${hotelInfo?.HotelDetails?.Longitude ?? 0}&hl=en&z=14&output=embed`;

  useEffect(() => {
    const payload = {
      rating: Number(rating),
      roomName: hotelRoomDetails?.RoomTypeName,
      mapUrl: mapUrl,
      address:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.AddressLine1,
      bookingId: hotelDetails?.GetBookingDetailResult?.BookingId,
      CheckInDate:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.CheckInDate,
      CheckOutDate:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.CheckOutDate,
      hotelName:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.HotelName,
      hotelId:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.HotelId,
      room: reducerState?.hotelSearchResult?.hotelDetails?.data?.data
        ?.GetBookingDetailResult?.NoOfRooms,
      country:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.CountryCode,
      cityName:
        reducerState?.hotelSearchResult?.hotelDetails?.data?.data
          ?.GetBookingDetailResult?.City,

      amount: hotelcoupon
        ? totalAmountAfterCoupon + markUpamount * totalAmount
        : grandTotal,

      paxes: passenger?.map((item, index) => ({
        title: item.Title,
        firstName: item.FirstName,
        lastName: item.LastName,
        phoneNo: item.Phoneno,
        email: item.Email,
        paxType: item.PaxType,
        leadPassenger: item.LeadPassenger,
        age: Number(item.Age),
        passportNumber: item.PassportNo,
        passportExpire: "0001-01-01T00:00:00",
        panNo: item.PAN,
      })),
      imageUrl: hotelInfo?.HotelDetails?.Images?.[0],
      bookingStatus: "BOOKED",
      refundable: hotelRoomDetails?.LastCancellationDate,
    };
    // console.log(payload.amount, "amount");
    if (
      reducerState?.hotelSearchResult?.hotelDetails?.data?.data
        ?.GetBookingDetailResult?.BookingId !== undefined
    ) {
      userApi.hotelBookingDetailsSave(payload);
    }
  }, [
    reducerState?.hotelSearchResult?.hotelDetails?.data?.data
      ?.GetBookingDetailResult?.BookingId,
  ]);

  return (
    <>
      <div className="bg-gray-100">
        <div className="max-w-4xl  pt-3 mx-auto w-full flex justify-between items-center text-center rounded-b-lg">
          <p
            onClick={() => navigate("/st-hotel")}
            className="flex flec-row items-center  cursor-pointer text-base font-semibold text-gray-700"
          >
            <ChevronLeft size={18} className="text-gray-700 text-base" /> Back
            to Home
          </p>
          <p
            onClick={handlePrint}
            className="flex flec-row items-center gap-2  cursor-pointer text-base font-semibold text-gray-700"
          >
            <Printer size={18} className="text-gray-700 text-base" /> Download
            PDF
          </p>
        </div>
      </div>
      <div
        ref={componentRef}
        className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
      >
        <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full">
          <div className="flex flex-row justify-between items-center bg-primary-6000 text-white p-6 rounded-t-lg">
            <div>
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <p className="mt-1">Thank you for your booking!</p>
            </div>
            <div>
              <p className="flex text-xl font-semibold flex-row gap-2 items-center">
                <div className="p-2 rounded-full bg-green-500">
                  <Check size={16} className="text-white " />
                </div>
                {hotelDetails?.GetBookingDetailResult?.HotelBookingStatus}
              </p>
              <p className="text-xl font-semibold">
                Booking ID : {hotelDetails?.GetBookingDetailResult?.BookingId}
              </p>
            </div>
          </div>
          <div className="p-6">
            {/* Hotel Information */}
            <div className="mb-4 flex flex-row">
              <div className=" w-1/2 px-2">
                <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                  {hotelInfo?.HotelDetails?.HotelName}
                </h1>
                <div className="py-3 flex flex-col mt-4 justify-start gap-3  flex-wrap">
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

                    {/* <ModalMap mapUrl={mapUrl} /> */}

                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                      <i class="fa-regular fa-user text-purple text-lg"></i>
                      {totalAdults} Adult
                    </div>

                    {totalChildren && (
                      <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                        <Baby className="h-6 w-6 text-purple" />
                        {totalChildren} child
                      </div>
                    )}
                  </div>

                  <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                    Total Amount : ₹{totalAmt}
                  </h2>
                </div>
              </div>

              <div className=" w-1/2">
                <img
                  src={hotelInfo?.HotelDetails?.Images?.[0]}
                  alt="no image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="col-lg-12 mt-3 border-t border-gray-300 pt-3">
              <div className="col-lg-12 mb-2">
                <div className="border-b pb-3 border-gray-300">
                  <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                    {" "}
                    Room Type : {hotelRoomDetails?.RoomTypeName}
                  </h2>

                  <div className="roomNameAndCategory">
                    <div className="othInc">
                      {hotelRoomDetails?.IsPANMandatory && (
                        <div className="othIncInner">
                          <div className="flex justify-start items-center gap-2">
                            <svg
                              id="fi_3596091"
                              enable-background="new 0 0 24 24"
                              height="20"
                              viewBox="0 0 24 24"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g>
                                <path d="m21.5 21h-19c-1.378 0-2.5-1.122-2.5-2.5v-13c0-1.378 1.122-2.5 2.5-2.5h19c1.378 0 2.5 1.122 2.5 2.5v13c0 1.378-1.122 2.5-2.5 2.5zm-19-17c-.827 0-1.5.673-1.5 1.5v13c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5v-13c0-.827-.673-1.5-1.5-1.5z"></path>
                              </g>
                              <g>
                                <path d="m7.5 12c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5 2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5zm0-4c-.827 0-1.5.673-1.5 1.5s.673 1.5 1.5 1.5 1.5-.673 1.5-1.5-.673-1.5-1.5-1.5z"></path>
                              </g>
                              <g>
                                <path d="m11.5 17c-.276 0-.5-.224-.5-.5v-1c0-.827-.673-1.5-1.5-1.5h-4c-.827 0-1.5.673-1.5 1.5v1c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-1c0-1.378 1.122-2.5 2.5-2.5h4c1.378 0 2.5 1.122 2.5 2.5v1c0 .276-.224.5-.5.5z"></path>
                              </g>
                              <g>
                                <path d="m20.5 9h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                              </g>
                              <g>
                                <path d="m20.5 13h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                              </g>
                              <g>
                                <path d="m20.5 17h-6c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h6c.276 0 .5.224.5.5s-.224.5-.5.5z"></path>
                              </g>
                            </svg>
                            <p className="text-sm text-gray-700">
                              Pan Required
                            </p>
                          </div>
                        </div>
                      )}

                      {hotelRoomDetails?.LastCancellationDate && (
                        <div className="othIncInner">
                          <div className="d-flex justify-content-start align-items-center gap-2">
                            <svg
                              id="fi_7444875"
                              height="20"
                              viewBox="0 0 128 128"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                              data-name="Layer 1"
                            >
                              <path d="m11.59 65.89 11.19 8a2 2 0 0 0 2.79-.47l8-11.19a2 2 0 1 0 -3.27-2.33l-5.18 7.25a41.82 41.82 0 1 1 79.64 6.11 2 2 0 0 0 1.12 2.6 2 2 0 0 0 .74.14 2 2 0 0 0 1.86-1.26 45.82 45.82 0 1 0 -87.31-6.92l-7.26-5.18a2 2 0 1 0 -2.32 3.25z"></path>
                              <path d="m113.08 83.24c-4-4.73-10.56-2.56-14.1-1.4-2.24.74-7.61 3-12.9 5.24a8.26 8.26 0 0 0 -.62-5c-2.86-6.53-9.92-5.28-15.08-4.36a27.61 27.61 0 0 1 -4.84.61 20.2 20.2 0 0 1 -8-1.75 24.66 24.66 0 0 0 -10.37-2 50.57 50.57 0 0 0 -19.76 4.42l-1.12.46c-9.29 3.7-13.29 4.54-13.29 4.54a2 2 0 0 0 -1.55 1.48c-.07.29-1.64 7 2.81 16.43 3.82 8 8.29 11.07 11.36 12.18a2 2 0 0 0 1.91-.31s2.51-2 4.43-3.12c1.27-.77 4.36-1.26 11.92.84a92.12 92.12 0 0 0 21.42 3.07 25 25 0 0 0 8.32-1.14c7.89-3 27.09-13 34.64-17.1 4-2.18 6.18-4.53 6.68-7.19a7 7 0 0 0 -1.86-5.9zm-2.08 5.17c-.25 1.35-1.91 2.92-4.66 4.42-6.34 3.47-26.28 13.92-34.13 16.87-5.51 2.06-19.38.14-27.26-2a37.74 37.74 0 0 0 -9.71-1.7 10.14 10.14 0 0 0 -5.37 1.24c-1.35.82-2.89 1.94-3.86 2.66-3-1.5-5.85-4.9-8.14-9.72a25.11 25.11 0 0 1 -2.68-12.62 121.45 121.45 0 0 0 12.59-4.44l1.15-.47a46.3 46.3 0 0 1 18.32-4.1 20.5 20.5 0 0 1 8.88 1.77 23.77 23.77 0 0 0 9.34 2 32.17 32.17 0 0 0 5.61-.67c5.51-1 9.23-1.37 10.71 2a4.22 4.22 0 0 1 .15 3.35c-.56 1.38-2 2.64-4.26 3.66-2 .84-3.5 1.49-4.16 1.75-4.24 1.66-7.89 1.08-11.42.52l-1.94-.3a2 2 0 0 0 -.54 4c.61.08 1.23.18 1.85.28 3.87.61 8.25 1.3 13.51-.75.61-.24 1.83-.75 3.45-1.45.3-.12.59-.24.87-.37l2.58-1.1c6.51-2.8 15.43-6.64 18.36-7.6 4.65-1.53 7.91-2 9.78.18 1.21 1.42 1.04 2.3.98 2.59z"></path>
                              <path d="m64 33.76v2.65a8.76 8.76 0 0 0 -2 .72 6.31 6.31 0 0 0 -3.47 5.47c-.14 4.39 3.81 5.86 6.69 6.93 3.36 1.25 4.38 1.89 4.23 3.49a2.76 2.76 0 0 1 -1.84 2.45 6.86 6.86 0 0 1 -5.93-.5 2 2 0 0 0 -2.48 3.15 9.34 9.34 0 0 0 4.8 1.73v2.39a2 2 0 1 0 4 0v-2.69a9.82 9.82 0 0 0 1.23-.4 6.75 6.75 0 0 0 4.25-5.74c.48-4.92-3.91-6.55-6.81-7.63-3.11-1.15-4.14-1.75-4.1-3.05a2.34 2.34 0 0 1 1.36-2.07 6.07 6.07 0 0 1 5.74.49 2 2 0 1 0 2.12-3.39 10.6 10.6 0 0 0 -3.79-1.45v-2.55a2 2 0 1 0 -4 0z"></path>
                              <path d="m42 48a24 24 0 1 0 24-24 24 24 0 0 0 -24 24zm44 0a20 20 0 1 1 -20-20 20 20 0 0 1 20 20z"></path>
                            </svg>
                            <p className="panDesign3">
                              Refundable (Cancel Before{" "}
                              {dayjs(
                                hotelRoomDetails?.LastCancellationDate
                              ).format("DD MMM, YY")}
                              )
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Boarding Details
              </h2>

              <div className="flex flex-row ">
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check In </p>
                  <p>
                    {dayjs(
                      hotelDetails?.GetBookingDetailResult?.InitialCheckInDate
                    ).format("DD MMM YY")}
                  </p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check Out </p>
                  <p>
                    {dayjs(
                      hotelDetails?.GetBookingDetailResult?.InitialCheckOutDate
                    ).format("DD MMM YY")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-12 mt-3">
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Your Booking Details will be sent to
              </h2>

              <div className="flex flex-row ">
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Phone No : </p>
                  <p>{passenger?.[0]?.Phoneno}</p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Email: </p>
                  <p>{passenger?.[0]?.Email}</p>
                </div>
              </div>
            </div>
            {/* passenger details  */}

            <div className="col-lg-12 mt-3">
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Guest Details
              </h2>
              {passenger?.map((item, index) => {
                return (
                  <div>
                    <div className="">
                      <div className="row g-3 mb-3">
                        <div className="flex flex-row ">
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-medium text-gray-900">Name: </p>
                            <p>
                              {item?.Title?.toUpperCase()}{" "}
                              {item?.FirstName?.toUpperCase()}{" "}
                              {item?.LastName?.toUpperCase()}
                            </p>
                          </div>
                          {index === 0 && item?.PaxType && (
                            <div className="flex flex-col items-start flex-1">
                              <p className="font-medium text-gray-900">PAN: </p>
                              <p>{index === 0 && <span>{item?.PAN}</span>}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-4">
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Hotel Location
              </h2>
              <div className="mt-2">
                <iframe
                  src={mapUrl}
                  className="w-full h-64 border rounded"
                  allowFullScreen
                  loading="lazy"
                  title="Hotel Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TboTicketGeneration;
