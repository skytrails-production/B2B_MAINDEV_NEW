import React from "react";

const FlightSearchLeftSkeleton = () => {
  return (
    <div className="FlightRightSkeleton">
      <div className="sticky top-4 rounded-lg border bg-card text-card-foreground ">
        <div className="w-full rounded-md">
          <div className=" skeleton  rounded-md  relative overflow-hidden bg-slate-600">
            <div className=" rounded-lg ">
              <div className=""></div>
              <div className="pb-3 flex flex-col space-y-2 p-6">
                <div className="h-6 w-32  rounded-lg bg-gray-200" />
              </div>

              <div className="space-y-6 p-6 pt-0">
                {/* Price Range Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-28  rounded-md bg-gray-200" />
                  <div className="px-2 space-y-2">
                    <div className="h-5 w-full  rounded-md bg-gray-200" />
                    <div className="flex justify-between">
                      <div className="h-4 w-12  rounded-md bg-gray-200" />
                      <div className="h-4 w-24  rounded-md bg-gray-200" />
                      <div className="h-4 w-12  rounded-md bg-gray-200" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-full bg-gray-200" />

                {/* Stops Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-16  rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-md  bg-gray-200" />
                        <div className="h-4 w-32  rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gray-200" />

                {/* Times Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-32  rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-md  bg-gray-200" />
                        <div className="h-4 w-48  rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gray-200" />

                {/* Airlines Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-20  rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-md  bg-gray-200" />
                        <div className="h-4 w-36  rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gray-200" />

                {/* Amenities Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-24  rounded-md bg-gray-200" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="h-5 w-5 rounded-md  bg-gray-200" />
                        <div className="h-4 w-40  rounded-md bg-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchLeftSkeleton;
