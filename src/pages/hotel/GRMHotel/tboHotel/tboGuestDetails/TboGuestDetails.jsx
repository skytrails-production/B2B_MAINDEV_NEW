import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TboAmenities from "../TboAmenities";
import { Baby, BedDouble, MapPin } from "lucide-react";
import HotelGallery from "../HotelGallery";
import dayjs from "dayjs";
import { PassengersAction } from "../../../../../Redux/Passengers/passenger";
import { useNavigate } from "react-router-dom";
// import Authentic from "../../../Auth/Authentic";
import ModalMap from "../../ModalMap";
import Authentic from "../../../../Auth/Authentic";

const TboGuestDetails = () => {
  const reducerState = useSelector((state) => state);
  const navigate = useNavigate();
  const authenticUser = reducerState?.logIn?.loginData?.status;
  const dispatch = useDispatch();
  const grnHotelDataRoom =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.RoomGuests ||
    [];
  const passportCheck =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails[0]?.IsPassportMandatory;
  const grnHotelData =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data;
  const hotelRoomDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails?.[0];

  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;
  const rating = hotelInfo?.HotelDetails?.StarRating;
  const totalStars = 5;
  const initialState = grnHotelDataRoom?.map((room, roomIndex) => ({
    adults: Array.from({ length: room?.NoOfAdults }, (_, adultIndex) => ({
      Title: "mr",
      FirstName: "",
      MiddleName: null,
      LastName: "",
      Phoneno: adultIndex === 0 && roomIndex === 0 ? "" : null,
      Email: adultIndex === 0 && roomIndex === 0 ? "" : null,
      PaxType: "",
      LeadPassenger: Boolean(),
      Age: "",
      PassportNo: passportCheck ? "" : null,
      PassportIssueDate: "0001-01-01T00:00:00",
      PassportExpDate: "0001-01-01T00:00:00",
      PAN: "",
      roomIndex: roomIndex.toString(),
    })),

    children:
      Array.isArray(room?.ChildAge) &&
      room?.ChildAge?.map((age) => ({
        Title: "mr",
        FirstName: "",
        MiddleName: null,
        LastName: "",
        Phoneno: null,
        Email: null,
        PaxType: "",
        LeadPassenger: Boolean(),
        Age: age.toString(),
        PassportNo: passportCheck ? "" : null,
        PassportIssueDate: "0001-01-01T00:00:00",
        PassportExpDate: "0001-01-01T00:00:00",
        PAN: "",
        roomIndex: roomIndex.toString(),
      })),
  }));

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    if (authenticUser == 200) {
      handleModalClose();
    }
  }, [authenticUser]);

  const handleInputChange = (
    roomIndex,
    personType,
    personIndex,
    field,
    value
  ) => {
    const updatedFormData = [...formData];
    updatedFormData[roomIndex][personType][personIndex][field] = value;
    setFormData(updatedFormData);
  };

  const validateForm = () => {
    const newErrors = {};
    formData?.forEach((room, roomIndex) => {
      newErrors[roomIndex] = { adults: [], children: [] };

      room?.adults?.forEach((adult, adultIndex) => {
        const adultErrors = {};
        if (!adult.Title) adultErrors.Title = "Title is required";
        if (!adult.FirstName) adultErrors.FirstName = "First Name is required";
        if (!adult.LastName) adultErrors.LastName = "Last Name is required";
        if (!adult.Age) adultErrors.Age = "Age is required";
        if (!adult.PAN) adultErrors.PAN = "PAN is required";
        if (passportCheck && !adult.PassportNo)
          adultErrors.PassportNo = "Passport No is required";
        if (adultIndex === 0 && roomIndex === 0) {
          if (!adult.Email) adultErrors.Email = "Email is required";
          if (!adult.PhoneNo) adultErrors.PhoneNo = "Phone No is required";
          else if (/^0/.test(adult.PhoneNo))
            adultErrors.PhoneNo = "Phone No cannot start with 0";
        }
        newErrors[roomIndex].adults[adultIndex] = adultErrors;
      });

      if (Array.isArray(room?.children)) {
        room?.children?.forEach((child, childIndex) => {
          const childErrors = {};
          if (!child.Title) childErrors.Title = "Title is required";
          if (!child.FirstName)
            childErrors.FirstName = "First Name is required";
          if (!child.LastName) childErrors.LastName = "Last Name is required";
          if (passportCheck && !child.PassportNo)
            childErrors.PassportNo = "Passport No is required";
          newErrors[roomIndex].children[childIndex] = childErrors;
        });
      } else {
        delete newErrors[roomIndex].children;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => {
      const roomErrors = newErrors[key];
      return (
        roomErrors.adults.every((e) => Object.keys(e).length === 0) &&
        (!roomErrors.children ||
          roomErrors.children.every((e) => Object.keys(e).length === 0))
      );
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const transformedData = formData.flatMap((room, roomIndex) => {
        const leadAdultIndex = 0;
        const adults = room?.adults?.map((adult, adultIndex) => ({
          Title: adult.Title,
          FirstName: adult.FirstName,
          MiddleName: null,
          LastName: adult.LastName,
          Phoneno: adultIndex === 0 && roomIndex === 0 ? adult.PhoneNo : null,
          Email: adultIndex === 0 && roomIndex === 0 ? adult.Email : null,
          PaxType: 1,
          // LeadPassenger: adultIndex === 0 && roomIndex === 0,
          LeadPassenger: adultIndex === leadAdultIndex,
          Age: adult.Age,
          PassportNo: adult.PassportNo,
          PassportIssueDate: "0001-01-01T00:00:00",
          PassportExpDate: "0001-01-01T00:00:00",
          PAN: adult.PAN,
          adultIndex: adultIndex,
          roomIndex: roomIndex,
        }));

        const children =
          Array.isArray(room?.children) &&
          room?.children?.map((child, childIndex) => ({
            Title: child.Title,
            FirstName: child.FirstName,
            MiddleName: null,
            LastName: child.LastName,
            Phoneno: null,
            Email: null,
            PaxType: 2,
            LeadPassenger: false,
            Age: child.Age,
            PassportNo: child.PassportNo,
            PassportIssueDate: "0001-01-01T00:00:00",
            PassportExpDate: "0001-01-01T00:00:00",
            PAN: null,
            childIndex: childIndex,
            roomIndex: roomIndex,
          }));

        return [...adults, ...(children || [])];
      });

      // if (authenticUser !== 200) {
      //   setIsLoginModalOpen(true);
      // } else {
      dispatch(PassengersAction(transformedData));
      navigate("/st-hotel/hotelresult/HotelBooknow/Reviewbooking/bookhotel");
      // }
    } else {
      console.log("Validation failed");
    }
  };

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

  const getBookingDetails =
    reducerState?.hotelSearchResult?.blockRoom?.BlockRoomResult
      ?.HotelRoomsDetails;

  // console.log(getBookingDetails, "booking details")
  const totalAmount = getBookingDetails?.reduce((accumulator, item) => {
    return accumulator + item?.Price?.PublishedPriceRoundedOff;
  }, 0);

  const mapUrl = `https://maps.google.com/maps?q=${
    hotelInfo?.HotelDetails?.Latitude ?? 0
  },${hotelInfo?.HotelDetails?.Longitude ?? 0}&hl=en&z=14&output=embed`;

  return (
    <div className="p-6 z-10 relative min-h-screen">
      <div className="container hotelBookRoomMain">
        {hotelInfo?.HotelDetails?.Images?.length > 4 && (
          <div className="row">
            <HotelGallery data={hotelInfo?.HotelDetails?.Images} />
          </div>
        )}

        <div className="row gy-4 mt-2">
          <div className="col-lg-8">
            <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-800">
              {hotelInfo?.HotelDetails?.HotelName}
            </h1>

            <div className="py-3 flex flex-col mt-4 justify-start gap-3  flex-wrap border-y border-gray-300">
              <div className="flex flex-row items-center gap-2">
                {Array.from({ length: totalStars }).map((_, index) => (
                  <i
                    key={index}
                    className={`fa-solid fa-star ${
                      index < rating ? "text-yellow-400" : "text-gray-800"
                    }`}
                  ></i>
                ))}
              </div>

              <div>
                <p className="text-start text-gray-800">
                  {hotelInfo?.HotelDetails?.Address}
                </p>
              </div>

              <div className="flex flex-row justify-start gap-3  flex-wrap">
                <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                  <BedDouble className="h-6 w-6 text-purple" />{" "}
                  {grnHotelData?.RoomGuests?.length} Room
                </div>

                <ModalMap mapUrl={mapUrl} />

                <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                  <i class="fa-regular fa-user text-purple text-lg"></i>
                  {totalAdults} Adult
                </div>

                {grnHotelData?.no_of_children > 0 && (
                  <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-800">
                    <Baby className="h-6 w-6 text-purple" />
                    {totalChildren} child
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-12 mt-3 mb-2">
              <div className="border-b pb-3 border-gray-300">
                <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
                  {" "}
                  Room Type : {hotelRoomDetails?.RoomTypeName}
                </h2>
                {/* <div className="flex flex-row items-center gap-2 justify-start">
                      <p class="mb-2 text-md font-semibold text-gray-700 ">
                        {hotelinfoGRN?.rate?.rooms?.[0]?.room_type}
                      </p>
                      <p className="mb-2 text-md font-semibold text-gray-700">
                        ({hotelinfoGRN?.rate?.boarding_details?.[0]})
                      </p>
                    </div> */}
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
                          <p className="text-sm text-gray-800">Pan Required</p>
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
                          <p className="panDesign3 text-gray-800">
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

            <h2 class="mb-2 text-lg font-semibold text-gray-800 ">
              Guest Details
            </h2>

            {formData?.map((room, roomIndex) => (
              <div key={roomIndex} className="mb-4  p-3 rounded-md  border">
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  Room {roomIndex + 1}
                </h2>

                <div className="">
                  {room?.adults?.map((adult, adultIndex) => (
                    <div
                      key={adultIndex}
                      className="p-3 bg-transparent   rounded"
                    >
                      <p className="text-md font-semibold text-gray-800">
                        Adult {adultIndex + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2 text-gray-800">
                        <div className="">
                          <label className="block text-sm font-medium">
                            Title
                          </label>
                          <select
                            className="bg-transparent  border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={adult.Title}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                "adults",
                                adultIndex,
                                "Title",
                                e.target.value
                              )
                            }
                          >
                            {/* <option value="">Select Title</option> */}
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Miss">Miss</option>
                          </select>
                          {errors[roomIndex]?.adults[adultIndex]?.Title && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[roomIndex].adults[adultIndex].Title}
                            </p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={adult.FirstName}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                "adults",
                                adultIndex,
                                "FirstName",
                                e.target.value
                              )
                            }
                          />
                          {errors[roomIndex]?.adults[adultIndex]?.FirstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[roomIndex].adults[adultIndex].FirstName}
                            </p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={adult.LastName}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                "adults",
                                adultIndex,
                                "LastName",
                                e.target.value
                              )
                            }
                          />
                          {errors[roomIndex]?.adults[adultIndex]?.LastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[roomIndex].adults[adultIndex].LastName}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className="block text-sm font-medium">
                            Age
                          </label>
                          <input
                            type="number"
                            className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={adult.Age}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                "adults",
                                adultIndex,
                                "Age",
                                e.target.value
                              )
                            }
                          />
                          {errors[roomIndex]?.adults[adultIndex]?.Age && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[roomIndex].adults[adultIndex].Age}
                            </p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium">
                            PAN
                          </label>
                          <input
                            type="text"
                            className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={adult.PAN}
                            onChange={(e) =>
                              handleInputChange(
                                roomIndex,
                                "adults",
                                adultIndex,
                                "PAN",
                                e.target.value
                              )
                            }
                          />
                          {errors[roomIndex]?.adults[adultIndex]?.PAN && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[roomIndex].adults[adultIndex].PAN}
                            </p>
                          )}
                        </div>
                        {passportCheck && (
                          <div className="col-span-2">
                            <label className="block text-sm font-medium">
                              Passport No
                            </label>
                            <input
                              type="text"
                              className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={adult.PassportNo}
                              onChange={(e) =>
                                handleInputChange(
                                  roomIndex,
                                  "adults",
                                  adultIndex,
                                  "PassportNo",
                                  e.target.value
                                )
                              }
                            />
                            {errors[roomIndex]?.adults[adultIndex]
                              ?.PassportNo && (
                              <p className="text-red-500 text-sm mt-1">
                                {
                                  errors[roomIndex].adults[adultIndex]
                                    .PassportNo
                                }
                              </p>
                            )}
                          </div>
                        )}
                        {adultIndex === 0 && roomIndex === 0 && (
                          <>
                            <div className="col-span-3">
                              <label className="block text-sm font-medium">
                                Email
                              </label>
                              <input
                                type="email"
                                className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={adult.Email}
                                onChange={(e) =>
                                  handleInputChange(
                                    roomIndex,
                                    "adults",
                                    adultIndex,
                                    "Email",
                                    e.target.value
                                  )
                                }
                              />
                              {errors[roomIndex]?.adults[adultIndex]?.Email && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors[roomIndex].adults[adultIndex].Email}
                                </p>
                              )}
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium">
                                Phone No
                              </label>
                              <input
                                type="text"
                                className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={adult.PhoneNo}
                                onChange={(e) =>
                                  handleInputChange(
                                    roomIndex,
                                    "adults",
                                    adultIndex,
                                    "PhoneNo",
                                    e.target.value
                                  )
                                }
                              />
                              {errors[roomIndex]?.adults[adultIndex]
                                ?.PhoneNo && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors[roomIndex].adults[adultIndex].PhoneNo}
                                </p>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {room?.children &&
                    room?.children?.map((child, childIndex) => (
                      <div key={childIndex} className="p-3 bg-gray-50 rounded">
                        <p className="text-md font-semibold text-gray-900">
                          Child {childIndex + 1}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-2">
                          <div>
                            <label className="block text-sm font-medium">
                              Title
                            </label>
                            <select
                              className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={child.Title}
                              onChange={(e) =>
                                handleInputChange(
                                  roomIndex,
                                  "children",
                                  childIndex,
                                  "Title",
                                  e.target.value
                                )
                              }
                            >
                              {/* <option value="">Select Title</option> */}
                              <option value="Mr">Mr</option>
                              <option value="Miss">Miss</option>
                            </select>
                            {errors[roomIndex]?.children[childIndex]?.Title && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[roomIndex].children[childIndex].Title}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={child.FirstName}
                              onChange={(e) =>
                                handleInputChange(
                                  roomIndex,
                                  "children",
                                  childIndex,
                                  "FirstName",
                                  e.target.value
                                )
                              }
                            />
                            {errors[roomIndex]?.children[childIndex]
                              ?.FirstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {
                                  errors[roomIndex].children[childIndex]
                                    .FirstName
                                }
                              </p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={child.LastName}
                              onChange={(e) =>
                                handleInputChange(
                                  roomIndex,
                                  "children",
                                  childIndex,
                                  "LastName",
                                  e.target.value
                                )
                              }
                            />
                            {errors[roomIndex]?.children[childIndex]
                              ?.LastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {
                                  errors[roomIndex].children[childIndex]
                                    .LastName
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium">
                              Age
                            </label>
                            <input
                              type="number"
                              className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                              value={child.Age}
                              disabled
                            />
                          </div>
                          {passportCheck && (
                            <div className="col-span-2">
                              <label className="block text-sm font-medium">
                                Passport No
                              </label>
                              <input
                                type="text"
                                className="bg-transparent border  border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={child.PassportNo}
                                onChange={(e) =>
                                  handleInputChange(
                                    roomIndex,
                                    "children",
                                    childIndex,
                                    "PassportNo",
                                    e.target.value
                                  )
                                }
                              />
                              {errors[roomIndex]?.children[childIndex]
                                ?.PassportNo && (
                                <p className="text-red-500 text-sm mt-1">
                                  {
                                    errors[roomIndex].children[childIndex]
                                      .PassportNo
                                  }
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div className="row">
              <TboAmenities />
            </div>
          </div>

          <div className="col-lg-4 ">
            <div className=" top-24 rounded-md bg-white shadow-sm border overflow-y-scroll p-7 sticky">
              <div className=" flex flex-col w-full border rounded-md">
                <div className=" flex flex-row justify-center items-center">
                  <div className="p-3 w-full border-b border-gray-300 flex flex-col gap-2 justify-center items-center">
                    <p className="text-sm  text-gray-800 mb-0">Check-In</p>
                    <p className="text-sm font-semibold text-gray-800 mb-0">
                      {dayjs(grnHotelData?.CheckInDate).format("DD MMM, YY")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mb-0">
                      {dayjs(grnHotelData?.CheckInDate).format("dddd")}
                    </p>
                  </div>

                  <div className="p-3 w-full border-b border-gray-300 flex flex-col gap-2 justify-center items-center">
                    <p className="text-sm text-gray-800 mb-0">Check-Out</p>
                    <p className="text-sm font-semibold text-gray-800 mb-0">
                      {dayjs(grnHotelData?.CheckOutDate).format("DD MMM, YY")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mb-0">
                      {dayjs(grnHotelData?.CheckOutDate).format("dddd")}
                    </p>
                  </div>
                </div>
                <div className=" flex flex-row justify-center items-center p-2">
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    {grnHotelData?.RoomGuests?.length} Room
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    {", "}
                    {totalAdults} Adult{" "}
                    {totalChildren > 0 ? `${totalChildren} Child` : ""}
                  </p>
                </div>
              </div>

              <div className="">
                <div className=" flex flex-row justify-between mt-2 text-gray-800">
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    ₹{" "}
                    {(
                      totalAmount?.toFixed(0) / grnHotelData?.NoOfRooms
                    ).toFixed(0)}{" "}
                    x {grnHotelData?.NoOfRooms} rooms
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    ₹ {totalAmount?.toFixed(0)}
                  </p>
                </div>
                <div className=" flex flex-row justify-between mt-2 text-gray-800">
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    ₹ {(totalAmount / noOfNights).toFixed(0)} x {noOfNights}{" "}
                    nights
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    ₹ {totalAmount?.toFixed(0)}
                  </p>
                </div>
              </div>
              <hr />

              <div className="">
                <div className=" flex flex-row justify-between mt-2 text-gray-800">
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    Total Before Taxes
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mb-0">
                    ₹ {totalAmount?.toFixed(0)}
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
                  onClick={handleSubmit}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          <Authentic
            isOpen={isLoginModalOpen}
            onClose={handleModalClose}
            // isLogoutOpen={logoutModalVisible}
            // onLogoutClose={closeLogoutModal}
          />
        </div>
      </div>
    </div>
  );
};

export default TboGuestDetails;
