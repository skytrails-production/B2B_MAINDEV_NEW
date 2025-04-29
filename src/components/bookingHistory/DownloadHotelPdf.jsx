import dayjs from "dayjs";
import { Baby, BedDouble, Check, ChevronLeft, Printer } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const DownloadHotelPdf = () => {
  const pdfData = JSON.parse(sessionStorage.getItem("hotelPdfData"));
  //   const [loading, setLoading] = useState(false);
  const [totalAdults, setTotalAdults] = useState(0);
  const [totalChildren, setTotalChildren] = useState(0);
  const componentRef = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: () => setLoading(false), // Hide loader after printing
  });

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

  useEffect(() => {
    let adultsCount = 0;
    let childrenCount = 0;

    // Ensure pdfData and passenger exist before accessing them
    if (pdfData?.passenger) {
      pdfData.passenger.forEach((element) => {
        if (element?.paxType === "AD" || element?.paxType === 1) {
          adultsCount += 1;
        } else if (element?.paxType === "CH" || element?.paxType === 2) {
          childrenCount += 1;
        }
      });
    }

    // Update state with the calculated counts
    setTotalAdults(adultsCount);
    setTotalChildren(childrenCount);
  }, [pdfData]);



  // console.log(pdfData);


  return (
    <>
      <div className="bg-gray-100">
        <div className="max-w-4xl  pt-3 mx-auto w-full flex justify-between items-center text-center rounded-b-lg">
          <p
            onClick={() => navigate("/bookinghistory")}
            className="flex flec-row items-center  cursor-pointer text-base font-semibold text-gray-700"
          >
            <ChevronLeft size={18} className="text-gray-700 text-base" /> All
            Bookings
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
                {pdfData?.bookingStatus}
              </p>
              <p className="text-base font-semibold">
                Booking ID : {pdfData?.bookingId}
              </p>
            </div>
          </div>
          <div className="p-6 relative">
            <img
              src="https://theskytrails.com/static/media/logoSky.63ff4d7e95a8ed4a90ba8f28c3b8958a.svg"
              alt=""
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20"
            />
            {/* Hotel Information */}
            <div className="mb-4 flex flex-row">
              <div className=" w-1/2 px-2">
                <h1 className="text-xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-gray-900">
                  {pdfData?.hotelName}
                </h1>
                <div className="py-3 flex flex-col  justify-start gap-3  flex-wrap">
                  <div className="flex flex-row items-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <i
                        key={index}
                        className={`fa-solid fa-star ${
                          index < pdfData?.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      ></i>
                    ))}
                  </div>

                  <div>
                    <p className="text-start">{pdfData?.address}</p>
                  </div>

                  <div className="flex flex-row justify-start gap-3  flex-wrap">
                    <div className="flex flex-row items-center gap-2 font-semibold text-[14px] text-gray-700">
                      <BedDouble className="h-6 w-6 text-purple" />{" "}
                      {pdfData?.noOfRooms} Room
                    </div>

                    {/* <ModalMap mapUrl={mapUrl} /> */}

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

                  <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                    Total Amount : ₹{pdfData?.amount}
                  </h2>
                </div>
              </div>

              <div className=" w-1/2">
                <img
                  src={pdfData?.img}
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
                    Room Type : {pdfData?.roomName}
                  </h2>
                  {/* <div className="flex flex-row items-center gap-2 justify-start">
                    <p class="mb-2 text-md font-semibold text-gray-700 ">
                      {hotelinfoGRN?.rate?.rooms?.[0]?.room_type}
                    </p>
                    <p className="mb-2 text-md font-semibold text-gray-700">
                      ({hotelinfoGRN?.rate?.boarding_details?.[0]})
                    </p>
                  </div> */}
                </div>
              </div>
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Boarding Details
              </h2>

              <div className="flex flex-row ">
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check In </p>
                  <p>{dayjs(pdfData?.checkin).format("DD MMM YY")}</p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Check Out </p>
                  <p>{dayjs(pdfData?.checkout).format("DD MMM YY")}</p>
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
                  <p>{pdfData?.phone}</p>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <p className="font-medium text-gray-900">Email: </p>
                  <p>{pdfData?.email}</p>
                </div>
              </div>
            </div>
            {/* passenger details  */}

            <div className="col-lg-12 mt-3">
              <h2 class="mb-2 text-lg font-semibold text-gray-900 ">
                Guest Details
              </h2>
              {pdfData?.passenger?.map((item, index) => {
                return (
                  <div>
                    <div className="">
                      <div className="row g-3 mb-3">
                        <div className="flex flex-row ">
                          <div className="flex flex-col items-start flex-1">
                            <p className="font-medium text-gray-700">Name: </p>
                            {item?.name && (
                              <p>
                                {item?.name} {item?.surname}
                              </p>
                            )}
                            {item?.firstName && (
                              <p>
                                {item?.firstName} {item?.lastName}
                              </p>
                            )}
                          </div>
                          {pdfData?.pan && index === 0 && (
                            <div className="flex flex-col items-start flex-1">
                              <p className="font-medium text-gray-700">PAN: </p>
                              <p>{<span>{pdfData?.pan}</span>}</p>
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
                  src={pdfData?.hotelLocation}
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

export default DownloadHotelPdf;
