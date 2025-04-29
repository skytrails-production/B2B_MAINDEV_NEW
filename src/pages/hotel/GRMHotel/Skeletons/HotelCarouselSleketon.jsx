import React from "react";
// import "./hotelCarouselSkeleton.scss"

const HotelCarouselSleketon = () => {
  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        {/* <div className="textBlock">
                    <div className="title skeleton"></div>
                    <div className="date skeleton"></div>
                </div> */}
      </div>
    );
  };

  return (
    <>
      <div className="container mt-4">
        <div className="carouselHotelGallery">
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelCarouselSleketon;
