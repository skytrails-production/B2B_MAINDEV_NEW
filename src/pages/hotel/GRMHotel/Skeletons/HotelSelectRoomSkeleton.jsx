import React from "react";
import HotelCarouselSleketon from "./HotelCarouselSleketon";
// import "./hotelresultRoomSkeleton.scss";

const HotelSelectRoomSkeleton = () => {
  const skItemLeft = () => {
    return (
      <div className="mainCOntent">
        <div className="posterBlock skeleton"></div>
      </div>
    );
  };
  const skItemLeft2 = () => {
    return (
      <div className="mainCOntent2">
        <div className="posterBlock skeleton"></div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        <HotelCarouselSleketon />
      </div>
      <div className="row">
        <div className="col-lg-8">
          <div className="col-lg-12">
            <div className="HotelSelectRoomSelect">
              <div className="loadingHotelContent">{skItemLeft()}</div>
            </div>
          </div>
          <div className="col-lg-12 ">
            <div className="HotelSelectRoomSelect">
              <div className="loadingHotelContent">{skItemLeft()}</div>
            </div>
          </div>
          <div className="col-lg-12 ">
            <div className="HotelSelectRoomSelect">
              <div className="loadingHotelContent">{skItemLeft()}</div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="col-lg-12">
            <div className="HotelSelectRoomSelect2">
              <div className="loadingHotelContent2">{skItemLeft2()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSelectRoomSkeleton;
