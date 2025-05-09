import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PriceSummaryGRN from "./PriceSummaryGRN";
import { Navigate, useNavigate } from "react-router-dom";
import { swalModal } from "../../../../utility/swal";
import BlurredLoader from "../../../../components/BlurredLoader";
import HoldHotelGalleryCarousel from "../../holdSelectRoom/HoldHotelGalleryCarousel";
import HoldGuestDetilsGRN from "./HoldGuestDetailsGRN";

const HoldBookingDetails = () => {
  const reducerState = useSelector((state) => state);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.hotelRoom?.length > 0 ||
      reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel
    ) {
      setLoader(false);
    }
  }, [reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel]);

  useEffect(() => {
    if (reducerState?.hotelSearchResultGRN?.hotelRoom?.errors?.length > 0) {
      swalModal("hotel", "Session Expired", false);
      navigate("/hotelhold");
    }
  }, [reducerState?.hotelSearchResultGRN?.hotelRoom?.errors]);

  const hotelGallery =
    reducerState?.hotelSearchResultGRN?.hotelGallery?.data?.data?.images
      ?.regular;

  const handleScrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {loader ? (
        <>
          <BlurredLoader textData={"Creating Itenerary for you"} />
        </>
      ) : (
        <div className="bg-indigo-50">
          <div className="py-4 md:pb-8 bg-white">
            <div className="container">
              <div className="row">
                <HoldHotelGalleryCarousel data={hotelGallery} />
              </div>

              <div className="row mt-3">
                <div className="col-lg-8">
                  <HoldGuestDetilsGRN ref={formRef} />
                </div>
                <div className="col-lg-4">
                  <PriceSummaryGRN />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HoldBookingDetails;
