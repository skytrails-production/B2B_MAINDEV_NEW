import React from "react";
import HoliResFilterSmall from "./HoliResFilterSmall";
import "./holidayresultskeleton.scss";

const HolidayResultSkeleton = () => {
  // con

  const skItemLeft = () => {
    return (
      <div className="w-full rounded-md">
        <div className=" skeleton p-4 rounded-md">
          <div className="flex">
            <div className="w-1/2">
              <div className="grid bg-gray-200 rounded-lg h-32 w-full place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="w-12 h-12 text-gray-300"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* Right Section: Content */}
            <div className="w-1/2 pl-4">
              <div className="flex flex-row gap-1 items-center">
                <div className="block w-16 h-5 mb-3   bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
                <div className="block w-16 h-5 mb-3  bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
              </div>
              <div className="block w-full h-5 mb-3   bg-gray-200 rounded-md ">
                &nbsp;
              </div>
              <div className="flex flex-row gap-1 items-center">
                <div className="block w-6 h-5 mb-3  bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
                <div className="block w-6 h-5 mb-3  bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
                <div className="block w-6 h-5 mb-3  bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
                <div className="block w-6 h-5 mb-3   bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
                <div className="block w-6 h-5 mb-3   bg-gray-200 rounded-md ">
                  &nbsp;
                </div>
              </div>

              <div className="block w-28 h-3 bg-gray-200 rounded-md ">
                &nbsp;
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-row gap-1 items-center">
            <div className="block w-16 h-7 mb-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
            <div className="block w-16 h-7 mb-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
            <div className="block w-16 h-7 mb-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1 items-center">
            <div className="block w-full h-3 mb-2  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
            <div className="block w-full h-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
          </div>
          <div className="mt-3 flex flex-col justify-end gap-1 items-end">
            <div className="block w-1/3 h-3 mb-2  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
            <div className="block w-1/4 h-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
          </div>

          <div className="mt-4 flex flex-row gap-2 items-center">
            <div className="block w-2/5 h-10 mb-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
            <div className="block w-3/5 h-10 mb-3  bg-gray-200 rounded-md ">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    );
  };

  const skItemLeftFilterBig = () => {
    return (
      <div className="skeletonItemResultFilter">
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
      <div>
        <div className=" skeleton h-40 ">
          <div className="h-full flex flex-row gap-2 justify-center items-center">
            <div className=" w-2/5 p-2 h-16 flex justify-end items-center  bg-gray-200 rounded-full ">
              <div className="h-14 w-14 bg-gray-300 rounded-full">&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4" style={{ backgroundColor: "white" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 visibleBig p-0">
              {/* <HoliResFilterBig /> */}

              <div className="carouselResultFilter">
                <div className="loadingSkeletonResultFilter">
                  {skItemLeftFilterBig()}
                </div>
              </div>
            </div>
            <div className="col-lg-3 visibleSmall ">
              <HoliResFilterSmall />
            </div>

            <div className="col-lg-9 ">
              <div className="row g-4">
                {[1, 2, 3, 4].map((item) => {
                  return (
                    <div className="col-lg-6">
                      <div className="carouselResultCard">
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
    </>
  );
};

export default HolidayResultSkeleton;
