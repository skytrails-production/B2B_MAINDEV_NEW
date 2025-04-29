import React from "react";

import "./busresultskeleton.scss";
import BusResultSkeletonMobile from "./BusResultSkeletonMobile";

const BusResultSkeleton = () => {
  // con

  const skItemLeft = () => {
    return (
      <div className="skeletonItemResultCard">
        <div className="posterBlock skeleton"></div>
      </div>
    );
  };

  const skItemLeftFilterBig = () => {
    return (
      <div className="skeletonItemResultFilter">
        <div className="posterBlock skeleton"></div>
      </div>
    );
  };

  return (
    <div className="pt-4" style={{ backgroundColor: "white" }}>
      <div className="container">
        <div className="flex flex-row md:flex-col gap-2">
          <div className="col-lg-3  visibleBig  p-0">
            {/* <HoliResFilterBig /> */}

            <div className="carouselResultFilterBus">
              <div className="loadingSkeletonResultFilter">
                {skItemLeftFilterBig()}
              </div>
            </div>
          </div>
          <div className="col-lg-3 visibleSmall hidden ">
            <BusResultSkeletonMobile />
          </div>

          <div className="col-lg-9 ">
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => {
                return (
                  <div className="col-lg-12">
                    <div className="carouselResultCardBus">
                      <div className="loadingSkeletonResultCard">
                        {skItemLeft()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusResultSkeleton;
