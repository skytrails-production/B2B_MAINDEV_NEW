import React from "react";

const FlightSearchRightSkeleton = () => {
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="FlightRightSkeleton gap-2 flex flex-col justify-center items-center w-full">
      {data.map((item, i) => {
        // return <div className="FlightRightSkeletonItem" key={i}></div>;
        return (
          <div className="w-full rounded-md">
            <div className=" skeleton p-4 rounded-md">
              <div className=" rounded-lg ">
                <div className="">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Airline info skeleton */}
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full flex justify-center items-center   bg-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          className="w-10 h-10 text-gray-300"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <div className="h-5 w-28 mb-1  rounded-md bg-gray-200 " />
                        <div className="h-3 w-16  rounded-md bg-gray-200 " />
                      </div>
                    </div>

                    {/* Flight details skeleton */}
                    <div className="col-span-12 sm:col-span-5 flex items-center justify-between">
                      <div className="text-center">
                        <div className="h-6 w-16 mb-1 mx-auto  rounded-md bg-gray-200 " />
                        <div className="h-4 w-10 mx-auto  rounded-md bg-gray-200 " />
                      </div>

                      <div className="flex flex-col items-center mx-2">
                        <div className="h-3 w-16 mb-1  rounded-md bg-gray-200" />
                        <div className="h-2 w-28 my-2  rounded-md bg-gray-200" />
                        <div className="h-3 w-14  rounded-md bg-gray-200" />
                      </div>

                      <div className="text-center">
                        <div className="h-6 w-16 mb-1 mx-auto  rounded-md bg-gray-200" />
                        <div className="h-4 w-10 mx-auto  rounded-md bg-gray-200" />
                      </div>
                    </div>

                    {/* Price and select skeleton */}
                    <div className="col-span-12 sm:col-span-4 flex items-center justify-between sm:justify-end gap-4">
                      <div className="h-8 w-24 rounded-full   bg-gray-200" />
                      <div className="text-right">
                        <div className="h-7 w-20 mb-1 ml-auto  rounded-md bg-gray-200" />
                        <div className="h-9 w-24 ml-auto  rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlightSearchRightSkeleton;
