import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Baby, BedDouble, Check, ChevronLeft, Printer } from "lucide-react";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import userApi from "../../../Redux/API/api";

const HotelTicketDB = () => {
  const location = useLocation();
  const { finalamount } = location.state || {};
  const navigate = useNavigate();
  const componentRef = useRef();
  const reducerState = useSelector((state) => state);
  const [isOpen, setIsOpen] = useState(true);
  // console.log(reducerState, "reducer state")
  const totalAmt = sessionStorage.getItem("ammo");
  const hotelGallery =
    reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data?.images
      ?.regular;
  const hotelMainReducer =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const passenger = reducerState?.passengers?.passengersData;
  const getBookingDetails = reducerState?.hotelSearchResultGRN?.bookRoom;
  const hotelDetails =
    reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.hotel;
  const hotelinfoGRN = reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel;
  const rating = hotelinfoGRN?.category;
  const totalStars = 5;
  const nonRefundable =
    getBookingDetails?.hotel?.booking_items?.[0]?.non_refundable;
  const cancelDetails =
    getBookingDetails?.hotel?.booking_items?.[0]?.cancellation_policy;

  // console.log(getBookingDetails, "getBookingDetails state")

  const [loading, setLoading] = useState(false);

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onAfterPrint: () => setLoading(false), // Hide loader after printing
  // });
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });  

  const handleDownload = () => {
    setLoading(true);
    handlePrint();
  };

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.ctrlKey && event.key === "p") {
  //       event.preventDefault();
  //       handlePrint();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handlePrint]);

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const payload = {
      userId: reducerState?.logIn?.loginData?.id,
      agnet_reference: getBookingDetails?.agent_reference,
      booking_date: getBookingDetails?.booking_date,
      booking_id: getBookingDetails?.booking_id,
      booking_reference: getBookingDetails?.booking_reference,
      checkin: getBookingDetails?.checkin,
      checkout: getBookingDetails?.checkout,
      // "total": getBookingDetails?.price?.total,
      total: Number(finalamount).toFixed(2),
      isHold: false,
      holdAmount: 0,
      holder: {
        title: passenger?.[0]?.adults?.[0]?.Title,
        name: passenger?.[0]?.adults?.[0]?.FirstName,
        surname: passenger?.[0]?.adults?.[0]?.LastName,
        email: passenger?.[0]?.adults?.[0]?.Email,
        phone_number: passenger?.[0]?.adults?.[0]?.Phoneno,
        client_nationality: "in",
        pan_number: passenger?.[0]?.adults?.[0]?.PAN,
      },
      hotel: {
        address: getBookingDetails?.hotel?.address,
        name: getBookingDetails?.hotel?.name,
        price: getBookingDetails?.price?.total,
        imageUrl: hotelDetails?.images?.url,
        phoneNumber: "",
        geolocation: {
          latitude: getBookingDetails?.hotel?.geolocation?.latitude,
          longitude: getBookingDetails?.hotel?.geolocation?.longitude,
        },
        category: getBookingDetails?.hotel?.category,
        city_code: getBookingDetails?.hotel?.city_code,
        country_code: getBookingDetails?.hotel?.country_code,
        paxes: getBookingDetails?.hotel?.paxes?.map((item) => ({
          age: item.age || "",
          name: item.name,
          pax_id: item.pax_id,
          surname: item.surname,
          title: item.title,
          paxType: item.type,
        })),
        rooms: getBookingDetails?.hotel?.booking_items?.[0].rooms?.map(
          (item) => ({
            description: item?.description,
            no_of_adults: item?.no_of_adults,
            no_of_children: item?.no_of_children,
            no_of_rooms: item?.no_of_rooms,
          })
        ),
        non_refundable: nonRefundable,
        cancellation_policy:
          nonRefundable === false
            ? {
                amount_type: cancelDetails?.amount_type,
                cancel_by_date: cancelDetails?.cancel_by_date,
                details: [
                  {
                    from: cancelDetails?.details?.[0]?.from,
                  },
                ],
              }
            : null,
      },
      bookingType: "HOTELS",
    };
    // console.log(payload, "payload")

    if (getBookingDetails?.booking_id !== undefined) {
      // console.log(payload, "payload")
      userApi.hotelBookingDetailsSaveGRN(payload);
    }
  }, [getBookingDetails?.booking_id]);

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelinfoGRN?.geolocation?.latitude ?? 0
  },${hotelinfoGRN?.geolocation?.longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <div className="relative z-10 ">
      <div className="bg-gray-100 ">
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
              <p className="flex text-xl capitalize font-semibold flex-row gap-2 items-center">
                <div className="p-2 rounded-full bg-green-500">
                  <Check size={16} className="text-white " />
                </div>
                {getBookingDetails?.status}
              </p>
              <p className="text-xl font-semibold">
                Booking ID : {getBookingDetails?.booking_id}
              </p>
            </div>
          </div>
          <div className="p-6">
            {/* Hotel Information */}
            <div className="mb-4 flex flex-row">
              <div className=" w-1/2 px-2">
                <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                  {hotelinfoGRN?.name}
                </h1>
                <div className="py-3 flex flex-col  justify-start gap-3  flex-wrap">
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

                    {/* <ModalMap mapUrl={mapUrl} /> */}

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

                  <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                    Total Amount : ₹{totalAmt}
                  </h2>
                </div>
              </div>

              <div className=" w-1/2">
                <img
                  src={hotelGallery?.[0]?.url}
                  alt="no image"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="col-lg-12 mt-3 border-t border-gray-300 pt-3">
              <div className="col-lg-12  mb-2">
                <div className="">
                  <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                    {" "}
                    Room Type : {hotelinfoGRN?.rate?.rooms?.[0]?.description}
                  </h2>
                  <div className="flex flex-row items-center gap-2 justify-start">
                    <p class="mb-2 text-md font-semibold text-gray-700 ">
                      {hotelinfoGRN?.rate?.rooms?.[0]?.room_type}
                    </p>
                    <p className="mb-2 text-md font-semibold text-gray-700">
                      ({hotelinfoGRN?.rate?.boarding_details?.[0]})
                    </p>
                  </div>
                </div>
              </div>
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Boarding Details
              </h2>

              <div className="flex flex-row ">
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check In </p>
                  <p>{dayjs(getBookingDetails?.checkin).format("DD MMM YY")}</p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check Out </p>
                  <p>
                    {dayjs(getBookingDetails?.checkout).format("DD MMM YY")}
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
                  <p>{passenger?.[0]?.adults?.[0]?.Phoneno}</p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Email: </p>
                  <p>{passenger?.[0]?.adults?.[0]?.Email}</p>
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
                    {item?.adults.length > 0 &&
                      item?.adults?.map((i, adultIndex) => (
                        <div className="">
                          <div className="row g-3 mb-3">
                            <div className="flex flex-row ">
                              <div className="flex flex-col items-start flex-1">
                                <p className="font-medium text-gray-700">
                                  Name:{" "}
                                </p>
                                <p>
                                  {i?.Title?.toUpperCase()}{" "}
                                  {i?.FirstName?.toUpperCase()}{" "}
                                  {i?.LastName?.toUpperCase()}
                                </p>
                              </div>
                              {index === 0 && adultIndex == 0 && (
                                <div className="flex flex-col items-start flex-1">
                                  <p className="font-medium text-gray-700">
                                    PAN:{" "}
                                  </p>
                                  <p>{index === 0 && <span>{i?.PAN}</span>}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    {item?.children.length > 0 &&
                      item?.children?.map((i, childIndex) => (
                        <div className="mb-3">
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-medium text-gray-700">
                              Child {childIndex + 1}
                            </p>
                            <p>
                              {i?.Title?.toUpperCase()}{" "}
                              {i?.FirstName?.toUpperCase()}{" "}
                              {i?.LastName?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      ))}
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
    </div>
  );
};

export default HotelTicketDB;
